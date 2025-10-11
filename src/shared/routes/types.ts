import type { Params } from "react-router";

export type RouteParams = Params;

export interface RouteConfig<T = unknown> {
  path: string;
  meta?: T;
}
