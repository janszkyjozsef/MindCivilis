import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../dist/server/index.js", import.meta.url), "utf8");
const hosting = JSON.parse(await readFile(new URL("../dist/.openai/hosting.json", import.meta.url), "utf8"));
const migration = await readFile(new URL("../dist/.openai/drizzle/0000_mindcivilis_research.sql", import.meta.url), "utf8");
const moduleUrl = `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
const worker = await import(moduleUrl);

assert.equal(typeof worker.default?.fetch, "function");
assert.equal(hosting.project_id, "appgprj_6a566d87c4b08191b60de00b7bf2338a");
assert.equal(hosting.d1, "DB");
assert.match(migration, /CREATE TABLE `research_participants`/);
assert.match(migration, /CREATE TABLE `research_profiles`/);
console.log("Sites output is valid ESM and includes the Atlas project, D1 binding and research migration.");
