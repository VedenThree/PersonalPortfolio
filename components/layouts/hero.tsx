import NavLink from "@/components/ui/nav-link";
import HeroOrbital from "@/components/ui/HeroOrbital";

const TAGS = ["FRONTEND", "REACT", "NEXT.JS"] as const;

export default function Hero() {
  return (
    <section id="hero" className="relative grid grid-cols-1 md:grid-cols-[1.25fr_0.9fr] items-start gap-14 py-24 pb-[100px]">
      <div>
        <div className="flex flex-wrap gap-7 mb-[38px] font-mono text-[12px] text-ice-dim">
          {TAGS.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-2 before:content-[''] before:w-[5px] before:h-[5px] before:rounded-full before:bg-ice-dim first:before:bg-orange"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="font-display font-bold text-[clamp(36px,4.6vw,66px)] leading-[1.04] tracking-[-0.01em] text-paper">
          Sviluppo web, un{" "}
          <span className="text-orange">sistema</span> alla volta.
        </h1>

        <p className="mt-9 max-w-[440px] text-base text-paper-dim">
          Junior Web & Mobile App Developer con focus sul frontend moderno,
          esperienza pratica con React, Next.js, TypeScript e Tailwind CSS, e
          capacità di trasformare design Figma in interfacce web funzionanti.
          Esperienza complementare nello sviluppo React Native, nell&apos;integrazione
          di API e nella gestione di database con SQLite e MySQL.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <NavLink
            section="lavori"
            className="group inline-flex items-center gap-2.5 relative border border-orange font-mono text-[12px] px-[26px] py-3.5 text-orange transition-all duration-200 hover:bg-orange hover:text-ink [clip-path:polygon(0_0,calc(100%_-_10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%_-_10px))]"
          >
            Vedi i progetti{" "}
            <span className="inline-block transition-transform duration-200 group-hover:translate-y-[3px]">
              ↓
            </span>
          </NavLink>
          <NavLink
            section="contatti"
            className="inline-flex items-center gap-2.5 relative border border-line font-mono text-[12px] px-[26px] py-3.5 text-paper-dim transition-all duration-200 hover:border-ice hover:text-ice [clip-path:polygon(0_0,calc(100%_-_10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%_-_10px))]"
          >
            Contatti
          </NavLink>
        </div>
      </div>

      <div>
        <HeroOrbital />
      </div>
    </section>
  );
}