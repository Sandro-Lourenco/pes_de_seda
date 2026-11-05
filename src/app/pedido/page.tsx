import type { Metadata } from "next";
import Link from "next/link";
import { commerceRepository } from "@/lib/commerce/sqlite-repository";
import { OrderStatusRefresh } from "@/components/order-status-refresh";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Status do pedido | Pés de Seda", robots: { index: false, follow: false } };

const content = {
  pending: { title: "Aguardando confirmação", text: "Você voltou do checkout, mas o pagamento ainda não foi confirmado pelo servidor. O arquivo permanece protegido." },
  paid: { title: "Pagamento confirmado", text: "Seu acesso foi confirmado. Use o botão abaixo para solicitar o arquivo protegido." },
  canceled: { title: "Checkout cancelado", text: "Nenhum acesso foi liberado. Quando as vendas abrirem, você poderá iniciar uma nova tentativa." },
  expired: { title: "Checkout expirado", text: "O prazo do checkout terminou e o arquivo continua protegido." },
  revoked: { title: "Acesso revogado", text: "O acesso a novos downloads foi encerrado. Entre em contato com o suporte quando ele estiver disponível." },
} as const;

export default async function OrderPage({ searchParams }: { searchParams: Promise<{ pedido?: string; acesso?: string }> }) {
  const params = await searchParams;
  const order = params.pedido && params.acesso ? commerceRepository().getOrderWithAccess(params.pedido, params.acesso) : null;

  if (!order) {
    return <main className="order-page"><section className="order-card"><p className="eyebrow">Área do pedido</p><h1>Link inválido ou expirado.</h1><p>Por segurança, confira o link privado recebido após a compra.</p><Link className="editorial-link" href="/">Voltar ao início</Link></section></main>;
  }

  const state = content[order.status];
  const query = new URLSearchParams({ pedido: order.id, acesso: params.acesso! });
  return (
    <main className="order-page">
      <section className="order-card" aria-labelledby="order-title">
        <p className="eyebrow">Pedido {order.id.slice(0, 8)}••••</p>
        <h1 id="order-title">{state.title}</h1>
        <p>{state.text}</p>
        {order.status === "paid" ? <a className="button button--primary" href={`/api/download?${query}`}>Baixar o e-book</a> : <p className="order-status" role="status">Nenhum download disponível neste momento.</p>}
        {order.status === "pending" && <OrderStatusRefresh orderId={order.id} accessToken={params.acesso!} />}
        <Link className="editorial-link" href="/">Voltar para Pés de Seda</Link>
      </section>
    </main>
  );
}
