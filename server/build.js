import { build } from "esbuild";

build({
  bundle: true,
  entryPoints: ["server/index.js"],
  external: ["express", "vite", "compression", "sirv"],
  format: "esm",
  logLevel: "info",
  outfile: "dist/index.js",
  platform: "node",
  target: "node22",
});
