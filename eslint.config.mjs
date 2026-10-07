import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Non è codice applicativo: immagini e font generati. Senza questo
    // ignore il lint segnala warning su file che nessuno scrive a mano.
    "public/**",
  ]),
  {
    // Il palette vive in app/globals.css. Un hex in un componente è la causa
    // documentata del drift: qui si chiude per legge, non
    // per burocrazia. Gli alpha di un token passano da `var(--x)` o
    // `color-mix(in srgb, var(--x) N%, transparent)`.
    files: ["components/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/#[0-9a-fA-F]{3,8}\\b/]",
          message:
            "Niente hex literal nei componenti: usa il token di globals.css (o color-mix per un alpha). I valori dell'elenco stanno in `:root`.",
        },
        {
          // Copre anche i valori arbitrari di Tailwind, che sono stringhe:
          // `bg-[rgba(6,6,15,0.85)]` è il modo più comune in cui il drift
          // rientra senza passare da un hex.
          selector: "Literal[value=/\\b(rgba?|hsla?|hwb|oklch|oklab)\\(/]",
          message:
            "Niente funzione colore inline nei componenti: usa `var(--token)` o `color-mix(in srgb, var(--token) N%, transparent)`. Se serve un nuovo colore, va dichiarato come `--token` in `:root`.",
        },
      ],
    },
  },
]);

export default eslintConfig;
