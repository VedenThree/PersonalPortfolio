import Reveal from "@/components/animations/reveal";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_COLORS: Record<string, string> = {
  DEPLOYED: "border-[rgba(232,88,10,0.35)] text-[rgba(232,88,10,0.9)]",
  STANDBY: "border-[rgba(168,196,212,0.25)] text-[rgba(168,196,212,0.6)]",
  IDEA: "border-[rgba(168,196,212,0.15)] text-[rgba(168,196,212,0.35)]",
};

export const PROJECTS = [
  {
    id: "dinamiche-verticali",
    status: "DEPLOYED",
    missionId: "PRJ-01",
    num: "01",
    title: "Dinamiche Verticali",
    desc: "Piattaforma operativa per la gestione e l'analisi di dati verticali. Attiva e visibile.",
    tags: ["React", "Next.js", "TypeScript", "MySQL"],
    completion: 100,
    visible: true,
  },
  {
    id: "skillswap",
    status: "STANDBY",
    missionId: "PRJ-02",
    num: "02",
    title: "SkillSwap",
    desc: "Piattaforma di scambio competenze in corso di completamento.",
    tags: ["React", "Next.js", "TypeScript", "MongoDB"],
    completion: 50,
    visible: false,
  },
  {
    id: "progetto-03",
    status: "IDEA",
    missionId: "PRJ-03",
    num: "03",
    title: "Progetto 03",
    desc: "",
    tags: [],
    completion: 0,
    visible: false,
  },
  {
    id: "progetto-04",
    status: "IDEA",
    missionId: "PRJ-04",
    num: "04",
    title: "Progetto 04",
    desc: "",
    tags: [],
    completion: 0,
    visible: false,
  },
];

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
          {PROJECTS.map((p) => (
            <div
              key={p.id}
              className="card-hover relative flex flex-col p-6 overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(168,196,212,0.03) 0%, rgba(13,14,26,0.95) 100%)",
              }}
            >
              {/* Corner brackets */}
              <div className="absolute border-l-2 border-t-2 border-[rgba(232,88,10,0.4)] left-0 top-0 size-[12px]" />
              <div className="absolute border-b-2 border-r-2 border-[rgba(232,88,10,0.4)] right-0 bottom-0 size-[12px]" />

              {/* Faded number */}
              <p aria-hidden className="pointer-events-none absolute right-5 top-1 font-mono font-bold text-[56px] leading-none text-orange/5 select-none">
                {p.num}
              </p>

              {/* Badges */}
              <div className="flex gap-2 mb-3">
                <span
                  className={`border font-mono text-[8px] tracking-[1.2px] px-2 py-0.5 ${STATUS_COLORS[p.status]}`}
                >
                  {p.status}
                </span>
              </div>

              <h3 className="font-display font-bold uppercase tracking-tight text-paper text-[20px] leading-none mb-3">
                {p.title}
              </h3>

              {p.desc ? (
                <p className="font-sans text-[12px] text-[rgba(168,196,212,0.65)] leading-[1.6] mb-4 flex-1">
                  {p.desc}
                </p>
              ) : (
                <div className="flex flex-col gap-2 mb-4 flex-1">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              )}

              {/* Tags */}
              {p.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="border border-[rgba(168,196,212,0.15)] font-mono text-[8px] text-[rgba(168,196,212,0.5)] tracking-[0.8px] px-2 py-0.5"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Progress */}
              <div className="mb-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-[3px] flex-1"
                      style={{
                        background:
                          i < Math.round(p.completion / 10)
                            ? "#e8580a"
                            : "rgba(232,88,10,0.12)",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto">
                <p className="font-mono text-[8px] text-[rgba(168,196,212,0.25)] tracking-[0.8px]">
                  {p.missionId}
                </p>
                <p className="font-mono text-[8px] text-[#e8580a] tracking-[0.8px] cursor-pointer hover:underline">
                  DETTAGLI →
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 font-mono text-[12px] text-ice-dim border-t border-line pt-8">
          <p>
            <span className="text-orange">●</span> Roster in aggiornamento:
            nuovi deployment in fase di catalogazione.
          </p>
        </div>
      </section>
    </Reveal>
  );
}