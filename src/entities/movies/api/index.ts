import { getTMDBMovieImage } from "../lib/mappers/tmdb-movies-mapper";
import { MovieSourceId, type MovieSourceIdType } from "../model/movies-constants";
import type { MoviesAPIActions } from "../model/movies-types";
import {
  getTMDBMovieDetail,
  getTMDBMovies,
  getTMDBSimilarMovies,
  getTMDBTrendingMovies,
} from "./providers/tmdb-movie-provider";

export const MOVIE_QUERY_KEY = "movies";

export const movieApi = {
  [MovieSourceId.TMDB]: {
    details: getTMDBMovieDetail,
    discover: getTMDBMovies,
    getMovieImage: getTMDBMovieImage,
    similar: getTMDBSimilarMovies,
    trending: getTMDBTrendingMovies,
  },
} satisfies Record<MovieSourceIdType, MoviesAPIActions>;
