export type OrderStatus = "pending" | "paid" | "canceled" | "expired" | "revoked";
export type AttemptStatus = "creating" | "active" | "reconciling" | "canceled" | "expired";

export type Attempt = {
  attemptKey: string;
  orderId: string;
  status: AttemptStatus;
  checkoutId: string | null;
  checkoutUrl: string | null;
  accessToken?: string;
};

export type OrderView = {
  id: string;
  status: OrderStatus;
  priceCents: number;
  entitlement: "active" | "revoked" | null;
};

export type CommerceEvent = {
  id: string;
  type: string;
  checkoutId?: string;
  orderId?: string;
  payloadHash: string;
};

export interface CommerceRepository {
  reserveAttempt(attemptKey: string, priceCents: number, environment: string): Attempt & { owner: boolean };
  completeAttempt(attemptKey: string, checkoutId: string, checkoutUrl: string): Attempt;
  reconcileAttempt(attemptKey: string): void;
  getAttempt(attemptKey: string): Attempt | null;
  applyEvent(event: CommerceEvent): { duplicate: boolean; orderId: string | null };
  getOrderWithAccess(orderId: string, accessToken: string): OrderView | null;
  canDownload(orderId: string, accessToken: string): boolean;
  createRecovery(email: string): { accepted: true };
  countEntitlements(orderId: string): number;
  countDeliveries(orderId: string): number;
}

export type CheckoutProvider = {
  create(input: { orderId: string; accessToken: string; priceCents: number }): Promise<{ id: string; url: string }>;
};
