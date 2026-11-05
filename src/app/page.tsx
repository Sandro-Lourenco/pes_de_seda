import "./landing-premium.css";
import "./reference-inspired.css";
import "./cinematic-premium.css";
import { CheckoutButton } from "@/components/checkout-button";
import { BookCover } from "@/components/book-cover";
import { BookScrollStory } from "@/components/book-scroll-story";
import { Faq } from "@/components/faq";
import { EditorialHero } from "@/components/editorial-hero";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { formatProductPrice } from "@/lib/commerce/product";

export default function HomePage() {
  const salesEnabled = process.env.SALES_ENABLED === "true" && process.env.CHECKOUT_MODE === "asaas";
  const priceLabel = formatProductPrice();

  return (
    <div className="landing-page">
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <div className="concept-banner">Pés de Seda · edição digital</div>
      <SiteHeader />

      <main id="conteudo">
        <EditorialHero priceLabel={priceLabel} />

        <section className="heritage" id="historia" aria-labelledby="heritage-title">
          <span className="section-folio container" aria-hidden="true">01 / 06 · O começo de tudo</span>
          <div className="container heritage__grid">
            <Reveal className="heritage__title">
              <h2 id="heritage-title">Alguns cuidados são <em>herança.</em></h2>
            </Reveal>
            <Reveal className="heritage__copy" delay={0.06}>
              <p>Há conhecimentos que não se encontram apenas nos livros. Eles vivem nas conversas de família, nos gestos cotidianos e nas receitas compartilhadas com carinho.</p>
              <p className="heritage__lead">O <em>Pés de Seda</em> nasceu de uma dessas histórias: um cuidado transmitido pela avó de Ana Maria Lourenço e preservado ao longo das gerações.</p>
            </Reveal>
            <p className="heritage__line" aria-hidden="true"><span>avó</span><i /><span>mãe</span><i /><span>filha</span><i /><span>livro</span></p>
          </div>
        </section>

        <BookScrollStory />

        <section className="author" id="autora" aria-labelledby="author-title">
          <span className="section-folio container" aria-hidden="true">03 / 06 · Quem está por trás deste cuidado</span>
          <div className="container author__grid">
            <Reveal className="author__quote">
              <span className="author__quote-mark" aria-hidden="true">“</span>
              <blockquote>
                <p>Cuidar de si também é respeitar os pequenos sinais do corpo e transformar a rotina em um momento de carinho.</p>
                <cite>Ana Maria Lourenço</cite>
              </blockquote>
            </Reveal>
            <Reveal className="author__copy" delay={0.08}>
              <h2 id="author-title">Ana Maria <em>Lourenço.</em></h2>
              <p className="author__identity">Ana Maria Lourenço, autora de <em>Pés de Seda</em></p>
              <p>Ana acredita que o autocuidado pode começar com gestos simples, naturais e acessíveis. A receita apresentada no livro atravessou gerações em sua família e ganhou, nesta edição, um registro que outras pessoas podem conhecer.</p>
              <p className="author__pending">Esta página permanece tipográfica enquanto o retrato autorizado está em preparação.</p>
            </Reveal>
          </div>
        </section>

        <section className="offer" id="oferta" aria-labelledby="offer-title">
          <span className="section-folio container" aria-hidden="true">04 / 06 · Seu próximo momento de cuidado</span>
          <div className="container offer__grid">
            <Reveal className="offer__visual"><BookCover compact /></Reveal>
            <Reveal className="offer__copy" delay={0.08}>
              <h2 id="offer-title">Pequenos gestos. <em>Um novo ritual.</em></h2>
              <p className="offer__summary">Receba o PDF depois da confirmação do pagamento e leia quando quiser.</p>
              <dl className="offer__facts" aria-label="Detalhes do produto">
                <div><dt>Formato</dt><dd>PDF</dd></div>
                <div><dt>Idioma</dt><dd>Português</dd></div>
                <div><dt>Extensão</dt><dd>41 páginas</dd></div>
                <div><dt>Pagamento</dt><dd>Único</dd></div>
              </dl>
              <div className="offer__price"><span>Valor total</span><strong>{priceLabel}</strong></div>
              <CheckoutButton enabled={salesEnabled} priceLabel={priceLabel} />
            </Reveal>
          </div>
        </section>

        <section className="faq" id="perguntas" aria-labelledby="faq-title">
          <span className="section-folio container" aria-hidden="true">05 / 06 · Antes de começar</span>
          <Reveal className="container faq__header">
            <h2 id="faq-title">Perguntas que <em>acolhem respostas.</em></h2>
            <p>Respostas diretas sobre o conteúdo, o cuidado e a entrega do arquivo.</p>
          </Reveal>
          <Reveal className="container faq__body" delay={0.06}><Faq /></Reveal>
        </section>
      </main>

      <footer className="site-footer">
        <span className="section-folio container" aria-hidden="true">06 / 06 · O cuidado continua</span>
        <div className="container site-footer__top">
          <p className="site-footer__mark">Que os pequenos gestos se tornem <em>grandes cuidados.</em></p>
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
