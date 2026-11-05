"use client";

import { forwardRef, type ReactNode, type SyntheticEvent } from "react";

// Adapted from A11YPros' Accessible Accordion on 21st.dev (MIT).
// Source: https://21st.dev/@a11ypros/components/a11y-accordion
export const AccessibleAccordion = forwardRef<
  HTMLDivElement,
  { children: ReactNode; allowMultiple?: boolean; className?: string }
>(function AccessibleAccordion({ children, allowMultiple = false, className = "" }, ref) {
  function closeOtherItems(event: SyntheticEvent<HTMLDivElement>) {
    if (allowMultiple) return;
    const target = event.target;
    if (!(target instanceof HTMLDetailsElement) || !target.open) return;

    event.currentTarget.querySelectorAll("details[open]").forEach((item) => {
      if (item !== target) item.removeAttribute("open");
    });
  }

  return (
    <div ref={ref} className={className} onToggle={closeOtherItems}>
      {children}
    </div>
  );
});

export const AccessibleAccordionItem = forwardRef<
  HTMLDetailsElement,
  { id: string; title: string; children: ReactNode; defaultOpen?: boolean }
>(function AccessibleAccordionItem({ id, title, children, defaultOpen = false }, ref) {
  return (
    <details ref={ref} id={id} className="faq-item" open={defaultOpen}>
      <summary>
        <span>{title}</span>
        <span className="faq-item__icon" aria-hidden="true">+</span>
      </summary>
      <div className="faq-item__answer">{children}</div>
    </details>
  );
});
