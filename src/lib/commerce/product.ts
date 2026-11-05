export const PRODUCT = Object.freeze({
  id: "pes-de-seda",
  name: "E-book Pés de Seda",
  description: "Edição digital em PDF, 41 páginas",
  priceCents: 4_990,
  currency: "BRL",
});

export function formatProductPrice() {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: PRODUCT.currency,
  }).format(PRODUCT.priceCents / 100);
}
