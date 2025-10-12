import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    ignores: ["**/__mocks__/**", "src/pages/ssr.ts"],
  },
  {
    // disable the `public-api` rule for files in the Shared layer
    files: ["./src/shared/**"],
    rules: {
      "fsd/insignificant-slice": "off",
      "fsd/public-api": "off",
    },
  },
]);
