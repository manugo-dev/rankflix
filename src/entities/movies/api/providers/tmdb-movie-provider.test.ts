import { describe, expect, it, vi } from "vitest";

import {
  MOCKED_MAPPED_MOVIE_DETAIL,
  MOCKED_MAPPED_MOVIES,
  MOCKED_TMDB_MOVIE_DETAIL,
  MOCKED_TMDB_MOVIES,
} from "@/entities/movies/__mocks__";
import { tmdbApi, type TMDBDiscoverMoviesParams } from "@/shared/api/tmdb";

import * as mapper from "../../lib/mappers/tmdb-movies-mapper";
import { DEFAULT_TRENDING_TIME } from "../../model/movies-constants";
import type { DiscoverMoviesParams, TrendingMoviesParams } from "../../model/movies-types";
import {
  getTMDBMovieDetail,
  getTMDBMovies,
  getTMDBSimilarMovies,
  getTMDBTrendingMovies,
} from "./tmdb-movie-provider";

describe("tmdb-movie-provider", () => {
  describe("getTMDBTrendingMovies", () => {
    it("uses default time window and maps results", async () => {
      const mapMovieSpy = vi
        .spyOn(mapper, "mapTMDBMovieToMovie")
        .mockReturnValue(MOCKED_MAPPED_MOVIES[0]);
      const trendingMoviesSpy = vi.spyOn(tmdbApi, "trendingMovies").mockResolvedValue({
        data: { page: 1, results: [MOCKED_TMDB_MOVIES[0]], total_pages: 3, total_results: 1 },
      } as Awaited<ReturnType<typeof tmdbApi.trendingMovies>>);

      const result = await getTMDBTrendingMovies();

      expect(trendingMoviesSpy).toHaveBeenCalledWith(DEFAULT_TRENDING_TIME, undefined);
      expect(mapMovieSpy).toHaveBeenCalledWith(MOCKED_TMDB_MOVIES[0]);
      expect(result).toEqual({
        page: 1,
        results: [MOCKED_MAPPED_MOVIES[0]],
        total_pages: 3,
        total_results: 1,
      });
    });

    it("forwards supplied params and time window to API", async () => {
      vi.spyOn(mapper, "mapTMDBMovieToMovie").mockReturnValue(MOCKED_MAPPED_MOVIES[0]);
      const trendingMoviesSpy = vi
        .spyOn(tmdbApi, "trendingMovies")
        .mockResolvedValue({ data: { results: [MOCKED_TMDB_MOVIES[0]] } } as Awaited<
          ReturnType<typeof tmdbApi.trendingMovies>
        >);

      const params: TrendingMoviesParams = { page: 2, timeWindow: "week" };
      await getTMDBTrendingMovies(params);
      expect(trendingMoviesSpy).toHaveBeenCalledWith("week", params);
    });
  });

  describe("getTMDBMovies", () => {
    it("maps discover params before delegating to API and maps results", async () => {
      const mappedParams: TMDBDiscoverMoviesParams = { with_genres: "28" };
      const discoverParams: DiscoverMoviesParams = { language: "en" };

      const mapParamsSpy = vi
        .spyOn(mapper, "mapDiscoverParamsToTMDBParams")
        .mockReturnValue(mappedParams);
      const mapMovieSpy = vi
        .spyOn(mapper, "mapTMDBMovieToMovie")
        .mockReturnValue(MOCKED_MAPPED_MOVIES[0]);
      const discoverMoviesSpy = vi.spyOn(tmdbApi, "discoverMovies").mockResolvedValue({
        data: {
          page: 2,
          results: [MOCKED_TMDB_MOVIES[0]],
          total_pages: 5,
          total_results: 42,
        },
      } as Awaited<ReturnType<typeof tmdbApi.discoverMovies>>);

      const result = await getTMDBMovies(discoverParams);
      expect(mapParamsSpy).toHaveBeenCalledWith(discoverParams);
      expect(discoverMoviesSpy).toHaveBeenCalledWith(mappedParams);
      expect(mapMovieSpy).toHaveBeenCalledWith(MOCKED_TMDB_MOVIES[0]);
      expect(result).toEqual({
        page: 2,
        results: [MOCKED_MAPPED_MOVIES[0]],
        total_pages: 5,
        total_results: 42,
      });
    });
  });

  describe("getTMDBMovieDetail", () => {
    it("returns mapped movie detail", async () => {
      const mapDetailSpy = vi
        .spyOn(mapper, "mapTMDBMovieDetailToMovieDetail")
        .mockReturnValue(MOCKED_MAPPED_MOVIE_DETAIL);
      const movieDetailSpy = vi.spyOn(tmdbApi, "movieDetail").mockResolvedValue({
        data: MOCKED_TMDB_MOVIE_DETAIL,
      } as unknown as Awaited<ReturnType<typeof tmdbApi.movieDetail>>);

      const result = await getTMDBMovieDetail("detail-id");

      expect(movieDetailSpy).toHaveBeenCalledWith("detail-id");
      expect(mapDetailSpy).toHaveBeenCalledWith(MOCKED_TMDB_MOVIE_DETAIL);
      expect(result).toBe(MOCKED_MAPPED_MOVIE_DETAIL);
    });
  });

  describe("getTMDBSimilarMovies", () => {
    it("fetches similar movies and maps them", async () => {
      const mapMovieSpy = vi
        .spyOn(mapper, "mapTMDBMovieToMovie")
        .mockReturnValue(MOCKED_MAPPED_MOVIES[0]);
      const similarMoviesSpy = vi.spyOn(tmdbApi, "similarMovies").mockResolvedValue({
        data: {
          page: 4,
          results: [MOCKED_TMDB_MOVIES[0]],
          total_pages: 6,
          total_results: 60,
        },
      } as Awaited<ReturnType<typeof tmdbApi.similarMovies>>);

      const result = await getTMDBSimilarMovies("movie-id");

      expect(similarMoviesSpy).toHaveBeenCalledWith("movie-id");
      expect(mapMovieSpy).toHaveBeenCalledWith(MOCKED_TMDB_MOVIES[0]);
      expect(result).toEqual({
        page: 4,
        results: [MOCKED_MAPPED_MOVIES[0]],
        total_pages: 6,
        total_results: 60,
      });
    });
  });
});
