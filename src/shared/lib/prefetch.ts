import { type QueryClient } from "@tanstack/react-query";

import { extractParams, matchRoute } from "@/shared/lib/route";
import type { RouteParams } from "@/shared/routes";

export interface PrefetchContext {
  params: RouteParams;
  queryClient: QueryClient;
  url: string;
}

export type PrefetchFunction = (_context: PrefetchContext) => Promise<void>;

export interface SSRRouteConfig {
  path: string;
  prefetch?: PrefetchFunction;
}

const routes = new Map<string, SSRRouteConfig>();

/**
 * Register a route with optional SSR prefetch function
 */
export function registerRoute(config: SSRRouteConfig): void {
  routes.set(config.path, config);
}

/**
 * Prefetch data for a given URL during SSR
 * Matches the URL to a registered route and executes its prefetch function
 */
export async function prefetchRouteData(queryClient: QueryClient, url: string): Promise<void> {
  const config = matchRoute(url, routes);

  if (!config?.prefetch) return;

  try {
    const params = extractParams(url, config.path);
    const context: PrefetchContext = { params: params, queryClient, url };
    await config.prefetch(context);
  } catch (error) {
    console.error(`Prefetch error for ${url}:`, error);
  }
}
