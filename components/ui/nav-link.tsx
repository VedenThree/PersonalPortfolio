"use client";

import { type AnchorHTMLAttributes, type MouseEvent } from "react";
import { goToSection } from "@/lib/section-nav";

type NavLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  /** id della sezione di destinazione */
  section: string;
};

/**
 * Link a una sezione che passa da `goToSection`: su "lavori" avvia il tour
 * animato come fa la navbar, sulle altre sezioni scorre. Serve a hero e footer,
 * che altrimenti avrebbero un comportamento diverso per la stessa destinazione.
 * L'href resta per il fallback (no-JS, middle-click, copia del link).
 */
export default function NavLink({
  section,
  onClick,
  className,
  ...props
}: NavLinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (
      e.defaultPrevented ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0
    ) {
      return;
    }
    e.preventDefault();
    goToSection(section);
  };

  return (
    <a
      href={`#${section}`}
      onClick={handleClick}
      className={className}
      {...props}
    />
  );
}