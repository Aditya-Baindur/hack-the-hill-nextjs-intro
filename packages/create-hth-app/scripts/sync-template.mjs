// Deliberate allowlist: never copy node_modules, local D1 data or credentials.
import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = fileURLToPath(new URL("../", import.meta.url));
const demo = path.resolve(packageRoot, "../../demo");
const files = [
  "app/about/page.tsx", "app/globals.css", "app/idea-board.tsx",
  "app/layout.tsx", "app/page.tsx", "next-env.d.ts", "tsconfig.json",
  "steps/idea-board-static.tsx", "worker/src/index.ts", "worker/tsconfig.json",
  "worker/wrangler.jsonc", "worker/migrations/0001_create_ideas.sql",
];
for (const relative of files) {
  const target = path.join(packageRoot, "template", relative);
  await mkdir(path.dirname(target), { recursive: true });
  await copyFile(path.join(demo, relative), target);
}
console.log(`Synced ${files.length} reviewed demo files into template/.`);
