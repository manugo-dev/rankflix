import {
  TMDBGenreMap,
  type TMDBDiscoverMoviesParams,
  type TMDBGenreId,
  type TMDBMovie,
} from "@/shared/api";
import { sortedValuesToString } from "@/shared/lib/array";

import { TMDB_MOVIE_SOURCE_ID } from "../../api/providers/tmdb-movie-provider";
import { MovieGenreMap, type MovieGenreId } from "../../model/movies-constants";
import type { DiscoverMoviesParams, Movie } from "../../model/movies-types";

/*
==============================================
From TMDB provider model to Movie model
==============================================
*/

export const mapTMDBMovieToMovie = (tmdbMovie: TMDBMovie): Movie => {
  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title,
    overview: tmdbMovie.overview,
    releaseDate: tmdbMovie.release_date,
    posterUrl: tmdbMovie.poster_path ?? undefined,
    backdropUrl: tmdbMovie.backdrop_path ?? undefined,
    voteAverage: tmdbMovie.vote_average,
    voteCount: tmdbMovie.vote_count,
    source: TMDB_MOVIE_SOURCE_ID,
  };
};

/* 
==============================================
From Movie model to TMDB provider model 
==============================================
*/

export const mapMovieGenreIdToTMDBGenreId = (genreId?: MovieGenreId): TMDBGenreId | undefined => {
  const movieGenreToTMDBGenreMap: Record<MovieGenreId, TMDBGenreId> = {
    [MovieGenreMap.ACTION]: TMDBGenreMap.action,
    [MovieGenreMap.ADVENTURE]: TMDBGenreMap.adventure,
    [MovieGenreMap.ANIMATION]: TMDBGenreMap.animation,
    [MovieGenreMap.COMEDY]: TMDBGenreMap.comedy,
    [MovieGenreMap.CRIME]: TMDBGenreMap.crime,
    [MovieGenreMap.DOCUMENTARY]: TMDBGenreMap.documentary,
    [MovieGenreMap.DRAMA]: TMDBGenreMap.drama,
    [MovieGenreMap.FAMILY]: TMDBGenreMap.family,
    [MovieGenreMap.FANTASY]: TMDBGenreMap.fantasy,
    [MovieGenreMap.HISTORY]: TMDBGenreMap.history,
    [MovieGenreMap.HORROR]: TMDBGenreMap.horror,
    [MovieGenreMap.MUSIC]: TMDBGenreMap.music,
    [MovieGenreMap.MYSTERY]: TMDBGenreMap.mystery,
    [MovieGenreMap.ROMANCE]: TMDBGenreMap.romance,
    [MovieGenreMap.SCIENCE_FICTION]: TMDBGenreMap.science_fiction,
    [MovieGenreMap.TV_MOVIE]: TMDBGenreMap.tv_movie,
    [MovieGenreMap.THRILLER]: TMDBGenreMap.thriller,
    [MovieGenreMap.WAR]: TMDBGenreMap.war,
    [MovieGenreMap.WESTERN]: TMDBGenreMap.western,
  };

  return genreId ? movieGenreToTMDBGenreMap[genreId] : undefined;
};

export const mapDiscoverParamsToTMDBParams = (
  params?: DiscoverMoviesParams,
): TMDBDiscoverMoviesParams => {
  return {
    with_genres: sortedValuesToString(
      params?.withGenres?.map((genre) => mapMovieGenreIdToTMDBGenreId(genre)),
    ),
  };
};
