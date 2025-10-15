import type { HttpPaginatedResponse } from "../http";
import type { TMDBGenreMap } from "./tmdb-constants";

export type TMDBGenreId = (typeof TMDBGenreMap)[keyof typeof TMDBGenreMap];

export interface TMDBProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface TMDBProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface TMDBMovieDetailGenre {
  id: TMDBGenreId;
  name: string;
}

export interface TMDBSpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface TMDBMovie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: string[];
  id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TMDBMovieDetail {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: string | null;
  budget: number;
  genres: TMDBMovieDetailGenre[];
  homepage: string;
  id: number;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: TMDBProductionCompany[];
  production_countries: TMDBProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: TMDBSpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export type TMDBSortByOption =
  | "original_title.asc"
  | "original_title.desc"
  | "popularity.asc"
  | "popularity.desc"
  | "primary_release_date.asc"
  | "primary_release_date.desc"
  | "release_date.asc"
  | "release_date.desc"
  | "revenue.asc"
  | "revenue.desc"
  | "vote_average.asc"
  | "vote_average.desc"
  | "vote_count.asc"
  | "vote_count.desc";

export type TMDBWatchMonetizationType = "ads" | "buy" | "flatrate" | "free" | "rent";

export type TMDBDiscoverMoviesResponse = HttpPaginatedResponse<TMDBMovie>;
export interface TMDBDiscoverMoviesParams {
  certification?: string;
  "certification.gte"?: string;
  "certification.lte"?: string;
  certification_country?: string;
  include_adult?: boolean;
  include_video?: boolean;
  language?: string;
  page?: number;
  "primary_release_date.gte"?: string;
  "primary_release_date.lte"?: string;
  primary_release_year?: number;
  region?: string;
  "release_date.gte"?: string;
  "release_date.lte"?: string;
  sort_by?: TMDBSortByOption;
  "vote_average.gte"?: number;
  "vote_average.lte"?: number;
  "vote_count.gte"?: number;
  "vote_count.lte"?: number;
  watch_region?: string;
  with_cast?: string;
  with_companies?: string;
  with_crew?: string;
  with_genres?: string;
  with_keywords?: string;
  with_origin_country?: string;
  with_original_language?: string;
  with_people?: string;
  with_release_type?: string;
  "with_runtime.gte"?: number;
  "with_runtime.lte"?: number;
  with_watch_monetization_types?: TMDBWatchMonetizationType;
  with_watch_providers?: string;
  without_companies?: string;
  without_genres?: string;
  without_keywords?: string;
  without_watch_providers?: string;
  year?: number;
}

export interface TMDBTrendingMoviesParams {
  language?: string;
  page?: number;
}
