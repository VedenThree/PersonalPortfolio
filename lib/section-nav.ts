/**
 * Un solo modo per arrivare a una sezione, condiviso da navbar, hero e footer.
 *
 * "lavori" ha un comportamento proprio — è pilotata da scroll e la navbar avvia
 * il tour animato con l'evento `play-projects` — quindi le altre sezioni sono
 * un semplice `scrollIntoView`. Centralizzando qui, la stessa destinazione non
 * può avere due comportamenti diversi a seconda di dove si è cliccato.
 *
 * Il trasporto dell'evento passa da `SECTION_EVENTS`/`onSectionEvent` invece
 * che da una stringa sparsa: il nome è legato a compile-time, quindi un
 * refactor del listener non può lasciare il dispatch a puntare sul nulla.
 */
export const SECTION_EVENTS = {
  /** projects.tsx lo ascolta per avviare il tour scroll-driven. */
  playProjects: "play-projects",
  /** Il tour lo ascolta per fermarsi: ogni navigazione ha precedenza. */
  stopTour: "stop-tour",
} as const;

export type SectionEvent = (typeof SECTION_EVENTS)[keyof typeof SECTION_EVENTS];

export function emitSectionEvent(name: SectionEvent) {
  window.dispatchEvent(new CustomEvent(name));
}

export function onSectionEvent(name: SectionEvent, handler: () => void) {
  window.addEventListener(name, handler);
  return () => window.removeEventListener(name, handler);
}

export function goToSection(id: string) {
  // Ogni navigazione da navbar/hero/footer ferma prima il tour: se sta
  // guidando lo scroll, non deve combattere con la nuova destinazione.
  emitSectionEvent(SECTION_EVENTS.stopTour);
  if (id === "lavori") {
    emitSectionEvent(SECTION_EVENTS.playProjects);
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}