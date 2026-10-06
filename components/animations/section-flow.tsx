"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { animate, onScroll } from "animejs";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const QUERY = "(min-width: 1024px)";
const RISE = 70;
const HOLD_A_VH = 0.5;
const HOLD_B_VH = 0;

/**
 * Due pannelli che si rilevano a cascata nello scroll.
 *
 * `a` e `b` sono props esplicite invece di children posizionali: con due
 * children soli, `keys[0]`/`keys[1]` scartava in silenzio un terzo figlio e la
 * firma non diceva quanti pannelli si aspettassero. I ref DOM hanno nomi
 * diversi dalle props per non ombreggiarle dentro l'effect.
 *
 * Il reveal è guidato dallo scroll via `onScroll` di anime.js: la comparsa
 * inizia quando la pista entra all'85% del viewport e si completa al 32%,
 * la stessa banda di prima senza easing e clamp scritti a mano.
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
    let runs: Array<{ revert: () => void }> = [];

    const clear = () => {
      runs.forEach((r) => r.revert());
      runs = [];
      panelA.style.position = "";
      panelA.style.top = "";
      panelB.style.position = "";
      panelB.style.top = "";
      runA.style.height = "";
      runB.style.height = "";
    };

    const setup = () => {
      clear();
      if (!mq.matches) return;
      const vh = window.innerHeight;
      panelA.style.position = "sticky";
      panelA.style.top = "0";
      panelB.style.position = "sticky";
      panelB.style.top = "0";
      runA.style.height = `${panelA.offsetHeight + vh * HOLD_A_VH}px`;
      runB.style.height = `${panelB.offsetHeight + vh * HOLD_B_VH}px`;

      // Reveal scroll-driven: entra all'85% del viewport, completo al 32%.
      const reveal = (run: HTMLDivElement, panel: HTMLDivElement) =>
        animate(panel, {
          translateY: [RISE, 0],
          opacity: [0.35, 1],
          ease: "linear",
          autoplay: onScroll({
            target: run,
            enter: "85% top",
            leave: "32% top",
            sync: 0.5,
          }),
        });
      runs = [reveal(runA, panelA), reveal(runB, panelB)];
    };

    mq.addEventListener("change", setup);
    window.addEventListener("resize", setup);

    setup();

    return () => {
      mq.removeEventListener("change", setup);
      window.removeEventListener("resize", setup);
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
