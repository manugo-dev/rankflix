import { matchPath } from "react-router";

import type { RouteConfig, RouteParams } from "@/shared/routes";

/**
 * Remove query string and hash from URL
 */
export function cleanUrl(url: string): string {
  return url.split("?")[0].split("#")[0];
}

/**
 * Extract route params from URL using a route pattern
 */
export function extractParams(url: string, pattern: string): RouteParams {
  const match = matchPath(pattern, url);
  return match?.params || {};
}

/**
 * Match a URL to a route from a collection of routes
 * @param url - The URL to match
 * @param routes - Map or array of routes to search
 * @returns The matched route or undefined
 */
export function matchRoute<T extends RouteConfig>(
  url: string,
  routes: Map<string, T> | T[],
): T | undefined {
  const cleanedUrl = cleanUrl(url);
  const routesList = routes instanceof Map ? [...routes.values()] : routes;

  for (const route of routesList) {
    if (matchPath(route.path, cleanedUrl)) {
      return route;
    }
  }

  return undefined;
}
