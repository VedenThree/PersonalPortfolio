"use client";

import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { num: "01", label: "Progetti", id: "lavori" },
  { num: "02", label: "Profilo", id: "profilo" },
  { num: "03", label: "Contatti", id: "contatti" },
];

export default function NavBar() {
  const [active, setActive] = useState(NAV_ITEMS[0].id);

  useEffect(() => {
    const onScroll = () => {
      const pos = window.scrollY + window.innerHeight * 0.35;
      let current = NAV_ITEMS[0].id;
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= pos) current = item.id;
      }
      setActive(current);
    };
    const t = setTimeout(onScroll, 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      {/* Sidebar (desktop) */}
      <aside className="fixed top-0 left-0 h-screen w-[220px] hidden lg:flex flex-col z-50 bg-[rgba(6,6,11,0.97)] border-r border-orange/20">
        {/* Logo / Identity */}
        <div className="border-b border-orange/20 px-5 pt-6 pb-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-orange flex items-center justify-center size-9 shrink-0">
              <span className="font-mono font-extrabold text-[16px] text-white leading-none tracking-widest">
                FD
              </span>
            </div>
            <div>
              <p className="font-mono text-[8px] text-ice-dim tracking-[1.2px]">
                FD / 01
              </p>
              <p className="font-mono text-[7.5px] text-ice-dim/70 tracking-[0.9px]">
                WEB DEVELOPER
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex items-end gap-0.5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-[3px] bg-orange"
                  style={{ height: `${6 + i * 2}px` }}
                />
              ))}
              <div className="w-[3px] h-[12px] bg-orange/10" />
            </div>
            <p className="font-mono text-[7.5px] text-ice-dim/70 tracking-[0.7px]">
              SIGNAL 3/4
            </p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col flex-1 pt-2">
          {NAV_ITEMS.map(({ num, label, id }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`flex items-center h-[68px] px-5 border-b border-ice/5 text-left relative overflow-hidden transition-colors cursor-pointer ${
                  isActive ? "bg-orange/5" : "hover:bg-ice/5"
                }`}
              >
                <div
                  aria-hidden
                  className="absolute left-0 top-0 bottom-0 w-[3px] bg-orange origin-top"
                  style={{
                    transform: isActive ? "scaleY(1)" : "scaleY(0)",
                    opacity: isActive ? 1 : 0,
                    transition:
                      "transform 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease",
                  }}
                />
                <div className="flex flex-col">
                  <span
                    className={`font-mono text-[9px] leading-none tracking-[1.23px] ${
                      isActive ? "text-orange/60" : "text-ice-dim/50"
                    }`}
                  >
                    {num}
                  </span>
                  <span
                    className={`font-display font-bold text-[16px] tracking-[1.6px] leading-[1.6] uppercase ${
                      isActive ? "text-orange" : "text-paper/70"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {isActive && (
                  <span className="ml-auto font-mono text-[10px] text-orange">▶</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Geolocation + status */}
        <div className="border-t border-orange/15 px-5 py-4">
          <div className="font-mono text-[9px] text-ice-dim tracking-[0.88px] leading-[1.8] mb-2">
            <p>LAT 46.2074°N</p>
            <p>LON 09.0200°E</p>
            <p>ALT 122m ASL</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-[6px] rounded-full bg-[#22c55e]" />
            <span className="font-mono text-[9px] text-[#22c55e] tracking-[0.88px]">
              ONLINE
            </span>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-50 bg-surface/90 backdrop-blur-[8px] border-b border-line">
        <div className="flex items-center justify-between px-6 py-[14px]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.25 h-2.25 rounded-[1px] bg-orange rotate-45 shrink-0 animate-pulse-glow" />
            <span className="text-[14px] tracking-[0.02em] text-paper font-medium font-mono">
              FD / 01
            </span>
          </div>
          <nav>
            <ul className="flex gap-5 list-none">
              {NAV_ITEMS.map(({ label, id }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="text-ice no-underline text-[12px] font-mono tracking-[0.02em] transition-colors hover:text-orange"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}