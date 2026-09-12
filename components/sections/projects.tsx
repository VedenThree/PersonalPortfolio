import Reveal from "@/components/animations/reveal";

const PROJECTS = [
  {
    id: "dinamiche-verticali",
    status: "OPERATIVE",
    statusColor: "orange",
    unit: "PRJ-01",
    title: "Dinamiche Verticali",
    desc: "Piattaforma operativa per la gestione e l'analisi di dati verticali. Attiva e visibile.",
    coords: "46.2074° N · 9.0200° E",
    visible: true,
  },
  {
    id: "skillswap",
    status: "STANDBY",
    statusColor: "olive",
    unit: "PRJ-02",
    title: "SkillSwap",
    desc: "Piattaforma di scambio competenze in corso di completamento.",
    coords: "",
    visible: false,
  },
  {
    id: "progetto-03",
    status: "IDEA",
    statusColor: "ice",
    unit: "PRJ-03",
    title: "Progetto 03",
    desc: "",
    coords: "",
    visible: false,
  },
  {
    id: "progetto-04",
    status: "IDEA",
    statusColor: "ice",
    unit: "PRJ-04",
    title: "Progetto 04",
    desc: "",
    coords: "",
    visible: false,
  },
];

const STATUS_STYLES: Record<string, string> = {
  orange: "bg-orange/20 text-orange border-orange/30",
  olive: "bg-olive/20 text-olive border-olive/30",
  ice: "bg-ice/20 text-ice border-ice/30",
};

export default function Projects() {
  return (
    <Reveal>
      <section id="lavori" className="py-24 border-t border-line">
        <div className="mb-16">
          <h2 className="font-display text-[clamp(28px,3.5vw,48px)] font-bold text-paper leading-[1.04]">
            Progetti
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROJECTS.map((p, i) => (
            <article
              key={p.id}
              className="relative flex flex-col gap-4 p-6 border border-line rounded card-hover"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.2em] text-ice-dim">
                  {p.unit}
                </span>
                <span
                  className={`font-mono text-[10px] tracking-[0.15em] px-2.5 py-1 rounded border ${STATUS_STYLES[p.statusColor]}`}
                >
                  {p.status}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-paper tracking-[-0.01em]">
                {p.title}
              </h3>
              {p.desc && (
                <p className="text-sm text-paper-dim leading-relaxed">
                  {p.desc}
                </p>
              )}
              {!p.desc && !p.visible && (
                <div className="flex flex-col gap-2 mt-2">
                  <div className="h-3 bg-line rounded w-3/4" />
                  <div className="h-3 bg-line rounded w-1/2" />
                  <div className="h-3 bg-line rounded w-2/3" />
                </div>
              )}
              {p.visible && (
                <div className="mt-auto flex items-center gap-2 font-mono text-[11px] text-ice-dim">
                  <span className="w-[5px] h-[5px] rounded-full bg-orange" />
                  {p.coords}
                </div>
              )}
            </article>
          ))}
        </div>
        <div className="mt-12 font-mono text-[12px] text-ice-dim border-t border-line pt-8">
          <p>
            <span className="text-orange">●</span> Roster in aggiornamento — nuovi deployment in fase di catalogazione.
          </p>
        </div>
      </section>
    </Reveal>
  );
}