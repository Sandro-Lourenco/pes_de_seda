"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

export function BookCover({ compact = false }: { compact?: boolean }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.figure
      className={compact ? "book-cover book-cover--compact" : "book-cover"}
      initial={reducedMotion ? false : { y: 8 }}
      animate={{ y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.42, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Capa do e-book Pés de Seda extraída do vídeo fornecido"
    >
      <Image
        className="book-cover__image"
        src="/assets/book-cover-video.webp"
        alt="Mockup tridimensional da capa verde e creme do e-book Pés de Seda"
        width={760}
        height={1160}
        sizes={compact ? "(max-width: 680px) 55vw, 300px" : "(max-width: 680px) 70vw, 380px"}
      />
    </motion.figure>
  );
}
