/* eslint-disable unicorn/prefer-top-level-await */
/* eslint-disable unicorn/no-process-exit */
/**
 * @typedef {import('express').Express} Express
 * @typedef {import('vite').ViteDevServer} ViteDevServer
 * @typedef {import('../src/entry-server').RenderResult} RenderResult
 * @typedef {{ render: (url: string) => Promise<RenderResult> }} RenderModule
 */

import compression from "compression";
import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sirv from "sirv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const IS_LOCAL = process.env.NODE_ENV === "local";
const BASE_URL = process.env.BASE || "/";
const PORT = Number(process.env.PORT) || 5174;

/**
 * Load HTML template
 * @param {ViteDevServer} [vite]
 * @param {string} [url]
 */
async function loadTemplate(vite, url = "/") {
  const filePath = IS_LOCAL
    ? path.join(ROOT_DIR, "index.html")
    : path.join(ROOT_DIR, "dist/client/index.html");

  let template = await fs.readFile(filePath, "utf8");

  if (IS_LOCAL && vite) {
    return await vite.transformIndexHtml(url, template);
  }

  return template;
}

/**
 * Load SSR render module
 * @param {ViteDevServer} [vite]
 * @returns {Promise<RenderModule>}
 */
async function loadRenderModule(vite) {
  if (IS_LOCAL && vite) {
    const renderModule = await vite.ssrLoadModule("src/entry-server.tsx");
    if (typeof renderModule.render !== "function") {
      throw new TypeError("SSR module does not export a 'render' function");
    }
    return { render: renderModule.render };
  }

  // In production, load the prebuilt SSR bundle from dist/server
  const entryPath = path.join(ROOT_DIR, "dist/server/entry-server.js");
  const fileUrl = pathToFileURL(entryPath).href;
  const renderModule = await import(fileUrl);
  return renderModule;
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
  if (!IS_LOCAL) {
    return;
  }

  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    appType: "custom",
    base: BASE_URL,
    root: ROOT_DIR,
    server: { middlewareMode: true },
  });
  app.use(vite.middlewares);
  return vite;
}

/**
 * Serve static assets in production
 * @param {Express} app
 */
async function registerProductionMiddleware(app) {
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
      if (vite && IS_LOCAL && vite.ssrFixStacktrace) {
        vite.ssrFixStacktrace(error);
      }
      return next(error);
    }
  };
}

/**
 * Bootstrap server
 */
(async function startServer() {
  try {
    const app = express();
    const vite = await createVite(app);

    if (!IS_LOCAL) {
      await registerProductionMiddleware(app);
    }

    app.use("/", createRequestHandler(vite));

    app.listen(PORT, () => {
      console.log(
        `✅ SSR server ready at http://localhost:${PORT} [${IS_LOCAL ? "local" : "production"}]`,
      );
    });
  } catch (error) {
    console.error("❌ Error during server bootstrap:", error);
    process.exit(1);
  }
})();
