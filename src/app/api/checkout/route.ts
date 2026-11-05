import { NextResponse } from "next/server";
import { AsaasCheckoutProvider } from "@/lib/commerce/asaas-provider";
import { createCheckout } from "@/lib/commerce/checkout-service";
import { commerceRepository } from "@/lib/commerce/sqlite-repository";
import { PRODUCT } from "@/lib/commerce/product";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return NextResponse.json({ message: "Origem não autorizada." }, { status: 403 });
  }
  if (process.env.SALES_ENABLED !== "true" || process.env.CHECKOUT_MODE !== "asaas") {
    return NextResponse.json({ message: "Vendas em preparação." }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as { attemptKey?: unknown; product?: unknown } | null;
  if (!body || body.product !== PRODUCT.id || typeof body.attemptKey !== "string" || !/^[a-zA-Z0-9_-]{16,100}$/.test(body.attemptKey)) {
    return NextResponse.json({ message: "Tentativa inválida." }, { status: 400 });
  }

  try {
    const result = await createCheckout(
      { attemptKey: body.attemptKey, priceCents: PRODUCT.priceCents, environment: process.env.ASAAS_API_URL?.includes("sandbox") ? "sandbox" : "production" },
      commerceRepository(),
      new AsaasCheckoutProvider(),
    );
    if (!result.checkoutUrl) return NextResponse.json({ orderId: result.orderId, status: "processing", message: "Tentativa em conciliação." }, { status: 202 });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Falha ao criar checkout Asaas:", error instanceof Error ? error.message : "erro desconhecido");
    return NextResponse.json({ message: "Não foi possível confirmar a criação. A tentativa entrou em conciliação e não será cobrada novamente automaticamente." }, { status: 502 });
  }
}
