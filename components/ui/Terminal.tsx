"use client";

import { forwardRef, useImperativeHandle, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import CrtSweep from "@/components/ui/CrtSweep";

export type TerminalLine = {
  id: string;
  cmd: string;
  res?: string;
  color?: string;
  module?: boolean;
  ready?: boolean;
};

export type TerminalHandle = {
  box: () => HTMLDivElement | null;
  status: () => HTMLSpanElement | null;
  cursor: () => HTMLSpanElement | null;
  layer: () => HTMLDivElement | null;
  prompts: () => (HTMLSpanElement | null)[];
  chars: () => (HTMLSpanElement | null)[][];
  res: () => (HTMLSpanElement | null)[];
};

type TerminalProps = {
  title: string;
  version?: string;
  status?: string;
  statusColor?: string;
  lines: TerminalLine[];
  children?: ReactNode;
  className?: string;
};

// Riferimenti DOM di una riga, usati dalla timeline per digitarla e cancellarla
type Row = {
  prompt: HTMLSpanElement | null;
  chars: (HTMLSpanElement | null)[];
  res: HTMLSpanElement | null;
};

const Terminal = forwardRef<TerminalHandle, TerminalProps>(function Terminal(
  {
    title,
    version = "V.24.1",
    status = "STANDBY",
    statusColor = "var(--steel)",
    lines,
    children,
    className,
  },
  ref,
) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const statusRef = useRef<HTMLSpanElement | null>(null);
  const cursorRef = useRef<HTMLSpanElement | null>(null);
  const layerRef = useRef<HTMLDivElement | null>(null);
  const rowsRef = useRef<Row[]>(
    lines.map(() => ({ prompt: null, chars: [], res: null })),
  );

  // Il terminale non anima nulla da solo: espone i nodi e li guida projects.tsx
  useImperativeHandle(
    ref,
    () => ({
      box: () => boxRef.current,
      status: () => statusRef.current,
      cursor: () => cursorRef.current,
      layer: () => layerRef.current,
      prompts: () => rowsRef.current.map((r) => r.prompt),
      chars: () => rowsRef.current.map((r) => r.chars),
      res: () => rowsRef.current.map((r) => r.res),
    }),
    [],
  );

  return (
    <div
      ref={boxRef}
      className={cn(
        "bg-panel border border-panel-line rounded-xs w-full relative overflow-hidden",
        className,
      )}
      // Niente will-change: sotto un layer promosso i glifi verrebbero riscalati
      // come bitmap, quindi sfocati per tutta l'animazione.
      //
      // E nessuna opacity di partenza: senza JS — o sotto reduced-motion, dove
      // la timeline non gira — il terminale deve essere già leggibile.
      // projects.tsx lo nasconde solo quando sa che lo riaccenderà.
      style={{ transformOrigin: "top center" }}
    >
      {/* Texture CRT + fascio di dati, entrambi overlay decorativi.
          La texture riusa .crt-scanline invece di ripetere il gradient. */}
      <div
        aria-hidden
        className="crt-scanline pointer-events-none absolute inset-0 opacity-60"
      />
      <CrtSweep />

      {/* Header: pallini, titolo, stato live */}
      <div className="relative border-b border-panel-line px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex gap-1.5 shrink-0">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`size-2.5 rounded-full ${i === 0 ? "bg-orange" : "bg-steel"}`}
              />
            ))}
          </div>
          <p className="font-mono text-[11px] text-ink-title ml-2 whitespace-nowrap overflow-hidden tracking-[0.14em]">
            {title}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span
            ref={statusRef}
            className="font-mono text-[11px] tracking-[0.2em]"
            style={{ color: statusColor }}
          >
            {status}
          </span>
          <p className="font-mono text-[10px] text-orange">{version}</p>
        </div>
      </div>

      {/* Terminal body */}
      <div className="relative">
        {/* Le card definiscono l'altezza naturale del terminale */}
<div className="relative z-10 p-5">{children}</div>

        {/* Righe digitate: overlay assoluto sulle card, pilotato da fuori.
            `terminal-lines` le nasconde sotto reduced-motion, quando nessuna
            timeline le accende e resterebbero sovrapposte alle card. */}
        <div
          ref={layerRef}
          className="terminal-lines absolute inset-0 z-20 pointer-events-none flex flex-col gap-2.5 px-5 pt-5 pb-5"
        >
          {lines.map((line, i) => (
            <div key={line.id} className="flex items-center gap-2.5">
              <span
                ref={(el) => {
                  rowsRef.current[i].prompt = el;
                }}
                className={cn(
                  "font-mono text-[13px] shrink-0",
                  line.ready ? "text-orange font-bold" : "text-ink-dim",
                )}
              >
                {line.module ? "│" : ">"}
              </span>
              <span
                className={cn(
                  "font-mono text-[13px] flex-1 overflow-hidden whitespace-pre",
                  line.ready
                    ? "text-orange font-bold"
                    : line.module
                      ? "text-ink-module"
                      : "text-ink-plain",
                )}
              >
                {/* Un span per carattere: la timeline li accende uno a uno */}
                {line.cmd.split("").map((c, j) => (
                  <span
                    key={j}
                    ref={(el) => {
                      // Anche il cleanup riceve null: senza questo i nodi staccati
                      // resterebbero referenziati in rowsRef.
                      rowsRef.current[i].chars[j] = el;
                    }}
                  >
                    {c}
                  </span>
                ))}
              </span>
              {line.ready ? (
                <span
                  ref={cursorRef}
                  className="inline-block w-2.25 h-4 bg-orange shrink-0"
                />
              ) : line.res ? (
                <span
                  ref={(el) => {
                    rowsRef.current[i].res = el;
                  }}
                  className="font-mono font-bold text-[13px] whitespace-nowrap"
                  style={{ color: line.color ?? "var(--steel)" }}
                >
                  {line.res}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default Terminal;
