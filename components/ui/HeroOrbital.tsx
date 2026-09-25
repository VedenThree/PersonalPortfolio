"use client";

import { useEffect, useRef } from "react";

// Sistema di coordinate "di progetto": le misure sono qui, poi pct() le converte in %.
const BOX = 460;
const CENTER = BOX / 2;

// Millisecondi per giro. Tutti gli elementi girano in senso antiorario.
const SWEEP_PERIOD = 6000;
const RING_OUTER_PERIOD = 18000;
const RING_INNER_PERIOD = 11000;

// Seed fisso: i target devono restare sempre sugli stessi pixel.
// Scelto perché spalma bene i 6 target (distanza minima fra due angoli ~55°);
// con l'LCG qui sotto cambiare il seed può anche accorpiarli.
const SEED = 58930482;

const pct = (v: number) => `${((v / BOX) * 100).toFixed(4)}%`;

type Target = {
  angle: number;
  radius: number;
  size: number;
  base: number;
  left: number;
  top: number;
};

// Angolo sempre in [0, 360), per poter accumulare senza crescere all'infinito.
const wrap360 = (deg: number) => ((deg % 360) + 360) % 360;

// I 6 target arancioni, generati una volta sola fuori dal render.
// Ogni target nasce come posizione sul cerchio: angle in gradi (0° in alto,
// senso orario) e radius in px dal centro. left/top sono il suo tradotto in
// coordinate di schermo, calcolato una volta: x = r·sin, y = −r·cos.
// rng è un LCG lineare con periodo completo 2^32: per 6 valori una tantum
// basta, e il seed fisso li rende identici a ogni reload.
const TARGETS: Target[] = (() => {
  let s = SEED;
  const rng = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  return Array.from({ length: 6 }, () => {
    const angle = rng() * 360;
    const radius = 62 + rng() * 86;
    const size = Math.round(3.5 + rng() * 2.5);
    const rad = (angle * Math.PI) / 180;
    const half = size / 2;
    return {
      angle,
      radius,
      size,
      base: 0.2 + rng() * 0.25,
      left: CENTER - half + radius * Math.sin(rad),
      top: CENTER - half - radius * Math.cos(rad),
    };
  });
})();

export default function HeroOrbital() {
  const sweepRef = useRef<HTMLDivElement | null>(null);
  const ringOuterRef = useRef<HTMLDivElement | null>(null);
  const ringInnerRef = useRef<HTMLDivElement | null>(null);
  const bearingRef = useRef<HTMLParagraphElement | null>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const hitsRef = useRef<number[]>(TARGETS.map(() => 0));

  // Loop a rAF: React disegna solo il primo frame, poi si scrive sul DOM direttamente.
  useEffect(() => {
    const sweep = sweepRef.current;
    const bearing = bearingRef.current;
    if (!sweep) return;

    let raf = 0;
    let last = performance.now();
    let angle = 0;
    let outerAngle = 0;
    let innerAngle = 0;
    let phase = 0;

    const writeBearing = (deg: number) => {
      if (bearing) bearing.textContent = `${String(Math.round(wrap360(deg))).padStart(3, "0")}°`;
    };

    // I due anelli ruotano con lo stesso orientamento iniziale, velocità diverse.
    const paintRings = () => {
      if (ringOuterRef.current) {
        ringOuterRef.current.style.transform = `rotate(${wrap360(outerAngle).toFixed(4)}deg)`;
      }
      if (ringInnerRef.current) {
        ringInnerRef.current.style.transform = `rotate(${wrap360(innerAngle).toFixed(4)}deg)`;
      }
    };

    // Al rientro dalla tab in background, azzera il riferimento temporale.
    const onVisibility = () => {
      if (!document.hidden) last = performance.now();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);

      // Tempo trascorso, limitato a un frame per non avere salti.
      const dt = Math.min(64, now - last);
      last = now;

      // Rete di sicurezza: se il browser continua a chiamare il loop in background.
      if (document.hidden) return;

      // Avanza sul tempo trascorso, non sul numero di frame: velocità costante.
      angle = wrap360(angle - (dt * 360) / SWEEP_PERIOD);
      outerAngle = wrap360(outerAngle - (dt * 360) / RING_OUTER_PERIOD);
      innerAngle = wrap360(innerAngle - (dt * 360) / RING_INNER_PERIOD);
      phase += dt / 1000;

      sweep.style.transform = `rotate(${angle.toFixed(4)}deg)`;
      paintRings();
      writeBearing(190 + 150 * Math.sin(phase * 0.9));

      // Entro 12° dal fascio il target è illuminato: memorizzo l'impatto.
      dotRefs.current.forEach((dot, i) => {
        if (!dot) return;
        const t = TARGETS[i];
        const ahead = wrap360(t.angle - angle);
        if (ahead < 12) hitsRef.current[i] = now;

        // onBeam = luce del fascio, tail = eco che sfuma in 520ms.
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

    raf = requestAnimationFrame(frame);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="bg-[#0b101d5d] relative rounded-[8px] w-full max-w-130 aspect-square overflow-clip">
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