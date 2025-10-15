import { tmdbClient } from "./tmdb-client";
import type {
  TMDBDiscoverMoviesParams,
  TMDBDiscoverMoviesResponse,
  TMDBTrendingMoviesParams,
} from "./tmdb-types";

export const TMDB_ENDPOINTS = {
  DISCOVER_MOVIE: () => "/discover/movie",
  MOVIE_DETAILS: (id: string) => `/movie/${id}`,
  SIMILAR_MOVIES: (id: string) => `/movie/${id}/similar`,
  TRENDING_MOVIES: (time?: "day" | "week") => `/trending/movie/${time ?? "day"}`,
} as const;

export const tmdbApi = {
  discoverMovies: (params?: TMDBDiscoverMoviesParams) =>
    tmdbClient.get<TMDBDiscoverMoviesResponse>(TMDB_ENDPOINTS.DISCOVER_MOVIE(), {
      params: params,
    }),

  movieDetail: (id: string) => tmdbClient.get(TMDB_ENDPOINTS.MOVIE_DETAILS(id)),

  similarMovies: (id: string) =>
    tmdbClient.get<TMDBDiscoverMoviesResponse>(TMDB_ENDPOINTS.SIMILAR_MOVIES(id)),

  trendingMovies: (time: "day" | "week", params?: TMDBTrendingMoviesParams) =>
    tmdbClient.get<TMDBDiscoverMoviesResponse>(TMDB_ENDPOINTS.TRENDING_MOVIES(time), {
      params: params,
    }),
};
