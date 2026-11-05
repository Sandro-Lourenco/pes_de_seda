import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { commerceRepository } from "@/lib/commerce/sqlite-repository";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get("pedido") ?? "";
  const accessToken = url.searchParams.get("acesso") ?? "";
  if (!commerceRepository().canDownload(orderId, accessToken)) {
    return NextResponse.json({ message: "O download ainda não está disponível para este pedido." }, {
      status: 403,
      headers: { "cache-control": "private, no-store" },
    });
  }
  const storageKey = process.env.PDF_STORAGE_KEY;
  if (!storageKey) {
    return NextResponse.json({ message: "Arquivo comercial ainda não configurado." }, {
      status: 503,
      headers: { "cache-control": "private, no-store" },
    });
  }

  const resolved = path.resolve(storageKey);
  const publicRoot = path.resolve(process.cwd(), "public");
  if (resolved.startsWith(`${publicRoot}${path.sep}`)) {
    return NextResponse.json({ message: "Configuração insegura de armazenamento." }, { status: 503, headers: { "cache-control": "private, no-store" } });
  }

  try {
    const file = await readFile(resolved);
    return new NextResponse(file, {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": 'attachment; filename="pes-de-seda.pdf"',
        "cache-control": "private, no-store, max-age=0",
        "x-content-type-options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ message: "Arquivo comercial indisponível." }, { status: 503, headers: { "cache-control": "private, no-store" } });
  }
}
