import { dehydrate } from "@tanstack/react-query";
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";

import { createQueryClient, i18n, type SupportedLanguage } from "@/shared/config";
import { prefetchRouteData } from "@/shared/lib/prefetch";

import { App } from "./app/app";
// Register SSR routes and their prefetch functions
import "./pages/ssr";

export interface RenderOptions {
  language?: SupportedLanguage;
}

export interface RenderResult {
  dehydrated?: unknown;
  head?: string;
  headers?: Record<string, string>;
  html: string;
}

export const render = async (
  currentUrl: string,
  options: RenderOptions = {},
): Promise<RenderResult> => {
  if (options.language) {
    i18n.changeLanguage(options.language).catch((error) => {
      console.error("Failed to change i18next language:", error);
    });
  }

  const queryClient = createQueryClient();
  await prefetchRouteData(queryClient, currentUrl);
  const dehydratedState = dehydrate(queryClient);

  const html = renderToString(
    <StrictMode>
      <StaticRouter location={currentUrl}>
        <App dehydratedState={dehydratedState} />
      </StaticRouter>
    </StrictMode>,
  );

  return {
    dehydrated: dehydratedState,
    html,
  };
};

export type RenderFunction = typeof render;
