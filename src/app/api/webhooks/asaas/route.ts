import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { equalSecret } from "@/lib/commerce/crypto";
import { commerceRepository } from "@/lib/commerce/sqlite-repository";

export const runtime = "nodejs";

type AsaasPayload = {
  id?: unknown;
  event?: unknown;
  checkout?: { id?: unknown; externalReference?: unknown };
  payment?: { externalReference?: unknown };
};

const supported = new Set([
  "CHECKOUT_CREATED",
  "CHECKOUT_PAID",
  "CHECKOUT_CANCELED",
  "CHECKOUT_EXPIRED",
  "PAYMENT_REFUNDED",
  "PAYMENT_CHARGEBACK_REQUESTED",
]);

export async function POST(request: Request) {
  if (!equalSecret(request.headers.get("asaas-access-token") ?? undefined, process.env.ASAAS_WEBHOOK_TOKEN)) {
    return NextResponse.json({ message: "Token inválido." }, { status: 401 });
  }

  const raw = await request.text();
  let payload: AsaasPayload;
  try {
    payload = JSON.parse(raw) as AsaasPayload;
  } catch {
    return NextResponse.json({ message: "JSON inválido." }, { status: 400 });
  }
  if (typeof payload.id !== "string" || typeof payload.event !== "string" || !supported.has(payload.event)) {
    return NextResponse.json({ message: "Evento ignorado." }, { status: 202 });
  }

  const checkoutId = typeof payload.checkout?.id === "string" ? payload.checkout.id : undefined;
  const orderId = typeof payload.payment?.externalReference === "string"
    ? payload.payment.externalReference
    : typeof payload.checkout?.externalReference === "string"
      ? payload.checkout.externalReference
      : undefined;
  if (!checkoutId && !orderId) return NextResponse.json({ message: "Evento sem correlação." }, { status: 202 });

  const result = commerceRepository().applyEvent({
    id: payload.id,
    type: payload.event,
    checkoutId,
    orderId,
    payloadHash: createHash("sha256").update(raw).digest("hex"),
  });
  return NextResponse.json({ received: true, duplicate: result.duplicate });
}
