"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/animations/reveal";
import CrtSweep from "@/components/ui/CrtSweep";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Chiave Web3Forms: incollala qui (dashboard web3forms.com → Access Key).
// Finché resta vuota, "Invia messaggio" usa il fallback mailto:.
const WEB3FORMS_KEY = "160b26d7-497a-4191-8048-f89970babcfe";

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
    prompt: "STATUS",
    value: "Disponibile per nuovi progetti",
    res: "OPEN",
    color: "var(--green)",
  },
];

const FIELDS = [
  {
    label: "Nome",
    name: "nome",
    placeholder: "Alex Rossi",
    type: "text",
    autoComplete: "name",
    multiline: false,
  },
  {
    label: "Email",
    name: "email",
    placeholder: "alex@example.com",
    type: "email",
    autoComplete: "email",
    multiline: false,
  },
  {
    label: "Messaggio",
    name: "messaggio",
    placeholder: "Ciao! Vorrei rifare il sito del mio studio entro marzo…",
    multiline: true,
  },
] as const;

type Status = "idle" | "sending" | "sent" | "error";
type SentVia = "direct" | "mailto";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [sentVia, setSentVia] = useState<SentVia>("direct");
  const [lastContact, setLastContact] = useState({ nome: "", email: "" });
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "sent") successRef.current?.focus();
  }, [status]);

  const openMailto = (nome: string, email: string, messaggio: string) => {
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
  };

  // Il sito è un export statico: l'invio passa da Web3Forms (POST esterna,
  // niente backend proprio). La validazione resta al browser (niente
  // noValidate: se un campo è vuoto il submit non parte nemmeno).
  // Senza chiave — o se la POST fallisce — si ricade sul client di posta.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const data = new FormData(form);
    const nome = String(data.get("nome") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const messaggio = String(data.get("messaggio") ?? "").trim();

    if (!WEB3FORMS_KEY) {
      openMailto(nome, email, messaggio);
      setLastContact({ nome, email });
      setSentVia("mailto");
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: nome,
          email,
          message: messaggio,
          subject: `Portfolio // ${nome || "nuovo contatto"}`,
        }),
      });
      const json = (await res.json()) as { success?: boolean };
      if (!res.ok || !json.success) throw new Error("Web3Forms error");
      setLastContact({ nome, email });
      setSentVia("direct");
      form.reset();
      setStatus("sent");
    } catch {
      openMailto(nome, email, messaggio);
      setStatus("error");
    }
  };

  const resetForm = () => setStatus("idle");

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
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className={`size-[9px] rounded-full ${i === 0 ? "bg-orange" : "bg-steel"}`}
                    />
                  ))}
                </div>
                <p className="font-mono text-[10px] text-ink-title tracking-[0.14em] whitespace-nowrap overflow-hidden">
                  SYS // CONTATTI
                </p>
              </div>
              <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] text-green shrink-0">
                <span className="size-[6px] rounded-full bg-green animate-pulse-glow" />
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
              <p className="m-0 mt-2 border-t border-panel-line pt-2.5 text-xs tracking-[0.1em] text-ink-faint">
                ENCRYPTION · TLS 1.3 // END-TO-END
              </p>
            </div>
          </div>
        </div>

        {/* Colonna destra: console di trasmissione */}
        <div className="border border-panel-line-strong rounded p-6 md:p-8 bg-surface/60 relative">
          {(
            [
              { glyph: "┌", pos: "-top-[1px] -left-[1px]" },
              { glyph: "┐", pos: "-top-[1px] -right-[1px]" },
              { glyph: "└", pos: "-bottom-[1px] -left-[1px]" },
              { glyph: "┘", pos: "-bottom-[1px] -right-[1px]" },
            ] as const
          ).map(({ glyph, pos }) => (
            <span
              key={glyph}
              aria-hidden
              className={`pointer-events-none absolute font-mono text-[14px] leading-none text-ink-faint ${pos}`}
            >
              {glyph}
            </span>
          ))}

          <h3 className="font-display font-bold text-xl text-paper tracking-[-0.01em] leading-tight mb-2">
            Inviami un messaggio
          </h3>
          <p className="font-sans text-[14px] text-paper-dim leading-[1.7] mb-6 max-w-[420px]">
            Raccontami cosa vuoi realizzare. Ti rispondo entro 24 ore,
            in orario CET.
          </p>
          {status === "sent" ? (
            <div
              ref={successRef}
              tabIndex={-1}
              role="status"
              aria-live="polite"
              className="border border-green/40 rounded bg-green/10 px-5 py-6 outline-none"
            >
              <div className="flex items-start gap-3.5">
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-6 shrink-0 text-green mt-0.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m8.5 12.5 2.5 2.5 5-5.5" />
                </svg>
                <div className="min-w-0">
                  <p className="font-display font-bold text-lg text-paper leading-tight mb-1.5">
                    {sentVia === "mailto"
                      ? "Si è aperto il tuo programma di posta"
                      : "Messaggio inviato"}
                  </p>
                  <p className="font-sans text-[14px] text-paper-dim leading-[1.7] mb-1">
                    {sentVia === "mailto" ? (
                      <>
                        Ho già compilato oggetto e testo
                        {lastContact.nome ? ` per ${lastContact.nome}` : ""}.
                        Premi <strong className="text-paper font-semibold">Invia</strong> lì
                        per completare: ti rispondo entro 24 ore, in orario CET.
                      </>
                    ) : (
                      <>
                        Grazie{lastContact.nome ? ` ${lastContact.nome}` : ""}:
                        l&apos;ho ricevuto
                        {lastContact.email ? ` e ti rispondo a ${lastContact.email}` : ""}{" "}
                        entro 24 ore, in orario CET.
                      </>
                    )}
                  </p>
                  <p className="font-mono text-xs text-ink-mid tracking-[0.06em] mb-5">
                    Preferisci la mail diretta?{" "}
                    <a
                      href={MAILTO}
                      className="text-orange underline underline-offset-4 hover:opacity-80"
                    >
                      {EMAIL}
                    </a>
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={resetForm}
                  >
                    Invia un altro messaggio
                  </Button>
                </div>
              </div>
            </div>
          ) : (
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {FIELDS.map((f) => (
              <div key={f.name}>
                <label
                  htmlFor={f.name}
                  className="font-mono text-xs text-ink-title tracking-[0.08em] uppercase mb-2 block"
                >
                  {f.label}{" "}
                  <span className="text-ink-faint normal-case tracking-normal">
                    · obbligatorio
                  </span>
                </label>
                {f.multiline ? (
                  <Textarea
                    id={f.name}
                    name={f.name}
                    placeholder={f.placeholder}
                    required
                    disabled={status === "sending"}
                    minLength={10}
                    maxLength={4000}
                    rows={5}
                    className="bg-field border-panel-line py-2.5 text-[14px] placeholder:text-ice/25 focus:border-orange/60"
                  />
                ) : (
                  <Input
                    id={f.name}
                    name={f.name}
                    type={f.type}
                    autoComplete={f.autoComplete}
                    placeholder={f.placeholder}
                    required
                    disabled={status === "sending"}
                    maxLength={120}
                    className="bg-field border-panel-line py-2.5 text-[14px] placeholder:text-ice/25 focus:border-orange/60"
                  />
                )}
              </div>
            ))}
            {status === "error" && (
              <div
                role="alert"
                className="border border-orange/40 rounded bg-orange/10 px-4 py-3.5"
              >
                <p className="font-sans text-[14px] text-paper leading-[1.6] mb-1">
                  L&apos;invio diretto non è riuscito, ma ho già aperto il tuo
                  programma di posta con il messaggio pronto.
                </p>
                <p className="font-sans text-[13px] text-paper-dim leading-[1.6]">
                  Completa l&apos;invio lì, oppure scrivimi a{" "}
                  <a
                    href={MAILTO}
                    className="text-orange underline underline-offset-4 hover:opacity-80"
                  >
                    {EMAIL}
                  </a>
                  .
                </p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Button type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Invio in corso…" : "Invia messaggio"}
              </Button>
              <p
                role="status"
                aria-live="polite"
                className="font-mono text-xs text-ink-mid tracking-[0.04em]"
              >
                {status === "sending"
                  ? "Invio in corso, attendi qualche secondo…"
                  : "Rispondo entro 24 ore · Orario CET"}
              </p>
            </div>
          </form>
          )}
        </div>
        </div>
      </section>
    </Reveal>
  );
}