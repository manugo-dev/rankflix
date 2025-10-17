/* eslint-disable no-var */
/// <reference types="vite/client" />

import type { DehydratedState, QueryClient } from "@tanstack/react-query";

export declare global {
  declare namespace globalThis {
    var __INITIAL_STATE__: DehydratedState | undefined;
    var __TANSTACK_QUERY_CLIENT__: QueryClient;
    var __LANGUAGE__: string | undefined;
  }
}
