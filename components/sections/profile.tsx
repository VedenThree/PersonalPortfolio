import Reveal from "@/components/animations/reveal";

const FACTS = [
  { label: "RUOLO", value: "Junior Web & Mobile App Developer" },
  { label: "BASE", value: "Italia", sub: "CET · UTC+1" },
  {
    label: "MODALITÀ",
    value: "Remoto · Ibrido",
    sub: "Fuso allineato al team",
  },
  { label: "LINGUE", value: "Italiano · Inglese", sub: "Doc tecnica inclusa" },
  {
    label: "FOCUS",
    value: "Frontend · API · Dati",
    sub: "React/Next.js/React Native",
  },
  { label: "SETTORE", value: "Sviluppo Web", sub: "Applicazioni" },
];

// Un livello non è un numero arbitrario: se `SKILL_BARS` aggiungeva un 2 qui
// sotto, `LEVELS[2]` era `undefined` e la barra mostrava una cella vuota con
// un aria-label rotto, senza errori di tipo. L'unione lo impedisce.
type SkillLevel = 3 | 4 | 5;

const LEVELS: Record<SkillLevel, string> = {
  5: "Dominio",
  4: "Produzione",
  3: "Autonomo",
};

const SKILL_BARS: { name: string; level: SkillLevel }[] = [
  { name: "Next.js", level: 4 },
  { name: "MySQL", level: 4 },
  { name: "Wordpress", level: 4 },
  { name: "React Native", level: 4 },
  { name: "TypeScript", level: 4 },
  { name: "React", level: 4 },
  { name: "HTML & CSS", level: 4 },
  { name: "Tailwind CSS", level: 3 },
  { name: "Figma", level: 3 },
  { name: "Git & GitHub", level: 3 },
  { name: "PHP", level: 3 },
];

export default function Profile() {
  return (
    <Reveal delay={100}>
      <section id="profilo" className="py-24 border-t border-line">
        <div className="mb-12 md:mb-16">
          <div className="flex items-center justify-between mb-3">
            <p className="font-mono text-[10px] tracking-[0.3em] text-ice-dim uppercase">
              Scheda Profilo
            </p>
            <span
              aria-hidden
              className="font-mono text-[10px] tracking-[0.2em] text-ice-dim/80"
            >
              REC // {String(FACTS.length).padStart(2, "0")}
            </span>
          </div>
          <h2 className="font-display text-[clamp(28px,3.5vw,48px)] font-bold text-paper leading-[1.04]">
            Profilo
          </h2>
        </div>

        <div className="flex flex-col gap-6 md:gap-10">
          {/* Dati essenziali in una striscia leggibile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 border border-line rounded overflow-hidden divide-y divide-line/60 sm:divide-y-0 sm:divide-x sm:divide-line/60 bg-surface/40">
            {FACTS.map((f) => (
              <div key={f.label} className="px-4 py-4">
                <p className="font-mono text-[9px] tracking-[0.2em] text-ice-dim uppercase pb-1.5">
                  {f.label}
                </p>
                <p className="text-[14px] font-medium text-paper leading-snug">
                  {f.value}
                </p>
                {f.sub && (
                  <p className="font-mono text-[9px] text-ice-dim/70 mt-1 tracking-[0.06em]">
                    {f.sub}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-start">
            {/* Approccio */}
            <div className="border border-line rounded bg-surface/60 p-6 md:p-8">
              <p className="font-mono text-[10px] tracking-[0.3em] text-ice-dim uppercase mb-4">
                Approccio
              </p>
              <h3 className="font-display text-2xl font-bold text-paper mb-4 tracking-[-0.01em]">
                Frontend e design-to-code
              </h3>
              <p className="text-paper-dim leading-relaxed [&>strong]:text-paper">
                Trasformo design Figma in interfacce React funzionanti con
                Next.js e TypeScript. Sviluppo applicazioni
                <strong> modali</strong> e<strong> responsive</strong>,
                integrando database SQLite/MySQL e API in ogni progetto.
              </p>
            </div>

            {/* Stack con livelli leggibili */}
            <div className="border border-line rounded bg-surface/60 overflow-hidden">
              <div className="px-5 py-3 border-b border-line bg-bg-deep/60 flex items-center justify-between">
                <p className="font-mono text-[10px] tracking-[0.25em] text-ice uppercase">
                  Stack · Livelli
                </p>
                <p className="font-mono text-[8px] tracking-[0.1em] text-ice-dim/70 uppercase">
                  3 Autonomo · 4 Produzione · 5 Dominio
                </p>
              </div>
              <div className="px-5 py-2">
                {SKILL_BARS.map((s) => (
                  <div
                    key={s.name}
                    className="grid grid-cols-[110px_1fr_52px] gap-3 items-center py-2.5 border-b border-line/60 last:border-b-0"
                  >
                    <span className="font-sans text-[13px] text-paper">
                      {s.name}
                    </span>
                    <div
                      className="h-[6px] w-full bg-bg-deep/80 border border-line/40 rounded"
                      role="img"
                      aria-label={`${s.name}: livello ${s.level} di 5 (${LEVELS[s.level]})`}
                    >
                      <div
                        className="h-full bg-gradient-to-r from-orange/50 to-orange rounded"
                        style={{ width: `${s.level * 20}%` }}
                      />
                    </div>
                    <span className="font-mono text-[9px] text-ice-dim uppercase text-right tabular-nums">
                      {LEVELS[s.level]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-2 md:mt-6 border-t border-line pt-6">
            <p className="font-mono text-[10px] text-ice-dim leading-relaxed">
              <span className="text-orange">▸</span> Credenziali e portfolio
              completo su richiesta.
            </p>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
