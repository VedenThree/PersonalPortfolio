"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

// Fascio di dati che attraversa il terminale. La banda è larga il 20% del
// contenitore e la corsa è in percentuale della sua larghezza: -100% = entra
// dal bordo sinistro, 525% = 1.05× la larghezza, quindi esce oltre il destro.
export default function CrtSweep() {
  const ref = useRef<HTMLSpanElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const sweep = animate(el, {
      translateX: ["-100%", "525%"],
      duration: 4200,
      ease: "inOutSine",
      loop: true,
    });
    return () => {
      sweep.revert();
    };
  }, [reduced]);

  return (
    <span
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute top-0 left-0 h-full w-[20%]"
      style={{
        backgroundImage:
          "linear-gradient(to right, transparent, var(--orange), transparent)",
        opacity: 0.05,
        willChange: "transform",
      }}
    />
  );
}
