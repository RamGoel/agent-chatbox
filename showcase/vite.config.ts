import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "chat-kit": resolve(__dirname, "../src"),
      "@": resolve(__dirname, "../src"),
    },
  },
  root: __dirname,
  build: { outDir: "dist" },
});
