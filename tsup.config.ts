import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm", "iife"],
  dts: true,
  clean: true,
  sourcemap: true,
  globalName: "MailTo",
  // CJS as .cjs so Node respects it when package has "type": "module"
  outExtension({ format }) {
    if (format === "iife") return { js: ".js" };
    return { js: format === "cjs" ? ".cjs" : ".mjs" };
  },
});
