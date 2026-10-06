import { test } from "node:test";
import assert from "node:assert/strict";

import { createWriter } from "./write-if-changed.ts";

test("scrive solo al cambio di valore", () => {
  const write = createWriter();
  let calls = 0;
  write("k", "a", () => calls++);
  assert.equal(calls, 1);
  write("k", "a", () => calls++);
  assert.equal(calls, 1);
  write("k", "b", () => calls++);
  assert.equal(calls, 2);
});

test("le chiavi sono indipendenti", () => {
  const write = createWriter();
  const seen: string[] = [];
  write("a", "x", () => seen.push("a"));
  write("b", "x", () => seen.push("b"));
  write("a", "x", () => seen.push("a"));
  assert.deepEqual(seen, ["a", "b"]);
});
