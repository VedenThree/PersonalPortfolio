# Portfolio — SYS / 01

Portfolio di uno sviluppatore web full stack. Interfaccia single-page costruita
con Next.js in App Router, animata con AnimeJS e CSS, esportata come sito
statico.

## Stack

| Ambito | Scelta |
|---|---|
| Framework | Next.js 16.3.5 (App Router), React 19.2.8 |
| Linguaggio | TypeScript |
| Styling | Tailwind CSS v4 (nessun `tailwind.config.js`: i token stanno in `app/globals.css`) |
| Animazione | AnimeJS v4 per le timeline, rAF loop per il radar dell'hero |
| Icone | lucide-react |
| Font | Archivo, IBM Plex Sans, IBM Plex Mono, JetBrains Mono (via `next/font`) |

## Comandi

```bash
npm install
npm run dev        # dev server su http://localhost:3000
npm run build      # build di produzione → export statico in out/
npm run start      # serve out/ con `serve` (vedi "Deploy" sotto)
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

Non esiste un test runner: la verifica è build + typecheck + lint.

## Export statico

`next.config.ts` imposta `output: "export"`, quindi `next build` produce una
cartella `out/` di file statici. **Non c'è un server Node**: `next start` non
funziona e non può funzionare.

Per servire la build in locale:

```bash
npm run start      # equivalente a: serve out
```

Ogni file statico va pubblicato com'è (GitHub Pages, Netlify, Vercel come
static output, S3, nginx…). Nessuna funzione server, nessuna API route.

Il form di contatti non fa POST: valida l'input e apre il client di posta con
il messaggio già composto, perché un export statico non ha dove inviare.

## Struttura

```
app/
  layout.tsx       # font, metadata, BgScene + NavBar, wrapper di contenuto
  page.tsx         # Hero · Projects · SectionFlow(Profile, Contact) · Footer
  globals.css      # token di design, @theme, keyframe, utilities
components/
  layouts/         # navbar, hero, footer, bg-scene
  sections/        # projects, profile, contact
  animations/      # reveal (IntersectionObserver), section-flow (sticky a due pannelli)
  ui/              # button, input, textarea (primitivi), Terminal, HeroOrbital, CrtSweep, nav-link
lib/
  utils.ts         # cn() = clsx + tailwind-merge
  projects-data.ts # unica fonte dei progetti (VISIBLE_PROJECTS per il rendering)
  section-nav.ts   # navigazione unificata alle sezioni
```

## Documentazione

- `AGENTS.md` — convenzioni per chi modifica il codice
- `DESIGN.md` — design system: token, tipografia, componenti, regole
- `PRODUCT.md` — posizionamento e contenuto
- `REVIEW.md` — code review con lo stato dei problemi noti

## Note

- Nessun tema chiaro: il design è pensato per uno sfondo scuro fisso.
- `npm start` usa `serve`, che è in `devDependencies` perché serve solo in locale.