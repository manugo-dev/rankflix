import { defineConfig } from "steiger";
import fsd from "@feature-sliced/steiger-plugin";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    ignores: ["**/__mocks__/**", "src/pages/ssr.ts"],
  },
  {
    // disable the `public-api` rule for files in the Shared layer
    files: ["./src/shared/**"],
    rules: {
      "fsd/public-api": "off",
      "fsd/insignificant-slice": "off",
    },
  },
]);
