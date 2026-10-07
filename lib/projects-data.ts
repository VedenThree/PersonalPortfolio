import type { Locale } from "@/lib/i18n";

export type ProjectStatus = "DEPLOYED" | "STANDBY" | "IDEA";

export type Project = {
  id: string;
  status: ProjectStatus;
  /** Ordinale canonico, "PRJ-03". `num` ne deriva: non va duplicato a mano. */
  missionId: string;
  title: string;
  desc: string;
  /** Descrizione inglese: i titoli restano nomi propri e non si traducono. */
  descEn: string;
  /** Link esterni, opzionali: chi non li ha (es. repo in trasloco) non mostra anchor. */
  githubUrl?: string;
  liveUrl?: string;
  tags: string[];
  completion: number;
  /**
   * I segnaposto restano in PROJECTS (così `LOAD_MODULES [2/4]` ha un
   * denominatore reale) ma non vengono pubblicati: usa VISIBLE_PROJECTS.
   *
   * Un segnaposto è un guscio vuoto. `visible: true` su un guscio vuoto è un
   * errore di configurazione, non una scelta: renderizzerebbe una card con
   * "[ EMPTY ]", descrizione di fallback e barra a zero.
   */
  placeholder: boolean;
  visible: boolean;
};

/** Numero di slot mostrato sulla card: "PRJ-03" → "03". */
export const projectNum = (p: Project) => p.missionId.replace(/^PRJ-/, "");

/** Un titolo diventa identificatore di modulo: "Dinamiche Verticali" → DINAMICHE_VERTICALI */
export const moduleName = (title: string) =>
  title.toUpperCase().replace(/\s+/g, "_");

export const STATUS_META: Record<
  ProjectStatus,
  { hex: string; chip: string }
> = {
  DEPLOYED: {
    hex: "var(--green)",
    chip: "border-green/40 text-green",
  },
  STANDBY: {
    hex: "var(--ice)",
    chip: "border-ice/35 text-ice",
  },
  IDEA: {
    hex: "var(--steel)",
    chip: "border-steel/35 text-steel",
  },
};

const PUBLISHED: Project[] = [
  {
    id: "dinamiche-verticali",
    status: "DEPLOYED",
    missionId: "PRJ-01",
    title: "Dinamiche Verticali",
    desc: "Sito web con blog dedicato all'attività di arrampicata in quota e su corda. Progetto scolastico di gruppo sviluppato interamente.",
    descEn:
      "Website with a blog dedicated to high-altitude and rope climbing. A fully developed group school project.",
    githubUrl:
      "https://github.com/fabiogentile-gif/DinamicheVerticali_WebSite",
    liveUrl: "https://dinamiche-verticali.vercel.app",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    completion: 100,
    placeholder: false,
    visible: true,
  },
  {
    id: "skillswap",
    status: "STANDBY",
    missionId: "PRJ-02",
    title: "SkillSwap",
    desc: "Piattaforma di scambio competenze in corso di completamento.",
    descEn: "Skill exchange platform, currently being completed.",
    tags: ["React", "Next.js", "TypeScript", "MongoDB"],
    completion: 50,
    placeholder: false,
    visible: true,
  },
];

// Slot riservati: la numerazione resta stabile quando si pubblica un progetto.
const RESERVED: Project[] = [
  {
    id: "progetto-03",
    status: "IDEA",
    missionId: "PRJ-03",
    title: "Progetto 03",
    desc: "",
    descEn: "",
    tags: [],
    completion: 0,
    placeholder: true,
    visible: false,
  },
  {
    id: "progetto-04",
    status: "IDEA",
    missionId: "PRJ-04",
    title: "Progetto 04",
    desc: "",
    descEn: "",
    tags: [],
    completion: 0,
    placeholder: true,
    visible: false,
  },
];

export const PROJECTS: Project[] = [...PUBLISHED, ...RESERVED];

/**
 * Guardia di pubblicazione: un segnaposto non può finire nella UI, anche se
 * qualcuno lo marca `visible: true` per errore.
 *
 * Non lancia: l'obiettivo è che la pagina continui a funzionare e che lo
 * sviluppatore veda il perché. In sviluppo segnala l'errore di configurazione,
 * in produzione lascia semplicemente fuori il segnaposto.
 */
const isPublishable = (p: Project) => {
  if (!p.placeholder) return true;
  if (p.visible && process.env.NODE_ENV !== "production") {
    console.error(
      `[projects-data] "${p.id}" è un segnaposto (placeholder: true) ma ha visible: true. ` +
        `Rimuovi visible o compilare desc/tag/completion prima di pubblicarlo.`,
    );
  }
  return false;
};

/** Unica lista da usare per il rendering: terminale, griglia e contatori. */
export const VISIBLE_PROJECTS: Project[] = PROJECTS.filter(
  (p) => p.visible && isPublishable(p),
);

/**
 * Descrizione nella lingua della pagina. Senza inglese (vecchi dati o
 * segnaposto) ricade sull'italiano: mai una card vuota per un buco di
 * traduzione.
 */
export function projectDesc(p: Project, locale: Locale): string {
  if (locale === "en" && p.descEn) return p.descEn;
  return p.desc;
}