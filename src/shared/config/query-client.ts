import { QueryClient } from "@tanstack/react-query";

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: 1000 * 60 * 3,
      },
    },
  });

export const STALE_TIMES = {
  DAY: 1000 * 60 * 60 * 24,
  DEFAULT: 1000 * 60 * 5,
  SHORT: 1000 * 60 * 1,
  WEEK: 1000 * 60 * 60 * 24 * 7,
} as const;
