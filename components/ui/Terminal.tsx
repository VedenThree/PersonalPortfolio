"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ReactNode,
} from "react";
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

const Terminal = forwardRef<TerminalHandle, TerminalProps>(function Terminal(
  {
    title,
    version = "V.24.1",
    status = "STANDBY",
    statusColor = "#64748b",
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
  const rowsRef = useRef<
    {
      prompt: HTMLSpanElement | null;
      chars: (HTMLSpanElement | null)[];
      res: HTMLSpanElement | null;
    }[]
  >(lines.map(() => ({ prompt: null, chars: [], res: null })));

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
        "bg-[#0b101d] border border-[#1b2438] rounded-[2px] w-full relative overflow-hidden",
        className,
      )}
      // Niente will-change: transform. Il box viene scalato dalla timeline, e
      // su un layer promosso il browser rasterizza i glifi una volta sola e poi
      // li riscala come bitmap: il testo resta sfocato per tutta l'animazione
      // (e anche dopo, sulle card). Senza layer, Chrome ridisegna alla scala
      // reale a ogni frame.
      style={{
        opacity: 0,
        transformOrigin: "top center",
      }}
    >
      {/* CRT scanline texture */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(127,160,184,0.03) 2px, rgba(127,160,184,0.03) 4px)",
          opacity: 0.6,
          zIndex: 1,
        }}
      />
      {/* Ambient data sweep */}
      <CrtSweep />

      {/* Terminal header bar */}
      <div className="relative border-b border-[#1b2438] px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex gap-1.5 shrink-0">
            <span className="size-[10px] rounded-full bg-[#ff5c00]" />
            <span className="size-[10px] rounded-full bg-[#64748b]" />
            <span className="size-[10px] rounded-full bg-[#64748b]" />
          </div>
          <p className="font-mono text-[11px] text-[#7d90a5] ml-2 whitespace-nowrap overflow-hidden tracking-[0.14em]">
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
          <p className="font-mono text-[10px] text-[#ff5c00]">{version}</p>
        </div>
      </div>

      {/* Terminal body */}
      <div className="relative">
        {/* Content layer (cards) — defines the natural height */}
        <div className="relative z-10 p-5">{children}</div>

        {/* Typed lines layer */}
        <div
          ref={layerRef}
          className="absolute inset-0 z-20 pointer-events-none flex flex-col gap-2.5 px-5 pt-5 pb-5"
        >
          {lines.map((line, i) => (
            <div key={line.id} className="flex items-center gap-2.5">
              <span
                ref={(el) => {
                  rowsRef.current[i].prompt = el;
                }}
                className={cn(
                  "font-mono text-[13px] shrink-0",
                  line.ready ? "text-[#ff5c00] font-bold" : "text-[#7a8ca1]",
                )}
                style={{ opacity: 0 }}
              >
                {line.ready ? ">" : line.module ? "│" : ">"}
              </span>
              <span
                className={cn(
                  "font-mono text-[13px] flex-1 overflow-hidden whitespace-nowrap",
                  line.ready
                    ? "text-[#ff5c00] font-bold"
                    : line.module
                      ? "text-[#8497ab]"
                      : "text-[#b9c7d6]",
                )}
                style={{ whiteSpace: "pre" }}
              >
                {line.cmd.split("").map((c, j) => (
                  <span
                    key={j}
                    ref={(el) => {
                      if (el) rowsRef.current[i].chars[j] = el;
                    }}
                    style={{ opacity: 0 }}
                  >
                    {c}
                  </span>
                ))}
              </span>
              {line.ready ? (
                <span
                  ref={cursorRef}
                  className="inline-block w-[9px] h-[16px] bg-[#ff5c00] shrink-0"
                  style={{ opacity: 0 }}
                />
              ) : line.res ? (
                <span
                  ref={(el) => {
                    rowsRef.current[i].res = el;
                  }}
                  className="font-mono font-bold text-[13px] whitespace-nowrap"
                  style={{ color: line.color ?? "#64748b", opacity: 0 }}
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