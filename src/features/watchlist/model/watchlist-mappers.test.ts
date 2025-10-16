import { describe, expect, it, vi } from "vitest";

import { type Movie, movieApi } from "@/entities/movies";
import { MOCKED_MAPPED_MOVIES } from "@/entities/movies/__mocks__";

import {
  createWatchlistItemFromMovie,
  getRouteForWatchlistItem,
  getUniqueId,
} from "./watchlist-mappers";
import type { WatchlistItem } from "./watchlist-types";

const DEFAULT_MOVIE: Movie = MOCKED_MAPPED_MOVIES[0]!;

vi.mock("@/entities/movies", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/entities/movies")>();
  return {
    ...original,
    movieApi: {
      TMDB: {
        getMovieImage: vi.fn((path: string, _size?: unknown) => `mocked-url/${path}`),
      },
    },
  };
});

describe("watchlist-mappers", () => {
  it("getUniqueId combines type and id", () => {
    expect(getUniqueId("123", "movie")).toBe("movie:123");
  });

  it("createWatchlistItemFromMovie maps movie fields and calls image mapper", () => {
    const item = createWatchlistItemFromMovie(DEFAULT_MOVIE);
    expect(item).toEqual<WatchlistItem>({
      id: DEFAULT_MOVIE.id,
      posterUrl: `mocked-url/${DEFAULT_MOVIE.posterPath}`,
      releaseDate: DEFAULT_MOVIE.releaseDate,
      title: DEFAULT_MOVIE.title,
      type: "movie",
      uid: `movie:${DEFAULT_MOVIE.id}`,
    });
    expect(movieApi.TMDB.getMovieImage).toHaveBeenCalledTimes(1);
    expect(movieApi.TMDB.getMovieImage).toHaveBeenCalledWith(DEFAULT_MOVIE.posterPath, "poster");
  });

  it("getRouteForWatchlistItem returns correct route for movie items", () => {
    const item = createWatchlistItemFromMovie(DEFAULT_MOVIE);
    const route = getRouteForWatchlistItem(item);
    expect(route).toBe(`/movie/${item.id}`);
  });
});
