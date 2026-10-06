"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
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
  // Solo chi è passato per lo stato nascosto va animato: al primo render
  // già visibile non c'è nulla da rivelare.
  const wasHidden = useRef(false);

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

  useEffect(() => {
    if (!revealed) wasHidden.current = true;
  }, [revealed]);

  // L'ingresso è una tween anime.js dallo stato nascosto a quello naturale,
  // non una transition CSS. Lo stato nascosto è inline (stesso meccanismo che
  // anime scrive), così non c'è doppio offset.
  useEffect(() => {
    if (reduced || !revealed || !wasHidden.current) return;
    const el = ref.current;
    if (!el) return;
    wasHidden.current = false;
    const show = animate(el, {
      opacity: [0, 1],
      translateY: [32, 0],
      duration: 700,
      delay,
      ease: "outExpo",
    });
    return () => {
      show.revert();
    };
  }, [reduced, revealed, delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={revealed ? undefined : { opacity: 0, transform: "translateY(32px)" }}
    >
      {children}
    </div>
  );
}
