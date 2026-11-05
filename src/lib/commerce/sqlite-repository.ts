import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { accessToken, hashSecret, opaqueId } from "./crypto";
import type { Attempt, CommerceEvent, CommerceRepository, OrderView } from "./types";

type Row = Record<string, string | number | null>;

export class SqliteCommerceRepository implements CommerceRepository {
  private db: DatabaseSync;

  constructor(filename: string) {
    if (filename !== ":memory:") fs.mkdirSync(path.dirname(path.resolve(filename)), { recursive: true });
    this.db = new DatabaseSync(filename);
    this.db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
    this.migrate();
  }

  private migrate() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        status TEXT NOT NULL,
        price_cents INTEGER NOT NULL,
        environment TEXT NOT NULL,
        access_token_hash TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        revoked_reason TEXT
      );
      CREATE TABLE IF NOT EXISTS attempts (
        attempt_key TEXT PRIMARY KEY,
        order_id TEXT NOT NULL UNIQUE REFERENCES orders(id),
        status TEXT NOT NULL,
        checkout_id TEXT UNIQUE,
        checkout_url TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS events (
        provider_event_id TEXT PRIMARY KEY,
        event_type TEXT NOT NULL,
        checkout_id TEXT,
        order_id TEXT,
        payload_hash TEXT NOT NULL,
        received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS entitlements (
        order_id TEXT PRIMARY KEY REFERENCES orders(id),
        status TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS deliveries (
        order_id TEXT PRIMARY KEY REFERENCES orders(id),
        status TEXT NOT NULL,
        attempts INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS recovery_requests (
        id TEXT PRIMARY KEY,
        email_hash TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  reserveAttempt(attemptKey: string, priceCents: number, environment: string) {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const existing = this.getAttempt(attemptKey);
      if (existing) {
        this.db.exec("COMMIT");
        return { ...existing, owner: false };
      }

      const orderId = opaqueId("ord");
      const token = accessToken();
      this.db.prepare("INSERT INTO orders (id, status, price_cents, environment, access_token_hash) VALUES (?, 'pending', ?, ?, ?)")
        .run(orderId, priceCents, environment, hashSecret(token));
      this.db.prepare("INSERT INTO attempts (attempt_key, order_id, status) VALUES (?, ?, 'creating')").run(attemptKey, orderId);
      this.db.exec("COMMIT");
      return { attemptKey, orderId, status: "creating" as const, checkoutId: null, checkoutUrl: null, accessToken: token, owner: true };
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }

  completeAttempt(attemptKey: string, checkoutId: string, checkoutUrl: string) {
    this.db.prepare("UPDATE attempts SET checkout_id = ?, checkout_url = ?, status = 'active' WHERE attempt_key = ? AND status IN ('creating', 'reconciling')")
      .run(checkoutId, checkoutUrl, attemptKey);
    const attempt = this.getAttempt(attemptKey);
    if (!attempt) throw new Error("Tentativa não encontrada.");
    return attempt;
  }

  reconcileAttempt(attemptKey: string) {
    this.db.prepare("UPDATE attempts SET status = 'reconciling' WHERE attempt_key = ? AND status = 'creating'").run(attemptKey);
  }

  getAttempt(attemptKey: string): Attempt | null {
    const row = this.db.prepare("SELECT attempt_key, order_id, status, checkout_id, checkout_url FROM attempts WHERE attempt_key = ?")
      .get(attemptKey) as Row | undefined;
    if (!row) return null;
    return { attemptKey: String(row.attempt_key), orderId: String(row.order_id), status: row.status as Attempt["status"], checkoutId: row.checkout_id ? String(row.checkout_id) : null, checkoutUrl: row.checkout_url ? String(row.checkout_url) : null };
  }

  applyEvent(event: CommerceEvent) {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const inserted = this.db.prepare("INSERT OR IGNORE INTO events (provider_event_id, event_type, checkout_id, order_id, payload_hash) VALUES (?, ?, ?, ?, ?)")
        .run(event.id, event.type, event.checkoutId ?? null, event.orderId ?? null, event.payloadHash);
      if (inserted.changes === 0) {
        this.db.exec("COMMIT");
        return { duplicate: true, orderId: null };
      }

      let orderId = event.orderId ?? null;
      if (!orderId && event.checkoutId) {
        const row = this.db.prepare("SELECT order_id FROM attempts WHERE checkout_id = ?").get(event.checkoutId) as Row | undefined;
        orderId = row ? String(row.order_id) : null;
      }

      if (orderId) this.transitionOrder(orderId, event.type);
      this.db.exec("COMMIT");
      return { duplicate: false, orderId };
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }

  private transitionOrder(orderId: string, eventType: string) {
    if (eventType === "CHECKOUT_PAID") {
      this.db.prepare("UPDATE orders SET status = 'paid' WHERE id = ? AND status NOT IN ('revoked', 'paid')").run(orderId);
      const order = this.db.prepare("SELECT status FROM orders WHERE id = ?").get(orderId) as Row | undefined;
      if (order?.status === "paid") {
        this.db.prepare("INSERT INTO entitlements (order_id, status) VALUES (?, 'active') ON CONFLICT(order_id) DO UPDATE SET status = CASE WHEN status = 'revoked' THEN 'revoked' ELSE 'active' END, updated_at = CURRENT_TIMESTAMP").run(orderId);
        this.db.prepare("INSERT OR IGNORE INTO deliveries (order_id, status) VALUES (?, 'queued')").run(orderId);
      }
      return;
    }

    if (["PAYMENT_REFUNDED", "PAYMENT_CHARGEBACK_REQUESTED"].includes(eventType)) {
      this.db.prepare("UPDATE orders SET status = 'revoked', revoked_reason = ? WHERE id = ?").run(eventType, orderId);
      this.db.prepare("INSERT INTO entitlements (order_id, status) VALUES (?, 'revoked') ON CONFLICT(order_id) DO UPDATE SET status = 'revoked', updated_at = CURRENT_TIMESTAMP").run(orderId);
      return;
    }

    if (eventType === "CHECKOUT_CANCELED") {
      this.db.prepare("UPDATE orders SET status = 'canceled' WHERE id = ? AND status = 'pending'").run(orderId);
      this.db.prepare("UPDATE attempts SET status = 'canceled' WHERE order_id = ? AND status != 'active'").run(orderId);
    }
    if (eventType === "CHECKOUT_EXPIRED") {
      this.db.prepare("UPDATE orders SET status = 'expired' WHERE id = ? AND status = 'pending'").run(orderId);
      this.db.prepare("UPDATE attempts SET status = 'expired' WHERE order_id = ?").run(orderId);
    }
  }

  getOrderWithAccess(orderId: string, token: string): OrderView | null {
    const row = this.db.prepare("SELECT o.id, o.status, o.price_cents, o.access_token_hash, e.status entitlement FROM orders o LEFT JOIN entitlements e ON e.order_id = o.id WHERE o.id = ?")
      .get(orderId) as Row | undefined;
    if (!row || hashSecret(token) !== row.access_token_hash) return null;
    return { id: String(row.id), status: row.status as OrderView["status"], priceCents: Number(row.price_cents), entitlement: row.entitlement as OrderView["entitlement"] };
  }

  canDownload(orderId: string, token: string) {
    const order = this.getOrderWithAccess(orderId, token);
    return order?.status === "paid" && order.entitlement === "active";
  }

  createRecovery(email: string) {
    this.db.prepare("INSERT INTO recovery_requests (id, email_hash) VALUES (?, ?)").run(opaqueId("rec"), hashSecret(email.trim().toLowerCase()));
    return { accepted: true as const };
  }

  countEntitlements(orderId: string) {
    const row = this.db.prepare("SELECT COUNT(*) count FROM entitlements WHERE order_id = ?").get(orderId) as Row;
    return Number(row.count);
  }

  countDeliveries(orderId: string) {
    const row = this.db.prepare("SELECT COUNT(*) count FROM deliveries WHERE order_id = ?").get(orderId) as Row;
    return Number(row.count);
  }
}

let singleton: SqliteCommerceRepository | undefined;
export function commerceRepository() {
  singleton ??= new SqliteCommerceRepository(process.env.DATABASE_PATH ?? ".data/pes-de-seda.sqlite");
  return singleton;
}
