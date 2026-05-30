import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const viteEntrypoint = path.join(rootDir, "node_modules", "vite", "bin", "vite.js");

const children = [
  spawn(process.execPath, [path.join(rootDir, "server", "minimax-api.mjs")], {
    cwd: rootDir,
    stdio: "inherit",
    env: process.env
  }),
  spawn(process.execPath, [viteEntrypoint], {
    cwd: rootDir,
    stdio: "inherit",
    env: process.env
  })
];

let shuttingDown = false;

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }

  setTimeout(() => process.exit(code), 80);
}

for (const child of children) {
  child.on("exit", (code) => {
    if (!shuttingDown) {
      shutdown(code ?? 0);
    }
  });
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
