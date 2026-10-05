/**
 * Geometria dei target del radar di HeroOrbital.
 *
 * Viva qui fuori perché è la parte pura e deterministica del file: senza un
 * modulo dedicato non era testabile, e la sua unica garanzia — che i 6 target
 * non si accostino troppo — dipendeva da un commento. Con `generateTargets`
 * accettando seed e conteggio, l'invariante si verifica una volta per tutte.
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
 * `rng` è un LCG lineare con periodo completo 2^32: per 6 valori una tantum
 * basta. Il seed di default è fisso perché i target devono restare sempre
 * sugli stessi pixel a ogni reload.
 */
export const generateTargets = (
  seed: number,
  count: number,
): Target[] => {
  let s = seed >>> 0;
  const rng = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
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
 * La spalma reale di questo seed NON è quella che il vecchio commento
 * prometteva (~55°): la coppia a 68.8° e 73.2° è a 4.44°, quindi due pallini
 * finiscono quasi attaccati. È com'era in produzione e non lo si è cambiato di
 * nascosto, ma il valore è misurato e bloccato dal test, così non è più una
 * promessa non verificata.
 *
 * Cambiare il seed sposta i pallini: se serve una spalma migliore va fatto
 * apposta, aggiornando MIN_GAP in orbital-targets.test.ts insieme al seed.
 */
export const ORBITAL_SEED = 58930482;
export const TARGET_COUNT = 6;

export const TARGETS: Target[] = generateTargets(ORBITAL_SEED, TARGET_COUNT);