/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react-swc";
// eslint-disable-next-line import-x/no-nodejs-modules
import path from "node:path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

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
      reporter: ["text", "json", "html"],
    },
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/tests/setup.ts",
  },
});
