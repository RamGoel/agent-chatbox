import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import base from "../tailwind.config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('tailwindcss').Config} */
export default {
  ...base,
  content: [
    resolve(__dirname, "../src/**/*.{ts,tsx}"),
    resolve(__dirname, "./src/**/*.{ts,tsx}"),
  ],
  corePlugins: { preflight: true },
};
