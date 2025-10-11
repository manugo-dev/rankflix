import type { LanguageParam, Paginated, PaginatedParams } from "@/shared/api";
import type { ParamsObject } from "@/shared/lib/utility-types";

import type { MovieGenreId, MovieSourceIdType } from "./movies-constants";

export interface Movie {
  id: string;
  title: string;
  overview?: string;
  posterUrl?: string;
  backdropUrl?: string;
  releaseDate?: string;
  voteAverage?: number;
  voteCount?: number;
  genres?: MovieGenreId[];
  source: MovieSourceIdType;
}

export type Movies = Movie[];

export interface MovieDetail {
  adult: boolean;
  backdrop_path: string;
  budget: number;
  genres: MovieGenreId[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: MovieSpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  source: MovieSourceIdType;
}

export interface MovieGenre {
  id: number;
  name: string;
}

export interface MovieSpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export type MovieTrendingTime = "day" | "week";

export type PaginatedMovies = Paginated<Movie>;

export interface TrendingMoviesParams extends ParamsObject, Partial<PaginatedParams> {
  timeWindow?: MovieTrendingTime;
  language?: LanguageParam;
}

export interface DiscoverMoviesParams extends ParamsObject, Partial<PaginatedParams> {
  withGenres?: MovieGenreId[];
  language?: LanguageParam;
}

export interface MoviesAPIActions {
  trending: (_params: TrendingMoviesParams) => Promise<PaginatedMovies>;
  discover: (_params: DiscoverMoviesParams) => Promise<PaginatedMovies>;
  details: (_id: string) => Promise<MovieDetail>;
}
