import js from "@eslint/js";
import globals from "globals";
import json from "@eslint/json";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["src/**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
    ignores: ["**/node_modules/**", "package*.json"],
  },
  {
    files: ["src/**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
    ignores: ["**/node_modules/**", "package*.json"],
  },
]);
