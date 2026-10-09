/**
 * Dizionario it/en per le due versioni statiche del sito (`/` ed `/en/`).
 *
 * Niente librerie i18n: con `output: "export"` non gira middleware né server,
 * quindi la traduzione è un oggetto tipizzato passato per prop dalle pagine.
 * `en` è annotato `Dict`: se una stringa manca in inglese, TypeScript lo
 * segnala a compile-time invece di mostrare un buco a runtime.
 *
 * Restano uguali in entrambe le lingue i token tecnici (comandi del
 * terminale, `SYS_*`, `SYNC_*`, stati, missionId, tag): sono nomi di macchina,
 * non frasi.
 */

export type Locale = "it" | "en";

export const LOCALES: readonly Locale[] = ["it", "en"];

/**
 * Prefisso di deploy (User Pages: root, stringa vuota). Stessa origine di
 * `basePath` in next.config.ts (assente): Next prefissa da solo gli asset
 * generati, ma i link scritti a mano (switcher lingua) devono farlo qui.
 */
export const BASE_PATH = "";

/** Dal pathname alla lingua: vale con o senza prefisso (`/en` è inglese). */
export function localeFromPathname(pathname: string | null): Locale {
  if (!pathname) return "it";
  return /(^|\/)en(\/|$)/.test(pathname) ? "en" : "it";
}

/** Destinazione dello switcher: slash finale perché l'host statico senza
 * rewrite risolve solo `/en/index.html`, non `/en`. */
export function localePath(locale: Locale): string {
  return `${BASE_PATH}${locale === "en" ? "/en/" : "/"}`;
}

export type Dict = {
  hero: {
    titleA: string;
    titleAccent: string;
    titleB: string;
    intro: string;
    ctaProjects: string;
    ctaContact: string;
  };
  projects: {
    title: string;
    roster: string;
    /** Prefisso dell'aria-label della card: ci si accoda il titolo. */
    openProject: string;
    fallbackDesc: string;
    /** Aria-label dei link esterni: `${githubAria} ${titolo} ${newTab}`. */
    githubAria: string;
    liveAria: string;
    newTab: string;
  };
  profile: {
    kicker: string;
    title: string;
    facts: { label: string; value: string; sub?: string }[];
    approachKicker: string;
    approachTitle: string;
    approachBodyA: string;
    approachStrong1: string;
    approachMid: string;
    approachStrong2: string;
    approachBodyB: string;
    stackTitle: string;
    levels: { 5: string; 4: string; 3: string };
    /** Frammenti dell'aria-label "Nome: livello 4 di 5 (…)". */
    levelWord: string;
    ofWord: string;
    footnote: string;
  };
  contact: {
    kicker: string;
    titleA: string;
    titleAccent: string;
    intro: string;
    geo: string;
    availability: string;
    formTitle: string;
    formIntro: string;
    fields: { label: string; placeholder: string }[];
    required: string;
    sentMailtoTitle: string;
    sentDirectTitle: string;
    filledPrefix: string;
    filledFor: string;
    pressVerb: string;
    pressSend: string;
    pressRest: string;
    thanks: string;
    received: string;
    replyTo: string;
    sla: string;
    preferMail: string;
    sendAnother: string;
    errorTitle: string;
    errorBody: string;
    submitIdle: string;
    submitSending: string;
    statusSending: string;
    statusIdle: string;
    newContact: string;
    nameLabel: string;
  };
  footer: {
    tagline: string;
    country: string;
    links: { lavori: string; profilo: string; contatti: string };
    navLabel: string;
  };
  nav: {
    home: string;
    items: { hero: string; lavori: string; profilo: string; contatti: string };
  };
};

const it: Dict = {
  hero: {
    titleA: "Sviluppo web, un",
    titleAccent: "sistema",
    titleB: "alla volta.",
    intro:
      "Web developer con focus sul frontend moderno. Realizzo interfacce responsive con React, Next.js e TypeScript, trasformando idee e design in esperienze web funzionali.",
    ctaProjects: "Vedi i progetti",
    ctaContact: "Contatti",
  },
  projects: {
    title: "Progetti",
    roster:
      "ROSTER in aggiornamento: nuovi deployment in fase di catalogazione.",
    openProject: "Apri progetto",
    fallbackDesc: "[ ---- DATI_IN_CODA ---- ]",
    githubAria: "Apri il repository GitHub di",
    liveAria: "Apri il sito di",
    newTab: "in una nuova scheda",
  },
  profile: {
    kicker: "Scheda Profilo",
    title: "Profilo",
    facts: [
      { label: "RUOLO", value: "Junior Web & Mobile App Developer" },
      { label: "BASE", value: "Italia", sub: "CET · UTC+1" },
      {
        label: "MODALITÀ",
        value: "Remoto · Ibrido",
        sub: "Fuso allineato al team",
      },
      {
        label: "LINGUE",
        value: "Italiano · Inglese",
        sub: "Doc tecnica inclusa",
      },
      {
        label: "FOCUS",
        value: "Frontend · API · Dati",
        sub: "React/Next.js/React Native",
      },
      { label: "SETTORE", value: "Sviluppo Web", sub: "Applicazioni" },
    ],
    approachKicker: "Approccio",
    approachTitle: "Frontend e design-to-code",
    approachBodyA:
      "Trasformo design Figma in interfacce React funzionanti con Next.js e TypeScript. Sviluppo applicazioni",
    approachStrong1: "modali",
    approachMid: "e",
    approachStrong2: "responsive",
    approachBodyB: ", integrando database SQLite/MySQL e API in ogni progetto.",
    stackTitle: "Stack · Livelli",
    levels: {
      5: "Dominio",
      4: "Produzione",
      3: "Autonomo",
    },
    levelWord: "livello",
    ofWord: "di",
    footnote: "Credenziali e portfolio completo su richiesta.",
  },
  contact: {
    kicker: "05 · Contatti",
    titleA: "Inizia la",
    titleAccent: "Missione",
    intro:
      "Hai un progetto da sviluppare? Cerchi un developer affidabile per il tuo team? Invia un messaggio: rispondo entro 24 ore in orario CET.",
    geo: "Italia · CET / UTC+1",
    availability: "Disponibile per nuovi progetti",
    formTitle: "Inviami un messaggio",
    formIntro:
      "Raccontami cosa vuoi realizzare. Ti rispondo entro 24 ore, in orario CET.",
    fields: [
      { label: "Nome", placeholder: "Alex Rossi" },
      { label: "Email", placeholder: "alex@example.com" },
      {
        label: "Messaggio",
        placeholder: "Ciao! Vorrei rifare il sito del mio studio entro marzo…",
      },
    ],
    required: "obbligatorio",
    sentMailtoTitle: "Si è aperto il tuo programma di posta",
    sentDirectTitle: "Messaggio inviato",
    filledPrefix: "Ho già compilato oggetto e testo",
    filledFor: "per",
    pressVerb: "Premi",
    pressSend: "Invia",
    pressRest: "lì per completare: ti rispondo entro 24 ore, in orario CET.",
    thanks: "Grazie",
    received: "l'ho ricevuto",
    replyTo: "e ti rispondo a",
    sla: "entro 24 ore, in orario CET.",
    preferMail: "Preferisci la mail diretta?",
    sendAnother: "Invia un altro messaggio",
    errorTitle:
      "L'invio diretto non è riuscito, ma ho già aperto il tuo programma di posta con il messaggio pronto.",
    errorBody: "Completa l'invio lì, oppure scrivimi a",
    submitIdle: "Invia messaggio",
    submitSending: "Invio in corso…",
    statusSending: "Invio in corso, attendi qualche secondo…",
    statusIdle: "Rispondo entro 24 ore · Orario CET",
    newContact: "nuovo contatto",
    nameLabel: "Nome",
  },
  footer: {
    tagline: "Codice, sistemi, dati",
    country: "Italia",
    links: {
      lavori: "Progetti",
      profilo: "Profilo",
      contatti: "Contatti",
    },
    navLabel: "Collegamenti di piede",
  },
  nav: {
    home: "Home",
    items: {
      hero: "Home",
      lavori: "Progetti",
      profilo: "Profilo",
      contatti: "Contatti",
    },
  },
};

const en: Dict = {
  hero: {
    titleA: "Web development, one",
    titleAccent: "system",
    titleB: "at a time.",
    intro:
      "Web developer focused on modern frontend development. I build responsive interfaces with React, Next.js and TypeScript, turning ideas and designs into functional web experiences.",
    ctaProjects: "View projects",
    ctaContact: "Contact",
  },
  projects: {
    title: "Projects",
    roster: "ROSTER updating: new deployments being catalogued.",
    openProject: "Open project",
    fallbackDesc: "[ ---- DATA_QUEUED ---- ]",
    githubAria: "Open the GitHub repository of",
    liveAria: "Open the live site of",
    newTab: "in a new tab",
  },
  profile: {
    kicker: "Profile Card",
    title: "Profile",
    facts: [
      { label: "ROLE", value: "Junior Web & Mobile App Developer" },
      { label: "BASE", value: "Italy", sub: "CET · UTC+1" },
      {
        label: "MODE",
        value: "Remote · Hybrid",
        sub: "Timezone aligned with the team",
      },
      {
        label: "LANGUAGES",
        value: "Italian · English",
        sub: "Technical docs included",
      },
      {
        label: "FOCUS",
        value: "Frontend · APIs · Data",
        sub: "React/Next.js/React Native",
      },
      { label: "FIELD", value: "Web Development", sub: "Applications" },
    ],
    approachKicker: "Approach",
    approachTitle: "Frontend and design-to-code",
    approachBodyA:
      "I turn Figma designs into working React interfaces with Next.js and TypeScript. I build",
    approachStrong1: "modular",
    approachMid: "and",
    approachStrong2: "responsive",
    approachBodyB:
      " applications, integrating SQLite/MySQL databases and APIs in every project.",
    stackTitle: "Stack · Levels",
    levels: {
      5: "Mastery",
      4: "Production",
      3: "Independent",
    },
    levelWord: "level",
    ofWord: "of",
    footnote: "References and full portfolio on request.",
  },
  contact: {
    kicker: "05 · Contact",
    titleA: "Start the",
    titleAccent: "Mission",
    intro:
      "Have a project to build? Looking for a reliable developer for your team? Send a message: I reply within 24 hours during CET hours.",
    geo: "Italy · CET / UTC+1",
    availability: "Available for new projects",
    formTitle: "Send me a message",
    formIntro:
      "Tell me what you want to build. I reply within 24 hours, during CET hours.",
    fields: [
      { label: "Name", placeholder: "Alex Rossi" },
      { label: "Email", placeholder: "alex@example.com" },
      {
        label: "Message",
        placeholder: "Hi! I'd like to redo my studio's website by March…",
      },
    ],
    required: "required",
    sentMailtoTitle: "Your mail app has opened",
    sentDirectTitle: "Message sent",
    filledPrefix: "I've already filled in the subject and body",
    filledFor: "for",
    pressVerb: "Press",
    pressSend: "Send",
    pressRest:
      "there to finish: I'll reply within 24 hours, during CET hours.",
    thanks: "Thanks",
    received: "I've received it",
    replyTo: "and I'll reply to",
    sla: "within 24 hours, during CET hours.",
    preferMail: "Prefer direct email?",
    sendAnother: "Send another message",
    errorTitle:
      "Direct sending failed, but I've already opened your mail app with the message ready.",
    errorBody: "Finish sending there, or write to me at",
    submitIdle: "Send message",
    submitSending: "Sending…",
    statusSending: "Sending, please wait a few seconds…",
    statusIdle: "I reply within 24 hours · CET hours",
    newContact: "new contact",
    nameLabel: "Name",
  },
  footer: {
    tagline: "Code, systems, data",
    country: "Italy",
    links: {
      lavori: "Projects",
      profilo: "Profile",
      contatti: "Contact",
    },
    navLabel: "Footer links",
  },
  nav: {
    home: "Home",
    items: {
      hero: "Home",
      lavori: "Projects",
      profilo: "Profile",
      contatti: "Contact",
    },
  },
};

export const DICTS: Record<Locale, Dict> = { it, en };
