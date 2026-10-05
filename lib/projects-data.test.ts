import { test } from "node:test";
import assert from "node:assert/strict";

import {
  PROJECTS,
  STATUS_META,
  VISIBLE_PROJECTS,
  moduleName,
  projectNum,
} from "./projects-data.ts";

test("VISIBLE_PROJECTS pubblica solo progetti compilati", () => {
  for (const p of VISIBLE_PROJECTS) {
    assert.equal(p.placeholder, false, `"${p.id}" è un segnaposto`);
    assert.equal(p.visible, true, `"${p.id}" non è visible`);
    assert.notEqual(p.desc, "", `"${p.id}" senza desc`);
    assert.ok(p.tags.length > 0, `"${p.id}" senza tag`);
    assert.ok(p.completion > 0, `"${p.id}" a zero`);
  }
});

test("PROJECTS mantiene lo slot riservato per il denominatore", () => {
  // `LOAD_MODULES [2/4]` dipende da questo: se i segnaposto sparissero
  // l'indicatore mentirebbe.
  assert.equal(PROJECTS.length, 4);
  assert.equal(VISIBLE_PROJECTS.length, 2);
  assert.ok(PROJECTS.length > VISIBLE_PROJECTS.length);
});

test("i missionId sono unici e ordinati", () => {
  const ids = PROJECTS.map((p) => p.missionId);
  assert.equal(new Set(ids).size, ids.length);
  const nums = ids.map((id) => Number(projectNum({ missionId: id } as never)));
  assert.deepEqual(nums, [...nums].sort((a, b) => a - b));
});

test("projectNum deriva l'ordinale dal missionId", () => {
  assert.equal(projectNum({ missionId: "PRJ-01" } as never), "01");
  assert.equal(projectNum({ missionId: "PRJ-12" } as never), "12");
  // Non deve inventare uno zero davanti a numeri già a due cifre.
  assert.equal(projectNum({ missionId: "PRJ-100" } as never), "100");
});

test("moduleName produce un identificatore stabile", () => {
  assert.equal(moduleName("Dinamiche Verticali"), "DINAMICHE_VERTICALI");
  assert.equal(moduleName("SkillSwap"), "SKILLSWAP");
  // Spazi multipli e leading/trailing: due righe identiche nella timeline
  // romperebbero l'indicizzazione di LINES.
  assert.equal(moduleName("  A   B  "), "_A_B_");
});

test("ogni status ha una meta entry", () => {
  for (const p of PROJECTS) {
    const meta = STATUS_META[p.status];
    assert.ok(meta, `status senza meta: ${p.status}`);
    assert.match(meta.hex, /^var\(--/, `${p.status}: hex non è un token`);
    assert.match(meta.chip, /\b(border|text)-/, `${p.status}: chip sospetta`);
  }
});