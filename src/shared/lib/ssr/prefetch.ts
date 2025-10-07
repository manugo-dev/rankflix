import { QueryClient } from "@tanstack/react-query";
import { type Params } from "react-router";

import { matchRoute, extractParameters } from "@/shared/lib/utils/route";

export interface PrefetchContext {
  queryClient: QueryClient;
  params: Params;
  url: string;
}

export type PrefetchFunction = (_context: PrefetchContext) => Promise<void>;

export interface RouteConfig {
  path: string;
  prefetch?: PrefetchFunction;
}

const routes = new Map<string, RouteConfig>();

export function registerRoute(config: RouteConfig) {
  routes.set(config.path, config);
}

export async function prefetchRouteData(queryClient: QueryClient, url: string): Promise<void> {
  const config = matchRoute(url, routes);

  if (!config?.prefetch) return;

  try {
    const parameters = extractParameters(url, config.path);
    await config.prefetch({ queryClient, params: parameters, url });
  } catch (error) {
    console.error(`Prefetch error for ${url}:`, error);
  }
}
