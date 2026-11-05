"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { BookCover } from "@/components/book-cover";

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
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [-4, 2, 5]);
  const lift = useTransform(scrollYProgress, [0, 0.5, 1], [18, -10, 14]);
  const boxShadow = useTransform(scrollYProgress, [0, 0.5, 1], [
    "0 24px 52px rgb(5 18 8 / .2)",
    "0 32px 70px rgb(5 18 8 / .34)",
    "0 26px 58px rgb(5 18 8 / .22)",
  ]);

  return (
    <section className="book-story" id="ebook" ref={sectionRef} aria-labelledby="chapters-title">
      <div className="container book-story__heading">
        <h2 id="chapters-title">Cuidado, <em>palavra</em> por palavra.</h2>
        <p>O livro se revela aos poucos — como uma conversa tranquila, feita para acompanhar e consultar.</p>
      </div>
      <div className="container book-story__layout">
        <figure className="book-story__stage">
          <motion.div
            className="book-story__book"
            style={reducedMotion ? undefined : { rotate, y: lift, boxShadow }}
          >
            <BookCover />
          </motion.div>
          <figcaption>Representação visual. O produto é entregue em formato digital.</figcaption>
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
