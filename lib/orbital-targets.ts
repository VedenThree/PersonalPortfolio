/**
 * Geometria dei target del radar di HeroOrbital.
 *
 * Viva qui fuori perché è la parte pura e deterministica del file: il suo
 * compito è che i 6 target non si accostino troppo, garanzia che oggi sta nel
 * commento di `ORBITAL_SEED` (gap misurato alla scelta del seed) anziché in
 * un test — i test di questo repo sono stati rimossi.
 */

export const ORBITAL_BOX = 460;
export const ORBITAL_CENTER = ORBITAL_BOX / 2;

/** Angolo sempre in [0, 360), per poter accumulare senza crescere all'infinito. */
export const wrap360 = (deg: number) => ((deg % 360) + 360) % 360;

/** Coordinate di progetto → percentuale del contenitore. */
export const pct = (v: number) => `${((v / ORBITAL_BOX) * 100).toFixed(4)}%`;

export type Target = {
  angle: number;
  radius: number;
  size: number;
  base: number;
  left: number;
  top: number;
};

/**
 * I 6 target arancioni. Ogni target nasce come posizione sul cerchio: angle in
 * gradi (0° in alto, senso orario) e radius in px dal centro. left/top sono il
 * suo tradotto in coordinate di schermo: x = r·sin, y = −r·cos.
 *
 * `rng` è mulberry32: lo stesso generatore del primo commit, ripristinato
 * perché con seed scelto spalma gli angoli molto meglio dell'LCG. Girano
 * 6×4 chiamate una tantum a caricamento del modulo, quindi per una statica
 * il costo è microscopico — la scelta conta solo per la distribuzione.
 */
export const generateTargets = (
  seed: number,
  count: number,
): Target[] => {
  let a = seed >>> 0;
  const rng = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: count }, () => {
    const angle = rng() * 360;
    const radius = 62 + rng() * 86;
    const size = Math.round(3.5 + rng() * 2.5);
    const rad = (angle * Math.PI) / 180;
    const half = size / 2;
    return {
      angle,
      radius,
      size,
      base: 0.2 + rng() * 0.25,
      left: ORBITAL_CENTER - half + radius * Math.sin(rad),
      top: ORBITAL_CENTER - half - radius * Math.cos(rad),
    };
  });
};

/**
 * Seed fisso: i target devono restare sugli stessi pixel a ogni reload.
 *
 * Scelto con una ricerca su 3M di seed massimizzando il minimo gap angolare
 * circolare tra i 6 target: qui è 57.47° (perfetto sarebbe 60°) e il massimo
 * è 69.5°, quindi la spalma è quasi regolare. I predecessori erano peggio —
 * LCG al seed 58930482: coppia a 4.44°; mulberry al seed vecchio 20260215:
 * coppia a 0.39°, quasi sovrapposti. Cambiare il seed sposta i pallini, quindi
 * va ricalcolato il min gap (stessa formula: gap circolari degli angoli
 * ordinati) invece di fidarsi del caso.
 */
export const ORBITAL_SEED = 1516651;
export const TARGET_COUNT = 6;

export const TARGETS: Target[] = generateTargets(ORBITAL_SEED, TARGET_COUNT);