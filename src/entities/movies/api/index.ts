import {
  getTMDBMovieDetails,
  getTMDBMovies,
  getTMDBTrendingMovies,
} from "./providers/tmdb-movie-provider";

import type { MovieSourceId } from "../model/movies-constants";
import type { MoviesAPIActions } from "../model/movies-types";

export const MOVIE_QUERY_KEY = "movies";

export const movieApi = {
  TMDB: {
    trending: getTMDBTrendingMovies,
    discover: getTMDBMovies,
    details: getTMDBMovieDetails,
  },
} satisfies Record<MovieSourceId, MoviesAPIActions>;
