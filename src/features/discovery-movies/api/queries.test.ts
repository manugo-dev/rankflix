import { describe, expect, it, type Mock, vi } from "vitest";

import { MovieGenreMap } from "@/entities/movies";
import { STALE_TIMES } from "@/shared/config";
import { createEntityKey } from "@/shared/lib/query";

import { discoverMoviesQueries } from "./queries";

vi.mock("@/entities/movies", async (importActual) => {
  const discoverFn = vi.fn(async (_params?: unknown) => ({
    page: 1,
    results: ["result1", "result2"],
  }));
  const trendingFn = vi.fn(async (_params?: unknown) => ({ results: ["trending1", "trending2"] }));
  return {
    ...(await importActual<typeof import("@/entities/movies")>()),
    MOVIE_QUERY_KEY: "movies",
    movieApi: {
      TMDB: {
        discover: discoverFn,
        trending: trendingFn,
      },
    },
  };
});

describe("discover-movies queries", () => {
  it("builds an 'all' query key and queryFn calls movieApi.discover with params", async () => {
    const params = { page: 2 };
    const expectedKey = createEntityKey("movies", "discover", "TMDB", "page:2");
    const options = discoverMoviesQueries.all("TMDB", params);
    expect(options.queryKey).toEqual(expectedKey);
    const result = await (options.queryFn as Mock)?.();
    expect(result).toStrictEqual({ page: 1, results: ["result1", "result2"] });
  });

  it("builds a 'byGenres' key including sorted genres and forwards withGenres param", async () => {
    const withGenres = [MovieGenreMap.ACTION, MovieGenreMap.ADVENTURE];
    const params = { page: 1 };
    const expectedKey = createEntityKey(
      "movies",
      "discover",
      "TMDB",
      "genres.ACTION,genres.ADVENTURE",
      "page:1",
    );
    const options = discoverMoviesQueries.byGenres("TMDB", withGenres, params);
    expect(options.queryKey).toEqual(expectedKey);
    const result = await (options.queryFn as Mock)?.();
    expect(result?.results).toStrictEqual(["result1", "result2"]);
  });

  it("builds a 'trending' key and uses STALE_TIMES.DAY as staleTime", () => {
    const options = discoverMoviesQueries.trending("TMDB", "week", { page: 1 });
    const expectedKey = createEntityKey("movies", "discover", "trending", "TMDB", "week", "page:1");
    expect(options.queryKey).toEqual(expectedKey);
    expect(options.staleTime).toBe(STALE_TIMES.DAY);
  });
});
