"use client";

import { useEffect, useRef, useState } from "react";
import { animate, createTimeline, onScroll, stagger } from "animejs";
import Terminal, {
  type TerminalHandle,
  type TerminalLine,
} from "@/components/ui/Terminal";
import { PROJECTS, STATUS_META, type Project } from "@/lib/projects-data";
import { cn } from "@/lib/utils";

const HOLD_START = 0.65;

const LINES: TerminalLine[] = [
  { id: "init", cmd: "INIT DEPLOY_PIPELINE", res: "OK", color: "#10b981" },
  {
    id: "modules",
    cmd: `LOAD_MODULES [${PROJECTS.length}/${PROJECTS.length}]`,
    res: "COMPLETE",
    color: "#10b981",
  },
  ...PROJECTS.map((p) => ({
    id: `module-${p.id}`,
    module: true,
    cmd: p.title.toUpperCase().replace(/\s+/g, "_"),
    res: p.status,
    color: STATUS_META[p.status].hex,
  })),
  { id: "net", cmd: "NET_STATUS", res: "ONLINE", color: "#10b981" },
  { id: "clearance", cmd: "CLEARANCE_LVL", res: "VERIFIED", color: "#10b981" },
  { id: "render", cmd: "RENDER_MODE", res: "ASCII", color: "#ff5c00" },
  { id: "ready", ready: true, cmd: "PROJECTS // ONLINE" },
];

const notNull = <T,>(x: T | null): x is T => x !== null;

function ASCIIProgressBar({ p }: { p: Project }) {
  const meta = STATUS_META[p.status];
  const cells = Array.from({ length: 12 }, (_, i) =>
    i < Math.round((p.completion / 100) * 12) ? "█" : "░",
  );
  return (
    <p className="m-0 text-[12px] leading-[1.7]">
      <span className="text-[#7a8ca1]">$</span>{" "}
      <span className="text-[#93a6b8]">PROG</span>{" "}
      <span className="text-[#ff5c00]">&gt;</span>{" "}
      <span className="text-[#5d7187]">[</span>
      {cells.map((c, i) => (
        <span
          key={i}
          style={{
            color: c === "█" ? meta.hex : "#2a3a4d",
          }}
        >
          {c}
        </span>
      ))}
      <span className="text-[#5d7187]">]</span>{" "}
      <span style={{ color: meta.hex }}>{p.completion}%</span>
    </p>
  );
}

export default function Projects() {
  const runwayRef = useRef<HTMLDivElement | null>(null);
  const syncRef = useRef<HTMLSpanElement | null>(null);
  const terminalRef = useRef<TerminalHandle | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const echoRef = useRef<HTMLSpanElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);

  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (p: Project) => {
    const nowSelected = selected !== p.id;
    setSelected(nowSelected ? p.id : null);
    if (echoRef.current) {
      echoRef.current.textContent = `$ ${
        nowSelected ? "open" : "close"
      } ${p.missionId.toLowerCase()} // ${p.title
        .toUpperCase()
        .replace(/\s+/g, "_")} [OK]`;
    }
  };

  useEffect(() => {
    const runway = runwayRef.current;
    const h = terminalRef.current;
    if (!runway || !h) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const show = (el: HTMLElement | null) => {
      if (el) el.style.opacity = "1";
    };

    const mq = window.matchMedia("(min-width: 768px)");
    let pinned = false;
    const setPinned = (v: boolean) => {
      pinned = v;
      runway.style.height = v ? "300vh" : "auto";
    };
    setPinned(mq.matches);

    // Auto-play tour (navbar "Progetti"): scorre la runway così che
    // onScroll piloti la timeline fino alla fine (card visibili).
    let observer: ReturnType<typeof onScroll> | null = null;
    let tlDuration = 0;
    let tourRaf = 0;
    let touring = false;
    const stopTour = () => {
      touring = false;
      if (tourRaf) cancelAnimationFrame(tourRaf);
      tourRaf = 0;
      document.documentElement.style.scrollBehavior = "";
    };
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const easeInOutQuart = (t: number) =>
      t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

    const startTour = () => {
      stopTour();
      if (!observer) return;
      const startY = window.scrollY;
      const oStart = observer.offsetStart;
      const oEnd = observer.offsetEnd;
      const travelDist = oStart - startY;
      const tourDist = oEnd - oStart;
      if (tourDist <= 0 || tlDuration <= 0) return;
      if (startY >= oEnd) {
        window.scrollTo({ top: oEnd, behavior: "smooth" });
        return;
      }
      const travelDur = Math.max(120, Math.min(900, travelDist * 0.35));
      const tourDur = Math.max(2600, tlDuration * 1.35);
      const total = travelDur + tourDur;
      const t0 = performance.now();
      touring = true;
      document.documentElement.style.scrollBehavior = "auto";
      const step = (now: number) => {
        if (!touring) return;
        const t = Math.min(1, (now - t0) / total);
        let y: number;
        if (t < travelDur / total) {
          y = startY + travelDist * easeInOutCubic(t / (travelDur / total));
        } else {
          y =
            oStart +
            tourDist *
              easeInOutQuart((t - travelDur / total) / (1 - travelDur / total));
        }
        window.scrollTo(0, Math.max(0, Math.round(y)));
        if (t < 1) tourRaf = requestAnimationFrame(step);
        else stopTour();
      };
      tourRaf = requestAnimationFrame(step);
    };

    const onPlayProjects = () => {
      if (reduced || !pinned || !observer) {
        document
          .getElementById("lavori")
          ?.scrollIntoView({ behavior: "smooth" });
        return;
      }
      startTour();
    };
    const cancelTour = () => stopTour();
    window.addEventListener("play-projects", onPlayProjects);
    window.addEventListener("wheel", cancelTour, { passive: true });
    window.addEventListener("touchstart", cancelTour, { passive: true });
    window.addEventListener("keydown", cancelTour);
    const removeNavEvents = () => {
      window.removeEventListener("play-projects", onPlayProjects);
      window.removeEventListener("wheel", cancelTour);
      window.removeEventListener("touchstart", cancelTour);
      window.removeEventListener("keydown", cancelTour);
      stopTour();
      runway.style.height = "auto";
    };

    if (reduced) {
      show(h.box());
      h.prompts().forEach(show);
      h.chars().forEach((row) => row.forEach(show));
      h.res().forEach(show);
      show(h.cursor());
      show(gridRef.current);
      cardRefs.current.forEach((c) => {
        if (c) {
          c.style.opacity = "1";
          c.style.transform = "none";
        }
      });
      show(footerRef.current);
      if (gridRef.current) gridRef.current.style.pointerEvents = "auto";
      const statusEl = h.status();
      if (statusEl) {
        statusEl.textContent = "DEPLOYED";
        statusEl.style.color = "#10b981";
      }
      if (syncRef.current) syncRef.current.textContent = "SYNC_100%";
      return removeNavEvents;
    }

    const box = h.box();
    if (!box) {
      removeNavEvents();
      return;
    }

    const tl = createTimeline({ defaults: { ease: "outExpo" } });

    // 1. Terminal window enters small
    tl.add(box, {
      opacity: [0, 1],
      scale: [0.45, 0.85],
      translateY: [18, 0],
      duration: 600,
    });

    // 2. Typewriter: one line at a time, characters left-to-right
    const prompts = h.prompts();
    const rowsCh = h.chars();
    const results = h.res();
    LINES.forEach((line, i) => {
      const promptEl = prompts[i];
      if (promptEl) {
        tl.add(promptEl, {
          opacity: [0, 1],
          duration: 80,
          ease: "linear",
        });
      }
      tl.add((rowsCh[i] || []).filter(notNull), {
        opacity: [0, 1],
        duration: line.ready ? 640 : 560,
        delay: stagger(line.ready ? 96 : 54),
        ease: "linear",
      });
      const resEl = line.ready ? null : results[i];
      if (resEl) {
        tl.add(resEl, {
          opacity: [0, 1],
          scale: [0.7, 1],
          duration: 240,
          ease: "back.out(2)",
        });
      }
    });

    // Durata del typewriter come unità: tutte le fasi successive vengono
    // dimensionate in proporzione, così la suddivisione sullo scroll
    // resta stabile e la "sosta" occupa una fetta visibile.
    const U = tl.duration;

    // 3. Maximize the terminal window (slow, so the typed text can be read)
    tl.add(box, {
      scale: [0.85, 1],
      duration: U * 0.38,
      ease: "inOutExpo",
    });

    // 3b. SOSTA: terminale massimizzato con le parole visibili. Dead-time
    // lungo quasi quanto il typewriter → sullo scroll ci si ferma a leggere.
    tl.add(box, { opacity: [1, 1], duration: U * 0.95 });

    // 4. Clear the screen (lines scroll away)
    const clearTargets = [
      ...prompts.filter(notNull),
      ...rowsCh.flat().filter(notNull),
      ...results.filter(notNull),
    ];
    tl.add(clearTargets, {
      opacity: [1, 0],
      translateY: [0, -14],
      duration: U * 0.1,
      delay: stagger(14),
      ease: "linear",
    });
    const clearEnd = tl.duration;

    // 5. Cards reveal inside the terminal
    tl.add(gridRef.current!, {
      opacity: [0, 1],
      duration: U * 0.05,
      ease: "linear",
    });
    tl.add(cardRefs.current.filter(notNull), {
      opacity: [0, 1],
      translateY: [16, 0],
      duration: U * 0.16,
      delay: stagger(70),
    });

    // 6. Footer
    tl.add(footerRef.current!, {
      opacity: [0, 1],
      translateY: [6, 0],
      duration: U * 0.07,
    });

    tlDuration = tl.duration;

    const loops: Array<{ revert: () => void }> = [];
    const cursor = h.cursor();
    if (cursor) {
      loops.push(
        animate(cursor, {
          opacity: [0.1, 1],
          duration: 680,
          ease: "steps(1)",
          loop: true,
          alternate: true,
        }),
      );
    }
    const scan = h.scan();
    if (scan) {
      loops.push(
        animate(scan, {
          translateX: ["-160%", "560%"],
          duration: 4200,
          ease: "inOutSine",
          loop: true,
        }),
      );
    }

    // Scroll observer di anime.js: lega la timeline allo scrolling.
    tl.pause();
    observer = onScroll({
      target: runway,
      enter: () => (pinned ? "top top" : "85% top"),
      leave: () => (pinned ? "end bottom" : "15% top"),
      sync: 0.5,
      onUpdate: (self) => {
        // La timeline completa al 65% della runway; il tratto residuo
        // mantiene la sezione sticky ferma (sosta) prima di proseguire.
        const remap = Math.min(1, self.progress / HOLD_START);
        const p = Math.max(0, Math.min(1, remap));
        const t = tl.duration * p;
        tl.seek(t);
        if (syncRef.current) {
          syncRef.current.textContent = `SYNC_${String(
            Math.round(self.progress * 100),
          ).padStart(2, "0")}%`;
        }
        const statusEl = h.status();
        if (statusEl) {
          const deployed = t >= clearEnd;
          statusEl.textContent = deployed ? "DEPLOYED" : "STANDBY";
          statusEl.style.color = deployed ? "#10b981" : "#64748b";
        }
        const layerEl = h.layer();
        if (layerEl) {
          // Dopo il clear le righe digitate sono a opacity 0 ma ancora in
          // DOM: nascondile davvero, altrimenti restano "fantasma".
          layerEl.style.visibility = t >= clearEnd ? "hidden" : "visible";
        }
        if (gridRef.current) {
          gridRef.current.style.pointerEvents = t >= clearEnd ? "auto" : "none";
        }
      },
    });

    const onMqChange = (e: MediaQueryListEvent) => {
      stopTour();
      setPinned(e.matches);
      observer.refresh();
    };
    if (mq.addEventListener) mq.addEventListener("change", onMqChange);

    return () => {
      observer.revert();
      tl.revert();
      loops.forEach((a) => a.revert());
      if (mq.removeEventListener) mq.removeEventListener("change", onMqChange);
      removeNavEvents();
    };
  }, []);

  return (
    <section id="lavori" className="relative border-t border-line">
      <div ref={runwayRef} className="relative">
        <div
          className="md:sticky md:top-0 md:min-h-screen w-full flex flex-col justify-center py-20 md:py-14 lg:py-20"
          style={{ willChange: "transform" }}
        >
          {/* Header */}
          <div className="mb-8 md:mb-8 lg:mb-10">
            <div className="flex items-baseline justify-between gap-4 mb-3">
              <p className="font-mono text-[10px] tracking-[0.3em] text-ice-dim uppercase">
                Deploy Pipeline // Archive
              </p>
              <span
                ref={syncRef}
                className="font-mono text-[10px] tracking-[0.2em] text-ice-dim tabular-nums"
              >
                SYNC_00%
              </span>
            </div>
            <h2 className="font-display text-[clamp(28px,3.5vw,48px)] font-bold text-paper leading-[1.04]">
              Progetti
            </h2>
          </div>

          {/* Terminal window: types, maximizes, then reveals the cards */}
          <Terminal
            ref={terminalRef}
            title="PROJECTS_SYS // ARCHIVE"
            status="STANDBY"
            statusColor="#64748b"
            lines={LINES}
          >
            <div
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6"
              style={{ opacity: 0, pointerEvents: "none" }}
            >
              {PROJECTS.map((p, i) => (
                <div
                  key={p.id}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="will-change-transform h-full"
                  style={{ opacity: 0, transform: "translateY(18px)" }}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    aria-pressed={selected === p.id}
                    aria-label={`Apri progetto ${p.title}`}
                    onClick={() => handleSelect(p)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelect(p);
                      }
                    }}
                    className={cn(
                      "group relative flex h-full cursor-pointer select-none flex-col border p-5 font-mono transition-colors duration-300",
                      "hover:border-[#ff5c00]/40 active:translate-y-[1px]",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange focus-visible:outline-offset-2",
                      "rounded-[2px]",
                      selected === p.id
                        ? "border-[#ff5c00]/70 bg-[rgba(255,92,0,0.05)]"
                        : "border-[#26344a]",
                    )}
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(168,196,212,0.03) 0%, rgba(11,16,29,0.9) 100%)",
                    }}
                  >
                    {/* ASCII corner glyphs */}
                    <span
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute -top-[1px] -left-[1px] font-mono text-[14px] leading-none transition-colors duration-300",
                        selected === p.id
                          ? "text-[#ff5c00]"
                          : "text-[#5d7187] group-hover:text-[#ff5c00]/70",
                      )}
                    >
                      ┌
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute -top-[1px] -right-[1px] font-mono text-[14px] leading-none transition-colors duration-300",
                        selected === p.id
                          ? "text-[#ff5c00]"
                          : "text-[#5d7187] group-hover:text-[#ff5c00]/70",
                      )}
                    >
                      ┐
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute -bottom-[1px] -left-[1px] font-mono text-[14px] leading-none transition-colors duration-300",
                        selected === p.id
                          ? "text-[#ff5c00]"
                          : "text-[#5d7187] group-hover:text-[#ff5c00]/70",
                      )}
                    >
                      └
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute -bottom-[1px] -right-[1px] font-mono text-[14px] leading-none transition-colors duration-300",
                        selected === p.id
                          ? "text-[#ff5c00]"
                          : "text-[#5d7187] group-hover:text-[#ff5c00]/70",
                      )}
                    >
                      ┘
                    </span>

                    {/* Header row */}
                    <div className="flex items-baseline gap-2 border-b border-[#26344a] pb-3 mb-3">
                      <span className="text-[15px] font-bold text-[#ff5c00]">
                        {p.num}
                      </span>
                      <h3 className="min-w-0 flex-1 truncate text-[15px] font-bold uppercase tracking-[0.08em] text-[#f2eee2]">
                        {selected === p.id && (
                          <span className="text-[#ff5c00]">▸ </span>
                        )}
                        {p.title}
                      </h3>
                      <span
                        className={cn(
                          "whitespace-nowrap border px-2 py-1 text-[9px] tracking-[0.12em]",
                          STATUS_META[p.status].chip,
                        )}
                      >
                        {p.status}
                      </span>
                    </div>

                    {/* Body rows */}
                    <div className="flex flex-1 flex-col gap-2">
                      <p className="m-0 text-[12px] leading-[1.7]">
                        <span className="text-[#7a8ca1]">$</span>{" "}
                        <span className="text-[#93a6b8]">DESC</span>{" "}
                        <span className="text-[#ff5c00]">&gt;</span>{" "}
                        <span className="text-[#c6d3df]">
                          {p.desc || "[ ---- DATI_IN_CODA ---- ]"}
                        </span>
                      </p>
                      <p className="m-0 text-[12px] leading-[1.7]">
                        <span className="text-[#7a8ca1]">$</span>{" "}
                        <span className="text-[#93a6b8]">TAGS</span>{" "}
                        <span className="text-[#ff5c00]">&gt;</span>{" "}
                        {p.tags.length > 0 ? (
                          p.tags.map((t) => (
                            <span key={t} className="text-[#a5b6c9]">
                              [{t}]
                            </span>
                          ))
                        ) : (
                          <span className="text-[#7a8ca1]">[EMPTY]</span>
                        )}
                      </p>
                      <ASCIIProgressBar p={p} />
                    </div>

                    {/* Footer row */}
                    <div className="mt-3 flex items-center justify-between border-t border-[#26344a] pt-3 text-[11px]">
                      <span className="text-[#7a8ca1] tracking-[0.12em]">
                        {p.missionId}
                      </span>
                      <span
                        className={cn(
                          "font-bold tracking-[0.1em] transition-colors duration-300",
                          selected === p.id
                            ? "text-[#10b981]"
                            : "text-[#ff5c00] group-hover:underline",
                        )}
                      >
                        {selected === p.id ? "[ OPENED ]" : "OPEN ▸"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Console echo line */}
              <div className="md:col-span-2 flex items-center gap-2 font-mono text-[12px] text-[#93a6b8] mt-1">
                <span className="text-[#ff5c00]">&gt;</span>
                <span ref={echoRef}>
                  TREE_VIEW // {PROJECTS.length} ENTRIES
                </span>
              </div>
            </div>
          </Terminal>

          {/* Footer */}
          <div
            ref={footerRef}
            className="mt-10 border-t border-line pt-6 font-mono text-[11px] text-ice-dim"
            style={{ opacity: 0 }}
          >
            <p>
              <span className="text-orange">&gt;</span> ROSTER in
              aggiornamento: nuovi deployment in fase di catalogazione.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}