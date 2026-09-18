"use client";

import Reveal from "@/components/animations/reveal";
import { ShieldCheck } from "lucide-react";

const CONTACT_DETAILS = [
  { label: "EMAIL", value: "marco.rossi@proton.me", sub: "Risposta < 24h" },
  { label: "BASE", value: "Italia", sub: "Fuso orario CET · UTC+1" },
  { label: "COORDINATE", value: "46.2074° N · 9.0200° E", sub: "Lavoro anche in remoto" },
];

const FORM_FIELDS = [
  { label: "NOME OPERATIVO", placeholder: "Alex Rossi", type: "text" },
  { label: "CANALE EMAIL", placeholder: "alex@example.com", type: "email" },
];

export default function Contact() {
  return (
    <Reveal delay={200}>
      <section id="contatti" className="py-24 border-t border-line">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          {/* Left */}
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
              Hai un progetto da sviluppare? Cerchi un developer affidabile
              per il tuo team? Invia un messaggio: rispondo entro 24 ore
              in orario CET.
            </p>

            {/* Encrypted channel badge */}
            <div
              className="border border-line flex items-center gap-3 px-[18px] py-[14px] mb-7"
              style={{
                background:
                  "linear-gradient(172deg, rgba(168,196,212,0.04) 0%, rgba(13,14,26,0.96) 100%)",
              }}
            >
              <ShieldCheck className="size-5 text-orange shrink-0" />
              <div>
                <p className="font-mono text-[9.5px] text-orange tracking-[1.3px] uppercase">
                  Canale criptato
                </p>
                <p className="font-sans text-[12px] text-paper-dim">
                  Comunicazione end-to-end protetta · TLS 1.3
                </p>
              </div>
            </div>

            {/* Contact details */}
            <div className="flex flex-col gap-4">
              {CONTACT_DETAILS.map(({ label, value, sub }) => (
                <div key={label} className="border-l-2 border-orange pl-3">
                  <p className="font-mono text-[9px] text-ice-dim tracking-[1.06px] uppercase">
                    {label}
                  </p>
                  <p className="font-sans text-[14px] text-paper mt-0.5">
                    {value}
                  </p>
                  <p className="font-mono text-[9px] text-ice-dim tracking-[0.7px]">
                    {sub}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div
            className="border border-line p-8 relative"
            style={{
              background:
                "linear-gradient(135deg, rgba(168,196,212,0.04) 0%, rgba(13,14,26,0.96) 100%)",
            }}
          >
            <div className="absolute border-l-2 border-t-2 border-orange left-0 top-0 size-[14px]" />
            <div className="absolute border-b-2 border-r-2 border-orange right-0 bottom-0 size-[14px]" />

            <p className="font-mono text-[10px] text-orange tracking-[2.22px] uppercase mb-5">
              {"// Invia messaggio"}
            </p>
            <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
              {FORM_FIELDS.map(({ label, placeholder, type }) => (
                <div key={label}>
                  <p className="font-mono text-[9.6px] text-orange tracking-[1.34px] uppercase mb-1.5">
                    {label}
                  </p>
                  <input
                    type={type}
                    placeholder={placeholder}
                    className="w-full bg-[rgba(6,6,15,0.85)] border border-orange/25 px-3.5 py-2.5 font-sans text-[14px] text-ice/50 placeholder:text-ice/25 outline-none focus:border-orange/60 transition-colors"
                  />
                </div>
              ))}
              <div>
                <p className="font-mono text-[9.6px] text-orange tracking-[1.34px] uppercase mb-1.5">
                  Messaggio cifrato
                </p>
                <textarea
                  placeholder="Descrivi il progetto o la collaborazione..."
                  rows={4}
                  className="w-full bg-[rgba(6,6,15,0.85)] border border-orange/25 px-3.5 py-2.5 font-sans text-[14px] text-ice/50 placeholder:text-ice/25 outline-none focus:border-orange/60 transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="bg-orange w-full py-3 font-mono font-bold text-[14px] text-ink tracking-[1.97px] uppercase hover:bg-orange/85 transition-colors cursor-pointer"
              >
                Invia trasmissione
              </button>
            </form>
          </div>
        </div>
      </section>
    </Reveal>
  );
}