/**
 * @typedef {import('express').Express} Express
 * @typedef {import('vite').ViteDevServer} ViteDevServer
 * @typedef {import('../src/entry-server').RenderResult} RenderResult
 * @typedef {{ render: (url: string) => Promise<RenderResult> }} RenderModule
 */

import fs from "node:fs/promises";
import path from "node:path";
import express from "express";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createServer as createViteServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const BASE_URL = process.env.BASE || "/";
const PORT = Number(process.env.PORT) || 5174;

/**
 * Load HTML template
 * @param {ViteDevServer} [vite]
 * @param {string} [url]
 * @returns {Promise<string>}
 */
async function loadTemplate(vite, url = "/") {
  const filePath = IS_PRODUCTION
    ? path.join(ROOT_DIR, "dist/client/index.html")
    : path.join(ROOT_DIR, "index.html");

  let template = await fs.readFile(filePath, "utf8");
  if (!IS_PRODUCTION && vite) {
    template = await vite.transformIndexHtml(url, template);
  }
  return template;
}

/**
 * Load SSR render module
 * @param {ViteDevServer} [vite]
 * @returns {Promise<RenderModule>}
 */
async function loadRenderModule(vite) {
  if (!IS_PRODUCTION && vite) {
    const module_ = await vite.ssrLoadModule("/src/entry-server.tsx");
    if (typeof module_.render !== "function") {
      throw new TypeError("SSR module does not export a 'render' function");
    }
    return { render: module_.render };
  }
  const entryPath = pathToFileURL(path.join(ROOT_DIR, "dist/server/entry-server.js"));
  return import(entryPath.href);
}

/**
 * Inject SSR HTML into template
 * @param {string} template
 * @param {RenderResult} result
 */
function injectAppContent(template, result) {
  let html = template
    .replace("<!--ssr-app-head-->", result.head || "")
    .replace("<!--ssr-app-html-->", result.html || "");

  if (result.dehydrated) {
    const serialized = JSON.stringify(result.dehydrated).replaceAll("<", String.raw`\u003c`);
    html = html.replace(
      "</body>",
      `<script>window.__INITIAL_STATE__=${serialized};</script></body>`,
    );
  }

  return html;
}

/**
 * Create Vite dev server
 * @param {Express} app
 * @returns {Promise<ViteDevServer | undefined>}
 */
async function createVite(app) {
  if (IS_PRODUCTION) {
    return;
  }
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
    base: BASE_URL,
    root: ROOT_DIR,
  });
  app.use(vite.middlewares);
  return vite;
}

/**
 * Serve static assets in production
 * @param {Express} app
 */
async function registerProductionMiddleware(app) {
  // eslint-disable-next-line unicorn/no-await-expression-member
  const compression = (await import("compression")).default;
  // eslint-disable-next-line unicorn/no-await-expression-member
  const sirv = (await import("sirv")).default;
  app.use(compression());
  app.use(BASE_URL, sirv(path.join(ROOT_DIR, "dist/client"), { extensions: [] }));
}

/**
 * Main SSR handler
 * @param {ViteDevServer} [vite]
 */
function createRequestHandler(vite) {
  return async (request, response, next) => {
    try {
      const url = request.originalUrl.replace(BASE_URL, "/");
      const template = await loadTemplate(vite, url);
      const renderModule = await loadRenderModule(vite);
      const rendered = await renderModule.render(url);
      const html = injectAppContent(template, rendered);
      return response.status(200).type("text/html").send(html);
    } catch (error) {
      if (!IS_PRODUCTION && vite) vite.ssrFixStacktrace(error);
      return next(error);
    }
  };
}

// Bootstrap the server
try {
  const app = express();
  const vite = await createVite(app);
  if (IS_PRODUCTION) {
    await registerProductionMiddleware(app);
  }
  app.use("*all", createRequestHandler(vite));
  app.listen(PORT, () => {
    console.log(
      `✅ SSR server ready at http://localhost:${PORT} [${IS_PRODUCTION ? "prod" : "dev"}]`,
    );
  });
} catch (error) {
  console.error("❌ Error during server bootstrap:", error);
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
}
