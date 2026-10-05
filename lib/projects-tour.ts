import type { ScrollObserver } from "animejs";

/**
 * Il tour che la navbar avvia su "Progetti": invece di scorrere fino alla
 * sezione e lasciare che il lettore completi a mano lo scroll, porta lui la
 * pagina dalla posizione corrente fino a `offsetEnd`, così la timeline
 * scroll-driven di anime.js arriva in fondo e le card restano visibili.
 *
 * Vive fuori da projects.tsx perché è un problema a sé — ha le sue easing
 * function, il suo rAF e le sue regole di cancellazione — e non ha bisogno di
 * sapere come è costruita la timeline, solo dove inizia e finisce.
 */

type TourOptions = {
  /** La runway: al termine del tour il suo fondo è il punto di arrivo. */
  runway: HTMLElement;
  /** L'observer che possiede gli offset. `null` finché non è creato. */
  getObserver: () => ScrollObserver | null;
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

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// Front-loaded: parte subito a piena velocità, poi si assesta. Il mix con la
// lineare tiene la corsa costante nella fetta centrale.
const easeTour = (t: number) => 0.35 * (1 - Math.pow(1 - t, 3)) + 0.65 * t;

export function createProjectsTour(opts: TourOptions): ProjectsTour {
  let raf = 0;
  let touring = false;

  const stop = () => {
    touring = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
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
    const total = travelDur + tourDur;
    const travelShare = travelDur / total;
    const t0 = performance.now();
    touring = true;
    document.documentElement.style.scrollBehavior = "auto";

    const step = (now: number) => {
      if (!touring) return;
      const t = Math.min(1, (now - t0) / total);
      let y: number;
      if (t < travelShare) {
        y = startY + travelDist * easeInOutCubic(t / travelShare);
      } else {
        y = oStart + tourDist * easeTour((t - travelShare) / (1 - travelShare));
      }
      window.scrollTo(0, Math.max(0, Math.round(y)));
      if (t < 1) raf = requestAnimationFrame(step);
      else stop();
    };
    raf = requestAnimationFrame(step);
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