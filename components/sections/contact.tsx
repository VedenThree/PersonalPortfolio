"use client";

import Reveal from "@/components/animations/reveal";
import CrtSweep from "@/components/ui/CrtSweep";

const DETAILS = [
  {
    prompt: "CHANNEL_EMAIL",
    value: "marco.rossi@proton.me",
    res: "OK",
    color: "#10b981",
  },
  {
    prompt: "BASE_GEO",
    value: "Italia · CET / UTC+1",
    res: "LOCAL",
    color: "#7fa0b8",
  },
  {
    prompt: "COORDINATES",
    value: "46.2074° N · 9.0200° E",
    res: "REMOTE",
    color: "#7fa0b8",
  },
];

const FIELDS = [
  { label: "NOME_OPERATIVO", placeholder: "Alex Rossi", type: "text" },
  { label: "CANALE_EMAIL", placeholder: "alex@example.com", type: "email" },
];

export default function Contact() {
  return (
    <Reveal delay={200}>
      <section id="contatti" className="py-24 border-t border-line">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-start">
          {/* Colonnna sinistra: richiamo + riepilogo sistema */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-ice-dim uppercase mb-3">
              05 · Contatti
            </p>
            <h2 className="font-display font-extrabold text-[clamp(34px,5vw,54px)] uppercase text-paper leading-[0.95] mb-5 tracking-[-0.01em]">
              Inizia la
              <br />
              <span className="text-orange">Missione</span>
            </h2>
            <p className="font-sans text-[16px] text-paper-dim leading-[1.8] max-w-[440px] mb-8">
              Hai un progetto da sviluppare? Cerchi un developer affidabile per
              il tuo team? Invia un messaggio: rispondo entro 24 ore in orario
              CET.
            </p>

            {/* Console di riepilogo canale */}
            <div className="border border-[#1b2438] rounded bg-[#0b101d] relative overflow-hidden">
              <div className="crt-scanline absolute inset-0 pointer-events-none opacity-50" />
              <CrtSweep />
              <div className="relative border-b border-[#1b2438] px-4 py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex gap-1.5 shrink-0">
                    <span className="size-[9px] rounded-full bg-[#ff5c00]" />
                    <span className="size-[9px] rounded-full bg-[#64748b]" />
                    <span className="size-[9px] rounded-full bg-[#64748b]" />
                  </div>
                  <p className="font-mono text-[10px] text-[#7d90a5] tracking-[0.14em] whitespace-nowrap overflow-hidden">
                    SYS // CONTATTI
                  </p>
                </div>
                <span className="font-mono text-[10px] tracking-[0.2em] text-[#10b981] shrink-0">
                  ONLINE
                </span>
              </div>
              <div className="relative px-4 py-4 flex flex-col gap-2.5">
                {DETAILS.map((d) => (
                  <p key={d.prompt} className="m-0 text-[12px] leading-[1.9]">
                    <span className="text-[#7a8ca1]">$</span>{" "}
                    <span className="text-[#93a6b8]">{d.prompt}</span>{" "}
                    <span className="text-[#ff5c00]">&gt;</span>{" "}
                    <span className="text-[#c6d3df]">{d.value}</span>{" "}
                    <span className="font-bold" style={{ color: d.color }}>
                      [{d.res}]
                    </span>
                  </p>
                ))}
                <p className="m-0 mt-2 border-t border-[#1b2438] pt-2.5 text-[11px] tracking-[0.1em] text-[#5d7187]">
                  ENCRYPTION · TLS 1.3 // END-TO-END
                </p>
              </div>
            </div>
          </div>

          {/* Colonna destra: console di trasmissione */}
          <div className="border border-[#26344a] rounded p-6 md:p-8 bg-surface/60 relative">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-[1px] -left-[1px] font-mono text-[14px] leading-none text-[#5d7187]"
            >
              ┌
            </span>
            <span
              aria-hidden
              className="pointer-events-none absolute -top-[1px] -right-[1px] font-mono text-[14px] leading-none text-[#5d7187]"
            >
              ┐
            </span>
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-[1px] -left-[1px] font-mono text-[14px] leading-none text-[#5d7187]"
            >
              └
            </span>
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-[1px] -right-[1px] font-mono text-[14px] leading-none text-[#5d7187]"
            >
              ┘
            </span>

            <p className="font-mono text-[10px] text-orange tracking-[2.22px] uppercase mb-5">
              {"// TRASMETTI MESSAGGIO"}
            </p>
            <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
              {FIELDS.map(({ label, placeholder, type }) => (
                <div key={label}>
                  <p className="font-mono text-[9.6px] text-[#93a6b8] tracking-[1.34px] uppercase mb-1.5">
                    [{label}]
                  </p>
                  <input
                    type={type}
                    placeholder={placeholder}
                    className="w-full bg-[rgba(6,6,15,0.85)] border border-[#1b2438] px-3.5 py-2.5 font-mono text-[14px] text-paper placeholder:text-ice/25 outline-none focus:border-[#ff5c00]/60 transition-colors"
                  />
                </div>
              ))}
              <div>
                <p className="font-mono text-[9.6px] text-[#93a6b8] tracking-[1.34px] uppercase mb-1.5">
                  [MESSAGGIO]
                </p>
                <textarea
                  placeholder="Descrivi il progetto o la collaborazione..."
                  rows={5}
                  className="w-full bg-[rgba(6,6,15,0.85)] border border-[#1b2438] px-3.5 py-2.5 font-mono text-[14px] text-paper placeholder:text-ice/25 outline-none focus:border-[#ff5c00]/60 transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="group inline-flex items-center justify-center gap-2.5 border border-orange font-mono text-[12px] px-[26px] py-3.5 text-orange transition-all duration-200 hover:bg-orange hover:text-ink cursor-pointer [clip-path:polygon(0_0,calc(100%_-_10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%_-_10px))]"
              >
                Trasmetti{" "}
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-[3px]">
                  ▸
                </span>
              </button>
              <p className="font-mono text-[9px] text-ice-dim tracking-[1px] uppercase">
                Risposta &lt; 24h · Orario CET
              </p>
            </form>
          </div>
        </div>
      </section>
    </Reveal>
  );
}