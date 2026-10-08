"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

// Glifi della decodifica: solo alfanumerici e simboli di sistema.
const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#/*+°·_<>|";
// Spazi e punteggiatura non si muovono mai: così la riga non salta di
// larghezza mentre il resto frulla.
const FIXED = new Set([" ", "·", "/", "+", ".", ",", "(", ")", "[", "]", "°"]);

/**
 * Testo che si decodifica da caratteri casuali all'ingresso nel viewport,
 * una sola passata. Senza JS o sotto reduced-motion resta testo pieno.
 */
export default function ScrambleText({
  text,
  index = 0,
  className,
}: {
  text: string;
  index?: number;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const spin = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];
    const render = (p: number) => {
      const cut = Math.floor(p * text.length);
      el.textContent = text
        .split("")
        .map((c, i) => (i < cut || FIXED.has(c) ? c : spin()))
        .join("");
    };
    render(0);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const proxy = { p: 0 };
        animate(proxy, {
          p: [0, 1],
          duration: 650,
          delay: Math.min(index * 90, 450),
          ease: "linear",
          onUpdate: () => render(proxy.p),
          onComplete: () => {
            el.textContent = text;
          },
        });
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [text, index, reduced]);

  return (
    <p ref={ref} className={className}>
      {text}
    </p>
  );
}
