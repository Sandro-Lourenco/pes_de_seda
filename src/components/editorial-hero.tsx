"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { BookCover } from "@/components/book-cover";

const container: Variants = {
  rest: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

export function EditorialHero({ priceLabel }: { priceLabel: string }) {
  const reducedMotion = useReducedMotion();
  const item: Variants = {
    rest: { opacity: 1, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reducedMotion ? 0 : 0.32, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <motion.div
        className="container hero__grid"
        variants={container}
        initial="rest"
        animate="visible"
      >
        <div className="hero__copy">
          <motion.p className="hero__edition" variants={item}>E-book de Ana Maria Lourenço</motion.p>
          <motion.h1 id="hero-title" variants={item}>Pés de Seda</motion.h1>
          <motion.p className="hero__kicker" variants={item}>Um cuidado de família, agora entre páginas.</motion.p>
          <motion.p className="hero__lead" variants={item}>Uma leitura acolhedora sobre a origem de uma receita familiar, os ingredientes apresentados pela autora e o saber preservado entre gerações.</motion.p>
          <motion.div className="hero__actions" variants={item}>
            <a className="button button--primary" href="#oferta">Comprar por {priceLabel}</a>
            <a className="editorial-link" href="#ebook">Conhecer o conteúdo</a>
          </motion.div>
          <motion.p className="hero__meta" variants={item}>PDF · 41 páginas · pagamento único pelo Asaas</motion.p>
        </div>
        <motion.figure className="hero__visual" variants={item}>
          <div className="hero__object-stage" aria-hidden="true" />
          <motion.div
            className="hero__book"
            initial={{ opacity: 1, y: 10, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: -1 }}
            transition={{ duration: reducedMotion ? 0 : 0.48, delay: reducedMotion ? 0 : 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            <BookCover compact />
          </motion.div>
          <svg className="hero__silk" viewBox="0 0 620 420" aria-hidden="true">
            <motion.path
              d="M18 286C132 354 181 76 341 110c118 25 92 162 261 128"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: reducedMotion ? 0 : 1.15, delay: reducedMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <figcaption>Uma edição digital inspirada em memórias de família.</figcaption>
        </motion.figure>
        <motion.a className="hero__scroll" href="#historia" variants={item}>Continuar a leitura</motion.a>
      </motion.div>
      <div className="hero__facts" aria-label="Informações do e-book">
        <p><span>Leitura</span><strong>Breve e consultável</strong></p>
        <p><span>Conteúdo</span><strong>3 capítulos organizados</strong></p>
        <p><span>Acesso</span><strong>Após confirmação</strong></p>
      </div>
    </section>
  );
}
