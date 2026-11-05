"use client";

import { useEffect, useState } from "react";

export function OrderStatusRefresh({ orderId, accessToken }: { orderId: string; accessToken: string }) {
  const [message, setMessage] = useState("A confirmação será atualizada automaticamente.");

  useEffect(() => {
    const query = new URLSearchParams({ pedido: orderId, acesso: accessToken });
    let active = true;

    async function refresh() {
      try {
        const response = await fetch(`/api/pedido?${query}`, { cache: "no-store" });
        if (!response.ok) return;
        const result = (await response.json()) as { status: string };
        if (!active) return;
        if (result.status !== "pending") window.location.reload();
        else setMessage("Pagamento ainda não confirmado. Verificaremos novamente em instantes.");
      } catch {
        if (active) setMessage("Não foi possível atualizar agora. Você pode recarregar esta página.");
      }
    }

    const timer = window.setInterval(refresh, 5_000);
    void refresh();
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [accessToken, orderId]);

  return <p className="order-refresh" role="status" aria-live="polite">{message}</p>;
}
