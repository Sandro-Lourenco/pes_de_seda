"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

const passages = [
  {
    title: "Entender o ressecamento",
    text: "Conheça os fatores que o livro associa à pele seca e às rachaduras, em uma leitura simples e consultável.",
  },
  {
    title: "Conhecer os ingredientes",
    text: "Veja como Ana Maria apresenta os componentes que fazem parte da receita preservada por sua família.",
  },
  {
    title: "Acompanhar o preparo",
    text: "Leia a descrição organizada pela autora e entenda o lugar de cada etapa dentro desse cuidado familiar.",
  },
];

export function BookScrollStory() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="book-story" id="ebook" aria-labelledby="chapters-title">
      <div className="container book-story__heading">
        <h2 id="chapters-title">Cuidado, palavra por palavra</h2>
        <p>O livro se revela aos poucos, como uma conversa tranquila feita para acompanhar e consultar.</p>
      </div>
      <div className="container book-story__layout">
        <figure className="book-story__stage">
          <motion.div
            className="book-story__book"
            initial={reducedMotion ? false : { y: 8 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: reducedMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              className="book-story__mockup"
              src="/assets/capa-pes-de-seda.webp"
              alt="Capa oficial do e-book Pés de Seda"
              width={900}
              height={1406}
              sizes="(max-width: 900px) 64vw, 340px"
            />
          </motion.div>
          <figcaption>O produto é entregue em formato digital.</figcaption>
        </figure>
        <ol className="book-story__passages">
          {passages.map((passage, index) => (
            <li key={passage.title}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>{passage.title}</h3>
              <p>{passage.text}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className="container reading-note">
        <strong>Antes de experimentar</strong>
        <p>O e-book registra uma experiência familiar. Procure orientação profissional antes de usar qualquer preparação nos pés, especialmente se você convive com diabetes ou alterações de sensibilidade.</p>
      </div>
    </section>
  );
}
