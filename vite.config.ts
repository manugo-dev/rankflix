import react from "@vitejs/plugin-react-swc";
// eslint-disable-next-line import-x/no-nodejs-modules
import path from "node:path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { coverageConfigDefaults } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use '${path.resolve("src/app/styles/responsive.scss").replaceAll("\\", "/")}' as *;
          @use '${path.resolve("src/app/styles/mixins.scss").replaceAll("\\", "/")}' as *;
        `,
      },
    },
  },
  plugins: [react(), tsconfigPaths()],
  server: {
    allowedHosts: ["localhost", ".ts.net"],
  },
  test: {
    coverage: {
      exclude: [
        "server/*.js",
        "**/__mocks__/*.ts",
        "**/*.stories.{ts,tsx}",
        "**/*-types.ts",
        "**/types.ts",
        "**/pages/**/*.ssr.ts",
        "**/pages/ssr.ts",
        "**/index.ts",
        "**/*.config.js",
        ...coverageConfigDefaults.exclude,
      ],
      reporter: ["text", "json", "html"],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
    env: { TZ: "UTC" },
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/tests/setup.ts",
  },
});
