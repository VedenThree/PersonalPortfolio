"use client";

import { useEffect, useRef } from "react";

const BOX = 460;
const CENTER = BOX / 2;
const SEED = 20260215;

type Target = {
  left: number;
  top: number;
  size: number;
  base: number;
  angle: number; // gradi, precalcolato una sola volta
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const wrap360 = (deg: number) => ((deg % 360) + 360) % 360;

// Target fissi: calcolati una sola volta al caricamento del modulo,
// sempre con lo stesso seed -> stessa posizione ad ogni visita/render.
// Niente più useState/regenerazione random a runtime.
const TARGETS: Target[] = (() => {
  const rng = mulberry32(SEED);
  return Array.from({ length: 6 }, () => {
    const a = rng() * Math.PI * 2;
    const r = 62 + rng() * 86;
    const size = Math.round(3.5 + rng() * 2.5);
    const left = CENTER - size / 2 + r * Math.cos(a);
    const top = CENTER - size / 2 + r * Math.sin(a);
    const cx = left + size / 2;
    const cy = top + size / 2;
    const angle = wrap360((Math.atan2(cy - CENTER, cx - CENTER) * 180) / Math.PI + 90);
    return { left, top, size, base: 0.2 + rng() * 0.25, angle };
  });
})();

export default function HeroOrbital() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const sweepRef = useRef<HTMLDivElement | null>(null);
  const bearingRef = useRef<HTMLParagraphElement | null>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const hitsRef = useRef<number[]>(TARGETS.map(() => 0)); // ultimo istante di "hit" per ogni dot

  useEffect(() => {
    const root = rootRef.current;
    const sweep = sweepRef.current;
    const bearing = bearingRef.current;
    if (!root || !sweep) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const applyScale = () => {
      const w = root.getBoundingClientRect().width;
      if (w > 0) root.style.setProperty("--s", (w / BOX).toFixed(4));
    };
    applyScale();
    const ro = new ResizeObserver(applyScale);
    ro.observe(root);

    let raf = 0;
    let last = performance.now();
    let angle = 0;
    let phase = 0;
    let visible = true;

    const writeBearing = (deg: number) => {
      if (bearing) bearing.textContent = `${String(Math.round(wrap360(deg))).padStart(3, "0")}°`;
    };

    const paintStatic = () => {
      writeBearing(angle);
      sweep.style.transform = `rotate(${wrap360(angle).toFixed(2)}deg)`;
    };

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) last = performance.now();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(64, now - last);
      last = now;

      if (prefersReduced || !visible) {
        paintStatic();
        return;
      }

      angle = wrap360(angle - (dt * 360) / 6000);
      phase += dt / 1000;

      sweep.style.transform = `rotate(${angle.toFixed(4)}deg)`;
      writeBearing(190 + 150 * Math.sin(phase * 0.9));

      dotRefs.current.forEach((dot, i) => {
        if (!dot) return;
        const t = TARGETS[i];
        const ahead = wrap360(t.angle - angle);
        if (ahead < 12) hitsRef.current[i] = now;

        const tail = Math.max(0, 1 - (now - hitsRef.current[i]) / 520);
        const onBeam = Math.max(0, 1 - ahead / 12);
        const hit = Math.min(1, onBeam * onBeam * 0.55 + tail * 0.45);

        dot.style.opacity = Math.min(1, t.base + hit).toFixed(3);
        dot.style.transform = `scale(${(1 + hit).toFixed(3)})`;
        dot.style.boxShadow =
          hit > 0.02
            ? `0 0 ${(10 + hit * 14).toFixed(1)}px rgba(255, 90, 31, ${(hit * 0.85).toFixed(3)})`
            : "none";
      });
    };

    if (prefersReduced) {
      paintStatic();
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="bg-[#0b101d5d] relative rounded-[8px] w-full max-w-[520px] aspect-square"
      style={{ "--s": 1 } as React.CSSProperties}
    >
      <div className="absolute inset-0 rounded-[inherit] will-change-transform" style={{ transform: "scale(var(--s))" }}>
        <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[inherit] size-full">
          {/* Griglia di sfondo */}
          <div className="absolute inset-0 flex flex-col justify-between p-5 pointer-events-none opacity-30">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-px w-full bg-[#1b2438]" />
            ))}
          </div>

          {/* Radar: anelli, sweep, target */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 m-auto overflow-clip rounded-full pointer-events-none size-[320px]">
              <div
                ref={sweepRef}
                className="absolute inset-0 will-change-transform"
                style={{
                  background:
                    "conic-gradient(from 0deg, rgba(255, 90, 31, 0.28) 7deg, rgba(255, 90, 31, 0.13) 19deg, rgba(255, 90, 31, 0.035) 32deg, rgba(255, 90, 31, 0) 48deg)",
                }}
              />
            </div>

            <div className="absolute inset-0 m-auto size-[360px]">
              <div className="arc-ring absolute inset-0 m-auto" style={{ width: 320, height: 320, opacity: 0.08 }} />
            </div>

            {/* Target fissi (stessa posizione ad ogni render) */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden>
              {TARGETS.map((t, i) => (
                <span
                  key={i}
                  ref={(el) => {
                    dotRefs.current[i] = el;
                  }}
                  className="absolute rounded-full bg-[#ff5c00]"
                  style={{ left: t.left, top: t.top, width: t.size, height: t.size, opacity: t.base }}
                />
              ))}
            </div>

            <div className="absolute inset-0 m-auto size-[220px]">
              <div className="arc-ring absolute inset-0 m-auto" style={{ width: 220, height: 220 }} />
            </div>
          </div>

          {/* Nucleo centrale */}
          <div className="absolute inset-0 m-auto size-[110px]">
            <div className="bg-[#050811] border-2 border-[#ff5c00] rounded-full size-full flex flex-col items-center justify-center">
              <p className="font-['Geist_Mono',_sans-serif] text-[9px] text-[#ff5c00]">SECTOR_CORE</p>
              <p ref={bearingRef} className="font-['Geist_Mono',_sans-serif] font-black text-[15px] tabular-nums text-[#f1f5f9]">
                000°
              </p>
              <p className="font-['Geist_Mono',_sans-serif] text-[8px] text-[#10b981]">SYS_READY</p>
            </div>
          </div>

          {/* Etichette d'angolo */}
          <p className="absolute font-['Geist_Mono',_sans-serif] text-[9px] text-[#64748b] left-6 top-6 whitespace-nowrap">
            SYS_MONITOR // V.24.1
          </p>
          <p className="absolute font-['Geist_Mono',_sans-serif] text-[9px] text-[#ff5c00] left-6 bottom-6 whitespace-nowrap">
            SYS_LOC: ORB_L_09
          </p>
          <p className="absolute font-['Geist_Mono',_sans-serif] text-[9px] text-[#10b981] right-6 top-6 whitespace-nowrap">
            SCANNER: SCAN
          </p>
        </div>
      </div>

      <div aria-hidden className="absolute border border-[#1b2438] inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}
