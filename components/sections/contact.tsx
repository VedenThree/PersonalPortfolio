"use client";

import Reveal from "@/components/animations/reveal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
                <span className="text-orange text-base shrink-0 size-5 text-center leading-[1]">
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
                <Input placeholder="Il tuo nome" />
              </div>
              <div>
                <label className="font-mono text-[10px] tracking-[0.15em] text-ice-dim uppercase block mb-1.5">
                  Email
                </label>
                <Input type="email" placeholder="la tua email" />
              </div>
              <div>
                <label className="font-mono text-[10px] tracking-[0.15em] text-ice-dim uppercase block mb-1.5">
                  Messaggio
                </label>
                <Textarea placeholder="Descrivi la tua richiesta..." />
              </div>
              <Button variant="primary" size="default">
                Invia Segnale ↓
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Reveal>
  );
}