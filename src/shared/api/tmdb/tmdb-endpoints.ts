import { tmdbClient } from "./tmdb-client";
import type {
  TMDBDiscoverMoviesParams,
  TMDBDiscoverMoviesResponse,
  TMDBTrendingMoviesParams,
} from "./tmdb-types";

const TMDB_ENDPOINTS = {
  TRENDING_MOVIES: (time?: "day" | "week") => `/trending/movie/${time ?? "day"}`,
  DISCOVER_MOVIE: () => "/discover/movie",
  MOVIE_DETAILS: (id: string) => `/movie/${id}`,
} as const;

export const tmdbApi = {
  trendingMovies: (time: "day" | "week", params?: TMDBTrendingMoviesParams) =>
    tmdbClient.get<TMDBDiscoverMoviesResponse>(TMDB_ENDPOINTS.TRENDING_MOVIES(time), {
      params: params,
    }),

  discoverMovies: (params?: TMDBDiscoverMoviesParams) =>
    tmdbClient.get<TMDBDiscoverMoviesResponse>(TMDB_ENDPOINTS.DISCOVER_MOVIE(), {
      params: params,
    }),

  movieDetails: (id: string) => tmdbClient.get(TMDB_ENDPOINTS.MOVIE_DETAILS(id)),
};
