"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/animations/reveal";
import CrtSweep from "@/components/ui/CrtSweep";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Dict } from "@/lib/i18n";

// Chiave Web3Forms: incollala qui (dashboard web3forms.com → Access Key).
// Finché resta vuota, "Invia messaggio" usa il fallback mailto:.
const WEB3FORMS_KEY = "02f58154-ba9d-4b42-bf91-e710a06b295f";

// Un solo indirizzo: prima la mailto e la riga della console ne avevano due
// copie indipendenti.
const EMAIL = "fabio.gentile910@proton.me";
const MAILTO = `mailto:${EMAIL}`;

// Contratto del form (nomi dei campi, tipi, autocomplete): le stringhe
// visibili vivono in `dict.fields`, stesso ordine, una voce per voce.
const FIELD_SPECS = [
  { name: "nome", type: "text", autoComplete: "name", multiline: false },
  { name: "email", type: "email", autoComplete: "email", multiline: false },
  { name: "messaggio", multiline: true },
] as const;

type Status = "idle" | "sending" | "sent" | "error";
type SentVia = "direct" | "mailto";

export default function Contact({ dict }: { dict: Dict["contact"] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [sentVia, setSentVia] = useState<SentVia>("direct");
  const [lastContact, setLastContact] = useState({ nome: "", email: "" });
  const successRef = useRef<HTMLDivElement>(null);

  // Righe della console: prompt e res sono token tecnici, i valori dal dict.
  const details = [
    {
      prompt: "CHANNEL_EMAIL",
      value: EMAIL,
      res: "OK",
      color: "var(--green)",
    },
    {
      prompt: "BASE_GEO",
      value: dict.geo,
      res: "LOCAL",
      color: "var(--ice)",
    },
    {
      prompt: "STATUS",
      value: dict.availability,
      res: "OPEN",
      color: "var(--green)",
    },
  ];

  useEffect(() => {
    if (status === "sent") successRef.current?.focus();
  }, [status]);

  const openMailto = (nome: string, email: string, messaggio: string) => {
    const subject = `Portfolio // ${nome || dict.newContact}`;
    const body = [`${dict.nameLabel}: ${nome}`, `Email: ${email}`, "", messaggio].join(
      "\n",
    );

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
          subject: `Portfolio // ${nome || dict.newContact}`,
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
      <section id="contatti" className="py-16 sm:py-24 border-t border-line">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-start">
        {/* Colonnna sinistra: richiamo + riepilogo sistema */}
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-ice-dim uppercase mb-3">
            {dict.kicker}
          </p>
          <h2 className="font-display font-extrabold text-[clamp(34px,5vw,54px)] uppercase text-paper leading-[0.95] mb-5 tracking-[-0.01em]">
            {dict.titleA}
            <br />
            <span className="text-orange">{dict.titleAccent}</span>
          </h2>
          <p className="font-sans text-[16px] text-paper-dim leading-[1.8] max-w-110 mb-8">
            {dict.intro}
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
                      className={`size-2.25 rounded-full ${i === 0 ? "bg-orange" : "bg-steel"}`}
                    />
                  ))}
                </div>
                <p className="font-mono text-[10px] text-ink-title tracking-[0.14em] whitespace-nowrap overflow-hidden">
                  SYS // CONTATTI
                </p>
              </div>
              <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] text-green shrink-0">
                <span className="size-1.5 rounded-full bg-green animate-pulse-glow" />
                ONLINE
              </span>
            </div>
            <div className="relative px-4 py-4 flex flex-col gap-2.5">
              {details.map((d) => (
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
              <p className="m-0 mt-2 border-t border-panel-line pt-2.5 text-xs tracking-widest text-ink-faint">
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
            {dict.formTitle}
          </h3>
          <p className="font-sans text-[14px] text-paper-dim leading-[1.7] mb-6 max-w-105">
            {dict.formIntro}
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
                      ? dict.sentMailtoTitle
                      : dict.sentDirectTitle}
                  </p>
                  <p className="font-sans text-[14px] text-paper-dim leading-[1.7] mb-1">
                    {sentVia === "mailto" ? (
                      <>
                        {dict.filledPrefix}
                        {lastContact.nome
                          ? ` ${dict.filledFor} ${lastContact.nome}`
                          : ""}
                        . {dict.pressVerb}{" "}
                        <strong className="text-paper font-semibold">
                          {dict.pressSend}
                        </strong>{" "}
                        {dict.pressRest}
                      </>
                    ) : (
                      <>
                        {dict.thanks}
                        {lastContact.nome ? ` ${lastContact.nome}` : ""}:{" "}
                        {dict.received}
                        {lastContact.email
                          ? ` ${dict.replyTo} ${lastContact.email}`
                          : ""}{" "}
                        {dict.sla}
                      </>
                    )}
                  </p>
                  <p className="font-mono text-xs text-ink-mid tracking-[0.06em] mb-5">
                    {dict.preferMail}{" "}
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
                    {dict.sendAnother}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {dict.fields.map((f, i) => {
              const spec = FIELD_SPECS[i];
              return (
                <div key={spec.name}>
                  <label
                    htmlFor={spec.name}
                    className="font-mono text-xs text-ink-title tracking-[0.08em] uppercase mb-2 block"
                  >
                    {f.label}{" "}
                    <span className="text-ink-faint normal-case tracking-normal">
                      · {dict.required}
                    </span>
                  </label>
                  {spec.multiline ? (
                    <Textarea
                      id={spec.name}
                      name={spec.name}
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
                      id={spec.name}
                      name={spec.name}
                      type={spec.type}
                      autoComplete={spec.autoComplete}
                      placeholder={f.placeholder}
                      required
                      disabled={status === "sending"}
                      maxLength={120}
                      className="bg-field border-panel-line py-2.5 text-[14px] placeholder:text-ice/25 focus:border-orange/60"
                    />
                  )}
                </div>
              );
            })}
            {status === "error" && (
              <div
                role="alert"
                className="border border-orange/40 rounded bg-orange/10 px-4 py-3.5"
              >
                <p className="font-sans text-[14px] text-paper leading-[1.6] mb-1">
                  {dict.errorTitle}
                </p>
                <p className="font-sans text-[13px] text-paper-dim leading-[1.6]">
                  {dict.errorBody}{" "}
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
                {status === "sending" ? dict.submitSending : dict.submitIdle}
              </Button>
              <p
                role="status"
                aria-live="polite"
                className="font-mono text-xs text-ink-mid tracking-[0.04em]"
              >
                {status === "sending" ? dict.statusSending : dict.statusIdle}
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