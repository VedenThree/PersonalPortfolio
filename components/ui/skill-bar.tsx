"use client";

import { useEffect, useRef } from "react";
import { animate, type JSAnimation } from "animejs";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Barra di livello che si riempie ogni volta che entra nel viewport, non
 * solo la prima: all'uscita torna a zero e al rientro riparte. Parte da
 * markup pieno (senza JS resta leggibile).
 */
export default function SkillBar({
  level,
  index,
  label,
}: {
  level: number;
  index: number;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = `${level * 20}%`;
    // Sotto reduced-motion niente tween: valore finale e stop.
    if (reduced) {
      el.style.width = target;
      return;
    }
    el.style.width = "0%";
    let anim: JSAnimation | null = null;
    const io = new IntersectionObserver(
      ([entry]) => {
        anim?.pause();
        // Fuori dal viewport: si azzera in silenzio, così il prossimo
        // ingresso riparte da capo invece di restare piena.
        if (!entry.isIntersecting) {
          el.style.width = "0%";
          anim = null;
          return;
        }
        anim = animate(el, {
          width: ["0%", target],
          duration: 900,
          delay: Math.min(index * 70, 420),
          ease: "outExpo",
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      anim?.pause();
    };
  }, [level, index, reduced]);

  return (
    <div
      className="h-[6px] w-full bg-bg-deep/80 border border-line/40 rounded"
      role="img"
      aria-label={label}
    >
      <div
        ref={ref}
        className="h-full bg-gradient-to-r from-orange/50 to-orange rounded"
        style={{ width: `${level * 20}%` }}
      />
    </div>
  );
}
