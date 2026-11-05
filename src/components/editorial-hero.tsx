"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";

const group: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

export function EditorialHero({ priceLabel }: { priceLabel: string }) {
  const reducedMotion = useReducedMotion();
  const item: Variants = {
    hidden: reducedMotion ? { opacity: 1 } : { opacity: 0, y: 18, filter: "blur(7px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reducedMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <motion.div className="container hero__grid" variants={group} initial="visible" animate="visible">
        <div className="hero__copy">
          <motion.p className="hero__edition" variants={item}>E-book de Ana Maria Lourenço</motion.p>
          <motion.h1 id="hero-title" variants={item}>Pés de <em>Seda</em></motion.h1>
          <motion.p className="hero__kicker" variants={item}>Um cuidado de família, agora entre páginas.</motion.p>
          <motion.p className="hero__lead" variants={item}>
            Uma leitura acolhedora sobre a origem de uma receita familiar, os ingredientes apresentados pela autora e o saber preservado entre gerações.
          </motion.p>
          <motion.div className="hero__actions" variants={item}>
            <a className="button button--primary" href="#oferta">Comprar por {priceLabel}</a>
            <a className="editorial-link" href="#ebook">Conhecer o conteúdo</a>
          </motion.div>
          <motion.p className="hero__meta" variants={item}>PDF · 41 páginas · pagamento único pelo Asaas</motion.p>
        </div>
      </motion.div>
      <div className="hero__image" aria-hidden="true">
        <Image src="/assets/hero-premium-safe.webp" alt="" fill priority sizes="100vw" />
      </div>
      <p className="hero__caption">Representação visual do e-book. O produto é entregue em formato digital.</p>
    </section>
  );
}
