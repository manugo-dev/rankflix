import type { MovieTrendingTime } from "./movies-types";

export const DEFAULT_TRENDING_TIME: MovieTrendingTime = "day";
export const DEFAULT_BANNER_PATH = "https://via.placeholder.com/1280x800?text=No+Image";

export const MovieSourceId = {
  TMDB: "TMDB",
} as const;

export const MovieSourceName = {
  [MovieSourceId.TMDB]: "The Movie Database",
} as const;

export type MovieSourceNameType = (typeof MovieSourceName)[keyof typeof MovieSourceName];
export type MovieSourceIdType = keyof typeof MovieSourceId;

export const MovieGenreMap = {
  ACTION: "movie.genre.action",
  ADVENTURE: "movie.genre.adventure",
  ANIMATION: "movie.genre.animation",
  COMEDY: "movie.genre.comedy",
  CRIME: "movie.genre.crime",
  DOCUMENTARY: "movie.genre.documentary",
  DRAMA: "movie.genre.drama",
  FAMILY: "movie.genre.family",
  FANTASY: "movie.genre.fantasy",
  HISTORY: "movie.genre.history",
  HORROR: "movie.genre.horror",
  MUSIC: "movie.genre.music",
  MYSTERY: "movie.genre.mystery",
  ROMANCE: "movie.genre.romance",
  SCIENCE_FICTION: "movie.genre.science_fiction",
  THRILLER: "movie.genre.thriller",
  TV_MOVIE: "movie.genre.tv_movie",
  WAR: "movie.genre.war",
  WESTERN: "movie.genre.western",
} as const;

export type MovieGenreId = (typeof MovieGenreMap)[keyof typeof MovieGenreMap];
export type MovieGenreValue = keyof typeof MovieGenreMap;
