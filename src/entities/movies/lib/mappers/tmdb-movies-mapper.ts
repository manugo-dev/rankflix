import {
  type TMDBDiscoverMoviesParams,
  type TMDBGenreId,
  TMDBGenreMap,
  type TMDBMovie,
  type TMDBMovieDetail,
} from "@/shared/api/tmdb";
import { ENVIRONMENT } from "@/shared/config";
import { sortedValuesToString } from "@/shared/lib/array";
import { parseDate } from "@/shared/lib/date";
import { createBidirectionalMap } from "@/shared/lib/mapping";

import { type MovieGenreId, MovieGenreMap, MovieSourceId } from "../../model/movies-constants";
import type {
  DiscoverMoviesParams,
  Movie,
  MovieDetail,
  MovieImageSize,
} from "../../model/movies-types";

export const tmdbImageSizes: Record<MovieImageSize, string> = {
  backdrop: "w780",
  banner: "w1920_and_h800_multi_faces",
  poster: "w342",
};

export const getTMDBMovieImage = (path?: string, size?: keyof typeof tmdbImageSizes) => {
  return `${ENVIRONMENT.TMDB_IMAGE_BASE_URL}/${size ? tmdbImageSizes[size] : tmdbImageSizes.poster}/${path}`;
};

export const tmdbGenreMap = createBidirectionalMap<MovieGenreId, TMDBGenreId>({
  [MovieGenreMap.ACTION]: TMDBGenreMap.action,
  [MovieGenreMap.DRAMA]: TMDBGenreMap.drama,
  [MovieGenreMap.ADVENTURE]: TMDBGenreMap.adventure,
  [MovieGenreMap.ANIMATION]: TMDBGenreMap.animation,
  [MovieGenreMap.COMEDY]: TMDBGenreMap.comedy,
  [MovieGenreMap.CRIME]: TMDBGenreMap.crime,
  [MovieGenreMap.DOCUMENTARY]: TMDBGenreMap.documentary,
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
    backdropPath: tmdbMovie.backdrop_path ?? undefined,
    id: tmdbMovie.id.toString(),
    overview: tmdbMovie.overview,
    posterPath: tmdbMovie.poster_path ?? undefined,
    releaseDate: tmdbMovie.release_date ? parseDate(tmdbMovie.release_date) : undefined,
    source: MovieSourceId.TMDB,
    title: tmdbMovie.title,
    voteAverage: tmdbMovie.vote_average,
    voteCount: tmdbMovie.vote_count,
  };
};

export const mapTMDBMovieDetailToMovieDetail = (tmdbMovie: TMDBMovieDetail): MovieDetail => {
  return {
    adult: tmdbMovie.adult,
    backdropPath: tmdbMovie.backdrop_path,
    budget: tmdbMovie.budget,
    genres: tmdbMovie.genres
      .map((genre) => mapTMDBGenreIdToMovieGenreId(genre.id))
      .filter((genre) => !!genre),
    homepage: tmdbMovie.homepage,
    id: tmdbMovie.id.toString(),
    imdbId: tmdbMovie.imdb_id,
    originalLanguage: tmdbMovie.original_language,
    originalTitle: tmdbMovie.original_title,
    overview: tmdbMovie.overview,
    popularity: tmdbMovie.popularity,
    posterPath: tmdbMovie.poster_path,
    productionCompanies: tmdbMovie.production_companies.map((company) => ({
      id: company.id,
      logoPath: company.logo_path ?? undefined,
      name: company.name,
      originCountry: company.origin_country || undefined,
    })),
    productionCountries: tmdbMovie.production_countries.map((country) => ({
      isoCode: country.iso_3166_1,
      name: country.name,
    })),
    releaseDate: tmdbMovie.release_date ? parseDate(tmdbMovie.release_date) : undefined,
    revenue: tmdbMovie.revenue,
    runtimeMilliseconds: tmdbMovie.runtime ? tmdbMovie.runtime * 60 * 1000 : undefined,
    source: MovieSourceId.TMDB,
    spokenLanguages: tmdbMovie.spoken_languages.map(
      (language) => language.english_name || language.name,
    ),
    status: tmdbMovie.status,
    tagline: tmdbMovie.tagline,
    title: tmdbMovie.title,
    video: tmdbMovie.video,
    voteAverage: tmdbMovie.vote_average,
    voteCount: tmdbMovie.vote_count,
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
    language: params?.language,
    with_genres: sortedValuesToString(
      params?.withGenres?.map((genre) => mapMovieGenreIdToTMDBGenreId(genre)),
    ),
  };
};
