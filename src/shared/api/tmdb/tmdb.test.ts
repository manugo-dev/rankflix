import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { tmdbApi } from "@/shared/api/tmdb";

const DISCOVER_RESULT_MOCK = [
  { id: 1, title: "Movie 1" },
  { id: 2, title: "Movie 2" },
  { id: 3, title: "Movie 3" },
];

const MOVIE_DETAILS_ID = "123";
const MOVIE_DETAILS_RESULT_MOCK = { id: MOVIE_DETAILS_ID, title: "Movie 123" };

const SIMILAR_MOVIES_ID = "456";
const SIMILAR_RESULT_MOCK = [
  { id: 4, title: "Movie 4" },
  { id: 5, title: "Movie 5" },
  { id: 6, title: "Movie 6" },
];

const TRENDING_RESULT_MOCK = [
  { id: 7, title: "Movie 7" },
  { id: 8, title: "Movie 8" },
  { id: 9, title: "Movie 9" },
];

const MOCKED_HANDLERS = [
  http.options("*/:path*", () => HttpResponse.text("OK")),
  http.get("*/discover/movie", ({ request }) => {
    const apiKey = new URL(request.url).searchParams.get("api_key");
    if (!apiKey) return HttpResponse.json({ message: "missing api_key" }, { status: 400 });
    return HttpResponse.json(DISCOVER_RESULT_MOCK, { status: 200 });
  }),
  http.get("*/trending/movie/:time?", ({ params, request }) => {
    const apiKey = new URL(request.url).searchParams.get("api_key");
    if (!apiKey) return HttpResponse.json({ message: "missing api_key" }, { status: 400 });
    return HttpResponse.json({ results: TRENDING_RESULT_MOCK, time: params.time });
  }),
  http.get("*/movie/:id", ({ params, request }) => {
    const apiKey = new URL(request.url).searchParams.get("api_key");
    if (!apiKey) return HttpResponse.json({ message: "missing api_key" }, { status: 400 });
    return HttpResponse.json({ id: params.id, results: MOVIE_DETAILS_RESULT_MOCK });
  }),
  http.get("*/movie/:id/similar", ({ params, request }) => {
    const apiKey = new URL(request.url).searchParams.get("api_key");
    if (!apiKey) return HttpResponse.json({ message: "missing api_key" }, { status: 400 });
    return HttpResponse.json({ id: params.id, results: SIMILAR_RESULT_MOCK });
  }),
];

describe("tmdb API (MSW)", () => {
  const server = setupServer(...MOCKED_HANDLERS);

  beforeAll(() => {
    server.listen();
  });
  afterAll(() => {
    server.close();
  });
  afterEach(() => {
    server.resetHandlers();
  });

  it("discoverMovies calls the discover endpoint", async () => {
    const response = await tmdbApi.discoverMovies();
    expect(response).toBeDefined();
    expect(response.data).toStrictEqual(DISCOVER_RESULT_MOCK);
  });

  it("movieDetail calls the movie detail endpoint", async () => {
    const response = await tmdbApi.movieDetail(MOVIE_DETAILS_ID);
    expect(response.data).toStrictEqual({
      id: MOVIE_DETAILS_ID,
      results: MOVIE_DETAILS_RESULT_MOCK,
    });
  });

  it("similarMovies calls the similar endpoint", async () => {
    const response = await tmdbApi.similarMovies(SIMILAR_MOVIES_ID);
    expect(response.data).toStrictEqual({ id: SIMILAR_MOVIES_ID, results: SIMILAR_RESULT_MOCK });
  });

  it("trendingMovies calls the trending endpoint", async () => {
    const response = await tmdbApi.trendingMovies("week");
    expect(response.data).toStrictEqual({ results: TRENDING_RESULT_MOCK, time: "week" });
  });
});
