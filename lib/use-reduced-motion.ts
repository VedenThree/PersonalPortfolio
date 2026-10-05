"use client";

import { useSyncExternalStore } from "react";

/**
 * `prefers-reduced-motion` come hook.
 *
 * `globals.css` già collassa durate e transizioni, ma copre solo ciò che è CSS.
 * I quattro sistemi animati da JS (HeroOrbital, projects, section-flow,
 * CrtSweep) devono chiedere il permesso esplicitamente: `getServerSnapshot`
 * restituisce `false` perché il server non può conoscere la preferenza, e il
 * client si allinea al primo render senza mismatch di idratazione.
 */
const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}