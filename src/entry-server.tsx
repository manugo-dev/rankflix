import { dehydrate } from "@tanstack/react-query";
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";

import { createQueryClient } from "@/shared/config/query-client";
import { prefetchRouteData } from "@/shared/lib/prefetch";

import { App } from "./app/app";
// Register SSR routes and their prefetch functions
import "./pages/ssr";

export interface RenderResult {
  dehydrated?: unknown;
  head?: string;
  html: string;
}

export const render = async (currentUrl: string): Promise<RenderResult> => {
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
