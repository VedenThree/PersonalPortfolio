"use client";

import { useState } from "react";
import Reveal from "@/components/animations/reveal";
import CrtSweep from "@/components/ui/CrtSweep";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Un solo indirizzo: prima la mailto e la riga della console ne avevano due
// copie indipendenti.
const EMAIL = "marco.rossi@proton.me";
const MAILTO = `mailto:${EMAIL}`;

const DETAILS = [
  {
    prompt: "CHANNEL_EMAIL",
    value: EMAIL,
    res: "OK",
    color: "var(--green)",
  },
  {
    prompt: "BASE_GEO",
    value: "Italia · CET / UTC+1",
    res: "LOCAL",
    color: "var(--ice)",
  },
  {
    prompt: "COORDINATES",
    value: "46.2074° N · 9.0200° E",
    res: "REMOTE",
    color: "var(--ice)",
  },
];

const FIELDS = [
  {
    label: "NOME_OPERATIVO",
    name: "nome",
    placeholder: "Alex Rossi",
    type: "text",
    autoComplete: "name",
  },
  {
    label: "CANALE_EMAIL",
    name: "email",
    placeholder: "alex@example.com",
    type: "email",
    autoComplete: "email",
  },
] as const;

type Status = "idle" | "sent";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  // Il sito è un export statico: non c'è un endpoint a cui fare POST.
  // "Trasmetti" lascia la validazione al browser (niente noValidate: se un campo
  // è vuoto il submit non parte nemmeno) e apre il client di posta con il
  // messaggio già composto.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const data = new FormData(form);
    const nome = String(data.get("nome") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const messaggio = String(data.get("messaggio") ?? "").trim();

    const subject = `Portfolio // ${nome || "nuovo contatto"}`;
    const body = [`Nome: ${nome}`, `Email: ${email}`, "", messaggio].join("\n");

    // window.open e non location.assign: mailto: non è una rotta interna,
    // quindi non passa dal router di Next.
    window.open(
      `${MAILTO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        body,
      )}`,
      "_self",
    );
    setStatus("sent");
  };

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
          <div className="border border-panel-line rounded bg-panel relative overflow-hidden">
            <div className="crt-scanline absolute inset-0 pointer-events-none opacity-50" />
            <CrtSweep />
            <div className="relative border-b border-panel-line px-4 py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex gap-1.5 shrink-0">
                  <span className="size-[9px] rounded-full bg-orange" />
                  <span className="size-[9px] rounded-full bg-steel" />
                  <span className="size-[9px] rounded-full bg-steel" />
                </div>
                <p className="font-mono text-[10px] text-ink-title tracking-[0.14em] whitespace-nowrap overflow-hidden">
                  SYS // CONTATTI
                </p>
              </div>
              <span className="font-mono text-[10px] tracking-[0.2em] text-green shrink-0">
                ONLINE
              </span>
            </div>
            <div className="relative px-4 py-4 flex flex-col gap-2.5">
              {DETAILS.map((d) => (
                <p key={d.prompt} className="m-0 text-[12px] leading-[1.9]">
                  <span className="text-ink-dim">$</span>{" "}
                  <span className="text-ink-mid">{d.prompt}</span>{" "}
                  <span className="text-orange">&gt;</span>{" "}
                  <span className="text-ink-value">{d.value}</span>{" "}
                  <span className="font-bold" style={{ color: d.color }}>
                    [{d.res}]
                  </span>
                </p>
              ))}
              <p className="m-0 mt-2 border-t border-panel-line pt-2.5 text-[11px] tracking-[0.1em] text-ink-faint">
                ENCRYPTION · TLS 1.3 // END-TO-END
              </p>
            </div>
          </div>
        </div>

        {/* Colonna destra: console di trasmissione */}
        <div className="border border-panel-line-strong rounded p-6 md:p-8 bg-surface/60 relative">
          <span
            aria-hidden
            className="pointer-events-none absolute -top-[1px] -left-[1px] font-mono text-[14px] leading-none text-ink-faint"
          >
            ┌
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute -top-[1px] -right-[1px] font-mono text-[14px] leading-none text-ink-faint"
          >
            ┐
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-[1px] -left-[1px] font-mono text-[14px] leading-none text-ink-faint"
          >
            └
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-[1px] -right-[1px] font-mono text-[14px] leading-none text-ink-faint"
          >
            ┘
          </span>

          <p className="font-mono text-[10px] text-orange tracking-[2.22px] uppercase mb-5">
            {"// TRASMETTI MESSAGGIO"}
          </p>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {FIELDS.map(({ label, name, placeholder, type, autoComplete }) => (
              <div key={name}>
                <label
                  htmlFor={name}
                  className="font-mono text-[9.6px] text-ink-mid tracking-[1.34px] uppercase mb-1.5 block"
                >
                  [{label}]
                </label>
                <Input
                  id={name}
                  name={name}
                  type={type}
                  autoComplete={autoComplete}
                  placeholder={placeholder}
                  required
                  maxLength={120}
                  className="bg-field border-panel-line py-2.5 text-[14px] placeholder:text-ice/25 focus:border-orange/60"
                />
              </div>
            ))}
            <div>
              <label
                htmlFor="messaggio"
                className="font-mono text-[9.6px] text-ink-mid tracking-[1.34px] uppercase mb-1.5 block"
              >
                [MESSAGGIO]
              </label>
              <Textarea
                id="messaggio"
                name="messaggio"
                placeholder="Descrivi il progetto o la collaborazione..."
                required
                minLength={10}
                maxLength={4000}
                rows={5}
                className="bg-field border-panel-line py-2.5 text-[14px] placeholder:text-ice/25 focus:border-orange/60"
              />
            </div>
            <div className="flex items-center gap-4">
              <Button type="submit">
                Trasmetti{" "}
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-[3px]">
                  ▸
                </span>
              </Button>
              <p
                role="status"
                aria-live="polite"
                className="font-mono text-[9px] text-ice-dim tracking-[1px] uppercase"
              >
                {status === "sent"
                  ? "Client di posta aperto — invia per confermare"
                  : "Risposta < 24h · Orario CET"}
              </p>
            </div>
          </form>
        </div>
        </div>
      </section>
    </Reveal>
  );
}