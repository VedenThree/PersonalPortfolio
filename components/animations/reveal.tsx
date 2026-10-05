"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  // `true` è il default anche nell'HTML statico: senza JS — o se l'effect
  // non parte mai — il contenuto resta leggibile. L'animazione deve poter
  // togliere il contenuto dalla vista, non il contrario.
  const [revealed, setRevealed] = useState(true);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    // Già dentro la finestra al caricamento: non c'è nulla da rivelare, e
    // nasconderlo solo per riaccenderlo un frame dopo sarebbe un lampo.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    setRevealed(false);
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          obs.unobserve(entry.target);
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      // transitionDelay, non animationDelay: l'elemento si muove con una
      // transition e non ha alcuna animazione CSS associata.
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}