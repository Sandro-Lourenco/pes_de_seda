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
    hidden: reducedMotion ? { opacity: 1 } : { opacity: 1, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reducedMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <motion.div className="container hero__grid" variants={group} initial="hidden" animate="visible">
        <div className="hero__copy">
          <motion.h1 id="hero-title" variants={item}>Pés de Seda</motion.h1>
          <motion.p className="hero__kicker" variants={item}>Um cuidado de família, agora entre páginas.</motion.p>
          <motion.p className="hero__lead" variants={item}>
            Uma leitura acolhedora sobre a origem de uma receita familiar, os ingredientes apresentados pela autora e o saber preservado entre gerações.
          </motion.p>
          <motion.div className="hero__actions" variants={item}>
            <a className="button button--primary" href="#oferta">Comprar por {priceLabel}</a>
            <a className="editorial-link" href="#ebook">Conhecer o conteúdo</a>
          </motion.div>
          <motion.p className="hero__meta" variants={item}>Ana Maria Lourenço · PDF · 41 páginas · pagamento único</motion.p>
        </div>
        <motion.figure className="hero__visual" variants={item}>
          <div className="hero__still-life" aria-hidden="true">
            <Image src="/assets/ritual-hero.webp" alt="" fill priority sizes="(max-width: 900px) 100vw, 54vw" />
          </div>
          <div className="hero__cover">
            <Image
              src="/assets/capa-pes-de-seda.webp"
              alt="Capa oficial do e-book Pés de Seda, de Ana Maria L. M."
              width={900}
              height={1406}
              priority
              sizes="(max-width: 700px) 54vw, 300px"
            />
          </div>
          <figcaption>Capa oficial do e-book</figcaption>
        </motion.figure>
      </motion.div>
    </section>
  );
}
