import { LOCALES, localePath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Switcher di lingua IT | EN: controllo segmentato bordato, stessa lingua
 * visiva dei pannelli (bordo `panel-line-strong`, attiva in arancione con
 * fondo tinta). Link veri alle due pagine statiche, non bottoni.
 */
export default function LangSwitch({
  locale,
  orientation = "row",
  className,
}: {
  locale: Locale;
  orientation?: "row" | "col";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex border border-panel-line-strong bg-panel-core",
        orientation === "col" && "flex-col",
        className,
      )}
    >
      {LOCALES.map((l, i) => (
        <a
          key={l}
          href={localePath(l)}
          aria-current={l === locale ? "page" : undefined}
          className={cn(
            "flex-1 px-2 py-2 text-center font-mono text-[11px] leading-none tracking-[0.12em] transition-colors",
            i > 0 &&
              (orientation === "col"
                ? "border-t border-panel-line-strong"
                : "border-l border-panel-line-strong"),
            l === locale
              ? "bg-orange/10 text-orange"
              : "text-ice-dim hover:text-paper",
          )}
        >
          {l.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
