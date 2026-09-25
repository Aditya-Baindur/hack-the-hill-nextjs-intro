#!/usr/bin/env node

import { cp, lstat, mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = fileURLToPath(new URL("../", import.meta.url));
const metadata = JSON.parse(await readFile(path.join(packageRoot, "package.json"), "utf8"));
const args = process.argv.slice(2);

function help() {
  console.log(`Create a Next.js + Cloudflare Worker + D1 idea board.

Usage:
  create-hth-app my-idea-board

Options:
  -h, --help       Show this help
  -v, --version    Show the package version

Choose a new folder or an existing empty folder. Nothing is installed,
deployed or sent to a cloud account until you run the printed commands.`);
}

async function main() {
  if (args.length === 1 && ["-h", "--help"].includes(args[0])) return help();
  if (args.length === 1 && ["-v", "--version"].includes(args[0])) {
    console.log(metadata.version);
    return;
  }
  if (Number(process.versions.node.split(".")[0]) < 22) {
    throw new Error("Use Node.js 22 or newer (required by the included Wrangler version).");
  }
  if (args.length !== 1 || !args[0].trim() || args[0].startsWith("-")) {
    help();
    throw new Error("Provide one destination folder, for example: my-idea-board");
  }

  const destination = path.resolve(args[0]);
  const template = path.join(packageRoot, "template");
  if (destination === packageRoot || destination.startsWith(`${packageRoot}${path.sep}`)) {
    throw new Error("Choose a folder outside the starter package.");
  }
  const stats = await lstat(destination).catch((error) => {
    if (error.code === "ENOENT") return null;
    throw error;
  });
  if (stats && (!stats.isDirectory() || stats.isSymbolicLink())) {
    throw new Error("The destination must be a directory, and cannot be a symbolic link.");
  }
  if (stats && (await readdir(destination)).length) {
    throw new Error("The destination is not empty. Choose a new or empty folder.");
  }

  await mkdir(destination, { recursive: true });
  for (const entry of await readdir(template)) {
    await cp(path.join(template, entry), path.join(destination, entry), {
      recursive: true, force: false, errorOnExist: true,
    });
  }
  // npm excludes .gitignore files in published packages. Store portable names.
  await rename(path.join(destination, "_gitignore"), path.join(destination, ".gitignore"));
  await rename(path.join(destination, "_env.example"), path.join(destination, ".env.example"));
  await rename(path.join(destination, "_github"), path.join(destination, ".github"));

  const projectName = path.basename(destination).toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "").slice(0, 100) || "hth-idea-board";
  for (const [relative, name] of [["package.json", projectName], ["worker/package.json", `${projectName}-worker`]]) {
    const file = path.join(destination, relative);
    const pkg = JSON.parse(await readFile(file, "utf8"));
    pkg.name = name;
    await writeFile(file, `${JSON.stringify(pkg, null, 2)}\n`);
  }
  const workerConfig = path.join(destination, "worker/wrangler.jsonc");
  const config = JSON.parse(await readFile(workerConfig, "utf8"));
  config.name = `${projectName.slice(0, 59).replace(/-+$/, "")}-api`;
  await writeFile(workerConfig, `${JSON.stringify(config, null, 2)}\n`);

  const quotedPath = process.platform === "win32"
    ? `'${args[0].replaceAll("'", "''")}'`
    : `'${args[0].replaceAll("'", "'\"'\"'")}'`;

  console.log(`\nCreated ${destination}\n
Next${process.platform === "win32" ? " (PowerShell)" : ""}:
  cd ${quotedPath}
  npm install
  npm run db:migrate
  npm run dev

Open http://localhost:3000
The Worker runs at http://localhost:8787; D1 stays on your computer.
Start with README.md and AGENTS.md. Workshop: https://hth.byaditya.com
`);
}

try {
  await main();
} catch (error) {
  console.error(`\ncreate-hth-app: ${error.message}`);
  process.exitCode = 1;
}
