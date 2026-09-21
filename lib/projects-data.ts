export type ProjectStatus = "DEPLOYED" | "STANDBY" | "IDEA";

export type Project = {
  id: string;
  status: ProjectStatus;
  missionId: string;
  num: string;
  title: string;
  desc: string;
  tags: string[];
  completion: number;
  visible: boolean;
};

export const STATUS_META: Record<
  ProjectStatus,
  { hex: string; chip: string }
> = {
  DEPLOYED: {
    hex: "#10b981",
    chip: "border-[rgba(16,185,129,0.4)] text-[#10b981]",
  },
  STANDBY: {
    hex: "#38bdf8",
    chip: "border-[rgba(56,189,248,0.35)] text-[#38bdf8]",
  },
  IDEA: {
    hex: "#64748b",
    chip: "border-[rgba(100,116,139,0.35)] text-[#64748b]",
  },
};

export const PROJECTS: Project[] = [
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