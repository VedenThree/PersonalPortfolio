"use client";

import { useEffect, useRef } from "react";
import { animate, type JSAnimation } from "animejs";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { TARGETS, pct, wrap360 } from "@/lib/orbital-targets";

// Millisecondi per giro. Tutti gli elementi girano in senso antiorario.
const SWEEP_PERIOD = 6000;
const RING_OUTER_PERIOD = 18000;
const RING_INNER_PERIOD = 11000;

export default function HeroOrbital() {
  const sweepRef = useRef<HTMLDivElement | null>(null);
  const ringOuterRef = useRef<HTMLDivElement | null>(null);
  const ringInnerRef = useRef<HTMLDivElement | null>(null);
  const bearingRef = useRef<HTMLParagraphElement | null>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const hitsRef = useRef<number[]>(TARGETS.map(() => 0));
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  // Rotazioni (sweep + 2 anelli) via anime.js; fascio-target e bearing restano
  // nel loop rAF invariati, come da review (target non toccati).
  useEffect(() => {
    const root = rootRef.current;
    const sweep = sweepRef.current;
    const ringOuter = ringOuterRef.current;
    const ringInner = ringInnerRef.current;
    const bearing = bearingRef.current;
    if (!root || !sweep) return;

    // Sotto reduced-motion il radar resta com' è: anelli e target visibili,
    // nessuna rotazione. Il bearing resta al valore iniziale.
    if (reduced) return;

    // Giri continui antiorari, stessi periodi di prima. La coda dello sweep
    // è la fonte unica dell'angolo del fascio (vedi frame).
    const sweepAnim = animate(sweep, {
      rotate: ["0deg", "-360deg"],
      duration: SWEEP_PERIOD,
      ease: "linear",
      loop: true,
    });
    const spins: JSAnimation[] = [sweepAnim];
    if (ringOuter) {
      spins.push(
        animate(ringOuter, {
          rotate: ["0deg", "-360deg"],
          duration: RING_OUTER_PERIOD,
          ease: "linear",
          loop: true,
        }),
      );
    }
    if (ringInner) {
      spins.push(
        animate(ringInner, {
          rotate: ["0deg", "-360deg"],
          duration: RING_INNER_PERIOD,
          ease: "linear",
          loop: true,
        }),
      );
    }

    // Ferme finché `start()` non le accende insieme al rAF: così sweep
    // visivo e angolo del fascio (stessa velocità) restano sincroni.
    spins.forEach((s) => s.pause());

    let raf = 0;
    let last = performance.now();
    let phase = 0;

    // Il radar sta solo nell'hero: quando esce dal viewport il loop si ferma,
    // così non si pagano 60fps e 6 boxShadow al secondo per tutta la sessione.
    let onScreen = false;

    // Ultimo valore scritto: riscrivere la stessa stringa 60 volte al secondo
    // invalida lo stile senza cambiare nulla.
    const lastBearing = { value: "" };
    const lastDot = TARGETS.map(() => ({
      opacity: "",
      scale: "",
      shadow: "",
      hit: -1,
    }));

    // La tab in background non deve costare 60fps: stop() interrompe il loop e
    // start() lo riprende azzerando il riferimento temporale.
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const frame = (now: number) => {
      // Tempo trascorso reale, senza clamp: deve seguire lo stesso orologio
      // di anime.js, che dopo uno stall riprende dal tempo vero.
      const dt = now - last;
      last = now;

      // Angolo letto dalla coda stessa che si vede girare: un solo orologio
      // per fascio e target, quindi un blocco del main thread (il "freeze"
      // al caricamento) non può più mettere i pallini in ritardo rispetto
      // alla linea: prima l'angolo avanzava al massimo 64ms per frame e
      // ogni stall lo faceva restare indietro per sempre.
      const angle = wrap360(
        -((sweepAnim.currentTime % SWEEP_PERIOD) / SWEEP_PERIOD) * 360,
      );
      phase += dt / 1000;

      const bearingText = `${String(
        Math.round(wrap360(190 + 150 * Math.sin(phase * 0.9))),
      ).padStart(3, "0")}°`;
      if (bearing && bearingText !== lastBearing.value) {
        bearing.textContent = bearingText;
        lastBearing.value = bearingText;
      }

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

        const cache = lastDot[i];
        if (hit === cache.hit) return;
        cache.hit = hit;

        const opacity = Math.min(1, t.base + hit).toFixed(3);
        if (opacity !== cache.opacity) {
          dot.style.opacity = opacity;
          cache.opacity = opacity;
        }
        const scale = (1 + hit).toFixed(3);
        if (scale !== cache.scale) {
          dot.style.transform = `scale(${scale})`;
          cache.scale = scale;
        }
        const shadow =
          hit > 0.02
            ? `0 0 ${(10 + hit * 14).toFixed(1)}px color-mix(in srgb, var(--orange) ${(hit * 0.85 * 100).toFixed(1)}%, transparent)`
            : "none";
        if (shadow !== cache.shadow) {
          dot.style.boxShadow = shadow;
          cache.shadow = shadow;
        }
      });

      raf = requestAnimationFrame(frame);
    };

    // Il loop parte e si ferma davvero: prima veniva solo saltato il lavoro
    // dentro `frame`, ma la catena rAF restava attiva per tutta la sessione.
    // Le rotazioni anime.js seguono lo stesso interruttore (pause/play).
    const start = () => {
      if (raf || !onScreen || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
      spins.forEach((s) => s.play());
    };
    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
      spins.forEach((s) => s.pause());
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) start();
        else stop();
      },
      { rootMargin: "100px" },
    );
    io.observe(root);

    document.addEventListener("visibilitychange", onVisibility);
    // L'observer non ha ancora sparato: se il radar è già in vista, si parte.
    start();

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
      stop();
      spins.forEach((s) => s.revert());
    };
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      className="bg-panel-ghost relative rounded-[8px] w-full max-w-130 aspect-square overflow-clip @container"
    >
      {/* Griglia di sfondo */}
      <div className="absolute inset-0 flex flex-col justify-between p-5 pointer-events-none opacity-30">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-px w-full bg-panel-line" />
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
                "conic-gradient(from 0deg, color-mix(in srgb, var(--orange) 28%, transparent) 7deg, color-mix(in srgb, var(--orange) 13%, transparent) 19deg, color-mix(in srgb, var(--orange) 3.5%, transparent) 32deg, transparent 48deg)",
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
              className="absolute rounded-full bg-orange"
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
        <div className="bg-panel-core border-2 border-orange rounded-full size-full flex flex-col items-center justify-center">
          {/* HUD fluido col box: le scritte sono in `cqi` (1% della larghezza
              del radar, che è il container) così restano proporzionate al
              cerchio a ogni dimensione — a 520px valgono quanto i 12/15/8px
              di prima, a 276px scalano da sole senza mai uscire dal bordo.
              Il cerchio non si tocca: il testo resta nitido a dimensione
              calcolata, non riscalato come bitmap. */}
          <p className="font-jet text-orange text-[2.3cqi]">SECTOR_CORE</p>
          <p
            ref={bearingRef}
            className="font-jet font-black tabular-nums text-paper-cool text-[2.9cqi]"
          >
            000°
          </p>
          <p className="font-jet text-green text-[1.5cqi]">SYS_READY</p>
        </div>
      </div>

      {/* Etichette d'angolo */}
      <p className="absolute font-jet text-[9px] text-steel left-6 top-6 whitespace-nowrap">
        SYS_MONITOR // V.24.1
      </p>
      <p className="absolute font-jet text-[9px] text-orange left-6 bottom-6 whitespace-nowrap">
        SYS_LOC: ORB_L_09
      </p>
      <p className="absolute font-jet text-[9px] text-green right-6 top-6 whitespace-nowrap">
        SCANNER: SCAN
      </p>

      <div aria-hidden className="absolute border border-panel-line inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}