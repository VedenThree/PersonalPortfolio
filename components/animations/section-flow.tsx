"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const QUERY = "(min-width: 1024px)";
const RISE = 70;
const BAND_VH = 0.85;
const SETTLE_VH = 0.32;
const HOLD_A_VH = 0.5;
const HOLD_B_VH = 0;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);

/**
 * Due pannelli che si rilevano a cascata nello scroll.
 *
 * `a` e `b` sono props esplicite invece di children posizionali: con due
 * children soli, `keys[0]`/`keys[1]` scartava in silenzio un terzo figlio e la
 * firma non diceva quanti pannelli si aspettassero. I ref DOM hanno nomi
 * diversi dalle props per non ombreggiarle dentro l'effect.
 */
export default function SectionFlow({ a, b }: { a: ReactNode; b: ReactNode }) {
  const runARef = useRef<HTMLDivElement>(null);
  const runBRef = useRef<HTMLDivElement>(null);
  const panelARef = useRef<HTMLDivElement>(null);
  const panelBRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const runA = runARef.current;
    const runB = runBRef.current;
    const panelA = panelARef.current;
    const panelB = panelBRef.current;
    if (!runA || !runB || !panelA || !panelB) return;

    // Sotto reduced-motion niente sticky e niente pista: i due pannelli
    // scorrono come se SectionFlow non esistesse.
    if (reduced) return;

    const mq = window.matchMedia(QUERY);
    let active = mq.matches;

    // offsetTop dei due pannelli dentro le rispettive piste: sono costanti finché
    // non cambia il layout, quindi si leggono una volta in setHold() e non a ogni
    // frame di scroll (dove erano un reflow sincrono, due volte per frame).
    // Stanno qui dentro, non a modulo: due istanze non si pesterebbero i piedi.
    const offsetTop = { a: 0, b: 0 };

    const setHold = () => {
      const vh = window.innerHeight;
      panelA.style.position = "sticky";
      panelA.style.top = "0";
      panelB.style.position = "sticky";
      panelB.style.top = "0";
      offsetTop.a = panelA.offsetTop;
      offsetTop.b = panelB.offsetTop;
      runA.style.height = `${panelA.offsetHeight + vh * HOLD_A_VH}px`;
      runB.style.height = `${panelB.offsetHeight + vh * HOLD_B_VH}px`;
    };

    const clear = () => {
      panelA.style.position = "";
      panelA.style.top = "";
      panelA.style.transform = "";
      panelA.style.opacity = "";
      panelB.style.position = "";
      panelB.style.top = "";
      panelB.style.transform = "";
      panelB.style.opacity = "";
      runA.style.height = "";
      runB.style.height = "";
    };

    const apply = () => {
      const vh = window.innerHeight;
      const s = window.scrollY;

      // runTop è l'unica lettura di layout per frame: il resto deriva da
      // valori già in memoria.
      const runTopA = runA.getBoundingClientRect().top + s;
      const runTopB = runB.getBoundingClientRect().top + s;
      const band = vh * BAND_VH;
      const span = band - vh * SETTLE_VH;

      const reveal = (runTop: number, panel: HTMLDivElement, top: number) => {
        const naturalTop = runTop + top - s;
        const p = clamp01((band - naturalTop) / span);
        const k = easeOutCubic(p);
        const y = ((1 - k) * RISE).toFixed(1);
        const o = String(0.35 + 0.65 * k);
        if (y !== panel.style.transform) {
          panel.style.transform = `translate3d(0, ${y}px, 0)`;
        }
        if (o !== panel.style.opacity) panel.style.opacity = o;
      };

      reveal(runTopA, panelA, offsetTop.a);
      reveal(runTopB, panelB, offsetTop.b);
    };

    let ticking = false;
    const onScroll = () => {
      if (!active) return;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        apply();
        ticking = false;
      });
    };

    const sync = () => {
      active = mq.matches;
      if (active) {
        setHold();
        onScroll();
      } else {
        clear();
      }
    };
    mq.addEventListener("change", sync);
    const onResize = () => {
      if (active) setHold();
      onScroll();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    sync();

    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      clear();
    };
  }, [reduced]);

  return (
    <div className="relative">
      <div ref={runARef} className="relative">
        <div ref={panelARef}>{a}</div>
      </div>
      <div ref={runBRef} className="relative">
        <div ref={panelBRef}>{b}</div>
      </div>
    </div>
  );
}