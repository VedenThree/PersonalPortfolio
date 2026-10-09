import NavLink from "@/components/ui/nav-link";
import HeroOrbital from "@/components/ui/HeroOrbital";
import type { Dict } from "@/lib/i18n";

const TAGS = ["FRONTEND", "REACT", "NEXT.JS"] as const;

export default function Hero({ dict }: { dict: Dict["hero"] }) {
  return (
    <section id="hero" className="relative grid grid-cols-1 md:grid-cols-[1.25fr_0.9fr] items-start gap-8 md:gap-14 py-16 sm:py-24 pb-16 sm:pb-[100px]">
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
          {dict.titleA}{" "}
          <span className="hero-accent text-orange">{dict.titleAccent}</span>{" "}
          {dict.titleB}
        </h1>

        <p className="mt-9 max-w-[440px] text-base text-paper-dim">
          {dict.intro}
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <NavLink
            section="lavori"
            className="hero-cta hero-cta-primary group inline-flex items-center gap-2.5 relative border border-orange font-mono text-[12px] tracking-[0.14em] uppercase px-[26px] py-3.5 text-orange transition-all duration-200 hover:bg-orange hover:text-ink [clip-path:polygon(0_0,calc(100%_-_10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%_-_10px))]"
          >
            {dict.ctaProjects}{" "}
            <svg
              aria-hidden
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="inline-block transition-transform duration-200 group-hover:translate-y-[3px]"
            >
              <path
                d="M6 1v9m0 0 3.5-3.5M6 10 2.5 6.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </NavLink>
          <NavLink
            section="contatti"
            className="hero-cta inline-flex items-center gap-2.5 relative border border-line font-mono text-[12px] tracking-[0.14em] uppercase px-[26px] py-3.5 text-paper-dim transition-all duration-200 hover:border-ice hover:text-ice [clip-path:polygon(0_0,calc(100%_-_10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%_-_10px))]"
          >
            {dict.ctaContact}
          </NavLink>
        </div>
      </div>

      {/* Sotto md il radar esce dai gutter (-mx combacia col px del
          contenitore): a 375px prende 331px invece di 259px, e il nucleo
          centrale smette di essere un cerchio da 62px con tre righe di testo
          dentro. Da md in su resta nella sua colonna. */}
      <div className="-mx-5 sm:-mx-8 md:mx-0 md:self-center">
        <HeroOrbital />
      </div>
    </section>
  );
}
