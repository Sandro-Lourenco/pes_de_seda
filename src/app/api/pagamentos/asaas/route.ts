import { NextResponse } from "next/server";
import { AsaasCheckoutProvider } from "@/lib/commerce/asaas-provider";
import { commerceRepository } from "@/lib/commerce/sqlite-repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const privateHeaders = { "cache-control": "private, no-store" };

export async function GET(request: Request) {
  if (process.env.CHECKOUT_MODE !== "asaas") {
    return NextResponse.json(
      { message: "Consulta Asaas indisponível neste ambiente." },
      { status: 503, headers: privateHeaders },
    );
  }

  const url = new URL(request.url);
  const orderId = url.searchParams.get("pedido") ?? "";
  const accessToken = url.searchParams.get("acesso") ?? "";
  const paymentId = url.searchParams.get("cobranca") ?? "";
  const order = commerceRepository().getOrderWithAccess(orderId, accessToken);
  if (!order) {
    return NextResponse.json(
      { message: "Pedido não encontrado." },
      { status: 404, headers: privateHeaders },
    );
  }

  try {
    const payment = await new AsaasCheckoutProvider().getPayment(paymentId, order.id);
    return NextResponse.json(
      {
        payment: {
          id: payment.id,
          status: payment.status,
          billingType: payment.billingType,
          valueCents: payment.valueCents,
        },
        authoritativeStatus: order.status,
        note: "Consulta pontual; o webhook continua sendo a confirmação financeira.",
      },
      { headers: privateHeaders },
    );
  } catch (error) {
    const message = error instanceof Error && error.message.includes("inválido")
      ? error.message
      : "Não foi possível consultar a cobrança no Asaas.";
    return NextResponse.json({ message }, { status: 502, headers: privateHeaders });
  }
}
