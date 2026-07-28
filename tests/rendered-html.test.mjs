import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("builds the MindCivilis consent entry", async () => {
  const [page, app, layout, worker] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/MindCivilisApp.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../dist/server/index.js", import.meta.url), "utf8"),
  ]);

  assert.match(page, /"codex-preview": "development"/);
  assert.match(layout, /MindCivilis – Nézetek a térképen/);
  assert.match(app, /Mielőtt elkezdjük/);
  assert.match(app, /Hozzájárulok a kutatáshoz/);
  assert.match(app, /Folytatom kutatás nélkül/);
  assert.match(app, /Kifejezetten hozzájárulok/);
  assert.match(worker, /MindCivilisApp/);
  assert.doesNotMatch(app, /Your site is taking shape|Building your site/);
});

test("keeps the privacy and cohort contracts in source", async () => {
  const [app, research, cohorts, decline, schema] = await Promise.all([
    readFile(new URL("../app/MindCivilisApp.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/research.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/cohorts/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/decline/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
  ]);

  assert.match(app, /Még nincs elegendő adat/);
  assert.match(app, /nem politikai diagnózis/);
  assert.match(app, /Saját adatok végleges törlése/);
  assert.match(research, /MIN_COHORT_SIZE = 10/);
  assert.match(research, /QUESTIONS: Question\[\]/);
  assert.match(cohorts, /HAVING COUNT\(\*\) >= \?/);
  assert.match(decline, /DELETE FROM research_participants/);
  assert.match(schema, /declined_sessions/);
  assert.match(schema, /ideology_responses/);
  assert.doesNotMatch(app, /Math\.random|fake|mock cohort/i);
});
