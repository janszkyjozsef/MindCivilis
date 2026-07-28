import { copyFile, mkdir, readdir, rename } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = join(projectRoot, "dist");
const clientRoot = join(distRoot, "client");
const serverRoot = join(distRoot, "server");
const openaiRoot = join(distRoot, ".openai");
const migrationRoot = join(openaiRoot, "drizzle");

await mkdir(clientRoot, { recursive: true });
await mkdir(serverRoot, { recursive: true });
await mkdir(migrationRoot, { recursive: true });

for (const entry of await readdir(distRoot, { withFileTypes: true })) {
  if (["client", "server", ".openai"].includes(entry.name)) continue;
  await rename(join(distRoot, entry.name), join(clientRoot, entry.name));
}

await copyFile(join(projectRoot, "worker", "index.js"), join(serverRoot, "index.js"));
await copyFile(join(projectRoot, ".openai", "hosting.json"), join(openaiRoot, "hosting.json"));

for (const migration of await readdir(join(projectRoot, "drizzle"))) {
  if (migration.endsWith(".sql")) {
    await copyFile(join(projectRoot, "drizzle", migration), join(migrationRoot, migration));
  }
}

console.log("Prepared GitHub Pages assets and Sites worker output in dist.");
