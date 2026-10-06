"use client";

import { useEffect, useRef, useState } from "react";
import { animate, createTimeline, onScroll, stagger } from "animejs";
import Terminal, {
  type TerminalHandle,
  type TerminalLine,
} from "@/components/ui/Terminal";
import {
  PROJECTS,
  STATUS_META,
  VISIBLE_PROJECTS,
  moduleName,
  projectNum,
  type Project,
} from "@/lib/projects-data";
import { createProjectsTour } from "@/lib/projects-tour";
import { SECTION_EVENTS, onSectionEvent } from "@/lib/section-nav";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { createWriter } from "@/lib/write-if-changed";
import { cn } from "@/lib/utils";

const HOLD_START = 0.65;

const LINES: TerminalLine[] = [
  { id: "init", cmd: "INIT DEPLOY_PIPELINE", res: "OK", color: "var(--green)" },
  {
    id: "modules",
    cmd: `LOAD_MODULES [${VISIBLE_PROJECTS.length}/${PROJECTS.length}]`,
    res: "COMPLETE",
    color: "var(--green)",
  },
  ...VISIBLE_PROJECTS.map((p) => ({
    id: `module-${p.id}`,
    module: true,
    cmd: moduleName(p.title),
    res: p.status,
    color: STATUS_META[p.status].hex,
  })),
  { id: "net", cmd: "NET_STATUS", res: "ONLINE", color: "var(--green)" },
  {
    id: "clearance",
    cmd: "CLEARANCE_LVL",
    res: "VERIFIED",
    color: "var(--green)",
  },
  { id: "render", cmd: "RENDER_MODE", res: "ASCII", color: "var(--orange)" },
  { id: "ready", ready: true, cmd: "PROJECTS // ONLINE" },
];

const CORNERS = [
  { glyph: "┌", pos: "-top-[1px] -left-[1px]" },
  { glyph: "┐", pos: "-top-[1px] -right-[1px]" },
  { glyph: "└", pos: "-bottom-[1px] -left-[1px]" },
  { glyph: "┘", pos: "-bottom-[1px] -right-[1px]" },
] as const;

const notNull = <T,>(x: T | null): x is T => x !== null;

function PromptHead({ label }: { label: string }) {
  return (
    <>
      <span className="text-ink-dim">$</span>{" "}
      <span className="text-ink-mid">{label}</span>{" "}
      <span className="text-orange">&gt;</span>{" "}
    </>
  );
}

function ASCIIProgressBar({ p }: { p: Project }) {
  const meta = STATUS_META[p.status];
  const cells = Array.from({ length: 12 }, (_, i) =>
    i < Math.round((p.completion / 100) * 12) ? "█" : "░",
  );
  return (
    <p className="m-0 text-[13px] leading-[1.7]">
      <PromptHead label="PROG" />
      <span className="text-ink-dim">[</span>
      {cells.map((c, i) => (
        <span
          key={i}
          style={{
            color: c === "█" ? meta.hex : "var(--panel-cell)",
          }}
        >
          {c}
        </span>
      ))}
      <span className="text-ink-dim">]</span>{" "}
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
  const reduced = usePrefersReducedMotion();

  const handleSelect = (p: Project) => {
    const nowSelected = selected !== p.id;
    setSelected(nowSelected ? p.id : null);
    if (echoRef.current) {
      echoRef.current.textContent = `$ ${
        nowSelected ? "open" : "close"
      } ${p.missionId.toLowerCase()} // ${moduleName(p.title)} [OK]`;
    }
  };

  useEffect(() => {
    // Sotto reduced-motion la sezione resta com'è nel markup: niente pista da
    // 200vh, niente sticky, niente timeline. Le card sono già visibili perché
    // nessuno le ha più nascoste con opacity: 0 (vedi H3 in REVIEW.md).
    if (reduced) return;

    const runway = runwayRef.current;
    const h = terminalRef.current;
    if (!runway || !h) return;

    const mq = window.matchMedia("(min-width: 768px)");
    let pinned = false;
    const setPinned = (v: boolean) => {
      pinned = v;
      runway.style.height = v ? "200vh" : "auto";
    };
    setPinned(mq.matches);

    // Auto-play tour (navbar "Progetti"): scorre la runway così che
    // onScroll piloti la timeline fino alla fine (card visibili).
    let observer: ReturnType<typeof onScroll> | null = null;
    let tlDuration = 0;

    const tour = createProjectsTour({
      runway,
      getObserver: () => observer,
      isPinned: () => pinned,
      getTimelineDuration: () => tlDuration,
    });

    const onPlayProjects = () => {
      if (!pinned) {
        document
          .getElementById("lavori")
          ?.scrollIntoView({ behavior: "smooth" });
        return;
      }
      tour.start();
    };
    const offNavEvent = onSectionEvent(
      SECTION_EVENTS.playProjects,
      onPlayProjects,
    );

    const box = h.box();
    if (!box) {
      tour.destroy();
      offNavEvent();
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
      duration: U * 0.3,
      ease: "inOutExpo",
    });

    // 3b. SOSTA: terminale massimizzato con le parole visibili. Dead-time
    // accorciato: sullo scroll ci si ferma a leggere senza bruciare corsa.
    tl.add(box, { opacity: [1, 1], duration: U * 0.7 });

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
    const grid = gridRef.current;
    if (grid) {
      tl.add(grid, {
        opacity: [0, 1],
        duration: U * 0.05,
        ease: "linear",
      });
    }
    tl.add(cardRefs.current.filter(notNull), {
      opacity: [0, 1],
      translateY: [16, 0],
      duration: U * 0.16,
      delay: stagger(70),
    });

    // 6. Footer
    const footer = footerRef.current;
    if (footer) {
      tl.add(footer, {
        opacity: [0, 1],
        translateY: [6, 0],
        duration: U * 0.07,
      });
    }

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
    // Il fascio overlay è gestito da <CrtSweep /> dentro Terminal.

    // Scroll observer di anime.js: lega la timeline allo scrolling.
    // onUpdate gira a ogni frame di scroll: `write` evita di riassegnare
    // le stesse stringhe quando nulla è cambiato.
    const write = createWriter();

    tl.pause();
    // seek(0) esplicito: senza, il primo render della timeline pausata potrebbe
    // arrivare dopo il primo scroll e mostrare per un frame il terminale già
    //digitato. Da qui in poi i valori di partenza sono quelli delle animazioni.
    tl.seek(0);
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

        const cleared = t >= clearEnd;

        const sync = syncRef.current;
        const syncText = `SYNC_${String(
          Math.round(self.progress * 100),
        ).padStart(2, "0")}%`;
        if (sync) {
          write("sync", syncText, () => {
            sync.textContent = syncText;
          });
        }

        const statusEl = h.status();
        if (statusEl) {
          const text = cleared ? "DEPLOYED" : "STANDBY";
          write("status", text, () => {
            statusEl.textContent = text;
          });
          const color = cleared ? "var(--green)" : "var(--steel)";
          write("statusColor", color, () => {
            statusEl.style.color = color;
          });
        }

        const layerEl = h.layer();
        if (layerEl) {
          // Dopo il clear le righe digitate sono a opacity 0 ma ancora in
          // DOM: nascondile davvero, altrimenti restano "fantasma".
          const visibility = cleared ? "hidden" : "visible";
          write("visibility", visibility, () => {
            layerEl.style.visibility = visibility;
          });
        }

        const gridEl = gridRef.current;
        if (gridEl) {
          const pe = cleared ? "auto" : "none";
          write("pointerEvents", pe, () => {
            gridEl.style.pointerEvents = pe;
          });
        }
      },
    });

    const onMqChange = (e: MediaQueryListEvent) => {
      tour.stop();
      setPinned(e.matches);
      observer?.refresh();
    };
    mq.addEventListener("change", onMqChange);

    return () => {
      observer?.revert();
      tl.revert();
      loops.forEach((a) => a.revert());
      mq.removeEventListener("change", onMqChange);
      tour.destroy();
      offNavEvent();
    };
  }, [reduced]);

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
            statusColor="var(--steel)"
            lines={LINES}
          >
            <div
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6"
            >
              {VISIBLE_PROJECTS.map((p, i) => (
                <div
                  key={p.id}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  // Niente will-change: il terminale è scalato dalla timeline, e
                  // un layer promosso sotto un antenato scalato viene riscalato
                  // come bitmap → testo sgranato. Il reveal (opacity + translateY,
                  // ~0.16U) si ridisegna senza problemi.
                  className="h-full"
                >
                  <button
                    type="button"
                    aria-pressed={selected === p.id}
                    aria-label={`Apri progetto ${p.title}`}
                    onClick={() => handleSelect(p)}
                    className={cn(
                      "group relative flex h-full w-full cursor-pointer select-none flex-col border p-5 text-left font-mono transition-colors duration-300",
                      "hover:border-orange/40 active:translate-y-[1px]",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange focus-visible:outline-offset-2",
                      "rounded-[2px]",
                      selected === p.id
                        ? "border-orange/70 bg-orange/5"
                        : "border-panel-rule",
                    )}
                    style={{
                      background:
                        "linear-gradient(135deg, color-mix(in srgb, var(--ice) 6%, transparent) 0%, color-mix(in srgb, var(--panel-card) 94%, transparent) 100%)",
                    }}
                  >
                    {/* ASCII corner glyphs */}
                    {CORNERS.map(({ glyph, pos }) => (
                      <span
                        key={glyph}
                        aria-hidden
                        className={cn(
                          `pointer-events-none absolute font-mono text-[14px] leading-none transition-colors duration-300 ${pos}`,
                          selected === p.id
                            ? "text-orange"
                            : "text-ink-faint group-hover:text-orange/70",
                        )}
                      >
                        {glyph}
                      </span>
                    ))}

                    {/* Header row */}
                    <div className="flex items-baseline gap-2 border-b border-panel-rule pb-3 mb-3">
                      <span className="text-[15px] font-bold text-orange">
                        {projectNum(p)}
                      </span>
                      <h3 className="font-display min-w-0 flex-1 truncate text-[15px] font-bold uppercase tracking-[0.08em] text-paper-bright">
                        {selected === p.id && (
                          <span className="text-orange">▸ </span>
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
                      <p className="m-0 text-[13px] leading-[1.7]">
                        <PromptHead label="DESC" />
                        <span className="text-ink-value">
                          {p.desc || "[ ---- DATI_IN_CODA ---- ]"}
                        </span>
                      </p>
                      <p className="m-0 text-[13px] leading-[1.7]">
                        <PromptHead label="TAGS" />
                        {p.tags.length > 0 ? (
                          p.tags.map((t) => (
                            <span key={t} className="text-ink-tag">
                              [{t}]
                            </span>
                          ))
                        ) : (
                          <span className="text-ink-dim">[EMPTY]</span>
                        )}
                      </p>
                      <ASCIIProgressBar p={p} />
                    </div>

                    {/* Footer row */}
                    <div className="mt-3 flex items-center justify-between border-t border-panel-rule pt-3 text-[11px]">
                      <span className="text-ink-dim tracking-[0.12em]">
                        {p.missionId}
                      </span>
                      <span
                        className={cn(
                          "font-bold tracking-[0.1em] transition-colors duration-300",
                          selected === p.id
                            ? "text-green"
                            : "text-orange group-hover:underline",
                        )}
                      >
                        {selected === p.id ? "[ OPENED ]" : "OPEN ▸"}
                      </span>
                    </div>
                  </button>
                </div>
              ))}

              {/* Console echo line */}
              <div className="md:col-span-2 flex items-center gap-2 font-mono text-[12px] text-ink-mid mt-1">
                <span className="text-orange">&gt;</span>
                <span ref={echoRef}>
                  TREE_VIEW // {VISIBLE_PROJECTS.length} ENTRIES
                </span>
              </div>
            </div>
          </Terminal>

          {/* Footer */}
          <div
            ref={footerRef}
            className="mt-10 border-t border-line pt-6 font-mono text-[11px] text-ice-dim"
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