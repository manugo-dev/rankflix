import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { type TMDBGenreId, TMDBGenreMap } from "@/shared/api/tmdb";
import { ENVIRONMENT } from "@/shared/config";

import {
  MOCKED_MAPPED_MOVIES,
  MOCKED_TMDB_MOVIE_DETAIL,
  MOCKED_TMDB_MOVIES,
} from "../../__mocks__";
import { MovieGenreMap, MovieSourceId } from "../../model/movies-constants";
import type { DiscoverMoviesParams } from "../../model/movies-types";
import {
  getTMDBMovieImage,
  mapDiscoverParamsToTMDBParams,
  mapMovieGenreIdToTMDBGenreId,
  mapTMDBGenreIdToMovieGenreId,
  mapTMDBMovieDetailToMovieDetail,
  mapTMDBMovieToMovie,
  tmdbImageSizes,
} from "./tmdb-movies-mapper";

const ORIGINAL_IMAGE_BASE_URL = ENVIRONMENT.TMDB_IMAGE_BASE_URL;

describe("tmdb-movies-mapper", () => {
  beforeEach(() => {
    (ENVIRONMENT as { TMDB_IMAGE_BASE_URL: string }).TMDB_IMAGE_BASE_URL =
      "https://images.tmdb.test";
  });

  afterAll(() => {
    (ENVIRONMENT as { TMDB_IMAGE_BASE_URL: string }).TMDB_IMAGE_BASE_URL = ORIGINAL_IMAGE_BASE_URL;
  });

  it("builds image URLs using default size when not provided", () => {
    const url = getTMDBMovieImage("path.jpg");
    expect(url).toBe(`https://images.tmdb.test/${tmdbImageSizes.poster}/path.jpg`);
  });

  it("builds image URLs using provided size", () => {
    const url = getTMDBMovieImage("banner.jpg", "banner");
    expect(url).toBe(`https://images.tmdb.test/${tmdbImageSizes.banner}/banner.jpg`);
  });

  it("maps TMDB movie to Movie with parsed dates and optional fields", () => {
    const movie = mapTMDBMovieToMovie(MOCKED_TMDB_MOVIES[0]);
    expect(movie).toStrictEqual(MOCKED_MAPPED_MOVIES[0]);
    expect(movie.releaseDate?.toISOString()).toBe("2024-01-01T00:00:00.000Z");
  });

  it("maps TMDB movie detail to MovieDetail including genres and nested collections", () => {
    const detail = mapTMDBMovieDetailToMovieDetail(MOCKED_TMDB_MOVIE_DETAIL);

    expect(detail.id).toBe("42");
    expect(detail.source).toBe(MovieSourceId.TMDB);
    expect(detail.genres).toEqual([MovieGenreMap.ACTION, MovieGenreMap.DRAMA]);
    expect(detail.productionCompanies[0]).toEqual({
      id: 1,
      logoPath: undefined,
      name: "Studio",
      originCountry: undefined,
    });
    expect(detail.productionCountries[0]).toEqual({ isoCode: "US", name: "United States" });
    expect(detail.spokenLanguages).toEqual(["English", "Español"]);
    expect(detail.releaseDate.toISOString()).toBe("2024-02-01T00:00:00.000Z");
  });

  it("maps TMDB genre id to Movie genre id when known", () => {
    const mapped = mapTMDBGenreIdToMovieGenreId(TMDBGenreMap.action);
    expect(mapped).toBe(MovieGenreMap.ACTION);
  });

  it("returns undefined when TMDB genre id is unknown", () => {
    const mapped = mapTMDBGenreIdToMovieGenreId("999" as unknown as TMDBGenreId);
    expect(mapped).toBeUndefined();
  });

  it("maps Movie genre id to TMDB genre id when known", () => {
    const mapped = mapMovieGenreIdToTMDBGenreId(MovieGenreMap.ACTION);
    expect(mapped).toBe(TMDBGenreMap.action);
  });

  it("returns undefined when Movie genre id is undefined", () => {
    const mapped = mapMovieGenreIdToTMDBGenreId(undefined);
    expect(mapped).toBeUndefined();
  });

  it("maps discover params to TMDB params with sorted TMDB genre ids", () => {
    const params: DiscoverMoviesParams = {
      withGenres: [MovieGenreMap.ACTION, MovieGenreMap.DRAMA],
    };

    const result = mapDiscoverParamsToTMDBParams(params);
    expect(result).toEqual({ with_genres: "18,28" });
  });

  it("maps discover params without genres to empty string", () => {
    const result = mapDiscoverParamsToTMDBParams();
    expect(result).toEqual({ with_genres: "" });
  });
});
