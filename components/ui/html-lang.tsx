"use client";

import { useEffect } from "react";

/**
 * Imposta `lang` su `<html>`. Serve solo alla rotta inglese: il layout root
 * è condiviso e in export statico non può variare l'attributo per rotta, ma
 * uno screen reader senza `lang="en"` leggerebbe l'inglese con la fonetica
 * italiana.
 */
export default function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
