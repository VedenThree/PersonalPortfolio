"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Wrapper con lo stesso linguaggio del box Approccio: scansione sul bordo
 * alto + reveal sfalsato via `data-ap` / `data-chip`, una sola passata.
 *
 * - Default SSR/statico: contenuto sempre visibile. Solo se JS rileva il box
 *   sotto il viewport lo arma in stato nascosto e lo rivela all'intersezione.
 * - Sotto reduced-motion: stato finale immediato.
 */
export default function ProfileBox({
  children,
  className,
  scan = true,
}: {
  children: React.ReactNode;
  className?: string;
  scan?: boolean;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  // `true` = stato finale visibile: default anche nell'HTML statico.
  const [live, setLive] = useState(true);

  useEffect(() => {
    if (reduced) return;
    const el = boxRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;
    // Armato in differita: lo stato nascosto esiste solo dopo che JS ha
    // verificato che il box è fuori dal viewport (niente lampo, niente
    // setState sincrono nell'effect).
    const raf = requestAnimationFrame(() => setLive(false));
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setLive(true);
        io.disconnect();
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [reduced]);

  return (
    <div
      ref={boxRef}
      data-approach={live ? "live" : "idle"}
      className={cn("approach group relative overflow-hidden", className)}
    >
      {scan && <div aria-hidden className="approach-scan" />}
      {children}
    </div>
  );
}
