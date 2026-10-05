import type { NextConfig } from "next";

// Export statico: `next build` produce out/, nessun server Node.
const nextConfig: NextConfig = {
  output: "export",
  // Su host statici che non fanno rewrite, `/about/index.html` è l'unico
  // percorso che funziona davvero. Oggi c'è una sola rotta, ma aggiungerne una
  // senza questo si traduce in 404.
  trailingSlash: true,
};

export default nextConfig;