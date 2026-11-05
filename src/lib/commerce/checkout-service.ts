import type { CheckoutProvider, CommerceRepository } from "./types";

export async function createCheckout(input: { attemptKey: string; priceCents: number; environment: string }, repository: CommerceRepository, provider: CheckoutProvider) {
  const reservation = repository.reserveAttempt(input.attemptKey, input.priceCents, input.environment);
  if (!reservation.owner) {
    return {
      orderId: reservation.orderId,
      checkoutUrl: reservation.checkoutUrl,
      status: reservation.status === "active" ? "active" : "processing",
      reused: true,
    } as const;
  }

  try {
    const checkout = await provider.create({ orderId: reservation.orderId, accessToken: reservation.accessToken!, priceCents: input.priceCents });
    const attempt = repository.completeAttempt(input.attemptKey, checkout.id, checkout.url);
    return { orderId: attempt.orderId, checkoutUrl: attempt.checkoutUrl, status: "active", reused: false } as const;
  } catch (error) {
    repository.reconcileAttempt(input.attemptKey);
    throw error;
  }
}
