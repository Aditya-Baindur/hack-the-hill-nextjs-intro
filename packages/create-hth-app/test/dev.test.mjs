import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import test from "node:test";
import { setTimeout as delay } from "node:timers/promises";

const run = promisify(execFile);

test("dev supervisor stops sibling and stubborn descendants when a server fails", {
  skip: process.platform === "win32" ? "POSIX process group check" : false,
  timeout: 12000,
}, async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "hth-dev-test-"));
  let descendant;
  t.after(async () => {
    if (descendant) try { process.kill(descendant, "SIGKILL"); } catch {}
    await rm(root, { recursive: true, force: true });
  });
  for (const directory of ["scripts", "worker", "node_modules/next/dist/bin", "node_modules/wrangler/bin"]) {
    await mkdir(path.join(root, directory), { recursive: true });
  }
  await copyFile(new URL("../template/scripts/dev.mjs", import.meta.url), path.join(root, "scripts/dev.mjs"));
  await writeFile(path.join(root, "worker/package.json"), "{}");
  await writeFile(path.join(root, "node_modules/wrangler/package.json"), '{"name":"wrangler"}');
  await writeFile(path.join(root, "node_modules/next/dist/bin/next"), "setTimeout(() => process.exit(7), 500);");
  await writeFile(path.join(root, "node_modules/wrangler/bin/wrangler.js"), `
const { spawn } = require("node:child_process");
const { writeFileSync } = require("node:fs");
const child = spawn(process.execPath, ["-e", "process.on('SIGTERM', () => {}); setInterval(() => {}, 1000)"]);
writeFileSync("descendant.pid", String(child.pid));
process.on("SIGTERM", () => process.exit(0));
setInterval(() => {}, 1000);
`);
  await assert.rejects(run(process.execPath, ["scripts/dev.mjs"], { cwd: root, timeout: 8000 }), (error) => {
    assert.equal(error.code, 1);
    assert.match(error.stderr, /Next.js stopped \(7\)/);
    return true;
  });
  descendant = Number(await readFile(path.join(root, "worker/descendant.pid"), "utf8"));
  let exists = true;
  for (let attempt = 0; attempt < 20; attempt++) {
    try { process.kill(descendant, 0); }
    catch (error) { if (error.code === "ESRCH") { exists = false; break; } throw error; }
    await delay(50);
  }
  assert.equal(exists, false, "a child process must not survive the supervisor");
});
