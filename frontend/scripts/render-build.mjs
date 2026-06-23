import { execSync } from "node:child_process";

const host = process.env.VITE_API_HOST?.replace(/\/$/, "");
if (host) {
  process.env.VITE_API_BASE = `${host}/api`;
  console.log(`VITE_API_BASE=${process.env.VITE_API_BASE}`);
} else {
  console.warn("VITE_API_HOST is not set — build will use default /api (local proxy only).");
}

execSync("vite build", { stdio: "inherit", env: process.env });
