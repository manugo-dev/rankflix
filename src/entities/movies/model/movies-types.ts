import type { Paginated, PaginatedParams } from "@/shared/api/types";
import type { ParamsObject } from "@/shared/lib/utility-types";

import type { MovieGenreId, MovieSourceIdType } from "./movies-constants";

export interface Movie {
  backdropPath?: string;
  genres?: MovieGenreId[];
  id: string;
  overview?: string;
  posterPath?: string;
  releaseDate?: Date;
  source: MovieSourceIdType;
  title: string;
  voteAverage?: number;
  voteCount?: number;
}
export type Movies = Movie[];

export interface MovieProductionCompany {
  id: number;
  logoPath?: string;
  name: string;
  originCountry?: string;
}

export interface MovieProductionCountry {
  isoCode: string;
  name: string;
}

export interface MovieDetail {
  adult: boolean;
  backdropPath: string;
  budget: number;
  genres?: MovieGenreId[];
  homepage: string;
  id: string;
  imdbId: string;
  originalLanguage: string;
  originalTitle: string;
  overview: string;
  popularity: number;
  posterPath: string;
  productionCompanies?: MovieProductionCompany[];
  productionCountries?: MovieProductionCountry[];
  releaseDate: Date;
  revenue: number;
  runtimeMilliseconds?: number;
  source: MovieSourceIdType;
  spokenLanguages?: string[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  voteAverage: number;
  voteCount: number;
}

export interface MovieGenre {
  id: number;
  name: string;
}

export type MovieTrendingTime = "day" | "week";

export type PaginatedMovies = Paginated<Movie>;

export interface TrendingMoviesParams extends ParamsObject, Partial<PaginatedParams> {
  language?: string;
  timeWindow?: MovieTrendingTime;
}

export interface DiscoverMoviesParams extends ParamsObject, Partial<PaginatedParams> {
  language?: string;
  withGenres?: MovieGenreId[];
}

export type MovieImageSize = "backdrop" | "banner" | "poster";

export interface MoviesAPIActions {
  details: (_id: string, _language: string) => Promise<MovieDetail>;
  discover: (_params: DiscoverMoviesParams) => Promise<PaginatedMovies>;
  getMovieImage: (_path: string, _size?: MovieImageSize) => string;
  similar: (_id: string, _language: string) => Promise<PaginatedMovies>;
  trending: (_params: TrendingMoviesParams, _language: string) => Promise<PaginatedMovies>;
}
