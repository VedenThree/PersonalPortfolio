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

- [x] **D1. `lucide-react` — RIMOSSO.** `ChevronRight` in `navbar.tsx` → SVG inline (`path m9 18 6-6-6-6`), `npm install` eseguito (`npm ls lucide-react` → vuoto), lock aggiornato.
- [-] **D2. `class-variance-authority` — TENUTO su tua indicazione.** `button.tsx` invariato.
- [-] **D3. `tw-animate-css` — TENUTO su tua indicazione.** Import in `globals.css` invariato.
- [x] **D4. `clsx` + `tailwind-merge` restano** — confermato, `cn()` usato ovunque.
- [-] **D5/D6/D7. `shadcn`, `serve`, test — INVARIATI su tua indicazione.**
- [-] **D8. Doc root/`.gitignore` — INVARIATO** (`out/`, `.next/` già ignorati). Nota: su Windows `review.md`/`REVIEW.md` sono lo stesso file — il piano vive qui.
- [x] **D9 (parziale). `public/` — rimossi i 5 SVG morti del template** (`file/globe/next/vercel/window.svg`, zero riferimenti nel codice). `public/images/` tenuto (origine tooling non chiara, da decidere in un task dedicato).
- [x] **D10. `components.json` + `next-env.d.ts`** — tenuti, nessuna azione.

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

1. **A + D veloci** — ✅ COMPLETATO in questo task (vedi Stato task 1 sopra).
2. **B logiche** (costanti orbitali, collapse `section-nav`, helper `writeIfChanged`) — prepara C.
3. **C anime.js** nell'ordine C1→C5, un keyframe CSS cancellato alla volta.
4. **E statico** (`basePath`, `.nojekyll`, metadata minima, audit `"use client"`).
5. **P prestazioni** (conteggio particelle, blur, font) + Lighthouse finale.
6. **F SEO** (una riga `robots`) + decisione `REVIEW.md` vs `review.md` + `.gitignore`.

Ogni step chiude con `npm run build && npm run lint && npm run typecheck`.
