"use client";

import ProfileBox from "@/components/ui/profile-box";
import type { Dict } from "@/lib/i18n";

/**
 * Box "Approccio" con un unico momento autoriale: una scansione
 * design-to-code all'ingresso nel viewport (una sola passata).
 *
 * Il comportamento di reveal vive in `ProfileBox` così gli altri box della
 * sezione profilo parlano lo stesso linguaggio visivo.
 */
const PIPELINE = ["FIGMA", "NEXT.JS", "API + DB"] as const;

export default function ApproachBox({
  dict,
}: {
  dict: Dict["profile"];
}) {
  return (
    <ProfileBox className="border border-line rounded bg-surface/60 p-6 md:p-8">
      <p
        data-ap
        style={{ "--d": "0ms" } as React.CSSProperties}
        className="approach-line font-mono text-[10px] tracking-[0.3em] text-ice-dim uppercase mb-4"
      >
        {dict.approachKicker}
      </p>
      <h3
        data-ap
        style={{ "--d": "70ms" } as React.CSSProperties}
        className="approach-title font-display text-2xl font-bold text-paper mb-4 tracking-[-0.01em]"
      >
        {dict.approachTitle}
      </h3>
      <p className="text-paper-dim leading-relaxed [&>strong]:text-paper">
        <span
          data-ap
          style={{ "--d": "150ms" } as React.CSSProperties}
          className="approach-line block"
        >
          {dict.approachBodyA}
        </span>{" "}
        <span
          data-ap
          style={{ "--d": "220ms" } as React.CSSProperties}
          className="approach-line"
        >
          <strong className="approach-hl" style={{ "--d": "420ms" } as React.CSSProperties}>
            {dict.approachStrong1}
          </strong>{" "}
          {dict.approachMid}{" "}
          <strong className="approach-hl" style={{ "--d": "520ms" } as React.CSSProperties}>
            {dict.approachStrong2}
          </strong>
        </span>{" "}
        <span
          data-ap
          style={{ "--d": "290ms" } as React.CSSProperties}
          className="approach-line"
        >
          {dict.approachBodyB}
        </span>
      </p>

      {/* pipeline design-to-code: si accende in cascata, una sola volta */}
      <ul
        aria-label="Pipeline design to code"
        className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-line/60 pt-5"
      >
        {PIPELINE.map((step, i) => (
          <li key={step} className="flex items-center gap-2">
            <span
              data-chip
              style={{ "--d": `${480 + i * 110}ms` } as React.CSSProperties}
              className="inline-flex items-center gap-1.5 rounded border border-line/70 bg-bg-deep/60 px-2 py-1 font-mono text-[9px] tracking-[0.18em] text-ice-dim"
            >
              <span aria-hidden className="approach-dot" />
              {step}
            </span>
            {i < PIPELINE.length - 1 && (
              <span aria-hidden className="font-mono text-[9px] text-orange/70">
                →
              </span>
            )}
          </li>
        ))}
      </ul>
    </ProfileBox>
  );
}
