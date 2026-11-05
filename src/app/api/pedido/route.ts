import { NextResponse } from "next/server";
import { commerceRepository } from "@/lib/commerce/sqlite-repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get("pedido") ?? "";
  const accessToken = url.searchParams.get("acesso") ?? "";
  const order = commerceRepository().getOrderWithAccess(orderId, accessToken);

  if (!order) {
    return NextResponse.json(
      { message: "Pedido não encontrado." },
      { status: 404, headers: { "cache-control": "private, no-store" } },
    );
  }

  return NextResponse.json(
    {
      status: order.status,
      priceCents: order.priceCents,
      downloadAvailable: order.status === "paid" && order.entitlement === "active",
    },
    { headers: { "cache-control": "private, no-store" } },
  );
}
