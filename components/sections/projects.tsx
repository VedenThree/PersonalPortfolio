import Reveal from "@/components/animations/reveal";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const PROJECTS = [
  {
    id: "dinamiche-verticali",
    status: "OPERATIVE",
    statusVariant: "orange" as const,
    unit: "PRJ-01",
    title: "Dinamiche Verticali",
    desc: "Piattaforma operativa per la gestione e l'analisi di dati verticali. Attiva e visibile.",
    coords: "46.2074° N · 9.0200° E",
    visible: true,
  },
  {
    id: "skillswap",
    status: "STANDBY",
    statusVariant: "olive" as const,
    unit: "PRJ-02",
    title: "SkillSwap",
    desc: "Piattaforma di scambio competenze in corso di completamento.",
    coords: "",
    visible: false,
  },
  {
    id: "progetto-03",
    status: "IDEA",
    statusVariant: "ice" as const,
    unit: "PRJ-03",
    title: "Progetto 03",
    desc: "",
    coords: "",
    visible: false,
  },
  {
    id: "progetto-04",
    status: "IDEA",
    statusVariant: "ice" as const,
    unit: "PRJ-04",
    title: "Progetto 04",
    desc: "",
    coords: "",
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
          {PROJECTS.map((p, i) => (
            <Card
              key={p.id}
              className="card-hover"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between p-6 pb-0">
                <span className="font-mono text-[10px] tracking-[0.2em] text-ice-dim">
                  {p.unit}
                </span>
                <Badge variant={p.statusVariant}>{p.status}</Badge>
              </CardHeader>
              <CardContent className="p-6 pt-4 flex flex-col gap-4">
                <CardTitle>{p.title}</CardTitle>
                {p.desc && (
                  <p className="text-sm text-paper-dim leading-relaxed">
                    {p.desc}
                  </p>
                )}
                {!p.desc && !p.visible && (
                  <div className="flex flex-col gap-2 mt-2">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                )}
                {p.visible && (
                  <div className="mt-auto flex items-center gap-2 font-mono text-[11px] text-ice-dim">
                    <span className="w-[5px] h-[5px] rounded-full bg-orange" />
                    {p.coords}
                  </div>
                )}
              </CardContent>
            </Card>
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