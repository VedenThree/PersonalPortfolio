"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

// Fascio di dati che attraversa il terminale. La banda è larga il 20% del
// contenitore e la corsa è in percentuale della sua larghezza: -100% = entra
// dal bordo sinistro, 525% = 1.05× la larghezza, quindi esce oltre il destro.
export default function CrtSweep() {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const sweep = animate(el, {
      translateX: ["-100%", "525%"],
      duration: 4200,
      ease: "inOutSine",
      loop: true,
    });
    return () => {
      sweep.revert();
    };
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute top-0 left-0 h-full w-[20%]"
      style={{
        backgroundImage:
          "linear-gradient(to right, transparent, #ff5c00, transparent)",
        opacity: 0.05,
        willChange: "transform",
      }}
    />
  );
}
