import { tmdbApi } from "@/shared/api";

import {
  mapDiscoverParamsToTMDBParams,
  mapTMDBMovieToMovie,
} from "../../lib/mappers/tmdb-movies-mapper";
import { DEFAULT_TRENDING_TIME } from "../../model/movies-constants";
import type {
  DiscoverMoviesParams,
  PaginatedMovies,
  TrendingMoviesParams,
} from "../../model/movies-types";

export const TMDB_MOVIE_SOURCE_ID = "TMDB";

export const getTMDBTrendingMovies = async (
  params?: TrendingMoviesParams,
): Promise<PaginatedMovies> => {
  const response = await tmdbApi.trendingMovies(
    params?.timeWindow ?? DEFAULT_TRENDING_TIME,
    params,
  );
  return {
    page: response.data.page,
    results: response.data.results.map((movie) => mapTMDBMovieToMovie(movie)),
    total_results: response.data.total_results,
    total_pages: response.data.total_pages,
  };
};

export const getTMDBMovies = async (params?: DiscoverMoviesParams): Promise<PaginatedMovies> => {
  const tmdbParams = mapDiscoverParamsToTMDBParams(params);
  const response = await tmdbApi.discoverMovies(tmdbParams);
  return {
    page: response.data.page,
    results: response.data.results.map((movie) => mapTMDBMovieToMovie(movie)),
    total_results: response.data.total_results,
    total_pages: response.data.total_pages,
  };
};

export const getTMDBMovieDetails = async (id: string) => {
  const response = await tmdbApi.movieDetails(id);
  return mapTMDBMovieToMovie(response.data);
};
