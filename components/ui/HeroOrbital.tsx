"use client";

import { useEffect, useRef, useState } from "react";

const BOX = 460;
const CENTER = BOX / 2;

type Target = { left: number; top: number; size: number; base: number };

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

function buildTargets(rng: () => number): Target[] {
  const out: Target[] = [];
  for (let i = 0; i < 6; i++) {
    const a = rng() * Math.PI * 2;
    const r = 62 + rng() * 86;
    const size = Math.round(3.5 + rng() * 2.5);
    out.push({
      left: CENTER - size / 2 + r * Math.cos(a),
      top: CENTER - size / 2 + r * Math.sin(a),
      size,
      base: 0.2 + rng() * 0.25,
    });
  }
  return out;
}

const initialTargets = buildTargets(mulberry32(20260215));

export default function HeroOrbital() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const sweepRef = useRef<HTMLDivElement | null>(null);
  const bearingRef = useRef<HTMLParagraphElement | null>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [targets, setTargets] = useState<Target[]>(initialTargets);
  const dotAnglesRef = useRef<number[]>([]);
  const baseRef = useRef<number[]>([]);
  const hitsRef = useRef<number[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    const sweep = sweepRef.current;
    const bearing = bearingRef.current;
    if (!root || !sweep) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const applyTargets = (list: Target[]) => {
      dotAnglesRef.current = list.map(({ left, top, size }) => {
        const cx = left + size / 2;
        const cy = top + size / 2;
        const deg = (Math.atan2(cy - CENTER, cx - CENTER) * 180) / Math.PI + 90;
        return ((deg % 360) + 360) % 360;
      });
      baseRef.current = list.map((t) => t.base);
      hitsRef.current = list.map(() => 0);
    };
    applyTargets(initialTargets);

    const next = buildTargets(Math.random);
    applyTargets(next);
    setTargets(next);

    const applyScale = () => {
      const w = root.getBoundingClientRect().width;
      if (w <= 0) return;
      root.style.setProperty("--s", (w / BOX).toFixed(4));
    };
    applyScale();
    const ro = new ResizeObserver(applyScale);
    ro.observe(root);

    const wrap = (d: number) => ((d % 360) + 360) % 360;

    let raf = 0;
    let last = performance.now();
    let angle = 0;
    let phase = 0;
    let visible = true;

    const writeBearing = (deg: number) => {
      if (!bearing) return;
      bearing.textContent = `${String(Math.round(wrap(deg))).padStart(3, "0")}°`;
    };

    const applyStatic = () => {
      const n = wrap(angle);
      writeBearing(n);
      sweep.style.transform = `rotate(${n.toFixed(2)}deg)`;
    };

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) last = performance.now();
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(64, now - last);
      last = now;

      if (prefersReduced || !visible) {
        applyStatic();
        return;
      }

      angle = wrap(angle - (dt * 360) / 6000);
      phase += dt / 1000;

      sweep.style.transform = `rotate(${angle.toFixed(4)}deg)`;
      writeBearing(190 + 150 * Math.sin(phase * 0.9));

      dotRefs.current.forEach((dot, i) => {
        if (!dot) return;
        const ahead = wrap(dotAnglesRef.current[i] - angle);
        if (ahead < 12) hitsRef.current[i] = now;
        const tail = Math.max(0, 1 - (now - hitsRef.current[i]) / 520);
        const onBeam = Math.max(0, 1 - ahead / 12);
        const hit = Math.min(1, onBeam * onBeam * 0.55 + tail * 0.45);
        dot.style.opacity = Math.min(1, baseRef.current[i] + hit).toFixed(3);
        dot.style.transform = `scale(${(1 + hit).toFixed(3)})`;
        dot.style.boxShadow =
          hit > 0.02
            ? `0 0 ${(10 + hit * 14).toFixed(1)}px rgba(255, 90, 31, ${(hit * 0.85).toFixed(3)})`
            : "none";
      });
    };

    document.addEventListener("visibilitychange", onVisibility);

    if (prefersReduced) {
      applyStatic();
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
          {/* Mesh grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between p-5 pointer-events-none opacity-30">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-px w-full bg-[#1b2438]" />
            ))}
          </div>

          {/* Instrument dish — rings, sweep, returns */}
          <div className="absolute inset-0">
            {/* Radar sweep wedge — 320px, centered */}
            <div className="absolute inset-0 m-auto overflow-clip rounded-full pointer-events-none size-[320px]">
              <div
                ref={sweepRef}
                className="absolute inset-0 will-change-transform"
                style={{
                  background:
                    "conic-gradient(from 0deg, rgba(255, 90, 31, 0.28) 7deg, rgba(255, 90, 31, 0.13) 19deg, rgba(255, 90, 31, 0.035) 32deg, rgba(255, 90, 31, 0) 48deg)",
                }}
              >

              </div>
            </div>

            {/* Outer ring */}
            <div className="absolute inset-0 m-auto size-[360px]">
              <div
                className="arc-ring absolute inset-0 m-auto"
                style={{ width: 320, height: 320, opacity: 0.08 }}
              />
            </div>

            {/* Radar returns — random per visit, within sweep radius */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden>
              {targets.map((t, i) => (
                <span
                  key={i}
                  ref={(el) => {
                    dotRefs.current[i] = el;
                  }}
                  className="absolute rounded-full bg-[#ff5c00]"
                  style={{
                    left: `${t.left}px`,
                    top: `${t.top}px`,
                    width: t.size,
                    height: t.size,
                    opacity: t.base,
                  }}
                />
              ))}
            </div>

            {/* Inner ring */}
            <div className="absolute inset-0 m-auto size-[220px]">
              <div
                className="arc-ring absolute inset-0 m-auto"
                style={{ width: 220, height: 220 }}
              />
            </div>
          </div>

          {/* Core beacon */}
          <div className="absolute inset-0 m-auto size-[110px]">
            <div className="bg-[#050811] border-2 border-[#ff5c00] rounded-full size-full flex flex-col items-center justify-center">
              <p className="font-['Geist_Mono',_sans-serif] text-[9px] text-[#ff5c00]">
                SECTOR_CORE
              </p>
              <p
                ref={bearingRef}
                className="font-['Geist_Mono',_sans-serif] font-black text-[15px] tabular-nums text-[#f1f5f9]"
              >
                000°
              </p>
              <p className="font-['Geist_Mono',_sans-serif] text-[8px] text-[#10b981]">
                SYS_READY
              </p>
            </div>
          </div>

          {/* Corner labels */}
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

      <div
        aria-hidden
        className="absolute border border-[#1b2438] inset-0 pointer-events-none rounded-[8px]"
      />
    </div>
  );
}