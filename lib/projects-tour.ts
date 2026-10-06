import { createTimeline, type Timeline } from "animejs";

/**
 * Il tour che la navbar avvia su "Progetti": invece di scorrere fino alla
 * sezione e lasciare che il lettore completi a mano lo scroll, porta lui la
 * pagina dalla posizione corrente fino a `offsetEnd`, così la timeline
 * scroll-driven di anime.js arriva in fondo e le card restano visibili.
 *
 * Lo scroll è una timeline anime.js su un proxy `{ y }`: due tratte in
 * sequenza (avvicinamento + attraversamento) con easing built-in, niente
 * rAF e niente easing scritte a mano.
 */

type TourOptions = {
  /** La runway: al termine del tour il suo fondo è il punto di arrivo. */
  runway: HTMLElement;
  /** L'observer che possiede gli offset. `null` finché non è creato. */
  getObserver: () => { offsetStart: number; offsetEnd: number } | null;
  /** Sotto il breakpoint il layout non è pinnato: il tour non ha senso. */
  isPinned: () => boolean;
  /** Durata della timeline, usata per dimensionare la corsa. */
  getTimelineDuration: () => number;
};

export type ProjectsTour = {
  start: () => void;
  stop: () => void;
  destroy: () => void;
};

export function createProjectsTour(opts: TourOptions): ProjectsTour {
  let tl: Timeline | null = null;

  const stop = () => {
    tl?.revert();
    tl = null;
    document.documentElement.style.scrollBehavior = "";
  };

  const start = () => {
    stop();
    const observer = opts.getObserver();
    const tlDuration = opts.getTimelineDuration();
    if (!observer || !opts.isPinned()) return;

    const startY = window.scrollY;
    const oStart = observer.offsetStart;
    const oEnd = observer.offsetEnd;
    const travelDist = oStart - startY;
    const tourDist = oEnd - oStart;
    if (tourDist <= 0 || tlDuration <= 0) return;

    // Già oltre la fine: non c'è più niente da pilotare.
    if (startY >= oEnd) {
      window.scrollTo({ top: oEnd, behavior: "smooth" });
      return;
    }

    // travelDist può essere negativo (già dentro la runway): il clamp a [90, 420]
    // impedisce che ne nasca una durata negativa.
    const travelDur = Math.max(90, Math.min(420, travelDist * 0.22));
    const tourDur = Math.max(1500, tlDuration * 0.78);
    const pos = { y: startY };
    const scrollTo = () =>
      window.scrollTo(0, Math.max(0, Math.round(pos.y)));
    document.documentElement.style.scrollBehavior = "auto";

    tl = createTimeline({ onComplete: stop });
    tl.add(pos, {
      y: oStart,
      duration: travelDur,
      ease: "inOutCubic",
      onUpdate: scrollTo,
    });
    tl.add(pos, {
      y: oEnd,
      duration: tourDur,
      ease: "outCubic",
      onUpdate: scrollTo,
    });
  };

  // Qualunque input dell'utente interrompe il tour: da quel momento la
  // pagina torna ad essere pilotata solo dal lettore.
  const cancel = () => stop();

  window.addEventListener("wheel", cancel, { passive: true });
  window.addEventListener("touchstart", cancel, { passive: true });
  window.addEventListener("keydown", cancel);

  return {
    start,
    stop,
    destroy() {
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
      window.removeEventListener("keydown", cancel);
      stop();
      opts.runway.style.height = "auto";
    },
  };
}
