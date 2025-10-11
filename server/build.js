import { build } from "esbuild";

build({
  logLevel: "info",
  entryPoints: ["server/index.js"],
  outfile: "dist/index.js",
  platform: "node",
  target: "node22",
  format: "esm",
  bundle: true,
  external: ["express", "vite", "compression", "sirv"],
});
