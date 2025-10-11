import type { LanguageParam, Paginated, PaginatedParams } from "@/shared/api";
import type { ParamsObject } from "@/shared/lib/utility-types";

import type { MovieGenreId, MovieSourceId } from "./movies-constants";

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
  source: MovieSourceId;
}

export type Movies = Movie[];

export interface MovieDetail {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: string | null;
  budget: number;
  genres: MovieGenre[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: MovieProductionCompany[];
  production_countries: MovieProductionCountry[];
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
}

export interface MovieGenre {
  id: number;
  name: string;
}

export interface MovieProductionCompany {
  id: number;
  logo_path?: string;
  name: string;
  origin_country: string;
}

export interface MovieProductionCountry {
  iso_3166_1: string;
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
  details: (_id: string) => Promise<Movie>;
}
