import { QueryClient } from "@tanstack/react-query";

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 3,
      },
    },
  });

export const STALE_TIMES = {
  SHORT: 1000 * 60 * 1,
  DEFAULT: 1000 * 60 * 5,
  DAY: 1000 * 60 * 60 * 24,
  WEEK: 1000 * 60 * 60 * 24 * 7,
} as const;
