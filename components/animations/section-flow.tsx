"use client";

import { useEffect, Children, useRef, type ReactNode } from "react";

const QUERY = "(min-width: 1024px)";
const RISE = 70;
const BAND_VH = 0.85;
const SETTLE_VH = 0.32;
const HOLD_A_VH = 0.5;
const HOLD_B_VH = 0;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);

export default function SectionFlow({ children }: { children: ReactNode }) {
  const runARef = useRef<HTMLDivElement>(null);
  const runBRef = useRef<HTMLDivElement>(null);
  const panelARef = useRef<HTMLDivElement>(null);
  const panelBRef = useRef<HTMLDivElement>(null);
  const keys = Children.toArray(children);

  useEffect(() => {
    const runA = runARef.current;
    const runB = runBRef.current;
    const a = panelARef.current;
    const b = panelBRef.current;
    if (!runA || !runB || !a || !b) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const mq = window.matchMedia(QUERY);
    let active = mq.matches && !reduced;

    const setHold = () => {
      const vh = window.innerHeight;
      a.style.position = "sticky";
      a.style.top = "0";
      b.style.position = "sticky";
      b.style.top = "0";
      runA.style.height = `${a.offsetHeight + vh * HOLD_A_VH}px`;
      runB.style.height = `${b.offsetHeight + vh * HOLD_B_VH}px`;
    };

    const clear = () => {
      a.style.position = "";
      a.style.top = "";
      a.style.transform = "";
      a.style.opacity = "";
      b.style.position = "";
      b.style.top = "";
      b.style.transform = "";
      b.style.opacity = "";
      runA.style.height = "";
      runB.style.height = "";
    };

    const apply = () => {
      const vh = window.innerHeight;
      const s = window.scrollY;

      const reveal = (run: HTMLDivElement, panel: HTMLDivElement) => {
        const runTop = run.getBoundingClientRect().top + s;
        const L = runTop + panel.offsetTop;
        const band = vh * BAND_VH;
        const naturalTop = L - s;
        const p = clamp01((band - naturalTop) / (band - vh * SETTLE_VH));
        const k = easeOutCubic(p);
        panel.style.transform = `translate3d(0, ${((1 - k) * RISE).toFixed(
          1,
        )}px, 0)`;
        panel.style.opacity = String(0.35 + 0.65 * k);
      };

      reveal(runA, a);
      reveal(runB, b);
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
      active = mq.matches && !reduced;
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
  }, []);

  return (
    <div className="relative">
      <div ref={runARef} className="relative">
        <div ref={panelARef}>{keys[0]}</div>
      </div>
      <div ref={runBRef} className="relative">
        <div ref={panelBRef}>{keys[1]}</div>
      </div>
    </div>
  );
}