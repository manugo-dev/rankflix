import type { Params } from "react-router";

export type RouteParams = Params;

export interface RouteConfig<T = unknown> {
  meta?: T;
  path: string;
}
