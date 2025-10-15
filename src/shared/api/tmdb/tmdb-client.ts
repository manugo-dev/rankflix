import { ENVIRONMENT } from "@/shared/config";

import { createHttpClient } from "../http";

export const tmdbClient = createHttpClient({
  baseURL: ENVIRONMENT.TMDB_BASE_URL,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

tmdbClient.interceptors.request.use((config) => {
  config.params = { ...config.params, api_key: ENVIRONMENT.TMDB_API_KEY };
  return config;
});
