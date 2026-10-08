"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Numero che conta fino al target all'ingresso nel viewport, una sola
 * passata. Senza JS o sotto reduced-motion mostra subito il valore.
 */
export default function CountUp({
  to,
  pad = 2,
}: {
  to: number;
  pad?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const render = (v: number) => {
      el.textContent = String(Math.round(v)).padStart(pad, "0");
    };
    if (reduced) {
      render(to);
      return;
    }
    render(0);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const proxy = { v: 0 };
        animate(proxy, {
          v: [0, to],
          duration: 600,
          ease: "outExpo",
          onUpdate: () => render(proxy.v),
        });
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, pad, reduced]);

  return <span ref={ref}>{String(to).padStart(pad, "0")}</span>;
}
