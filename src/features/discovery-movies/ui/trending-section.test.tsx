import { useQuery } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, type Mock, vi } from "vitest";

import type { Movies } from "@/entities/movies";

import { TrendingSection } from "./trending-section";

vi.mock("@tanstack/react-query", async (importActual) => ({
  ...(await importActual()),
  useQuery: vi.fn(),
}));
vi.mock("@/entities/movies", async (importActual) => ({
  ...(await importActual()),
  MoviesHeroSlider: (props: { className: string; movies?: Movies }) => (
    <div
      data-testid="movies-hero-slider"
      className={props.className}
      data-movies={JSON.stringify(props.movies)}
    />
  ),
}));
vi.mock("@/shared/ui/spinner", () => ({
  Spinner: () => <div data-testid="spinner" />,
}));

const mockedUseQuery = useQuery as Mock;

describe("TrendingSection", () => {
  it("renders Spinner while loading", () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      error: null,
      isLoading: true,
    });

    render(<TrendingSection source={"TMDB"} />);

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("renders empty container on error", () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      error: new Error("fetch failed"),
      isLoading: false,
    });
    const { container } = render(<TrendingSection source={"TMDB"} />);
    expect(container.querySelector(".trending-section")).toBeInTheDocument();
    expect(screen.queryByTestId("movies-hero-slider")).not.toBeInTheDocument();
  });

  it("renders empty container when no results are present", () => {
    mockedUseQuery.mockReturnValue({
      data: { some: "payload" }, // no results key
      error: null,
      isLoading: false,
    });
    const { container } = render(<TrendingSection source={"TMDB"} />);
    expect(container.querySelector(".trending-section")).toBeInTheDocument();
    expect(screen.queryByTestId("movies-hero-slider")).not.toBeInTheDocument();
  });

  it("renders MoviesHeroSlider with movies on success", () => {
    const movies = [{ id: 1, title: "Movie A" }];
    mockedUseQuery.mockReturnValue({
      data: { results: movies },
      error: null,
      isLoading: false,
    });
    render(<TrendingSection source={"TMDB"} />);
    const slider = screen.getByTestId("movies-hero-slider");
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveClass("trending-section");
    expect(slider.dataset.movies).toBe(JSON.stringify(movies));
  });
});
