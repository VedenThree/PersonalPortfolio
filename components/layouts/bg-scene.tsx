"use client";

import { useEffect } from "react";

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
  // 88 elementi animati più un layer aurora con blur e mix-blend: il browser
  // continua a dipingere anche con la tab in background. Sospendere
  // animation-play-state quando la tab è nascosta libera quel lavoro.
  useEffect(() => {
    const root = document.documentElement;
    const onVisibility = () => {
      root.classList.toggle("scene-paused", document.hidden);
    };
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      root.classList.remove("scene-paused");
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--bg-deep)_0%,var(--bg)_45%,var(--bg)_100%)]" />
      <div
        className="absolute w-[150%] h-[65%] -top-[15%] -left-[25%] opacity-40 animate-aurora will-change-transform mix-blend-screen blur-[70px] bg-[radial-gradient(ellipse_at_28%_30%,color-mix(in_srgb,var(--ice)_55%,transparent),transparent_60%),radial-gradient(ellipse_at_68%_42%,color-mix(in_srgb,var(--orange)_28%,transparent),transparent_55%),radial-gradient(ellipse_at_48%_62%,color-mix(in_srgb,var(--olive)_40%,transparent),transparent_60%)]"
      />
      <div id="particles" className="absolute inset-0">
        {STARS.map((s) => (
          <span
            key={s.id}
            className="absolute rounded-full bg-paper animate-twinkle"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
        {MOTES.map((m) => (
          <span
            key={m.id}
            className="absolute rounded-full bg-ice opacity-50 animate-drift"
            style={{
              left: `${m.left}%`,
              bottom: `${m.bottom}%`,
              width: m.size,
              height: m.size,
              animationDuration: `${m.duration}s`,
              animationDelay: `${m.delay}s`,
            }}
          />
        ))}
      </div>
      <div className="crt-scanline absolute inset-0 pointer-events-none" />
      <div className="crosshair absolute inset-0 pointer-events-none" />
    </div>
  );
}