import { NextResponse } from "next/server";
import { commerceRepository } from "@/lib/commerce/sqlite-repository";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return NextResponse.json({ message: "Origem não autorizada." }, { status: 403 });
  const body = (await request.json().catch(() => null)) as { email?: unknown } | null;
  if (!body || typeof body.email !== "string" || !/^\S+@\S+\.\S+$/.test(body.email)) {
    return NextResponse.json({ message: "Informe um e-mail válido." }, { status: 400 });
  }
  commerceRepository().createRecovery(body.email);
  return NextResponse.json({ message: "Se houver uma compra elegível, enviaremos um link temporário para o e-mail informado." }, { status: 202 });
}
