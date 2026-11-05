const items = [
  ["Essa receita realmente funciona?", "O livro registra uma experiência familiar. Os resultados individuais podem variar e o material não comprova eficácia clínica."],
  ["Quais ingredientes são necessários?", "O capítulo 2 apresenta os componentes da fórmula da família. Consulte orientação profissional antes de usar a preparação."],
  ["Quanto tempo leva para perceber os resultados?", "A autora não estabelece um prazo comprovado."],
  ["Posso utilizar mesmo sendo diabético?", "Converse com a equipe que acompanha seu diabetes antes de usar preparações nos pés."],
  ["Receberei o e-book imediatamente?", "Após a confirmação do pagamento, a página do pedido libera o PDF. Se ainda estiver pendente, você poderá voltar para consultar o status."],
] as const;

export function Faq() {
  return (
    <AccessibleAccordion className="faq-list">
      {items.map(([question, answer]) => (
        <AccessibleAccordionItem id={`faq-${question.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`} title={question} key={question}>
          <p>{answer}</p>
        </AccessibleAccordionItem>
      ))}
    </AccessibleAccordion>
  );
}
import { AccessibleAccordion, AccessibleAccordionItem } from "@/components/ui/accessible-accordion";

