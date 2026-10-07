import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "agent-chatbox": resolve(__dirname, "../src"),
      "@": resolve(__dirname, "../src"),
    },
  },
  root: __dirname,
  // GitHub Pages serves project sites from /<repo-name>/. The Pages workflow
  // sets BASE_PATH; local dev and other hosts use "/".
  base: process.env.BASE_PATH ?? "/",
  build: { outDir: "dist" },
});
