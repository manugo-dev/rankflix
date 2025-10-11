import type { MovieTrendingTime } from "./movies-types";

export const DEFAULT_TRENDING_TIME: MovieTrendingTime = "day";

export const MovieSourceId = {
  TMDB: "TMDB",
} as const;

export const MovieSourceName = {
  [MovieSourceId.TMDB]: "The Movie Database",
} as const;

export type MovieSourceNameType = (typeof MovieSourceName)[keyof typeof MovieSourceName];
export type MovieSourceIdType = keyof typeof MovieSourceId;

export const MovieGenreMap = {
  ACTION: "genres.ACTION",
  ADVENTURE: "genres.ADVENTURE",
  ANIMATION: "genres.ANIMATION",
  COMEDY: "genres.COMEDY",
  CRIME: "genres.CRIME",
  DOCUMENTARY: "genres.DOCUMENTARY",
  DRAMA: "genres.DRAMA",
  FAMILY: "genres.FAMILY",
  FANTASY: "genres.FANTASY",
  HISTORY: "genres.HISTORY",
  HORROR: "genres.HORROR",
  MUSIC: "genres.MUSIC",
  MYSTERY: "genres.MYSTERY",
  ROMANCE: "genres.ROMANCE",
  SCIENCE_FICTION: "genres.SCIENCE_FICTION",
  TV_MOVIE: "genres.TV_MOVIE",
  THRILLER: "genres.THRILLER",
  WAR: "genres.WAR",
  WESTERN: "genres.WESTERN",
} as const;

export type MovieGenreId = (typeof MovieGenreMap)[keyof typeof MovieGenreMap];
export type MovieGenreValue = keyof typeof MovieGenreMap;
