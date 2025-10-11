import {
  getTMDBMovieDetail,
  getTMDBMovies,
  getTMDBTrendingMovies,
} from "./providers/tmdb-movie-provider";

import { MovieSourceId, type MovieSourceIdType } from "../model/movies-constants";
import type { MoviesAPIActions } from "../model/movies-types";

export const MOVIE_QUERY_KEY = "movies";

export const movieApi = {
  [MovieSourceId.TMDB]: {
    trending: getTMDBTrendingMovies,
    discover: getTMDBMovies,
    details: getTMDBMovieDetail,
  },
} satisfies Record<MovieSourceIdType, MoviesAPIActions>;
