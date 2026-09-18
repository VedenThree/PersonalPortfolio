import Reveal from "@/components/animations/reveal";

export default function Footer() {
  return (
    <Reveal delay={300}>
      <footer className="border-t border-line py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-[1px] bg-orange rotate-45" />
            <span className="font-mono text-[12px] tracking-[0.02em] text-paper font-medium">
              FD / 01
            </span>
          </div>
          <p className="font-mono text-[10px] text-ice-dim">
            <span className="text-orange">◈</span> Codice, sistemi, dati ·{" "}
            <span className="text-paper/60">Italia</span>
          </p>
          <nav className="flex gap-6 list-none">
            <li>
              <a
                href="#lavori"
                className="font-mono text-[12px] text-ice-dim hover:text-orange transition-colors"
              >
                Progetti
              </a>
            </li>
            <li>
              <a
                href="#profilo"
                className="font-mono text-[12px] text-ice-dim hover:text-orange transition-colors"
              >
                Profilo
              </a>
            </li>
            <li>
              <a
                href="#contatti"
                className="font-mono text-[12px] text-ice-dim hover:text-orange transition-colors"
              >
                Contatti
              </a>
            </li>
          </nav>
        </div>
      </footer>
    </Reveal>
  );
}