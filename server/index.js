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
function injectAppContent(template, result, language) {
  let html = template
    .replace("<!--ssr-app-head-->", result.head || "")
    .replace("<!--ssr-app-html-->", result.html || "")
    .replace("%lang%", language || "");

  if (result.dehydrated) {
    const serialized = JSON.stringify(result.dehydrated).replaceAll("<", String.raw`\u003c`);
    html = html.replace(
      "</body>",
      `<script>window.__INITIAL_STATE__=${serialized};window.__LANGUAGE__='${language}'</script></body>`,
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

function parseCookies(header = "") {
  return (
    header
      .split(";")
      .map((pair) => pair.trim().split("="))
      // eslint-disable-next-line unicorn/no-array-reduce
      .reduce((accumulator, [key, value]) => {
        if (key && value) accumulator[key] = decodeURIComponent(value);
        return accumulator;
      }, {})
  );
}

/**
 * Detect language from request headers or cookies
 * @param {import('express').Request} request
 * @returns {string}
 */
function detectLanguage(request) {
  if (request.query.lang) {
    return request.query.lang;
  }
  const cookies = parseCookies(request.headers.cookie);
  if (cookies.language) {
    return cookies.language;
  }
  const acceptLanguage = request.headers["accept-language"];
  if (acceptLanguage) {
    // Parse the header (format: "en-US,en;q=0.9,es;q=0.8")
    const languages = acceptLanguage.split(",").map((lang) => {
      const [code] = lang.split(";");
      return code.trim().split("-")[0]; // Extract base language code
    });
    const supportedLanguages = new Set(["es", "en", "de"]);
    const detected = languages.find((lang) => supportedLanguages.has(lang));
    if (detected) {
      return detected;
    }
  }
  return "en";
}

/**
 * Main SSR handler
 * @param {ViteDevServer} [vite]
 */
function createRequestHandler(vite) {
  return async (request, response, next) => {
    try {
      const url = request.originalUrl.replace(BASE_URL, "/");
      const language = detectLanguage(request);
      const template = await loadTemplate(vite, url);
      const renderModule = await loadRenderModule(vite);
      const rendered = await renderModule.render(url, { language });
      const html = injectAppContent(template, rendered, language);
      response.append("Set-Cookie", `language=${language}; Path=/; SameSite=Lax`);
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
