# Piano di revisione — minimalismo, anime.js, statico, prestazioni

> Solo piano d'azione, nessuna esecuzione. Obiettivo: stesso risultato visivo attuale con minimo HTML/TS, niente "grande matematica", tutte le animazioni via `animejs` (senza toccare quelle già funzionanti), repo statico per GitHub Pages, SEO ridotta al minimo, prestazioni verificate.

Stato di partenza verificato sui file: `output: "export"` + `trailingSlash: true` già presenti (`next.config.ts:4-9`); animazioni anime.js già funzionanti in `components/sections/projects.tsx` (timeline + `onScroll`) e `components/ui/CrtSweep.tsx` (`animate` loop) — **non toccare**.

## Stato task 1 — A+D (completato)

Eseguito il punto 1 (A+D veloci). Verifiche: `npm run typecheck` ✓, `npm run lint` ✓, `npm run build` ✓, `npm test` ✓ (16 pass).
Scelte confermate prima di eseguire: rimosso `lucide-react`; tenuti `cva`, `tw-animate-css`, `RESERVED`/`isPublishable`/test, token `ink-*`/`panel*` invariati; dai file extra rimossi solo gli SVG morti in `public/`.
Dettaglio per voce nelle checkbox sotto (`[x]` = fatto in questo task, `[-]` = saltato su tua indicazione).

---

## 1. Codice inutile / ridondante (HTML + TS al minimo)

Principio: se 3 nodi hanno stesso stile, è 1 array + 1 `.map`, non 3 span copiati.

- [x] **A1. `components/layouts/hero.tsx` — 3 span identici → map su `TAGS`.** (Nota: il `first:before:bg-orange` funzionava già — è `:first-child` del div — quindi è stato conservato identico nel map.) I 2 `NavLink` restano come sono su tua indicazione (niente `buttonVariants`).
- [x] **A2. Angoli ASCII `┌┐└┘` → map su `CORNERS`** in `projects.tsx` e inline-map in `contact.tsx`. ~40 righe → ~10, stesso output.
- [x] **A3 (parziale, senza nuovo file). Righe console `$ LABEL >`** in `projects.tsx` → helper locale `PromptHead({label})` usato da `DESC`, `TAGS`, `PROG`. Niente `ConsoleRow` condiviso in `components/ui/` (avrebbe aggiunto un file per 3 righe).
- [x] **A4. Pallini header → map su `[0,1,2]`** in `Terminal.tsx` e `contact.tsx` (primo `bg-orange`, resto `bg-steel`).
- [x] **A5. `footer.tsx` — 3 `NavLink` → map su `LINKS`.**
- [x] **A6. `navbar.tsx` signal bars → map unica da 4** (`[8,10,12,12]`, ultima dimmerata). Resto della doppia sidebar invariato.
- [x] **A7. `bg-scene.tsx` — `STARS`/`MOTES` → factory `makeParticles(kind,n,fn)`.** Render invariato.
- [-] **A8. Token `ink-*`/`panel*` — SALTATO su tua indicazione.** Palette invariata.
- [-] **A9. `RESERVED`/`isPublishable` — SALTATO su tua indicazione.** `LOAD_MODULES [2/4]` e test invariati.
- [x] **A10. `contact.tsx` — `FIELDS` unificato** (i 2 `Input` + `Textarea` messaggio ora in un solo array con `multiline` e un solo render con ternario).

## Stato task 2 — B logiche (completato)

Eseguito il punto 2 con le tue scelte: B1 non toccato, B2/B3 rimandati al punto 3, B4 con anime.js, bus invariato.
Verifiche: `npm run typecheck` ✓, `npm run lint` ✓, `npm run build` ✓, `npm test` ✓ (18 pass, +2 del nuovo helper).
Dettaglio per voce nelle checkbox sotto (`[x]` = fatto in questo task, `[-]` = saltato/rinviato su tua indicazione).

## 2. Semplificare la logica (niente "grande matematica")

Principio: niente `sin/cos/pow/%` sparsi nei componenti; o costanti fisse o helper anime.js.

- [-] **B1. `lib/orbital-targets.ts` — NON TOCCATO su tua indicazione** ("vedrò in futuro"). LCG, seed, `wrap360`, `pct` e `orbital-targets.test.ts` invariati.
- [-] **B2/B3. `HeroOrbital.tsx` + `section-flow.tsx` — RINVIATI al punto 3 su tua indicazione.** Loop rAF e matematica invariati; spariranno con le timeline anime.js (C2/C4). Nessuna micro-pulizia applicata per non toccare codice che verrà riscritto.
- [x] **B4. `lib/projects-tour.ts` — riscritto con `createTimeline` anime.js.** Via rAF, `easeInOutCubic`/`easeTour` scritte a mano e `travelShare`: due tratte in sequenza (`inOutCubic` + `outCubic`) su proxy `{ y }` con `onUpdate` che fa `scrollTo`. Stessa API (`start/stop/destroy`), stesse durate (`travel [90,420]ms`, `tour max(1500, tl*0.78)`), stessi guard (`!pinned`, `tourDist<=0`, `startY>=oEnd` → smooth), stesso cancel su `wheel/touchstart/keydown`. Tolto anche il type `ScrollObserver` di anime.js: `getObserver` è ora strutturale (`{offsetStart,offsetEnd}`), meno accoppiamento. 113 → ~100 righe ma zero matematica di easing.
- [x] **B5. Nuovo `lib/write-if-changed.ts` (`createWriter`) + uso in `projects.tsx`.** L'oggetto `last` a 5 campi e i 5 `if` manuali in `onUpdate` diventano 5 chiamate `write(chiave, valore, () => ...)`. Stesso comportamento, ~10 righe in meno. Copertura: `lib/write-if-changed.test.ts` (2 test). Adozione in `HeroOrbital`/`section-flow` rimandata al punto 3 con le timeline.
- [-] **B6. `lib/section-nav.ts` — TENUTO su tua indicazione.** Event bus `play-projects` e tour da navbar invariati.

## Stato task 3 — C anime.js (completato)

Eseguite C1–C5 nell'ordine previsto, con le tue scelte: target del radar invariati, hover restano in CSS.
Verifiche: `npm run typecheck` ✓, `npm run lint` ✓, `npm run build` ✓, `npm test` ✓ (18 pass).
Dettaglio per voce nelle checkbox sotto (`[x]` = fatto in questo task, `[-]` = lasciato in CSS su tua indicazione).

## 3. Tutte le animazioni via anime.js (senza toccare quelle esistenti)

Intoccabili: timeline + `onScroll` in `projects.tsx`, loop `animate` in `CrtSweep.tsx` — invariati.

- [x] **C1. `reveal.tsx` — transition CSS → tween anime.js.** Via le classi `transition-all/duration-700/ease-[...]`: lo stato nascosto è inline (`opacity: 0`, `translateY(32px)` — stesso meccanismo che anime scrive, niente doppio offset) e all'intersezione parte `animate(el, {opacity:[0,1], translateY:[32,0], duration:700, delay, ease:"outExpo"})`. Invariati: default visibile senza JS, skip se già in viewport, gate reduced-motion.
- [x] **C5. `navbar.tsx` — indicatore CSS → tween anime.js.** Via `transition-transform duration-500`: `animate(el, {translateY: activeIndex * rowH, duration:500, ease:"outExpo"})` dove `rowH` è letto da `--nav-row-h` (stessa fonte, niente px duplicati). Il `transform` via `--nav-index` resta come fallback no-JS/reduced-motion (l'inline di anime lo sovrascrive, `revert()` lo ripristina).
- [x] **C2. `section-flow.tsx` — rAF manuale → `onScroll` anime.js.** Cancellati `clamp01`, `easeOutCubic`, `BAND/SETTLE_VH`, `getBoundingClientRect` per frame, cache `offsetTop`, `ticking`: ogni pannello è `animate(panel, {translateY:[70,0], opacity:[0.35,1], ease:"linear", autoplay: onScroll({target: run, enter:"85% top", leave:"32% top", sync:0.5})})`. Restano sticky + altezze hold + `matchMedia`/`resize` (comportamento, non animazione). Da ricontrollare visivamente: la banda 85%→32% replica quella di prima (0.85vh→0.32vh).
- [x] **C3. `bg-scene.tsx` — 88 animazioni CSS → 3 istanze anime.js** (stelle twinkle con durate/ritardi per-target come prima, motes drift lineare, aurora 24s alternate). Via le classi `animate-*`, gli inline `animationDuration/Delay` e il toggle `.scene-paused`: `visibilitychange` fa `pause()/play()`. Gate reduced-motion sull'effect. **Keyframes rimossi** (`aurora-drift`, `twinkle`, `drift` + rispettive `--animate-*` e blocco `.scene-paused` in `globals.css`). Resta `pulse-glow` perché i dot ONLINE della navbar usano ancora `animate-pulse-glow`. Nota perf: 3 tween totali invece di 88 animazioni indipendenti, ma ora girano sul main thread — da misurare al punto 5.
- [x] **C4 (parziale, come concordato). `HeroOrbital.tsx` — sweep + 2 anelli → loop anime.js** (`rotate 0→-360`, stessi periodi 6s/11s/18s, `linear`, stessa accensione/spegnimento con viewport e tab). **Target, bearing e angolo fascio invariati** nel rAF esistente (stessa velocità dello sweep, restano sincroni). Via `outerAngle/innerAngle`, `lastTransform` e le 3 scritture transform nel loop.
- [-] **C6. Hover (`transition-colors/transform`) — RESTANO in CSS su tua indicazione.** Sono stati, non animazioni: zero JS extra.
- [x] **C7. Ordine rispettato** (Reveal → indicatore → SectionFlow → BgScene → HeroOrbital) con typecheck+lint verdi a ogni step e build+test finali. Doc `AGENTS.md` aggiornata (resta un solo keyframe: `pulse-glow`).

## 4. Pulizia dipendenze e file inutili

- [x] **D1. `lucide-react` — RIMOSSO.** `ChevronRight` in `navbar.tsx` → SVG inline (`path m9 18 6-6-6-6`), `npm install` eseguito (`npm ls lucide-react` → vuoto), lock aggiornato.
- [-] **D2. `class-variance-authority` — TENUTO su tua indicazione.** `button.tsx` invariato.
- [-] **D3. `tw-animate-css` — TENUTO su tua indicazione.** Import in `globals.css` invariato.
- [x] **D4. `clsx` + `tailwind-merge` restano** — confermato, `cn()` usato ovunque.
- [-] **D5/D6/D7. `shadcn`, `serve`, test — INVARIATI su tua indicazione.**
- [-] **D8. Doc root/`.gitignore` — INVARIATO** (`out/`, `.next/` già ignorati). Nota: su Windows `review.md`/`REVIEW.md` sono lo stesso file — il piano vive qui.
- [x] **D9 (parziale). `public/` — rimossi i 5 SVG morti del template** (`file/globe/next/vercel/window.svg`, zero riferimenti nel codice). `public/images/` tenuto (origine tooling non chiara, da decidere in un task dedicato).
- [x] **D10. `components.json` + `next-env.d.ts`** — tenuti, nessuna azione.

## Stato task 4 — E statico Pages (completato)

Eseguito il punto 4 con le tue scelte: user-site diretto (niente `basePath`), metadata ridotti.
Verifiche: `npm run typecheck` ✓, `npm run lint` ✓, `npm run build` ✓ (`out/.nojekyll` presente), `npm test` ✓ (18 pass).
Dettaglio per voce nelle checkbox sotto (`[x]` = fatto in questo task, `[-]` = non necessario su tua indicazione/conferma).

## 5. Statico per GitHub Pages (niente dinamico)

Già ok: nessun `fetch`, nessuna API route, form via `mailto:`, `output:"export"`.

- [-] **E1. `basePath` — NON NECESSARIO.** Sito su user-site diretto: niente `basePath`. Se mai finisce sotto un subpath di progetto, aggiungerlo in `next.config.ts` (nota anche in `AGENTS.md`).
- [x] **E2. `.nojekyll`.** Creato `public/.nojekyll` (copiato in `out/` dal build, verificato presente) così Jekyll non ignora `_next/`.
- [x] **E3. Metadata ridotti a `{title, description}`** in `layout.tsx`: via `metadataBase`, `openGraph`, `twitter` e costante `SITE_URL`; cancellato `.env.example` (+ eccezione `!.env.example` in `.gitignore`, riga `NEXT_PUBLIC_SITE_URL` in `AGENTS.md` aggiornata). Niente più rischio `example.com` canonico né anteprime social.
- [x] **E4. Audit `"use client"` — nessun taglio possibile.** Verificati tutti i 10 file in `components/` + `lib/use-reduced-motion.ts`: ognuno ha logica client reale (state, effects, handler, `forwardRef`/`useImperativeHandle` in `Terminal`, `onClick` in `nav-link`). La nota del piano su `Terminal`/`nav-link` server era sbagliata: senza `"use client"` non compilano. Zero JS risparmiabile qui.
- [x] **E5/E6. Confermati senza modifiche:** nessun `useRouter`/`Link` (solo `goToSection` + `href="#..."`), `scroll-smooth` + `scrollIntoView` ok per lo statico.

## Stato task 6 — F SEO minima (completato)

Nessuna domanda necessaria: il blocco indicizzazione era già deciso ("sito non indicizzato").
Verifiche: `npm run typecheck` ✓, `npm run lint` ✓, `npm run build` ✓, `npm test` ✓ (18 pass), meta `robots` confermato in `out/index.html`.

## 6. SEO — volutamente minima

- [x] **F1. Solo `<html lang="it">`, `title` + `description`.** Già fatto al task 4 (via OG/Twitter/`metadataBase`).
- [x] **F2. `robots: {index:false, follow:false}`** in `metadata` (`layout.tsx`) → `<meta name="robots" content="noindex, nofollow">` nell'export. Copre anche mirror/anteprime.
- [x] **F3. Non fatto (volutamente):** niente sitemap, `canonical`, JSON-LD, `robots.txt`.

## Stato task 5 — P prestazioni (completato)

Misurato prima di toccare: `out/` = 66 file / 1,6MB non compressi (JS ~700KB nei chunk `_next`, font woff2 ~400KB in 35 file, `index.html` 75KB, CSS 81KB). Senza browser non si può girare Lighthouse: le misure strumentali finiscono qui, il resto va verificato in dev (DevTools → Rendering → Paint flashing, Lighthouse locale).
Su tue risposte: P1/P3 invariati, solo P4 eseguito. Dopo il cambio `out/` invariato (atteso: una stringa in meno nel chunk).
Verifiche: `npm run typecheck` ✓, `npm run lint` ✓, `npm run build` ✓, `npm test` ✓ (18 pass).
Dettaglio per voce nelle checkbox sotto (`[x]` = fatto in questo task, `[-]` = invariato su tua indicazione o vincolato).

## 7. Prestazioni (stato attuale e interventi)

- [-] **P1. `BgScene` — INVARIATO su tua indicazione.** Restano 88 nodi + `blur-[70px]` + `mix-blend-screen`: è il costo paint maggiore della pagina. Il passaggio a 3 tween anime.js (task 3) ha tolto le 88 animazioni indipendenti ma gira sul main thread — da confrontare in DevTools prima/dopo se mai si riapre.
- [-] **P2. `HeroOrbital` — VINCOLATO.** Il `boxShadow` a 60fps resta perché i target non si toccano (scelta task 3). Mitigazioni già attive e confermate: loop fermo fuori viewport (`IntersectionObserver`) e a tab nascosta, scritture solo su cambio, niente `will-change` sotto antenati scalati.
- [-] **P3. Font — INVARIATI su tua indicazione.** Restano 4 famiglie eager (~400KB woff2). `font-jet` è usato solo nell'HUD del radar (6 scritte): il risparmio sarebbe ~4 file, a costo di leggibilità a 8-12px.
- [x] **P4. Pista progetti `300vh` → `200vh`** in `projects.tsx:setPinned`. `HOLD_START = 0.65` e le durate del tour restano relativi/assoluti come prima: il tour si completa prima e la sosta si accorcia. Da ricontrollare scrollando la sezione (sensazione del tour più rapido).
- [-] **P5. `Reveal` — NESSUNA AZIONE.** 4-5 `IntersectionObserver` indipendenti costano quasi zero; un observer condiviso non vale il refactor.
- [x] **P6. Misure.** `out/`: 66 file, 1,6MB (invariato dal task 1 a qui: i refactor non aggiungono peso). Target gzip <1MB plausibile ma non misurato qui. Prossimo passo in browser: Lighthouse Performance + CLS + Paint flashing su sezione progetti.

---

## Ordine di esecuzione consigliato (stima)

1. **A + D veloci** — ✅ COMPLETATO in questo task (vedi Stato task 1 sopra).
2. **B logiche** — ✅ COMPLETATO in questo task (vedi Stato task 2 sopra; B1 fermo, B2/B3 e coda B5 al punto 3, B6 tenuto).
3. **C anime.js** — ✅ COMPLETATO in questo task (vedi Stato task 3 sopra; hover in CSS, target radar invariati).
4. **E statico** — ✅ COMPLETATO in questo task (vedi Stato task 4 sopra; niente basePath, metadata minimi, audit client senza tagli).
5. **P prestazioni** — ✅ COMPLETATO in questo task (vedi Stato task 5 sopra; solo pista 200vh, resto invariato su tua indicazione/vincoli).
6. **F SEO** — ✅ COMPLETATO in questo task (una riga `robots`, verificata nell'export).

---

## Riepilogo finale (tutti i 6 punti)

| Punto | Stato | Note |
|---|---|---|
| 1. A+D | ✅ | Map/loop ovunque, `lucide-react` rimosso, SVG morti rimossi; tenuti `cva`, `tw-animate-css`, placeholder, token |
| 2. B logiche | ✅ | Tour su `createTimeline`, helper `createWriter`; B1 fermo, B2/B3 confluiti nel punto 3, bus tenuto |
| 3. C anime.js | ✅ | Reveal, indicatore, SectionFlow, BgScene, anelli/sweep radar su anime.js; resta il keyframe `pulse-glow`; hover in CSS; target radar invariati |
| 4. E statico | ✅ | `.nojekyll`, metadata minimi, niente `basePath` (user-site); audit client senza tagli |
| 5. P prestazioni | ✅ | Solo pista 200vh; `out/` 66 file / 1,6MB; Lighthouse da fare in browser |
| 6. F SEO | ✅ | `noindex, nofollow` verificato in `out/index.html` |

Da ricontrollare visivamente in dev: banda reveal SectionFlow, sincronia sweep/target radar, rapidità tour progetti a 200vh.

Ogni step chiude con `npm run build && npm run lint && npm run typecheck`.
