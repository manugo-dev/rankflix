import { useQuery } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, type Mock, vi } from "vitest";

import type { Movies } from "@/entities/movies";

import { GenresSection } from "./genres-section";

vi.mock("@tanstack/react-query", async (importActual) => ({
  ...(await importActual()),
  useQuery: vi.fn(),
}));
vi.mock("@/entities/movies", async (importActual) => ({
  ...(await importActual()),
  MoviesCarousel: (props: { movies: Movies }) => (
    <div data-testid="movies-carousel">{String(props.movies?.length ?? "")}</div>
  ),
}));
vi.mock("@/shared/ui/skeleton", () => ({
  TitlesSkeleton: () => <div data-testid="titles-skeleton" />,
}));

const mockedUseQuery = useQuery as Mock;

describe("GenresSection", () => {
  it("renders TitlesSkeleton while loading", () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isPending: true,
    });
    render(<GenresSection genres={["movie.genre.action"]} source={"TMDB"} title="Popular" />);
    expect(screen.getByRole("heading", { name: "Popular" })).toBeInTheDocument();
    expect(screen.getByTestId("titles-skeleton")).toBeInTheDocument();
  });

  it("shows error message when query errors", () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isError: true,
      isPending: false,
    });
    render(<GenresSection genres={["movie.genre.comedy"]} source={"TMDB"} title="Comedy" />);
    expect(screen.getByRole("heading", { name: "Comedy" })).toBeInTheDocument();
    expect(screen.getByText("#movie.something-went-wrong#")).toBeInTheDocument();
  });

  it("shows 'No movies found' when there are no results", () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isPending: false,
    });
    render(<GenresSection genres={["movie.genre.animation"]} source={"TMDB"} title="Animation" />);
    expect(screen.getByRole("heading", { name: "Animation" })).toBeInTheDocument();
    expect(screen.getByText("#movie.no-movies-found#")).toBeInTheDocument();
  });

  it("renders MoviesCarousel when movies are returned", () => {
    const sampleResults = [{ id: 1 }, { id: 2 }];
    mockedUseQuery.mockReturnValue({
      data: { results: sampleResults },
      isPending: false,
    });
    render(<GenresSection genres={["movie.genre.adventure"]} source={"TMDB"} title="Adventure" />);
    expect(screen.getByRole("heading", { name: "Adventure" })).toBeInTheDocument();
    const carousel = screen.getByTestId("movies-carousel");
    expect(carousel).toBeInTheDocument();
    expect(carousel.textContent).toContain(String(sampleResults.length));
  });
});
