import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vault content, not project source — a pasted Obsidian vault can
    // include a .obsidian/plugins/**/main.js (third-party compiled plugin
    // bundles), which is not code this project owns or should lint.
    "content/**",
  ]),
]);

export default eslintConfig;
