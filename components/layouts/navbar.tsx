"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { ChevronRight } from "lucide-react";
import { goToSection } from "@/lib/section-nav";

const NAV_ITEMS = [
  { num: "00", label: "Home", id: "hero" },
  { num: "01", label: "Progetti", id: "lavori" },
  { num: "02", label: "Profilo", id: "profilo" },
  { num: "03", label: "Contatti", id: "contatti" },
] as const;

function useNavScroll() {
  const [active, setActive] = useState<string>(NAV_ITEMS[0].id);

  useEffect(() => {
    // Una getBoundingClientRect per voce di nav, a ogni evento scroll: senza
    // coalescing ogni evento forza un layout sincrono. Un rAF per frame dà lo
    // stesso risultato (projects.tsx e section-flow.tsx già lo fanno).
    let ticking = false;
    const measure = () => {
      ticking = false;
      const pos = window.scrollY + window.innerHeight * 0.35;
      let current: string = NAV_ITEMS[0].id;
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= pos) current = item.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // Prima passata al frame successivo al mount: le sezioni sono già nel DOM,
    // quindi non serve aspettare un timeout per essere sicuri.
    const raf = requestAnimationFrame(measure);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { active, goTo: goToSection };
}

function MobileRail({
  active,
  goTo,
}: {
  active: string;
  goTo: (id: string) => void;
}) {
  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-[var(--rail-w)] flex-col items-center border-r border-line bg-ink-deep/90 py-5 lg:hidden">
      {/* Marchio: torna alla sezione attiva, non a una destinazione diversa */}
      <button
        onClick={() => goTo("hero")}
        aria-label="Home"
        title="Home"
        className="mb-8 flex size-7 shrink-0 cursor-pointer items-center justify-center bg-orange"
      >
        <span className="font-mono text-[11px] font-extrabold leading-none text-white">
          FD
        </span>
      </button>

      <nav className="flex flex-1 flex-col items-center gap-6">
        {NAV_ITEMS.map(({ num, label, id }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => goTo(id)}
              aria-label={label}
              className={`flex cursor-pointer flex-col items-center gap-1.5 transition-colors ${
                isActive ? "text-orange" : "text-ice-dim/40 hover:text-ice"
              }`}
            >
              <span className="font-mono text-[9px] leading-none tracking-[1px]">
                {num}
              </span>
              <span
                className={`inline-block size-[3px] rotate-45 rounded-[1px] transition-colors ${
                  isActive ? "bg-orange" : "bg-ice/25"
                }`}
              />
            </button>
          );
        })}
      </nav>

      <div
        className="size-[6px] shrink-0 rounded-full bg-green animate-pulse-glow"
        title="Online"
      />
    </aside>
  );
}

export default function NavBar() {
  const { active, goTo } = useNavScroll();
  const activeIndex = Math.max(
    0,
    NAV_ITEMS.findIndex((n) => n.id === active),
  );

  return (
    <>
      {/* nav-sidebar: su viewport bassi le 4 righe fisse da --nav-row-h non
            entrano, in quel caso il nav scorre (regola in globals.css) */}
        <aside className="nav-sidebar fixed left-0 top-0 z-50 hidden h-screen w-[var(--sidebar-w)] flex-col bg-ink-deep/90 backdrop-blur-[12px] lg:flex">
        <div className="border-b border-line px-5 pb-5 pt-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center bg-orange">
              <span className="font-mono font-extrabold leading-none text-white">
                FD
              </span>
            </div>
            <div>
              <p className="font-display text-[15px] font-bold uppercase leading-none tracking-[1.5px] text-paper">
                FD / 01
              </p>
              <p className="mt-1.5 font-mono text-[7.5px] uppercase tracking-[0.9px] text-ice-dim/70">
                SISTEMA WEB DEV
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-ice/10 pt-3">
            <div className="flex items-end gap-0.5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-[3px] bg-orange"
                  style={{ height: `${6 + i * 2}px` }}
                />
              ))}
              <div className="w-[3px] bg-orange/10" style={{ height: 12 }} />
            </div>
            <span className="font-mono text-[7.5px] tracking-[0.7px] text-ice-dim/70">
              SIGNAL 3/4
            </span>
          </div>
        </div>

        <nav className="relative flex flex-1 flex-col pt-1">
          <span
            aria-hidden
            className="absolute left-0 top-0 h-full w-px bg-ice/10"
          />
          {/* L'altezza della riga e il passo dell'indicatore vivono entrambe in
              --nav-row-h: nessuno dei due può divergere. */}
          <span
            aria-hidden
            className="nav-indicator absolute left-0 top-0 h-[var(--nav-row-h)] w-[2px] bg-orange transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ "--nav-index": activeIndex } as CSSProperties}
          />
          {NAV_ITEMS.map(({ num, label, id }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => goTo(id)}
                className={`group flex h-[var(--nav-row-h)] cursor-pointer items-center border-b border-ice/5 px-5 text-left transition-colors ${
                  isActive ? "bg-orange/5" : "hover:bg-ice/5"
                }`}
              >
                <span className="flex flex-col">
                  <span
                    className={`font-mono text-[9px] leading-none tracking-[1.23px] transition-colors ${
                      isActive ? "text-orange" : "text-ice-dim/50"
                    }`}
                  >
                    {num}
                  </span>
                  <span
                    className={`font-display mt-1.5 text-[16px] font-bold uppercase leading-none tracking-[1.6px] transition-colors ${
                      isActive ? "text-paper" : "text-paper/60 group-hover:text-paper/80"
                    }`}
                  >
                    {label}
                  </span>
                </span>
                <ChevronRight
                  className={`ml-auto size-3.5 shrink-0 transition-colors ${
                    isActive ? "text-orange" : "text-transparent"
                  }`}
                  strokeWidth={2}
                />
              </button>
            );
          })}
        </nav>

        <div className="border-t border-ice/15 px-5 py-4">
          <div className="mb-3 grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 font-mono text-[8px] tracking-[0.88px] text-ice-dim/80">
            <span>LAT</span>
            <span className="text-right">46.2074°N</span>
            <span>LON</span>
            <span className="text-right">09.0200°E</span>
            <span>ALT</span>
            <span className="text-right">122m ASL</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-[6px] rounded-full bg-green animate-pulse-glow" />
            <span className="font-mono text-[8px] tracking-[0.88px] text-green">
              ONLINE
            </span>
          </div>
        </div>
      </aside>

      <MobileRail active={active} goTo={goTo} />
    </>
  );
}