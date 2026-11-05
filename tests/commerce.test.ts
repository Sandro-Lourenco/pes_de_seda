import { createHash } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { createCheckout } from "@/lib/commerce/checkout-service";
import { SqliteCommerceRepository } from "@/lib/commerce/sqlite-repository";
import type { CheckoutProvider } from "@/lib/commerce/types";
import { PRODUCT, formatProductPrice } from "@/lib/commerce/product";

function repository() {
  return new SqliteCommerceRepository(":memory:");
}

function event(id: string, type: string, checkoutId?: string, orderId?: string) {
  return { id, type, checkoutId, orderId, payloadHash: createHash("sha256").update(id).digest("hex") };
}

describe("contrato local de compra", () => {
  it("mantém o preço canônico de R$ 49,90 no servidor", () => {
    expect(PRODUCT.priceCents).toBe(4_990);
    expect(formatProductPrice()).toContain("49,90");
  });

  it("reutiliza uma chave de tentativa e cria no máximo um checkout", async () => {
    const repo = repository();
    let release!: () => void;
    const gate = new Promise<void>((resolve) => { release = resolve; });
    const provider: CheckoutProvider = {
      create: vi.fn(async ({ orderId }) => {
        await gate;
        return { id: "chk_simulado_001", url: `https://checkout.invalid/${orderId}` };
      }),
    };

    const first = createCheckout({ attemptKey: "tentativa-concorrente-001", priceCents: 4990, environment: "local" }, repo, provider);
    const second = await createCheckout({ attemptKey: "tentativa-concorrente-001", priceCents: 1, environment: "local" }, repo, provider);
    expect(second.status).toBe("processing");
    expect(second.reused).toBe(true);
    release();
    const completed = await first;
    expect(completed.status).toBe("active");
    expect(provider.create).toHaveBeenCalledTimes(1);
  });

  it("mantém a tentativa em conciliação após perda de resposta do provedor", async () => {
    const repo = repository();
    const provider: CheckoutProvider = { create: vi.fn(async () => { throw new Error("timeout simulado"); }) };
    await expect(createCheckout({ attemptKey: "tentativa-timeout-0001", priceCents: 4990, environment: "local" }, repo, provider)).rejects.toThrow("timeout simulado");

    const retryProvider: CheckoutProvider = { create: vi.fn() };
    const retry = await createCheckout({ attemptKey: "tentativa-timeout-0001", priceCents: 4990, environment: "local" }, repo, retryProvider);
    expect(retry.status).toBe("processing");
    expect(retryProvider.create).not.toHaveBeenCalled();
  });

  it("não libera download quando a pessoa retorna antes do webhook", async () => {
    const repo = repository();
    let privateToken = "";
    const provider: CheckoutProvider = { create: vi.fn(async ({ orderId, accessToken }) => { privateToken = accessToken; return { id: "chk_simulado_002", url: `https://checkout.invalid/${orderId}` }; }) };
    const result = await createCheckout({ attemptKey: "tentativa-retorno-0001", priceCents: 4990, environment: "local" }, repo, provider);
    const view = repo.getOrderWithAccess(result.orderId, privateToken);
    expect(view?.status).toBe("pending");
    expect(repo.canDownload(result.orderId, privateToken)).toBe(false);
  });

  it("rejeita token forjado mesmo para um pedido pago", async () => {
    const repo = repository();
    let privateToken = "";
    const provider: CheckoutProvider = { create: vi.fn(async ({ accessToken }) => { privateToken = accessToken; return { id: "chk_simulado_003", url: "https://checkout.invalid/3" }; }) };
    const result = await createCheckout({ attemptKey: "tentativa-token-0000001", priceCents: 4990, environment: "local" }, repo, provider);
    repo.applyEvent(event("evt_pagamento_001", "CHECKOUT_PAID", "chk_simulado_003"));
    expect(repo.canDownload(result.orderId, "token-forjado")).toBe(false);
    expect(repo.canDownload(result.orderId, privateToken)).toBe(true);
  });

  it("processa webhook duplicado com um único direito e uma única entrega", async () => {
    const repo = repository();
    const provider: CheckoutProvider = { create: vi.fn(async () => ({ id: "chk_simulado_004", url: "https://checkout.invalid/4" })) };
    const result = await createCheckout({ attemptKey: "tentativa-duplicada-001", priceCents: 4990, environment: "local" }, repo, provider);
    const first = repo.applyEvent(event("evt_pagamento_002", "CHECKOUT_PAID", "chk_simulado_004"));
    const duplicate = repo.applyEvent(event("evt_pagamento_002", "CHECKOUT_PAID", "chk_simulado_004"));
    expect(first.duplicate).toBe(false);
    expect(duplicate.duplicate).toBe(true);
    expect(repo.countEntitlements(result.orderId)).toBe(1);
    expect(repo.countDeliveries(result.orderId)).toBe(1);
  });

  it("mantém o acesso revogado diante de pagamento atrasado após estorno", async () => {
    const repo = repository();
    let privateToken = "";
    const provider: CheckoutProvider = { create: vi.fn(async ({ accessToken }) => { privateToken = accessToken; return { id: "chk_simulado_005", url: "https://checkout.invalid/5" }; }) };
    const result = await createCheckout({ attemptKey: "tentativa-estorno-0001", priceCents: 4990, environment: "local" }, repo, provider);
    repo.applyEvent(event("evt_pagamento_003", "CHECKOUT_PAID", "chk_simulado_005"));
    repo.applyEvent(event("evt_estorno_001", "PAYMENT_REFUNDED", undefined, result.orderId));
    repo.applyEvent(event("evt_pagamento_atrasado_001", "CHECKOUT_PAID", "chk_simulado_005"));
    expect(repo.getOrderWithAccess(result.orderId, privateToken)?.status).toBe("revoked");
    expect(repo.canDownload(result.orderId, privateToken)).toBe(false);
  });
});
