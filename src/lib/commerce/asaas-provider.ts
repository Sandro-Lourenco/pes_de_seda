import type { CheckoutProvider } from "./types";
import { PRODUCT } from "./product";

export type AsaasPaymentSnapshot = {
  id: string;
  status: string;
  billingType: string;
  valueCents: number;
  externalReference: string;
};

export class AsaasCheckoutProvider implements CheckoutProvider {
  async create(input: { orderId: string; accessToken: string; priceCents: number }) {
    const accessToken = process.env.ASAAS_ACCESS_TOKEN;
    const apiUrl = process.env.ASAAS_API_URL ?? "https://api-sandbox.asaas.com/v3";
    if (!accessToken) throw new Error("Credencial Asaas não configurada.");
    if (input.priceCents !== PRODUCT.priceCents) throw new Error("Preço divergente da oferta canônica.");

    const callbackQuery = new URLSearchParams({ pedido: input.orderId, acesso: input.accessToken });
    const callback = {
      successUrl: `${requiredUrl("ASAAS_SUCCESS_URL")}?${callbackQuery}`,
      cancelUrl: `${requiredUrl("ASAAS_CANCEL_URL")}?${callbackQuery}&retorno=cancelado`,
      expiredUrl: `${requiredUrl("ASAAS_EXPIRED_URL")}?${callbackQuery}&retorno=expirado`,
    };
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);

    try {
      const response = await fetch(`${apiUrl}/checkouts`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          access_token: accessToken,
          "user-agent": "PesDeSeda/0.1.0",
        },
        body: JSON.stringify({
          billingTypes: ["PIX", "CREDIT_CARD"],
          chargeTypes: ["DETACHED"],
          minutesToExpire: 60,
          externalReference: input.orderId,
          callback,
          items: [{
            name: PRODUCT.name,
            description: PRODUCT.description,
            quantity: 1,
            value: PRODUCT.priceCents / 100,
          }],
        }),
        signal: controller.signal,
      });
      if (!response.ok) {
        const details = await readAsaasError(response);
        throw new Error(`Asaas respondeu HTTP ${response.status}${details ? `: ${details}` : "."}`);
      }
      const data = (await response.json()) as { id: string };
      const checkoutOrigin = apiUrl.includes("sandbox") ? "https://sandbox.asaas.com" : "https://www.asaas.com";
      return { id: data.id, url: `${checkoutOrigin}/checkoutSession/show?id=${encodeURIComponent(data.id)}` };
    } finally {
      clearTimeout(timeout);
    }
  }

  async getPayment(paymentId: string, expectedOrderId: string): Promise<AsaasPaymentSnapshot> {
    if (!/^pay_[A-Za-z0-9_-]{3,120}$/.test(paymentId)) {
      throw new Error("ID de cobrança Asaas inválido.");
    }

    const accessToken = process.env.ASAAS_ACCESS_TOKEN;
    const apiUrl = process.env.ASAAS_API_URL ?? "https://api-sandbox.asaas.com/v3";
    if (!accessToken) throw new Error("Credencial Asaas não configurada.");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);
    try {
      const response = await fetch(`${apiUrl}/payments/${encodeURIComponent(paymentId)}`, {
        method: "GET",
        headers: {
          accept: "application/json",
          access_token: accessToken,
          "user-agent": "PesDeSeda/0.1.0",
        },
        signal: controller.signal,
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`Asaas respondeu HTTP ${response.status}.`);

      const data = (await response.json()) as Record<string, unknown>;
      const valueCents = typeof data.value === "number" ? Math.round(data.value * 100) : Number.NaN;
      if (
        data.id !== paymentId ||
        data.externalReference !== expectedOrderId ||
        valueCents !== PRODUCT.priceCents ||
        typeof data.status !== "string" ||
        typeof data.billingType !== "string"
      ) {
        throw new Error("Cobrança Asaas não corresponde ao pedido e à oferta canônica.");
      }

      return {
        id: paymentId,
        status: data.status,
        billingType: data.billingType,
        valueCents,
        externalReference: expectedOrderId,
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}

function requiredUrl(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} não configurada.`);
  return value;
}

async function readAsaasError(response: Response) {
  const body = await response.json().catch(() => null) as { errors?: Array<{ description?: unknown }> } | null;
  return body?.errors
    ?.map((error) => typeof error.description === "string" ? error.description : null)
    .filter((description): description is string => Boolean(description))
    .join("; ") ?? "";
}
