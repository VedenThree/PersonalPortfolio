"use client";

import { useEffect, useRef } from "react";
import { animate, createTimeline, stagger } from "animejs";
import { PROJECTS } from "@/components/sections/projects";

const MODULE_COLOR: Record<string, string> = {
  DEPLOYED: "#10b981",
  STANDBY: "#38bdf8",
  IDEA: "#64748b",
};

type Row = {
  id: string;
  module?: boolean;
  cmd: string;
  res: string;
  color: string;
};

const ROWS: Row[] = [
  { id: "boot", cmd: "INIT_BOOT", res: "OK", color: "#10b981" },
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
    color: MODULE_COLOR[p.status] ?? "#64748b",
  })),
  { id: "net", cmd: "NET_STATUS", res: "ONLINE", color: "#10b981" },
  { id: "firewall", cmd: "FIREWALL", res: "ACTIVE", color: "#ff5c00" },
  { id: "clearance", cmd: "CLEARANCE_LVL", res: "VERIFIED", color: "#10b981" },
  {
    id: "engine",
    cmd: "ENGINE_STATUS",
    res: "READY // FULL-STACK",
    color: "#10b981",
  },
  {
    id: "latency",
    cmd: "LATENCY",
    res: "14ms [OTTIMIZZATO]",
    color: "#ff5c00",
  },
];

const TITLE = "TERMINAL_SYS // BOOT_SEQUENCE";

const notNull = <T,>(x: T | null): x is T => x !== null;

export default function HeroTerminal() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const scanRef = useRef<HTMLSpanElement | null>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const titleCharRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const promptRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const charRowsRef = useRef<(HTMLSpanElement | null)[][]>([]);
  const resRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const readyPromptRef = useRef<HTMLSpanElement | null>(null);
  const readyCharRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const cursorRef = useRef<HTMLSpanElement | null>(null);

  function revealAllRefs(tl: ReturnType<typeof createTimeline>) {
    tl.add(dotRefs.current.filter(notNull), {
      opacity: [0, 1],
      scale: [0.4, 1],
      duration: 220,
      delay: stagger(90),
    })
      .add(
        titleCharRefs.current.filter(notNull),
        { opacity: [0, 1], duration: 180, delay: stagger(14), ease: "linear" },
        "-=120",
      );

    ROWS.forEach((_, i) => {
      const prompt = promptRefs.current[i]!;
      const chars = (charRowsRef.current[i] || []).filter(notNull);
      const res = resRefs.current[i]!;
      tl.add(prompt, { opacity: [0, 1], duration: 70, ease: "linear" })
        .add(chars, {
          opacity: [0, 1],
          duration: 240,
          delay: stagger(24),
          ease: "linear",
        })
        .add(res, {
          opacity: [0, 1],
          scale: [0.7, 1],
          duration: 280,
          ease: "back.out(2)",
        });
    });

    tl.add(readyPromptRef.current!, { opacity: [0, 1], duration: 70 })
      .add(
        readyCharRefs.current.filter(notNull),
        { opacity: [0, 1], duration: 240, delay: stagger(70), ease: "linear" },
      )
      .add(cursorRef.current!, {
        opacity: [0, 1],
        scale: [0.5, 1],
        duration: 220,
      });
  }

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const revealAll = (els: (HTMLSpanElement | null)[]) =>
      els.forEach((el) => {
        if (el) el.style.opacity = "1";
      });

    if (reduced) {
      root.style.opacity = "1";
      root.style.transform = "none";
      revealAll(dotRefs.current);
      revealAll(titleCharRefs.current);
      revealAll(promptRefs.current);
      charRowsRef.current.forEach(revealAll);
      revealAll(resRefs.current);
      revealAll([readyPromptRef.current]);
      revealAll(readyCharRefs.current);
      revealAll([cursorRef.current]);
      return;
    }

    const tl = createTimeline({ defaults: { ease: "outExpo" } });

    tl.add(root, { opacity: [0, 1], translateY: [14, 0], duration: 480 });

    const loops: Array<{ revert: () => void }> = [];

    const bootDone = () => {
      loops.push(
        animate(dotRefs.current.filter(notNull), {
          opacity: [0.35, 0.9],
          duration: 1900,
          delay: stagger(420),
          ease: "inOutSine",
          loop: true,
          alternate: true,
        }),
        animate(cursorRef.current!, {
          opacity: [0.15, 1],
          duration: 640,
          ease: "steps(1)",
          loop: true,
          alternate: true,
        }),
      );
      if (scanRef.current) {
        loops.push(
          animate(scanRef.current, {
            translateX: ["-160%", "560%"],
            duration: 3400,
            ease: "inOutSine",
            loop: true,
          }),
        );
      }
    };

    revealAllRefs(tl);
    tl.call(bootDone);
    tl.play();

    return () => {
      loops.forEach((a) => a.revert());
      tl.revert();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="bg-[#0b101d5d] border border-[#1b2438] rounded-[2px] w-full relative overflow-hidden"
      style={{ opacity: 0 }}
    >
      {/* CRT scanline texture */}
      <div className="crt-scanline absolute inset-0 pointer-events-none opacity-60" />
      {/* Ambient data sweep */}
      <span
        ref={scanRef}
        aria-hidden
        style={{ opacity: 0.05, willChange: "transform" }}
        className="pointer-events-none absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-transparent via-[#ff5c00] to-transparent"
      />

      {/* Terminal header bar */}
      <div className="relative border-b border-[#1b2438] px-4 py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex gap-1.5 shrink-0">
            <span
              ref={(el) => {
                dotRefs.current[0] = el;
              }}
              className="size-[8px] rounded-full bg-[#ff5c00]"
              style={{ opacity: 0 }}
            />
            <span
              ref={(el) => {
                dotRefs.current[1] = el;
              }}
              className="size-[8px] rounded-full bg-[#64748b]"
              style={{ opacity: 0 }}
            />
            <span
              ref={(el) => {
                dotRefs.current[2] = el;
              }}
              className="size-[8px] rounded-full bg-[#64748b]"
              style={{ opacity: 0 }}
            />
          </div>
          <p className="font-mono text-[9px] text-[#64748b] ml-2 whitespace-nowrap overflow-hidden">
            {TITLE.split("").map((c, i) => (
              <span
                key={i}
                ref={(el) => {
                  titleCharRefs.current[i] = el;
                }}
                style={{ opacity: 0 }}
              >
                {c}
              </span>
            ))}
          </p>
        </div>
        <p className="font-mono text-[9px] text-[#ff5c00] shrink-0">
          V.24.1
        </p>
      </div>

      {/* Lines */}
      <div className="relative px-4 py-3 flex flex-col gap-1.5">
        {ROWS.map(({ id, module, cmd, res, color }, i) => (
          <div key={id} className="flex items-center gap-2.5">
            <span
              ref={(el) => {
                promptRefs.current[i] = el;
              }}
              className="font-mono text-[10px] text-[#4b5a69] shrink-0"
              style={{ opacity: 0 }}
            >
              {module ? "│" : ">"}
            </span>
            <span
              className={`font-mono text-[10px] flex-1 truncate ${
                module ? "text-[#5a6b7e]" : "text-[#64748b]"
              }`}
              style={{ whiteSpace: "pre" }}
            >
              {cmd.split("").map((c, j) => (
                <span
                  key={j}
                  ref={(el) => {
                    if (!el) return;
                    charRowsRef.current[i] = charRowsRef.current[i] || [];
                    charRowsRef.current[i][j] = el;
                  }}
                  style={{ opacity: 0 }}
                >
                  {c}
                </span>
              ))}
            </span>
            <span
              ref={(el) => {
                resRefs.current[i] = el;
              }}
              className="font-mono font-bold text-[10px] whitespace-nowrap"
              style={{ color, opacity: 0 }}
            >
              {res}
            </span>
          </div>
        ))}

        {/* Ready line */}
        <div className="flex items-center gap-2.5 mt-1">
          <span
            ref={readyPromptRef}
            className="font-mono text-[10px] text-[#ff5c00] shrink-0"
            style={{ opacity: 0 }}
          >
            &gt;
          </span>
          <span
            className="font-mono font-bold text-[10px] text-[#ff5c00]"
            style={{ whiteSpace: "pre" }}
          >
            {Array.from("READY_").map((c, j) => (
              <span
                key={j}
                ref={(el) => {
                  readyCharRefs.current[j] = el;
                }}
                style={{ opacity: 0 }}
              >
                {c}
              </span>
            ))}
          </span>
          <span
            ref={cursorRef}
            className="inline-block w-[7px] h-[12px] bg-[#ff5c00]"
            style={{ opacity: 0 }}
          />
        </div>
      </div>
    </div>
  );
}