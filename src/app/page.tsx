import "./editorial-studio.css";
import { CheckoutButton } from "@/components/checkout-button";
import { BookScrollStory } from "@/components/book-scroll-story";
import { Faq } from "@/components/faq";
import { EditorialHero } from "@/components/editorial-hero";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { formatProductPrice } from "@/lib/commerce/product";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const salesEnabled = process.env.SALES_ENABLED === "true" && process.env.CHECKOUT_MODE === "asaas";
  const isSandbox = salesEnabled && (process.env.ASAAS_API_URL ?? "").includes("sandbox");
  const priceLabel = formatProductPrice();

  return (
    <div className="landing-page">
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <SiteHeader />
      <main id="conteudo">
        <EditorialHero priceLabel={priceLabel} />

        <section className="heritage" id="historia" aria-labelledby="heritage-title">
          <div className="container heritage__grid">
            <Reveal className="heritage__title">
              <h2 id="heritage-title">Alguns cuidados são herança</h2>
            </Reveal>
            <Reveal className="heritage__copy" delay={0.06}>
              <p>Há conhecimentos que vivem nas conversas de família, nos gestos cotidianos e nas receitas compartilhadas com carinho.</p>
              <p><em>Pés de Seda</em> nasceu de uma dessas histórias: um cuidado transmitido pela avó de Ana Maria Lourenço e preservado ao longo das gerações.</p>
            </Reveal>
            <div className="heritage__thread" aria-hidden="true">
              <span>avó</span><i /><span>família</span><i /><span>Ana Maria</span><i /><span>livro</span>
            </div>
          </div>
        </section>

        <BookScrollStory />

        <section className="author" id="autora" aria-labelledby="author-title">
          <div className="container author__grid">
            <Reveal className="author__quote">
              <span className="author__quote-mark" aria-hidden="true">“</span>
              <blockquote>
                <p>Cuidar de si também é respeitar os pequenos sinais do corpo e transformar a rotina em um momento de carinho.</p>
                <cite>Ana Maria Lourenço</cite>
              </blockquote>
            </Reveal>
            <Reveal className="author__copy" delay={0.08}>
              <h2 id="author-title">Ana Maria Lourenço</h2>
              <p className="author__identity">Ana Maria Lourenço, autora de <em>Pés de Seda</em></p>
              <p>Ana acredita que o autocuidado pode começar com gestos simples, naturais e acessíveis. A receita apresentada no livro atravessou gerações em sua família e ganhou, nesta edição, um registro que outras pessoas podem conhecer.</p>
            </Reveal>
          </div>
        </section>

        <section className="offer" id="oferta" aria-labelledby="offer-title">
          <div className="container offer__grid">
            <div className="offer__intro">
              <p>Uma edição digital para ler e consultar no seu ritmo</p>
              <span aria-hidden="true">Pés de Seda · 2026</span>
            </div>
            <Reveal className="offer__copy" delay={0.08}>
              <h2 id="offer-title">Leve Pés de Seda para sua rotina</h2>
              <p className="offer__summary">Receba o PDF depois da confirmação do pagamento e leia quando quiser.</p>
              <dl className="offer__facts" aria-label="Detalhes do produto">
                <div><dt>Formato</dt><dd>PDF</dd></div>
                <div><dt>Idioma</dt><dd>Português</dd></div>
                <div><dt>Extensão</dt><dd>41 páginas</dd></div>
                <div><dt>Pagamento</dt><dd>Único</dd></div>
              </dl>
              <div className="offer__price"><span>Valor total</span><strong>{priceLabel}</strong></div>
              <CheckoutButton enabled={salesEnabled} priceLabel={priceLabel} />
              {isSandbox ? <p className="offer__environment">Ambiente Sandbox — nenhuma compra comercial é processada nesta prévia.</p> : null}
            </Reveal>
          </div>
        </section>

        <section className="faq" id="perguntas" aria-labelledby="faq-title">
          <Reveal className="container faq__header">
            <h2 id="faq-title">Antes de comprar</h2>
            <p>Informações sobre o conteúdo, o cuidado e a entrega do arquivo.</p>
          </Reveal>
          <Reveal className="container faq__body" delay={0.06}><Faq /></Reveal>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container site-footer__top">
          <p className="site-footer__mark">Pés de Seda</p>
          <p className="site-footer__note">Uma história de cuidado preservada entre gerações.</p>
          <a href="#inicio">Voltar ao topo</a>
        </div>
        <div className="container site-footer__bottom">
          <p>© 2026 Pés de Seda</p>
          <nav aria-label="Navegação do rodapé"><a href="#autora">Autora</a><a href="#ebook">Índice</a><a href="#perguntas">Perguntas</a></nav>
          <p className="site-footer__pending">Privacidade e termos em preparação.</p>
        </div>
      </footer>
    </div>
  );
}
