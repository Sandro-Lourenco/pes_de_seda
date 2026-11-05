"use client";

import { useRef, useState } from "react";

type CheckoutButtonProps = {
  enabled: boolean;
  priceLabel?: string;
};

export function CheckoutButton({ enabled, priceLabel }: CheckoutButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const attemptKey = useRef(crypto.randomUUID());

  async function startCheckout() {
    if (!enabled || status === "loading") return;
    setStatus("loading");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ attemptKey: attemptKey.current, product: "pes-de-seda" }),
      });
      const result = (await response.json()) as { checkoutUrl?: string; message?: string };
      if (!response.ok || !result.checkoutUrl) throw new Error(result.message ?? "Não foi possível abrir o pagamento.");
      window.location.assign(result.checkoutUrl);
    } catch {
      setStatus("error");
    }
  }

  const label = !enabled
    ? "Vendas em preparação"
    : status === "loading"
      ? "Abrindo pagamento…"
      : priceLabel
        ? `Comprar por ${priceLabel}`
        : "Comprar o e-book";

  return (
    <div className="checkout-action">
      <button
        className="button button--light"
        type="button"
        disabled={!enabled || status === "loading"}
        onClick={startCheckout}
        aria-describedby="checkout-help checkout-status"
      >
        <span>{label}</span>
      </button>
      <p id="checkout-help" className="offer__help">
        Pagamento pelo Asaas. O download será liberado somente após a confirmação.
      </p>
      <p id="checkout-status" className="checkout-status" role="status" aria-live="polite">
        {status === "error" ? "Não foi possível abrir o pagamento. Tente novamente." : status === "loading" ? "Preparando um checkout seguro." : ""}
      </p>
    </div>
  );
}
