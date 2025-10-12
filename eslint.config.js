import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import { importX } from "eslint-plugin-import-x";
import { configs as reactHooksConfigs } from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { configs as sonarjsConfigs } from "eslint-plugin-sonarjs";
import sort from "eslint-plugin-sort";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import globals from "globals";
import { configs as tseslintConfigs } from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist", "coverage", ".vercel"]),
  sonarjsConfigs.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  eslintPluginUnicorn.configs.recommended,
  sort.configs["flat/recommended"],
  {
    files: ["**/*.{js,cjs,mjs}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node,
      },
      sourceType: "module",
    },
  },
  {
    extends: [
      js.configs.recommended,
      tseslintConfigs.recommended,
      reactHooksConfigs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // typescript-eslint rules
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

      // eslint-plugin-import-x rules
      "import-x/newline-after-import": ["error", { count: 1 }],
      "import-x/no-dynamic-require": "warn",
      "import-x/no-nodejs-modules": "warn",

      // eslint core rules
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

      // eslint-plugin-sort rules
      "sort/imports": [
        "warn",
        {
          groups: [
            { order: 1, type: "dependency" },
            { order: 2, regex: String.raw`^@/` },
            { order: 6, regex: String.raw`\.(png|jpe?g|svg|gif|webp)$` },
            { order: 7, regex: String.raw`\.(scss|css)$` },
            { order: 3, type: "other" },
          ],
          natural: true,
          separator: "\n",
          typeOrder: "first",
        },
      ],
      "sort/string-enums": ["error", { caseSensitive: false, natural: true }],
      "sort/string-unions": ["error", { caseSensitive: false, natural: true }],
      "sort/type-properties": ["error", { caseSensitive: false, natural: true }],

      // eslint-plugin-unicorn rules
      "unicorn/filename-case": ["error", { case: "kebabCase" }],
      "unicorn/no-null": "off",
      "unicorn/no-useless-undefined": ["error", { checkArguments: false }],
      "unicorn/prevent-abbreviations": [
        "error",
        {
          allowList: { lib: true, param: false, params: false, props: true },
          replacements: { param: false, params: false, props: false },
        },
      ],
    },
  },
  eslintConfigPrettier,
]);
