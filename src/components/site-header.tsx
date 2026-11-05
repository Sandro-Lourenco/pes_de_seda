"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const links = [
  ["Nossa história", "#historia"],
  ["O e-book", "#ebook"],
  ["A autora", "#autora"],
  ["Perguntas", "#perguntas"],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header className="site-header">
      <a className="wordmark" href="#inicio" aria-label="Pés de Seda, início">
        Pés de Seda
      </a>

      <nav className="site-header__desktop-nav" aria-label="Navegação principal">
        {links.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
      </nav>

      <a className="header-offer" href="#oferta">Ver oferta</a>

      <button
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="menu-celular"
        onClick={() => setOpen((value) => !value)}
      >
        <span>{open ? "Fechar" : "Menu"}</span>
        <span className="menu-toggle__icon" aria-hidden="true"><i /><i /></span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="menu-celular"
            className="mobile-menu"
            aria-label="Navegação no celular"
            initial={reducedMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: reducedMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {links.map(([label, href], index) => (
              <a href={href} key={href} onClick={() => setOpen(false)}>
                <span aria-hidden="true">0{index + 1}</span>{label}
              </a>
            ))}
            <a className="mobile-menu__offer" href="#oferta" onClick={() => setOpen(false)}>Comprar o e-book</a>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
