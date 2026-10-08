# Portfolio — SYS / 01

Portfolio personale di un Junior Web & Mobile App Developer, in italiano (`/`)
e inglese (`/en/`). Single-page in Next.js App Router con animazioni Anime.js,
esportata come sito statico.

## Avvio

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # export statico in out/
```

## Stack

| Ambito | Scelta |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Linguaggio | TypeScript |
| Styling | Tailwind CSS v4, token in `app/globals.css` |
| Animazione | Anime.js v4 per le timeline, rAF per il radar dell'hero |
| Font | Archivo, IBM Plex Sans, IBM Plex Mono, JetBrains Mono (via `next/font`) |
| Form contatti | Web3Forms, con fallback mailto |

## Struttura

```
app/
  page.tsx         # home italiana: Hero · Projects · Profile · Contact · Footer
  en/page.tsx      # stessa composizione, dizionario inglese
  layout.tsx       # font, BgScene + NavBar, wrapper di contenuto
  globals.css      # token di design, keyframe, utilities
components/
  layouts/         # navbar (con switcher IT/EN), hero, footer, bg-scene
  sections/        # projects, profile, contact
  animations/      # reveal, section-flow
  ui/              # terminale, radar, primitivi di form
lib/
  i18n.ts          # dizionari it/en e percorsi delle due lingue
  projects-data.ts # unica fonte dei progetti
  section-nav.ts   # navigazione unificata alle sezioni
```
