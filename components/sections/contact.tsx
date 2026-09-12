"use client";

import Reveal from "@/components/animations/reveal";

const CONTACT_METHODS = [
  {
    label: "EMAIL",
    value: "marco.rossi@proton.me",
    icon: "▶",
  },
  {
    label: "BASE",
    value: "Italia",
    icon: "◎",
  },
  {
    label: "COORDINATE",
    value: "46.2074° N · 9.0200° E",
    icon: "◆",
  },
];

export default function Contact() {
  return (
    <Reveal delay={200}>
      <section id="contatti" className="py-24 border-t border-line">
        <div className="mb-16">
          <h2 className="font-display text-[clamp(28px,3.5vw,48px)] font-bold text-paper leading-[1.04]">
            Contatti
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="flex flex-col gap-6">
            {CONTACT_METHODS.map((m) => (
              <div
                key={m.label}
                className="flex items-center gap-4 font-mono group"
              >
                <span className="text-orange text-base shrink-0 w-5 text-center leading-[1]">
                  {m.icon}
                </span>
                <div>
                  <span className="text-[10px] tracking-[0.2em] text-ice-dim uppercase block mb-1">
                    {m.label}
                  </span>
                  <span className="text-paper group-hover:text-orange transition-colors">
                    {m.value}
                  </span>
                </div>
              </div>
            ))}
            <div className="border-t border-line pt-6 mt-2">
              <p className="font-mono text-[11px] text-ice-dim">
                <span className="text-orange">▸</span>{" "}
                Rispondo entro 48h. Disponibile per commissioni e assunzioni.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-mono text-[10px] tracking-[0.3em] text-ice-dim uppercase mb-2">
              Invio Messaggio
            </p>
            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="font-mono text-[10px] tracking-[0.15em] text-ice-dim uppercase block mb-1.5">
                  Nome
                </label>
                <input
                  type="text"
                  placeholder="Il tuo nome"
                  className="w-full bg-surface border border-line rounded px-4 py-3 font-mono text-sm text-paper placeholder:text-ice-dim/40 focus:border-orange transition-colors"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] tracking-[0.15em] text-ice-dim uppercase block mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="la tua email"
                  className="w-full bg-surface border border-line rounded px-4 py-3 font-mono text-sm text-paper placeholder:text-ice-dim/40 focus:border-orange transition-colors"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] tracking-[0.15em] text-ice-dim uppercase block mb-1.5">
                  Messaggio
                </label>
                <textarea
                  rows={4}
                  placeholder="Descrivi la tua richiesta..."
                  className="w-full bg-surface border border-line rounded px-4 py-3 font-mono text-sm text-paper placeholder:text-ice-dim/40 focus:border-orange transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2.5 border border-orange font-mono text-[13px] px-[26px] py-3.5 text-orange transition-all duration-200 hover:bg-orange hover:text-ink [clip-path:polygon(0_0,calc(100%_-_10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%_-_10px))]"
              >
                Invia Segnale ↓
              </button>
            </form>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
