import type { LanguageParam, Paginated, PaginatedParams } from "@/shared/api/types";
import type { ParamsObject } from "@/shared/lib/utility-types";

import type { MovieGenreId, MovieSourceIdType } from "./movies-constants";

export interface Movie {
  backdropUrl?: string;
  genres?: MovieGenreId[];
  id: string;
  overview?: string;
  posterUrl?: string;
  releaseDate?: string;
  source: MovieSourceIdType;
  title: string;
  voteAverage?: number;
  voteCount?: number;
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
  source: MovieSourceIdType;
  spoken_languages: MovieSpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
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
  language?: LanguageParam;
  timeWindow?: MovieTrendingTime;
}

export interface DiscoverMoviesParams extends ParamsObject, Partial<PaginatedParams> {
  language?: LanguageParam;
  withGenres?: MovieGenreId[];
}

export type MovieImageSize = "backdrop" | "banner" | "poster";

export interface MoviesAPIActions {
  details: (_id: string) => Promise<MovieDetail>;
  discover: (_params: DiscoverMoviesParams) => Promise<PaginatedMovies>;
  getMovieImage: (_path: string, _size?: MovieImageSize) => string;
  trending: (_params: TrendingMoviesParams) => Promise<PaginatedMovies>;
}
