import Reveal from "@/components/animations/reveal";
import NavLink from "@/components/ui/nav-link";

const LINKS = [
  { section: "lavori", label: "Progetti" },
  { section: "profilo", label: "Profilo" },
  { section: "contatti", label: "Contatti" },
] as const;

export default function Footer() {
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
            <span className="text-orange">◈</span> Codice, sistemi, dati ·{" "}
            <span className="text-paper/60">Italia</span>
          </p>
          <nav aria-label="Collegamenti di piede">
          <ul className="flex gap-6 list-none">
            {LINKS.map(({ section, label }) => (
              <li key={section}>
                <NavLink
                  section={section}
                  className="font-mono text-[12px] text-ice-dim hover:text-orange transition-colors"
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        </div>
      </footer>
    </Reveal>
  );
}