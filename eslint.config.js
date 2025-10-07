import { configs as reactHooksConfigs } from "eslint-plugin-react-hooks";
import { configs as sonarjsConfigs } from "eslint-plugin-sonarjs";
import { configs as tseslintConfigs } from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import { importX } from "eslint-plugin-import-x";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import globals from "globals";
import js from "@eslint/js";
import reactRefresh from "eslint-plugin-react-refresh";

export default defineConfig([
  globalIgnores(["dist", "coverage"]),
  sonarjsConfigs.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  eslintPluginUnicorn.configs.recommended,
  {
    files: ["**/*.{.js,.jsx,ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslintConfigs.recommended,
      reactHooksConfigs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // eslint-plugin-unicorn rules
      "unicorn/filename-case": ["error", { case: "kebabCase" }],
      // eslint-plugin-import-x rules
      "import-x/no-dynamic-require": "warn",
      "import-x/no-nodejs-modules": "warn",
      "import-x/newline-after-import": ["error", { count: 1 }],
      "import-x/order": [
        "error",
        {
          groups: ["external", "builtin", "internal", "sibling", "parent", "index"],
          pathGroups: [{ pattern: "@/**", group: "sibling" }],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  eslintConfigPrettier,
]);
