import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.node
    },
    rules: {
      semi: ["warn", "always"],
    }
  },
  tseslint.configs.recommended,
  eslint.configs.recommended,
  

]);
