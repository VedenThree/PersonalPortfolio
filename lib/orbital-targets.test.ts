import { test } from "node:test";
import assert from "node:assert/strict";

import {
  ORBITAL_BOX,
  ORBITAL_CENTER,
  ORBITAL_SEED,
  TARGET_COUNT,
  TARGETS,
  generateTargets,
  pct,
  wrap360,
} from "./orbital-targets.ts";

test("wrap360 riporta sempre dentro [0, 360)", () => {
  assert.equal(wrap360(0), 0);
  assert.equal(wrap360(359.9), 359.9);
  assert.equal(wrap360(360), 0);
  assert.equal(wrap360(450), 90);
  // Il ciclo della timeline accumula per sempre: i negativi non devono
  // diventare positivi giganti.
  assert.equal(wrap360(-1), 359);
  assert.equal(wrap360(-360), 0);
  assert.equal(wrap360(-450), 270);
  assert.equal(wrap360(7200 + 37), 37);
});

test("wrap360 non accumula errore su molti giri", () => {
  let angle = 0;
  for (let i = 0; i < 10_000; i++) angle = wrap360(angle - 1.7);
  assert.ok(angle >= 0 && angle < 360, `angle fuori range: ${angle}`);
});

test("pct converte le coordinate di progetto in percentuale", () => {
  assert.equal(pct(0), "0.0000%");
  assert.equal(pct(ORBITAL_BOX), "100.0000%");
  // 320/460 = 69.5652…%: la larghezza del fascio e dell'anello esterno.
  assert.equal(pct(320), "69.5652%");
  assert.equal(pct(220), "47.8261%");
  assert.equal(pct(110), "23.9130%");
});

test("i target sono stabili a parità di seed", () => {
  const a = generateTargets(ORBITAL_SEED, TARGET_COUNT);
  const b = generateTargets(ORBITAL_SEED, TARGET_COUNT);
  assert.deepEqual(a, b);
  assert.deepEqual(a, TARGETS);
});

test("i target stanno dentro il riquadro e nei range dichiarati", () => {
  assert.equal(TARGETS.length, TARGET_COUNT);
  for (const t of TARGETS) {
    assert.ok(t.angle >= 0 && t.angle < 360, `angle fuori range: ${t.angle}`);
    assert.ok(t.radius >= 62 && t.radius <= 148, `radius: ${t.radius}`);
    assert.ok(t.size >= 4 && t.size <= 6, `size: ${t.size}`);
    assert.ok(t.base >= 0.2 && t.base <= 0.45, `base: ${t.base}`);

    const half = t.size / 2;
    assert.ok(
      t.left >= -half && t.left <= ORBITAL_BOX + half,
      `left fuori riquadro: ${t.left}`,
    );
    assert.ok(
      t.top >= -half && t.top <= ORBITAL_BOX + half,
      `top fuori riquadro: ${t.top}`,
    );
  }
});

test("left/top sono la posizione sul cerchio (x = r·sin, y = −r·cos)", () => {
  for (const t of TARGETS) {
    const rad = (t.angle * Math.PI) / 180;
    const half = t.size / 2;
    const cx = ORBITAL_CENTER - half + t.radius * Math.sin(rad);
    const cy = ORBITAL_CENTER - half - t.radius * Math.cos(rad);
    assert.ok(Math.abs(cx - t.left) < 1e-9);
    assert.ok(Math.abs(cy - t.top) < 1e-9);
  }
});

/** Spalma minima misurata sul seed in uso. Cambiare il seed rompe questo test. */
const MEASURED_MIN_GAP = 4.44;

const minGapOf = (targets: { angle: number }[]) => {
  let min = Infinity;
  for (let i = 0; i < targets.length; i++) {
    for (let j = i + 1; j < targets.length; j++) {
      const d = Math.abs(wrap360(targets[i].angle - targets[j].angle));
      min = Math.min(min, d, 360 - d);
    }
  }
  return min;
};

test("i target non si sovrappongono", () => {
  const minGap = minGapOf(TARGETS);
  assert.ok(minGap > 1, `target coincidenti o sovrapposti: ${minGap.toFixed(1)}°`);
});

test("la spalma minima è quella misurata, non quella promessa", () => {
  // Il commento sul seed diceva ~55°. La verità è 4.44°, misurata: due pallini
  // sono quasi sovrapposti. Questo test blocca il valore, così nessuno crede
  // ancora al commento e un cambio di seed deve aggiornare entrambi.
  assert.ok(
    Math.abs(minGapOf(TARGETS) - MEASURED_MIN_GAP) < 0.05,
    `spalma cambiata in ${minGapOf(TARGETS).toFixed(2)}°: se è voluto, ` +
      `aggiorna ORBITAL_SEED e questo valore`,
  );
});

test("generateTargets non collassa i target con altri seed", () => {
  // Copre il caso che il commento avverte: cambiare seed può accorciare le
  // distanze. Non tutti i seed vanno bene, ma nessuno deve collassare.
  for (const seed of [1, 42, 1337, 999_983, 4_294_967_295]) {
    const gap = minGapOf(generateTargets(seed, TARGET_COUNT));
    assert.ok(gap > 0, `seed ${seed}: target coincidenti`);
  }
});

test("generateTargets rispetta il conteggio richiesto", () => {
  assert.equal(generateTargets(ORBITAL_SEED, 1).length, 1);
  assert.equal(generateTargets(ORBITAL_SEED, 12).length, 12);
  assert.equal(generateTargets(ORBITAL_SEED, 0).length, 0);
});