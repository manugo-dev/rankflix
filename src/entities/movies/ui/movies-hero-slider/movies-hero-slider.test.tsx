import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { getRouteLink } from "@/shared/routes";

import { MOCKED_MAPPED_MOVIES } from "../../__mocks__";
import { DEFAULT_BANNER_PATH } from "../../model/movies-constants";
import { MoviesHeroSlider } from "./movies-hero-slider";

vi.mock("../../api", () => ({
  movieApi: {
    TMDB: {
      getMovieImage: (backdropUrl: string | undefined) =>
        backdropUrl ? `https://images.test/${backdropUrl}` : undefined,
    },
  },
}));

vi.mock("@/shared/ui/hero-slider/hero-slider", () => ({
  HeroSlider: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="hero-slider" className={className}>
      {children}
    </div>
  ),
}));

describe("MoviesHeroSlider", () => {
  it("renders slides with images coming from movieApi", () => {
    render(
      <MemoryRouter>
        <MoviesHeroSlider movies={MOCKED_MAPPED_MOVIES} />
      </MemoryRouter>,
    );

    const slider = screen.getByTestId("hero-slider");
    expect(slider).toBeInTheDocument();

    const images = screen.getAllByRole("img");
    expect(images.length).toBe(2);
    expect(images[0]).toHaveAttribute("src", "https://images.test/bpath1");
    expect(images[1]).toHaveAttribute("src", DEFAULT_BANNER_PATH);
  });

  it("renders 'See more' link that points to movie detail route", () => {
    render(
      <MemoryRouter>
        <MoviesHeroSlider movies={MOCKED_MAPPED_MOVIES} />
      </MemoryRouter>,
    );

    const links = screen.getAllByRole("link", { name: "#movie.see-details#" });
    expect(links[0]).toBeInTheDocument();
    expect(links[0]).toHaveAttribute("href", getRouteLink.MOVIE_DETAIL("321"));
    expect(links[1]).toBeInTheDocument();
    expect(links[1]).toHaveAttribute("href", getRouteLink.MOVIE_DETAIL("322"));
  });
});
