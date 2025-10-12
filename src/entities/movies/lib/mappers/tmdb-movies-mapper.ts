import {
  type TMDBDiscoverMoviesParams,
  type TMDBGenreId,
  TMDBGenreMap,
  type TMDBMovie,
  type TMDBMovieDetail,
} from "@/shared/api/tmdb";
import { ENVIRONMENT } from "@/shared/config";
import { sortedValuesToString } from "@/shared/lib/array";
import { createBidirectionalMap } from "@/shared/lib/mapping";

import { type MovieGenreId, MovieGenreMap, MovieSourceId } from "../../model/movies-constants";
import type { DiscoverMoviesParams, Movie, MovieDetail } from "../../model/movies-types";

export const tmdbImageSizes = {
  backdrop: "w780",
  banner: "w1920_and_h800_multi_faces",
  poster: "w342",
};

export const getTMDBMovieImage = (path?: string, size?: keyof typeof tmdbImageSizes) => {
  return `${ENVIRONMENT.TMDB_IMAGE_BASE_URL}/${size ? tmdbImageSizes[size] : tmdbImageSizes.poster}/${path}`;
};

export const tmdbGenreMap = createBidirectionalMap<MovieGenreId, TMDBGenreId>({
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
});

/*
==============================================
From TMDB provider model to Movie model
==============================================
*/

export const mapTMDBMovieToMovie = (tmdbMovie: TMDBMovie): Movie => {
  return {
    backdropUrl: tmdbMovie.backdrop_path ?? undefined,
    id: tmdbMovie.id,
    overview: tmdbMovie.overview,
    posterUrl: tmdbMovie.poster_path ?? undefined,
    releaseDate: tmdbMovie.release_date,
    source: MovieSourceId.TMDB,
    title: tmdbMovie.title,
    voteAverage: tmdbMovie.vote_average,
    voteCount: tmdbMovie.vote_count,
  };
};

export const mapTMDBMovieDetailToMovieDetail = (tmdbMovie: TMDBMovieDetail): MovieDetail => {
  return {
    adult: tmdbMovie.adult,
    backdrop_path: tmdbMovie.backdrop_path,
    budget: tmdbMovie.budget,
    genres: tmdbMovie.genres
      .map((genreId) => mapTMDBGenreIdToMovieGenreId(genreId))
      .filter((genreId) => !!genreId),
    homepage: tmdbMovie.homepage,
    id: tmdbMovie.id,
    imdb_id: tmdbMovie.imdb_id,
    original_language: tmdbMovie.original_language,
    original_title: tmdbMovie.original_title,
    overview: tmdbMovie.overview,
    popularity: tmdbMovie.popularity,
    poster_path: tmdbMovie.poster_path,
    release_date: tmdbMovie.release_date,
    revenue: tmdbMovie.revenue,
    runtime: tmdbMovie.runtime,
    source: MovieSourceId.TMDB,
    spoken_languages: tmdbMovie.spoken_languages.map((language) => ({
      english_name: language.english_name,
      iso_639_1: language.iso_639_1,
      name: language.name,
    })),
    status: tmdbMovie.status,
    tagline: tmdbMovie.tagline,
    title: tmdbMovie.title,
    video: tmdbMovie.video,
    vote_average: tmdbMovie.vote_average,
    vote_count: tmdbMovie.vote_count,
  };
};

export const mapTMDBGenreIdToMovieGenreId = (genreId?: TMDBGenreId): MovieGenreId | undefined => {
  return tmdbGenreMap.toKey(genreId);
};

/* 
==============================================
From Movie model to TMDB provider model 
==============================================
*/

export const mapMovieGenreIdToTMDBGenreId = (genreId?: MovieGenreId): TMDBGenreId | undefined => {
  return tmdbGenreMap.toValue(genreId);
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
