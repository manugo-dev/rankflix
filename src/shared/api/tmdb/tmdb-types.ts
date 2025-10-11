import type { TMDBGenreMap } from "./tmdb-constants";

import type { HttpPaginatedResponse } from "../http";

export type TMDBGenreId = (typeof TMDBGenreMap)[keyof typeof TMDBGenreMap];

export interface TMDBMovie {
  id: string;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: string[];
  adult: boolean;
  original_language: string;
  video: boolean;
}

export type TMDBSortByOption =
  | "popularity.asc"
  | "popularity.desc"
  | "release_date.asc"
  | "release_date.desc"
  | "revenue.asc"
  | "revenue.desc"
  | "primary_release_date.asc"
  | "primary_release_date.desc"
  | "original_title.asc"
  | "original_title.desc"
  | "vote_average.asc"
  | "vote_average.desc"
  | "vote_count.asc"
  | "vote_count.desc";

export type TMDBWatchMonetizationType = "flatrate" | "free" | "ads" | "rent" | "buy";

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
  primary_release_year?: number;
  "primary_release_date.gte"?: string;
  "primary_release_date.lte"?: string;
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
