import { useQuery } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, type Mock, vi } from "vitest";

import type { Movies } from "@/entities/movies";

import { SimilarMovies } from "./similar-movies";

vi.mock("@tanstack/react-query", async (importActual) => ({
  ...(await importActual()),
  useQuery: vi.fn(),
}));
vi.mock("@/entities/movies", async (importActual) => ({
  ...(await importActual()),
  MoviesCarousel: (props: { movies: Movies }) => (
    <div data-testid="movies-carousel">{JSON.stringify(props.movies)}</div>
  ),
  MovieSourceId: { TMDB: "TMDB" },
}));
vi.mock("@/shared/ui/spinner/spinner", () => ({
  Spinner: () => <div data-testid="spinner">spinner</div>,
}));

const mockedUseQuery = useQuery as Mock;

describe("SimilarMovies", () => {
  it("renders Spinner when query is pending", () => {
    mockedUseQuery.mockReturnValue({ isPending: true });
    render(<SimilarMovies movieId="1" />);
    expect(screen.getByTestId("spinner")).toBeDefined();
  });

  it("renders MoviesCarousel when results exist", () => {
    const movies = [{ id: 1, title: "Movie A" }];
    mockedUseQuery.mockReturnValue({ data: { results: movies }, isPending: false });
    render(<SimilarMovies movieId="1" />);
    const carousel = screen.getByTestId("movies-carousel");
    expect(carousel).toBeDefined();
    expect(carousel.textContent).toContain("Movie A");
  });

  it("renders fallback message when no results", () => {
    mockedUseQuery.mockReturnValue({ data: { results: [] }, isPending: false });
    render(<SimilarMovies movieId="1" />);
    expect(screen.getByText("We could not find similar titles right now.")).toBeDefined();
  });
});
