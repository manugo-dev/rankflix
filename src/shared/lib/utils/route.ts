import { matchPath, type Params } from "react-router";

export function cleanUrl(url: string): string {
  return url.split("?")[0].split("#")[0];
}

export function extractParameters(url: string, pattern: string): Params {
  const match = matchPath(pattern, url);
  return match?.params || {};
}

export function matchRoute<T extends { path: string }>(
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
