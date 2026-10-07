"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { animate, type JSAnimation } from "animejs";
import { goToSection } from "@/lib/section-nav";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import LangSwitch from "@/components/ui/lang-switch";
import {
  DICTS,
  localeFromPathname,
  type Dict,
  type Locale,
} from "@/lib/i18n";

// Stesse voci e stessi id in entrambe le lingue: gli anchor (`#lavori`…)
// sono invisibili, quindi non si traducono. Le etichette sì, dal dizionario.
const NAV_ITEMS = [
  { num: "00", id: "hero" },
  { num: "01", id: "lavori" },
  { num: "02", id: "profilo" },
  { num: "03", id: "contatti" },
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
  nav,
  locale,
}: {
  active: string;
  goTo: (id: string) => void;
  nav: Dict["nav"];
  locale: Locale;
}) {
  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-[var(--rail-w)] flex-col items-center border-r border-line bg-ink-deep/90 py-5 lg:hidden">
      {/* Marchio: torna alla sezione attiva, non a una destinazione diversa.
          44px anche qui: sotto i 44 non è un tap target, è un'inezia. */}
      <button
        onClick={() => goTo("hero")}
        aria-label={nav.home}
        title={nav.home}
        className="mb-6 flex size-11 shrink-0 cursor-pointer items-center justify-center border border-line bg-panel-core"
      >
        <span
          aria-hidden
          className="font-mono text-[10px] font-bold leading-none text-orange"
        >
          {">_"}
        </span>
      </button>

      {/* Ogni voce è larga quanto il rail e alta 44px: il dito ci sta.
          gap-2 perché il padding verticale della riga fa già da spazio. */}
      <nav className="flex flex-1 flex-col items-center gap-2">
        {NAV_ITEMS.map(({ num, id }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => goTo(id)}
              aria-label={nav.items[id]}
              aria-current={isActive ? "true" : undefined}
              className={`flex w-full cursor-pointer flex-col items-center gap-1.5 py-3 transition-colors ${
                isActive ? "text-orange" : "text-ice-dim/40 hover:text-ice"
              }`}
            >
              <span className="font-mono text-[11px] leading-none tracking-[1px]">
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

      {/* Switcher di lingua: controllo segmentato, si vede da lontano. */}
      <LangSwitch locale={locale} orientation="col" className="mb-4 w-full" />

      <div
        className="size-[6px] shrink-0 rounded-full bg-green animate-pulse-glow"
        title="Online"
      />
    </aside>
  );
}

export default function NavBar() {
  const { active, goTo } = useNavScroll();
  // La lingua si legge dal pathname: la navbar vive nel layout condiviso,
  // quindi non riceve prop dalla pagina. `/en` ed `/en/` sono inglesi.
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  const dict = DICTS[locale];
  const activeIndex = Math.max(
    0,
    NAV_ITEMS.findIndex((n) => n.id === active),
  );
  const activeItem = NAV_ITEMS[activeIndex] ?? NAV_ITEMS[0];
  const indicatorRef = useRef<HTMLSpanElement | null>(null);
  const slideRef = useRef<JSAnimation | null>(null);
  const reduced = usePrefersReducedMotion();

  // L'indicatore scorre con una tween anime.js dalla posizione corrente:
  // 4→3 scivola verso l'alto, 2→3 verso il basso, senza salti. Niente
  // revert al cambio: congeliamo (pause) e ripartiamo da lì. Senza JS —
  // o sotto reduced-motion — resta il posizionamento CSS via --nav-index.
  useEffect(() => {
    if (reduced) return;
    const el = indicatorRef.current;
    if (!el) return;
    const rowH =
      parseFloat(
        getComputedStyle(el).getPropertyValue("--nav-row-h"),
      ) || 68;
    slideRef.current?.pause();
    slideRef.current = animate(el, {
      translateY: activeIndex * rowH,
      duration: 500,
      ease: "outExpo",
    });
  }, [activeIndex, reduced]);

  // Solo allo smontaggio si ripristina lo stato CSS.
  useEffect(
    () => () => {
      slideRef.current?.revert();
      slideRef.current = null;
    },
    [],
  );

  return (
    <>
      {/* nav-sidebar: su viewport bassi le 4 righe fisse da --nav-row-h non
            entrano, in quel caso il nav scorre (regola in globals.css) */}
        <aside className="nav-sidebar fixed left-0 top-0 z-50 hidden h-screen w-[var(--sidebar-w)] flex-col bg-ink-deep/90 backdrop-blur-[12px] lg:flex">
        <div className="border-b border-line px-5 pb-5 pt-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center border border-line bg-panel-core">
              <span
                aria-hidden
                className="font-mono text-[13px] font-bold leading-none text-orange"
              >
                {">_"}
              </span>
            </div>
            <div>
              <p className="font-display text-[15px] font-bold uppercase leading-none tracking-[1.5px] text-paper">
                SYS / 01
              </p>
              <p className="mt-1.5 font-mono text-[7.5px] uppercase tracking-[0.9px] text-ice-dim/70">
                FULL STACK · IT
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-ice/10 pt-3">
            <span className="font-mono text-[7.5px] tracking-[0.7px] text-ice-dim/70">
              SEC.{activeItem.num}
            </span>
            <span className="font-mono text-[7.5px] uppercase tracking-[0.7px] text-paper/80">
              {dict.nav.items[activeItem.id]}
            </span>
          </div>
        </div>

        <nav className="relative flex flex-1 flex-col pt-1">
          <span
            aria-hidden
            className="absolute left-0 top-0 h-full w-px bg-ice/10"
          />
          {/* L'altezza della riga e il passo dell'indicatore vivono entrambe in
              --nav-row-h: nessuno dei due può divergere. La tween anime.js
              legge la stessa variabile, quindi il passo resta quello. */}
          <span
            ref={indicatorRef}
            aria-hidden
            className="nav-indicator absolute left-0 top-0 h-[var(--nav-row-h)] w-[2px] bg-orange"
            style={{ "--nav-index": activeIndex } as CSSProperties}
          />
          {NAV_ITEMS.map(({ num, id }) => {
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
                    {dict.nav.items[id]}
                  </span>
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden
                  className={`ml-auto size-3.5 shrink-0 transition-colors ${
                    isActive ? "text-orange" : "text-transparent"
                  }`}
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-ice/15 px-5 py-4">
          <div className="mb-3 flex items-center justify-between font-mono text-[8px] tracking-[0.88px]">
            <span className="text-ice-dim/50">STACK</span>
            <span className="text-paper/70">REACT·NEXT·NODE·SQL</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-[6px] rounded-full bg-green animate-pulse-glow" />
            <span className="font-mono text-[8px] tracking-[0.88px] text-green">
              ONLINE
            </span>
            <span className="ml-auto font-mono text-[8px] tracking-[0.88px] text-ice-dim/70">
              {String(activeIndex + 1).padStart(2, "0")}/04
            </span>
          </div>
          {/* Switcher di lingua: segmento bordato in fondo alla sidebar. */}
          <LangSwitch locale={locale} className="mt-3" />
        </div>
      </aside>

      <MobileRail
        active={active}
        goTo={goTo}
        nav={dict.nav}
        locale={locale}
      />
    </>
  );
}