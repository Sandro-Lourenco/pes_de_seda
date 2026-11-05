"use client";

import { motion, useReducedMotion } from "motion/react";

export function BookCover({ compact = false }: { compact?: boolean }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.figure
      className={compact ? "book-cover book-cover--compact" : "book-cover"}
      initial={reducedMotion ? false : { y: 8 }}
      animate={{ y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.42, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Representação editorial temporária da capa do e-book Pés de Seda"
    >
      <div className="book-cover__page">
        <span className="book-cover__edition">Prévia editorial</span>
        <span className="book-cover__thread" aria-hidden="true" />
        <div className="book-cover__title">
          <span>Pés</span>
          <em>de</em>
          <span>Seda</span>
        </div>
        <span className="book-cover__author">Ana Maria Lourenço</span>
      </div>
      {!compact && <figcaption>Capa final pendente de aprovação.</figcaption>}
    </motion.figure>
  );
}
