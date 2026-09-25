"use client";

import { useEffect, useRef } from "react";

const BOX = 460;
const CENTER = BOX / 2;
const SEED = 12323234;
const SWEEP_PERIOD = 6000;
const RING_OUTER_PERIOD = 18000;
const RING_INNER_PERIOD = 11000;

// Utility: converte un valore nel sistema di coordinate BOX in % del contenitore reale
const pct = (v: number) => `${((v / BOX) * 100).toFixed(4)}%`;

type Target = {
  left: number;
  top: number;
  size: number;
  base: number;
  angle: number;
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

// Target fissi: stessa posizione ad ogni render/visita (stesso seed).
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
  const sweepRef = useRef<HTMLDivElement | null>(null);
  const ringOuterRef = useRef<HTMLDivElement | null>(null);
  const ringInnerRef = useRef<HTMLDivElement | null>(null);
  const bearingRef = useRef<HTMLParagraphElement | null>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const hitsRef = useRef<number[]>(TARGETS.map(() => 0));

  useEffect(() => {
    const sweep = sweepRef.current;
    const bearing = bearingRef.current;
    if (!sweep) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let last = performance.now();
    let angle = 0;
    let outerAngle = 0;
    let innerAngle = 0;
    let phase = 0;
    let visible = true;

    const writeBearing = (deg: number) => {
      if (bearing) bearing.textContent = `${String(Math.round(wrap360(deg))).padStart(3, "0")}°`;
    };

    const paintRings = () => {
      if (ringOuterRef.current) {
        ringOuterRef.current.style.transform = `rotate(${wrap360(outerAngle).toFixed(4)}deg)`;
      }
      if (ringInnerRef.current) {
        ringInnerRef.current.style.transform = `rotate(${wrap360(innerAngle).toFixed(4)}deg)`;
      }
    };

    const paintStatic = () => {
      writeBearing(angle);
      sweep.style.transform = `rotate(${wrap360(angle).toFixed(2)}deg)`;
      paintRings();
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

      angle = wrap360(angle - (dt * 360) / SWEEP_PERIOD);
      outerAngle = wrap360(outerAngle - (dt * 360) / RING_OUTER_PERIOD);
      innerAngle = wrap360(innerAngle - (dt * 360) / RING_INNER_PERIOD);
      phase += dt / 1000;

      sweep.style.transform = `rotate(${angle.toFixed(4)}deg)`;
      paintRings();
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
    };
  }, []);

  return (
    <div className="bg-[#0b101d5d] relative rounded-[8px] w-full max-w-[520px] aspect-square overflow-clip">
      {/* Griglia di sfondo */}
      <div className="absolute inset-0 flex flex-col justify-between p-5 pointer-events-none opacity-30">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-px w-full bg-[#1b2438]" />
        ))}
      </div>

      {/* Radar: anelli, sweep, target — tutto in % del contenitore, niente transform:scale globale */}
      <div className="absolute inset-0">
        {/* Sweep wedge: 320/460 = 69.57% */}
        <div
          className="absolute inset-0 m-auto overflow-clip rounded-full pointer-events-none"
          style={{ width: pct(320), height: pct(320) }}
        >
          <div
            ref={sweepRef}
            className="absolute inset-0 will-change-transform"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(255, 90, 31, 0.28) 7deg, rgba(255, 90, 31, 0.13) 19deg, rgba(255, 90, 31, 0.035) 32deg, rgba(255, 90, 31, 0) 48deg)",
            }}
          />
        </div>

        {/* Anello esterno: 320/460 = 69.57% — 18s/giro, contro-orario */}
        <div
          ref={ringOuterRef}
          className="arc-ring absolute inset-0 m-auto will-change-transform"
          style={{ width: pct(320), height: pct(320), opacity: 0.08 }}
        />

        {/* Target fissi */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {TARGETS.map((t, i) => (
            <span
              key={i}
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              className="absolute rounded-full bg-[#ff5c00]"
              style={{
                left: pct(t.left),
                top: pct(t.top),
                width: pct(t.size),
                height: pct(t.size),
                opacity: t.base,
              }}
            />
          ))}
        </div>

        {/* Anello interno: 220/460 = 47.83% — 11s/giro, contro-orario */}
        <div
          ref={ringInnerRef}
          className="arc-ring absolute inset-0 m-auto will-change-transform"
          style={{ width: pct(220), height: pct(220) }}
        />
      </div>

      {/* Nucleo centrale: 110/460 = 23.91% — testo sempre alla sua dimensione reale, mai scalato */}
      <div className="absolute inset-0 m-auto" style={{ width: pct(110), height: pct(110) }}>
        <div className="bg-[#050811] border-2 border-[#ff5c00] rounded-full size-full flex flex-col items-center justify-center">
          <p className="font-jet text-[12px] text-[#ff5c00]">SECTOR_CORE</p>
          <p ref={bearingRef} className="font-jet font-black text-[15px] tabular-nums text-[#f1f5f9]">
            000°
          </p>
          <p className="font-jet text-[8px] text-[#10b981]">SYS_READY</p>
        </div>
      </div>

      {/* Etichette d'angolo */}
      <p className="absolute font-jet text-[9px] text-[#64748b] left-6 top-6 whitespace-nowrap">
        SYS_MONITOR // V.24.1
      </p>
      <p className="absolute font-jet text-[9px] text-[#ff5c00] left-6 bottom-6 whitespace-nowrap">
        SYS_LOC: ORB_L_09
      </p>
      <p className="absolute font-jet text-[9px] text-[#10b981] right-6 top-6 whitespace-nowrap">
        SCANNER: SCAN
      </p>

      <div aria-hidden className="absolute border border-[#1b2438] inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}