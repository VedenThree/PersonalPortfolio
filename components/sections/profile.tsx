import Reveal from "@/components/animations/reveal";

const IDENTITY_FIELDS = [
  { label: "RUOLO", value: "Full Stack Web Developer" },
  { label: "BASE", value: "Italia" },
  { label: "SISTEMA", value: "React · Next · Node · SQL" },
  { label: "SETTORE", value: "Sviluppo Web · Applicazioni" },
];

const SKILLS = [
  { name: "HTML", level: 5 },
  { name: "CSS", level: 5 },
  { name: "JavaScript", level: 4 },
  { name: "TypeScript", level: 4 },
  { name: "Next.js", level: 4 },
  { name: "React", level: 4 },
  { name: "MySQL", level: 3 },
  { name: "MongoDB", level: 3 },
];

function SkillDot({ name, level }: { name: string; level: number }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[rgba(168,196,212,0.06)]">
      <p className="font-mono text-[12px] text-paper-dim">{name}</p>
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="size-[7px] rounded-full"
            style={{ background: i < level ? "var(--orange)" : "rgba(232,88,10,0.15)" }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <Reveal delay={100}>
      <section id="profilo" className="py-24 border-t border-line">
        <div className="mb-16">
          <p className="font-mono text-[10px] tracking-[0.3em] text-ice-dim uppercase mb-3">
            Identity Sheet
          </p>
          <h2 className="font-display text-[clamp(28px,3.5vw,48px)] font-bold text-paper leading-[1.04]">
            Profilo
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="flex flex-col gap-0 border border-line rounded bg-surface overflow-hidden">
            <div className="px-6 py-3 border-b border-line bg-ink-deep/50">
              <p className="font-mono text-[10px] tracking-[0.3em] text-orange uppercase">
                Identity Card
              </p>
            </div>
            <div className="divide-y divide-line">
              {IDENTITY_FIELDS.map((f) => (
                <div
                  key={f.label}
                  className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 gap-2"
                >
                  <span className="font-mono text-[10px] tracking-[0.2em] text-ice-dim uppercase shrink-0">
                    {f.label}
                  </span>
                  <span className="text-paper font-medium">{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <h3 className="font-display text-2xl font-bold text-paper mb-4 tracking-[-0.01em]">
                Sistemi digitali, riga per riga
              </h3>
              <p className="text-paper-dim leading-relaxed max-w-lg">
                Progetto interfacce e back-end con lo stesso approccio con cui
                si mappa un territorio: precisione, struttura e continuità.
                Ogni sistema nasce da una domanda, si costruisce in layer e
                si rilascia funzionante.
              </p>
            </div>

            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] text-ice-dim uppercase mb-4">
                Stack Operativo
              </p>
              <div className="border border-line rounded bg-surface overflow-hidden">
                {SKILLS.map((s) => (
                  <SkillDot key={s.name} {...s} />
                ))}
              </div>
            </div>

            <div className="border-t border-line pt-8">
              <p className="font-mono text-[10px] text-ice-dim leading-relaxed">
                <span className="text-orange">▸</span>{" "}
                Credenziali e portfolio completo su richiesta.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
