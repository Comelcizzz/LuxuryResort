import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// One canonical absolute root (long path on Windows). Avoids mixing 8.3 (9ED2~1) with
// Unicode real paths, which breaks dev resolution and Rollup chunk names.
const configDir = path.dirname(fileURLToPath(import.meta.url));
const root = fs.realpathSync.native(configDir);

export default defineConfig({
  root,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.join(root, "src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
