import Reveal from "@/components/animations/reveal";

const IDENTITY_FIELDS = [
  { label: "RUOLO", value: "Full Stack Web Developer" },
  { label: "BASE", value: "Italia" },
  { label: "SISTEMA", value: "React · Next · Node · SQL" },
  { label: "SETTORE", value: "Sviluppo Web · Applicazioni" },
];

export default function Profile() {
  return (
    <Reveal delay={100}>
      <section id="profilo" className="py-24 border-t border-line">
        <div className="mb-16">
          <p className="font-mono text-[11px] tracking-[0.3em] text-ice-dim uppercase mb-3">
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
              <div className="flex flex-wrap gap-2">
                {[
                  "HTML",
                  "CSS",
                  "JavaScript",
                  "TypeScript",
                  "Next.js",
                  "React",
                  "MySQL",
                  "MongoDB",
                ].map((t, i) => (
                  <span
                    key={t}
                    className="font-mono text-[11px] px-3 py-1.5 rounded border border-line text-ice bg-ice/5 tag-hover"
                    style={{ transitionDelay: `${i * 50}ms` }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-line pt-8">
              <p className="font-mono text-[11px] text-ice-dim leading-relaxed">
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
