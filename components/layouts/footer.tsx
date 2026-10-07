import Reveal from "@/components/animations/reveal";
import NavLink from "@/components/ui/nav-link";
import LangSwitch from "@/components/ui/lang-switch";
import type { Dict, Locale } from "@/lib/i18n";

const LINKS = [
  { section: "lavori" },
  { section: "profilo" },
  { section: "contatti" },
] as const;

export default function Footer({
  dict,
  locale,
}: {
  dict: Dict["footer"];
  locale: Locale;
}) {
  return (
    <Reveal delay={300}>
      <footer className="border-t border-line py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-[1px] bg-orange rotate-45" />
            <span className="font-mono text-[12px] tracking-[0.02em] text-paper font-medium">
              SYS / 01
            </span>
          </div>
          <p className="font-mono text-[10px] text-ice-dim">
            <span className="text-orange">◈</span> {dict.tagline} ·{" "}
            <span className="text-paper/60">{dict.country}</span>
          </p>
          <nav aria-label={dict.navLabel}>
          {/* flex-wrap: a 320px i tre link in riga unica non ci stavano e
              producevano scroll orizzontale. py-2 li porta a ~32px di altezza. */}
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-1 list-none">
            {LINKS.map(({ section }) => (
              <li key={section}>
                <NavLink
                  section={section}
                  className="inline-block py-2 font-mono text-[12px] text-ice-dim hover:text-orange transition-colors"
                >
                  {dict.links[section]}
                </NavLink>
              </li>
            ))}
            {/* Switcher di lingua: stesso controllo della navbar. */}
            <li>
              <LangSwitch locale={locale} />
            </li>
          </ul>
        </nav>
        </div>
      </footer>
    </Reveal>
  );
}