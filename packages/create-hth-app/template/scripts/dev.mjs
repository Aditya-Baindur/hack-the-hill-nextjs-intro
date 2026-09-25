import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(import.meta.url);
const workerRequire = createRequire(path.join(root, "worker/package.json"));
const isWindows = process.platform === "win32";
const children = new Set();
let stopping = false;

function killTree(child, signal) {
  if (!child.pid) return;
  if (isWindows) {
    // Windows has no POSIX process groups; stop the full tool process tree.
    spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
  } else {
    try { process.kill(-child.pid, signal); }
    catch (error) { if (error.code !== "ESRCH") console.error(error.message); }
  }
}

function stop(code) {
  if (stopping) return;
  stopping = true;
  process.exitCode = code;
  for (const child of children) killTree(child, "SIGTERM");
  if (!children.size) return;
  // Keep the supervisor alive through the grace period: a tool can exit before
  // its descendants. Retain every process group until the final cleanup.
  setTimeout(() => {
    for (const child of children) killTree(child, "SIGKILL");
  }, 3000);
}

function start(label, entry, args, cwd) {
  const child = spawn(process.execPath, [entry, ...args], {
    cwd, stdio: "inherit", detached: !isWindows,
  });
  children.add(child);
  child.on("error", (error) => {
    console.error(`${label}: ${error.message}`);
    stop(1);
  });
  child.on("exit", (code, signal) => {
    // Kill the remaining descendants even when the tool's main process exits.
    killTree(child, "SIGTERM");
    if (!stopping) {
      console.error(`${label} stopped (${signal ?? code}). Stopping both servers.`);
      stop(code === 0 ? 0 : 1);
    }
  });
}

process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));

try {
  // Resolve both before starting either so missing dependencies leave no server.
  const next = require.resolve("next/dist/bin/next");
  const wrangler = path.join(path.dirname(workerRequire.resolve("wrangler/package.json")), "bin/wrangler.js");
  console.log("Next.js → http://localhost:3000\nWorker  → http://localhost:8787\nCtrl+C stops both.\n");
  start("Worker", wrangler, ["dev", "--port", "8787"], path.join(root, "worker"));
  start("Next.js", next, ["dev", "--port", "3000"], root);
} catch (error) {
  console.error(`Could not start the app. Run npm install first.\n${error.message}`);
  stop(1);
}
