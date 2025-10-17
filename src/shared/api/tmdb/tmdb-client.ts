import { ENVIRONMENT } from "@/shared/config";

import { createHttpClient } from "../http";

export const tmdbClient = createHttpClient({
  baseURL: ENVIRONMENT.TMDB_BASE_URL,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

// Add API key to all requests
tmdbClient.interceptors.request.use((config) => {
  config.params = { ...config.params, api_key: ENVIRONMENT.TMDB_API_KEY };
  return config;
});

// Add language to all requests (works in both client and SSR)
// registerLanguageInterceptor(tmdbClient);
