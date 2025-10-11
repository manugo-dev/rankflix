export const ENVIRONMENT = {
  TMDB_API_KEY: import.meta.env.VITE_TMDB_API_KEY || "",
  TMDB_BASE_URL: "https://api.themoviedb.org/3",
} as const;
