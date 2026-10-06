"use client";

import { useEffect, useRef } from "react";
import { animate, type JSAnimation } from "animejs";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

type Particle = {
  id: string;
  top?: number;
  left: number;
  bottom?: number;
  size: number;
  duration: number;
  delay: number;
};

const makeParticles = (
  kind: string,
  n: number,
  fn: (i: number) => Omit<Particle, "id">,
): Particle[] => Array.from({ length: n }, (_, i) => ({ ...fn(i), id: `${kind}-${i}` }));

const STARS = makeParticles("star", 70, (i) => ({
  top: (i * 37) % 100,
  left: (i * 53) % 100,
  size: 1 + ((i * 7) % 10) / 5,
  duration: 2 + ((i * 3) % 40) / 10,
  delay: ((i * 11) % 50) / 10,
}));

const MOTES = makeParticles("mote", 18, (i) => ({
  left: (i * 41) % 100,
  bottom: 5 + ((i * 13) % 90),
  size: 1 + ((i * 5) % 8) / 4,
  duration: 12 + ((i * 7) % 60) / 10,
  delay: ((i * 17) % 100) / 10,
}));

export default function BgScene() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const auroraRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  // Tre istanze anime.js al posto di 88 animazioni CSS: stelle, pulviscolo e
  // alone. Ogni stella/polline tiene la sua durata e il suo ritardo, come
  // prima con animation-duration/delay inline.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const runs: JSAnimation[] = [
      animate(root.querySelectorAll("[data-star]"), {
        opacity: [0.15, 0.9],
        duration: (_el?: unknown, i?: number) => STARS[i ?? 0].duration * 1000,
        delay: (_el?: unknown, i?: number) => STARS[i ?? 0].delay * 1000,
        ease: "inOutSine",
        loop: true,
        alternate: true,
      }),
      animate(root.querySelectorAll("[data-mote]"), {
        translateY: ["0px", "-110vh"],
        duration: (_el?: unknown, i?: number) => MOTES[i ?? 0].duration * 1000,
        delay: (_el?: unknown, i?: number) => MOTES[i ?? 0].delay * 1000,
        ease: "linear",
        loop: true,
      }),
    ];
    if (auroraRef.current) {
      runs.push(
        animate(auroraRef.current, {
          translate: ["0% 0%", "3% 4%"],
          rotate: [0, 2.5],
          scale: [1, 1.06],
          duration: 24000,
          ease: "inOutSine",
          loop: true,
          alternate: true,
        }),
      );
    }

    // La tab in background non deve costare animazioni: pause al posto del
    // vecchio toggle di `animation-play-state` via classe.
    const onVisibility = () => {
      runs.forEach((r) => (document.hidden ? r.pause() : r.play()));
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      runs.forEach((r) => r.revert());
    };
  }, [reduced]);

  return (
    <div ref={rootRef} className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--bg-deep)_0%,var(--bg)_45%,var(--bg)_100%)]" />
      <div
        ref={auroraRef}
        className="absolute w-[150%] h-[65%] -top-[15%] -left-[25%] opacity-40 will-change-transform mix-blend-screen blur-[70px] bg-[radial-gradient(ellipse_at_28%_30%,color-mix(in_srgb,var(--ice)_55%,transparent),transparent_60%),radial-gradient(ellipse_at_68%_42%,color-mix(in_srgb,var(--orange)_28%,transparent),transparent_55%),radial-gradient(ellipse_at_48%_62%,color-mix(in_srgb,var(--olive)_40%,transparent),transparent_60%)]"
      />
      <div id="particles" className="absolute inset-0">
        {STARS.map((s) => (
          <span
            key={s.id}
            data-star
            className="absolute rounded-full bg-paper"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
            }}
          />
        ))}
        {MOTES.map((m) => (
          <span
            key={m.id}
            data-mote
            className="absolute rounded-full bg-ice opacity-50"
            style={{
              left: `${m.left}%`,
              bottom: `${m.bottom}%`,
              width: m.size,
              height: m.size,
            }}
          />
        ))}
      </div>
      <div className="crt-scanline absolute inset-0 pointer-events-none" />
      <div className="crosshair absolute inset-0 pointer-events-none" />
    </div>
  );
}
