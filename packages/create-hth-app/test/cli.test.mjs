import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, readdir, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import test from "node:test";

const run = promisify(execFile);
const cli = fileURLToPath(new URL("../bin/create-hth-app.mjs", import.meta.url));
async function temporary(t) {
  const directory = await mkdtemp(path.join(os.tmpdir(), "create-hth-test-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

test("help/version do not create any files", async (t) => {
  const cwd = await temporary(t);
  assert.match((await run(process.execPath, [cli, "--help"], { cwd })).stdout, /Usage:/);
  assert.equal((await run(process.execPath, [cli, "--version"], { cwd })).stdout.trim(), "0.1.0");
  assert.deepEqual(await readdir(cwd), []);
});

test("requires exactly one destination and rejects unknown flags", async (t) => {
  const cwd = await temporary(t);
  for (const args of [[], ["--force"], ["one", "two"], [" "]]) {
    await assert.rejects(run(process.execPath, [cli, ...args], { cwd }), /Provide one destination/);
  }
  assert.deepEqual(await readdir(cwd), []);
});

test("scaffolds the complete workspace without installing or copying local state", async (t) => {
  const cwd = await temporary(t);
  const destination = path.join(cwd, "My Idea Board");
  await run(process.execPath, [cli, "My Idea Board"], { cwd });
  const pkg = JSON.parse(await readFile(path.join(destination, "package.json"), "utf8"));
  assert.equal(pkg.name, "my-idea-board");
  assert.deepEqual(pkg.workspaces, ["worker"]);
  assert.equal(pkg.engines.node, ">=22.0.0");
  assert.match(pkg.scripts["db:migrate"], /--workspace worker/);
  const worker = JSON.parse(await readFile(path.join(destination, "worker/package.json"), "utf8"));
  assert.equal(worker.name, "my-idea-board-worker");
  const config = JSON.parse(await readFile(path.join(destination, "worker/wrangler.jsonc"), "utf8"));
  assert.equal(config.name, "my-idea-board-api");
  for (const required of [
    "app/idea-board.tsx", "worker/src/index.ts", "worker/migrations/0001_create_ideas.sql",
    ".gitignore", ".env.example", ".github/copilot-instructions.md", "AGENTS.md", "README.md", "scripts/dev.mjs",
  ]) assert.ok((await readFile(path.join(destination, required), "utf8")).length, required);
  for (const forbidden of ["node_modules", ".next", ".env.local", "_gitignore", "_github", "worker/.wrangler", "worker/worker-configuration.d.ts"]) {
    await assert.rejects(readFile(path.join(destination, forbidden)), { code: "ENOENT" });
  }
});

test("does not overwrite a nonempty destination, including hidden files", async (t) => {
  const cwd = await temporary(t);
  await writeFile(path.join(cwd, ".keep"), "original");
  await assert.rejects(run(process.execPath, [cli, "."], { cwd }), /not empty/);
  assert.equal(await readFile(path.join(cwd, ".keep"), "utf8"), "original");
  assert.deepEqual(await readdir(cwd), [".keep"]);
});

test("accepts an existing empty folder", async (t) => {
  const cwd = await temporary(t);
  await run(process.execPath, [cli, "."], { cwd });
  assert.ok(JSON.parse(await readFile(path.join(cwd, "package.json"), "utf8")).private);
});

test("rejects a file and a symlink without modifying either", async (t) => {
  const cwd = await temporary(t);
  const existing = path.join(cwd, "existing");
  await writeFile(existing, "keep me");
  await assert.rejects(run(process.execPath, [cli, "existing"], { cwd }), /must be a directory/);
  if (process.platform !== "win32") {
    await symlink(existing, path.join(cwd, "linked"));
    await assert.rejects(run(process.execPath, [cli, "linked"], { cwd }), /symbolic link/);
  }
  assert.equal(await readFile(existing, "utf8"), "keep me");
});

test("destination shell characters are treated as literal filenames", async (t) => {
  const cwd = await temporary(t);
  const name = "my-'$board";
  const result = await run(process.execPath, [cli, name], { cwd });
  assert.equal(JSON.parse(await readFile(path.join(cwd, name, "package.json"), "utf8")).name, "my-board");
  if (process.platform !== "win32") assert.ok(result.stdout.includes("cd 'my-'\"'\"'$board'"));
});
