import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "agent-kit": resolve(__dirname, "../src"),
      "@": resolve(__dirname, "../src"),
    },
  },
  root: __dirname,
  build: { outDir: "dist" },
});
