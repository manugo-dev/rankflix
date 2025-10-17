import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";

import { createEntityKey } from "@/shared/lib/query";

import { movieDetailQueries } from "./queries";

vi.mock("@/entities/movies", async (importActual) => {
  const detailsFn = vi.fn(async (_id?: string) => ({ id: _id }));
  const similarFn = vi.fn(async (_id?: string) => ({ results: [1, 2, 3] }));
  return {
    ...(await importActual<typeof import("@/entities/movies")>()),
    MOVIE_QUERY_KEY: "movies",
    movieApi: {
      TMDB: {
        details: detailsFn,
        similar: similarFn,
      },
    },
  };
});

describe("movie-detail queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates movie detail query key and queryFn calls movieApi.details", async () => {
    const id = "123";
    const expectedKey = createEntityKey("movies", "detail", id, "en");
    const options = movieDetailQueries.getMovie("TMDB", id);
    expect(options.queryKey).toEqual(expectedKey);
    expect(typeof options.queryFn).toBe("function");
    const result = await (options.queryFn as Mock)();
    expect(result).toStrictEqual({ id: id });
  });

  it("creates similar movies query key and queryFn calls movieApi.similar", async () => {
    const id = "456";
    const expectedKey = createEntityKey("movies", "detail", id, "similar", "en");
    const options = movieDetailQueries.getSimilar("TMDB", id);
    expect(options.queryKey).toEqual(expectedKey);
    expect(typeof options.queryFn).toBe("function");
    const result = await (options.queryFn as Mock)();
    expect(result).toStrictEqual({ results: [1, 2, 3] });
  });
});
