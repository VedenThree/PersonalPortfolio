# Piano di revisione — minimalismo, anime.js, statico, prestazioni

> Solo piano d'azione, nessuna esecuzione. Obiettivo: stesso risultato visivo attuale con minimo HTML/TS, niente "grande matematica", tutte le animazioni via `animejs` (senza toccare quelle già funzionanti), repo statico per GitHub Pages, SEO ridotta al minimo, prestazioni verificate.

Stato di partenza verificato sui file: `output: "export"` + `trailingSlash: true` già presenti (`next.config.ts:4-9`); animazioni anime.js già funzionanti in `components/sections/projects.tsx` (timeline + `onScroll`) e `components/ui/CrtSweep.tsx` (`animate` loop) — **non toccare**.

---

## 1. Codice inutile / ridondante (HTML + TS al minimo)

Principio: se 3 nodi hanno stesso stile, è 1 array + 1 `.map`, non 3 span copiati.

- [ ] **A1. `components/layouts/hero.tsx:8-18` — 3 span identici.** `FRONTEND/BACKEND/FULLSTACK` differiscono solo per il testo (il `first:before:bg-orange` tra l'altro non funziona su 3 span fratelli separati). → `const TAGS = [...]` + map. Stesso per i 2 `NavLink` `:32-46` che duplicano `clip-path` + padding + font: usare `buttonVariants({variant:"primary"|"secondary"})` da `components/ui/button.tsx` invece di ricopiare le classi.
- [ ] **A2. Angoli ASCII `┌┐└┘` duplicati ×2.** `components/sections/projects.tsx:428-471` (4 span con stesso `cn`) e `components/sections/contact.tsx:145-168` (altri 4 span). → un `ProjectCorners({selected})` o map su `[["┌","-top..."],...]`. Risparmio: ~40 righe → ~10.
- [ ] **A3. Righe console `$ LABEL > valore`.** `projects.tsx:496-518` (`DESC`, `TAGS`), `ASCIIProgressBar:52-77` (`PROG`), `contact.tsx:125-135` (`DETAILS`). Stesso pattern `$ / label / > / valore / [res]`. → un `ConsoleRow({prompt,value,res,color})` condiviso in `components/ui/`.
- [ ] **A4. Pallini header terminale ×2.** `Terminal.tsx:104-108` e `contact.tsx:111-115` (3 `span` tondi). → `Dots()` condiviso.
- [ ] **A5. `components/layouts/footer.tsx:20-46` — 3 `NavLink` identici.** Solo `section`/`label` cambiano. → map su array.
- [ ] **A6. `components/layouts/navbar.tsx` — doppia sidebar.** `MobileRail:56-108` e sidebar desktop `:121-220` duplicano logo `FD`, dot `ONLINE`, loop `NAV_ITEMS`. → estrarre `BrandMark`, `StatusDot`, unica `NAV_ITEMS` già esistente. Sotto-task: signal bars `:140-147` (`[1,2,3].map` + 1 div statico) → loop unico da 4.
- [ ] **A7. `components/layouts/bg-scene.tsx:5-21` — `STARS`/`MOTES` gemelli.** Due `Array.from` con stessa forma (`left/size/duration/delay`). → una `factory(n, fn)` o un solo array con `kind`. Anche il render `:47-74` dei due `.map` è identico → un componente `Particle`.
- [ ] **A8. `app/globals.css:15-87` — inflazione token.** 8 `ink-*`, 8 `panel*`, doppioni `bg`/`ink`/`bg-deep`/`ink-deep`, `paper-bright`/`paper-cool` quasi identici. → target: max ~4 ink + 3 panel + 1 paper. Ogni token rimosso va sostituito con il più vicino (nessun cambio pixel, solo alias). La regola lint `no-restricted-syntax` in `eslint.config.mjs:23-47` resta: garantisce che non rientrino hex.
- [ ] **A9. `lib/projects-data.ts:75-98` — `RESERVED` placeholder.** Due oggetti vuoti servono solo a tenere il denominatore `LOAD_MODULES [2/4]` (`projects.tsx:28`). → sostituire con `const TOTAL_SLOTS = 4` e cancellare ~25 righe + la guardia `isPublishable:110-124` (non serve se non esistono placeholder pubblicabili).
- [ ] **A10. `components/sections/contact.tsx:36-51` — `FIELDS` + blocco messaggio separato `:194-211`.** I 3 campi differiscono solo per `label/name/rows`. → un solo array con `multiline?: boolean` e un `Field` unico.

## 2. Semplificare la logica (niente "grande matematica")

Principio: niente `sin/cos/pow/%` sparsi nei componenti; o costanti fisse o helper anime.js.

- [ ] **B1. `lib/orbital-targets.ts:37-61` — LCG + `sin/cos`.** Il generatore deterministico con seed fisso produce sempre gli stessi 6 pixel: tanto vale committare 6 `{left,top,size,base,angle}` statici e cancellare `generateTargets`, `ORBITAL_BOX/CENTER`, `pct`. `wrap360` resta solo se serve ad anime.js, altrimenti va via anche lui. Nota: il commento `:63-74` ammette già gap 4.44° — con costanti fisse si fissano 6 posizioni ben spaziate una volta e non si ricalcola più nulla.
- [ ] **B2. `components/ui/HeroOrbital.tsx:62-134` — rAF da ~130 righe.** `wrap360`, `Math.sin` per bearing, `tail/onBeam` con divisioni, `boxShadow` con `color-mix` ricalcolato a 60fps, 4 cache `last*` scritte a mano. → dopo la migrazione anime.js (punto 3) questo file deve diventare markup + 1 timeline; le cache manuali spariscono perché anime.js scrive solo quando interpola.
- [ ] **B3. `components/animations/section-flow.tsx:13-14,76-101`.** `clamp01`, `easeOutCubic` con `Math.pow`, `getBoundingClientRect()+scrollY` per frame, `offsetTop` cachato a mano. → cancellare tutto e riusare lo stesso pattern `onScroll({sync})` già usato in `projects.tsx:282-340`. Niente easing scritte a mano: `ease: "outCubic"` di anime.js.
- [ ] **B4. `lib/projects-tour.ts:31-36,68-86`.** `easeInOutCubic`/`easeTour` con `pow`, `travelShare`, `oStart/oEnd` calcolati dall'observer. → sostituire con `animate(window, {scrollY})` o un `createTimeline` anime.js; il clamp `[90,420]` diventa `clamp` dell'API. Il file probabilmente sparisce dentro `projects.tsx` (~30 righe invece di 113).
- [ ] **B5. `components/sections/projects.tsx:269-340` — `onUpdate` con 5 `last*`.** Il dedup manuale di `sync/status/color/visibility/pointerEvents` è boilerplate. → `requestAnimationFrame` + scrittura solo su cambio è già il pattern di navbar; valutare un micro-helper `writeIfChanged(el,prop,val)` in `lib/` per eliminare ~30 righe ripetute anche in `HeroOrbital` e `section-flow`.
- [ ] **B6. `lib/section-nav.ts` — event bus per un solo evento.** `SECTION_EVENTS/onSectionEvent/emitSectionEvent` + `goToSection` con caso speciale `lavori` servono solo al tour di projects. Se il tour diventa uno scroll anime.js standard (B4), tutto il file collassa in `document.getElementById(id)?.scrollIntoView()` dentro `NavLink`. Cancellare ~35 righe.

## 3. Tutte le animazioni via anime.js (senza toccare quelle esistenti)

Intoccabili: timeline + `onScroll` in `projects.tsx:152-340`, loop `animate` in `CrtSweep.tsx:17-22`.

- [ ] **C1. `components/animations/reveal.tsx:47-59` — transition CSS → anime.js.** Oggi è `transition-all duration-700` + `opacity/translate` + `transitionDelay`. → `animate(el,{opacity:[0,1],translateY:[32,0],delay,duration:700,ease:"outExpo",autoplay:onIntersect})`. Rimuovere le classi `transition-all/duration-700/ease-[...]`. `use-reduced-motion.ts` resta il gate (l'effect ritorna subito, come già fa `:24`).
- [ ] **C2. `components/animations/section-flow.tsx` — rAF manuale → anime.js.** Stesso `onScroll({sync})` di projects: `animate(panel,{translateY:[70,0],opacity:[0.35,1]})` guidato da scroll. Cancellare `RISE/BAND_VH/SETTLE_VH/HOLD_*`, `clamp01`, `easeOutCubic`.
- [ ] **C3. `components/layouts/bg-scene.tsx` + `app/globals.css:161-197`.** Oggi 4 keyframes CSS (`aurora-drift/twinkle/drift/pulse-glow`) su 88 nodi. → `animate(".star",{opacity:[0.15,0.9],loop:true,alternate:true,delay:stagger(...)})` e `animate(".mote",{translateY:[0,-110vh],loop:true})`, aurora con `animate` su `translate/scale/rotate`. Dopo la migrazione cancellare i 4 `@keyframes` + `--animate-*` (`globals.css:148-151`) + `.scene-paused` (`:302-309`, sostituito da `animation.pause()` su `visibilitychange`).
- [ ] **C4. `components/ui/HeroOrbital.tsx` — rAF → anime.js.** Sweep + 2 anelli: `animate(el,{rotate:"-=360",duration:6000/11000/18000,loop:true,ease:"linear"})`. Target: `animate` su `opacity/scale` con `delay` in funzione della distanza angolare invece di `ahead/tail/onBeam`. Bearing numerico: `animate(obj,{value:[190,340]})` con `onUpdate` che scrive `textContent` (un solo numero, niente `sin`). Cancellare `SWEEP_PERIOD/RING_*`, `phase`, `hitsRef`, `lastBearing/lastTransform/lastDot`.
- [ ] **C5. `components/layouts/navbar.tsx:163-166` — indicatore CSS → anime.js.** Oggi `transition-transform duration-500` + `translateY(calc(var(--nav-row-h)*index))`. → `animate(indicator,{translateY:index*68,duration:500,ease:"outExpo"})`. Poi `--nav-row-h`/`--nav-index`/`nav-indicator` in `globals.css:284-288` diventano una costante TS.
- [ ] **C6. Hover/transition Tailwind restanti.** `transition-colors/transition-transform duration-200/300` in `hero.tsx:34,37`, `navbar.tsx:85,93`, `projects.tsx:414` ecc. → decisione: o si lasciano (sono transizioni di stato, non "animazioni") o si portano su `animate` al `mouseenter`. Raccomandazione: lasciarle in CSS — portarle su anime.js aggiunge JS per zero guadagno visivo. Da confermare prima di toccarle.
- [ ] **C7. Ordine di migrazione (per non rompere tutto insieme).** 1) Reveal, 2) navbar indicator, 3) SectionFlow, 4) BgScene, 5) HeroOrbital. Dopo ogni step: `npm run build` + controllo visivo. Cancellare un keyframe CSS solo quando nessun componente lo referenzia più (grep `animate-aurora|twinkle|drift|pulse-glow`).

## 4. Pulizia dipendenze e file inutili

- [ ] **D1. `lucide-react` (`package.json:18`) — usato 1 sola volta** (`navbar.tsx:4` per `ChevronRight`). → sostituire con `›` testuale o SVG inline da 3 righe e rimuovere la dipendenza (~centinaia di KB risparmiati nel bundle dev).
- [ ] **D2. `class-variance-authority` (`package.json:15`) — usato 1 solo file** (`button.tsx:8`). → inline: `constcls = variant==="secondary" ? ... : ...`. Rimuove una dipendenza per ~10 righe di ternario.
- [ ] **D3. `tw-animate-css` (`package.json:22` + `@import` in `globals.css:2`).** Verificare con grep cosa usa davvero (`animate-*` del progetto sono custom in `@theme inline`, non di tw-animate). Se inutilizzato → rimuovere import + dipendenza + `@import "tw-animate-css"`.
- [ ] **D4. `clsx` + `tailwind-merge` restano** (`lib/utils.ts:1-6`): `cn()` è usato ovunque, tenerli.
- [ ] **D5. `shadcn` in `devDependencies` + `components.json`.** Serve solo se si aggiungeranno altri primitivi; `Button/Input/Textarea` sono già vendorizzati. → o si rimuove dal `package.json` (i 3 file restano) o si dichiara "tengo per futuri componenti". Decisione esplicita, non dimenticanza.
- [ ] **D6. `serve` (`package.json:31`, `npm start`).** Per GitHub Pages non serve alcun server statico locale oltre a `npx serve` occasionale. → spostare in documentazione o rimuovere; il build GH Pages usa solo `npm run build` → `out/`.
- [ ] **D7. Test `lib/*.test.ts` + `tsconfig.test.json` + `npm test`.** Sono `node:test` zero-dipendenze e coprono `orbital-targets`/`projects-data` — i due file che il piano propone di cancellare/semplificare (A9, B1). → dopo B1/A9 i test corrispondenti vanno rimossi; tenere l'infrastruttura solo se restano invarianti da bloccare.
- [ ] **D8. File/cartelle da non pubblicare (non toccano `out/`, ma sporcano il repo).** `DESIGN.md`, `PRODUCT.md`, `CLAUDE.md`, `.impeccable/`, `.agents/`, `.opencode/`, `opencode.json`, `skills-lock.json`, `REVIEW.md` (vuoto, questo piano lo sostituisce), `.next/`, `out/`. → aggiungere a `.gitignore` (`out/`, `.next/` — verificare) e valutare spostamento doc in `docs/` o cancellazione. **Questo file va in `review.md` (minuscolo) come richiesto; decidere se cancellare `REVIEW.md` (maiuscolo, vuoto) o tenerlo come alias.**
- [ ] **D9. `public/` + `app/favicon.ico`.** Inventariare: se ci sono font/immagini non referenziati, cancellarli. Ogni KB in `public/` finisce su GH Pages.
- [ ] **D10. `components.json` + `next-env.d.ts`.** Tenerli (config shadcn / tipi Next), non sono peso.

## 5. Statico per GitHub Pages (niente dinamico)

Già ok: nessun `fetch`, nessuna API route, form via `mailto:` (`contact.tsx:62-83`), `output:"export"`.

- [ ] **E1. `basePath` per Pages.** Se il repo è `user.github.io/<repo>` (non user-site), aggiungere `basePath: "/<repo>"` in `next.config.ts` altrimenti asset e link si rompono. Verificare il nome repo prima del deploy.
- [ ] **E2. `.nojekyll` in `out/`.** Cartelle con `_next/` vengono ignorate da Jekyll di default → pagina bianca. → script `postbuild: touch out/.nojekyll` o file `public/.nojekyll` (viene copiato in `out/`).
- [ ] **E3. `metadataBase` + `NEXT_PUBLIC_SITE_URL` (`layout.tsx:37`, `.env.example`).** Con SEO non indicizzata è peso morto + rischio `example.com` canonico. → ridurre `metadata` a `{title, description}` e cancellare `openGraph/twitter/metadataBase` + `.env.example`. Se si vuole tenere l'OG per condivisioni social, fissare l'URL reale e basta.
- [ ] **E4. `"use client"` — audit.** Oggi in `navbar`, `bg-scene`, `HeroOrbital`, `Terminal`, `CrtSweep`, `nav-link`, `reveal`, `section-flow`, `projects`, `contact`. Dopo le semplificazioni: `Terminal`, `nav-link`, `footer` diventano server component (nessuno stato); `projects`/`contact` restano client (stato + form). Ogni `"use client"` rimosso è JS in meno nel bundle.
- [ ] **E5. Router Next non necessario.** `goToSection` + `NavLink` con `href="#..."` bastano; nessun `useRouter`/`Link` — confermato, non introdurne.
- [ ] **E6. `scroll-smooth` (`layout.tsx:63`) + `scrollIntoView({behavior:"smooth"})`.** Ok per statico, nessun JS server. Tenere.

## 6. SEO — volutamente minima

- [ ] **F1. Tenere solo:** `<html lang="it">` (già presente), `title` + `description` in `metadata`. Cancellare `openGraph`, `twitter`, `metadataBase` (punto E3).
- [ ] **F2. Aggiungere `robots: {index:false}`** nel `metadata` così eventuali mirror/deploy di anteprima non vengono indicizzati per sbaglio. Una riga, zero costi.
- [ ] **F3. Non fare:** sitemap, `canonical`, JSON-LD, `robots.txt` dedicato. Spreco per un sito che non deve essere trovato.

## 7. Prestazioni (stato attuale e interventi)

Colli di bottiglia osservati (senza misurazioni: da verificare con Lighthouse prima di tagliare):

- [ ] **P1. `BgScene` — 88 nodi animati + `blur-[70px]` + `mix-blend-screen`.** Il blur su un layer da 150%×65% è il costo maggiore della pagina. Interventi: ridurre `STARS 70→35`, `MOTES 18→10`; dimezzare il blur o applicarlo a un layer statico prerenderizzato; dopo C3 le animazioni sono 2 timeline anime.js invece di 88 animazioni CSS indipendenti. Misurare con DevTools → Rendering → Paint flashing prima/dopo.
- [ ] **P2. `HeroOrbital` — `boxShadow` a 60fps su 6 dot + `will-change-transform` multipli.** Il `boxShadow` animato è il peggior trigger di repaint. → dopo C4 l'eco diventa `opacity/scale` (compositing-only), niente più shadow per-frame. Rimuovere `will-change` dove non serve (`Terminal` lo evita già correttamente, `projects.tsx:402-405`).
- [ ] **P3. Font: 4 famiglie eager (`layout.tsx:8-31`).** Archivo variable + Plex Sans + Plex Mono + JetBrains Mono = ~4 richieste render-blocking. → tenere Archivo + 1 mono (scegliere tra Plex Mono e JetBrains; la differenza a 8-12px citata in `globals.css:141-143` va verificata visivamente: se indistinguibile, cancellare JetBrains e `font-jet`).
- [ ] **P4. `Projects` — pista `300vh` + `sticky` + `seek` per scroll.** Su mobile è già `auto` (ok). Su desktop il `sync:0.5` + `seek` a ogni frame di scroll è il secondo costo dopo BgScene. Dopo B4/C2 rivalutare se la pista può scendere a `200vh` senza perdere la "sosta" (`HOLD_START = 0.65` in `projects.tsx:22`).
- [ ] **P5. `Reveal` — N `IntersectionObserver` (uno per istanza).** Con 4-5 istanze è trascurabile, ma un unico observer condiviso o l'`onScroll` di anime.js elimina overhead. Secondario rispetto a P1/P2.
- [ ] **P6. Verifiche prima/dopo.** `npm run build` + Lighthouse (Performance, CLS — gli `aspect-square` e le altezze fisse aiutano già) + `npx next-bundle-analyzer` o `du -sh out/` per il peso. Target indicativo: `out/` sotto 1 MB gzip senza immagini, zero jank sullo scroll della sezione progetti.

---

## Ordine di esecuzione consigliato (stima)

1. **A + D veloci** (map/loop, `lucide`→SVG, `cva`→ternario, `RESERVED`→costante) — zero rischio visivo, `build` verde subito.
2. **B logiche** (costanti orbitali, collapse `section-nav`, helper `writeIfChanged`) — prepara C.
3. **C anime.js** nell'ordine C1→C5, un keyframe CSS cancellato alla volta.
4. **E statico** (`basePath`, `.nojekyll`, metadata minima, audit `"use client"`).
5. **P prestazioni** (conteggio particelle, blur, font) + Lighthouse finale.
6. **F SEO** (una riga `robots`) + decisione `REVIEW.md` vs `review.md` + `.gitignore`.

Ogni step chiude con `npm run build && npm run lint && npm run typecheck`.
