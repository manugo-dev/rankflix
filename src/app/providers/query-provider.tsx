import {
  hydrate,
  HydrationBoundary,
  QueryClientProvider,
  type DehydratedState,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";

import { createQueryClient } from "@/shared/config";

interface QueryProviderProps {
  children: ReactNode;
  dehydratedState?: DehydratedState;
}

export function QueryProvider({ children, dehydratedState }: QueryProviderProps) {
  const [queryClient] = useState(() => createQueryClient());

  globalThis.__TANSTACK_QUERY_CLIENT__ = queryClient;

  // Hydrate the dehydrated state if provided (SSR)
  if (!!dehydratedState && globalThis.window !== undefined) {
    hydrate(queryClient, dehydratedState);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        {children}
        <ReactQueryDevtools buttonPosition="bottom-left" />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
