import { useQuery } from "@tanstack/react-query";
import { screen } from "@testing-library/react";
import { describe, expect, it, type Mock, vi } from "vitest";

import { MOCKED_MAPPED_MOVIE_DETAIL } from "@/entities/movies/__mocks__";
import { getRouteLink } from "@/shared/routes";
import { renderWithProviders } from "@/tests/utilities";

import { MovieDetailPage } from "./page";

vi.mock("@/features/discovery-movies", async (importActual) => ({
  ...(await importActual()),
  SimilarMovies: ({ movieId }: { movieId: string }) => (
    <div data-testid="similar-movies">similar for {movieId}</div>
  ),
}));
vi.mock("@/features/watchlist", async (importActual) => ({
  ...(await importActual()),
  AddToWatchlistButton: () => <button data-testid="add-to-watchlist">add</button>,
}));
vi.mock("@tanstack/react-query", async (importActual) => ({
  ...(await importActual()),
  useQuery: vi.fn(() => ({
    data: MOCKED_MAPPED_MOVIE_DETAIL,
    isPending: false,
  })),
}));
vi.mock("react-router", async (importActual) => ({
  ...(await importActual()),
  Navigate: ({ to }: { to: string }) => <div>Navigate to {to}</div>,
  useParams: vi.fn(() => ({
    movieId: "123",
  })),
}));

describe("MovieDetailPage", () => {
  it("shows a Spinner while loading", () => {
    (useQuery as Mock).mockReturnValueOnce({
      data: null,
      isPending: true,
    });
    renderWithProviders(<MovieDetailPage />, {
      initialEntries: [getRouteLink.MOVIE_DETAIL("123")],
    });
    expect(screen.getByRole("status")).toBeDefined();
  });

  it("renders movie on success", async () => {
    const { container } = renderWithProviders(<MovieDetailPage />, {
      initialEntries: [getRouteLink.MOVIE_DETAIL("123")],
    });
    expect(
      await screen.findByRole("heading", { name: MOCKED_MAPPED_MOVIE_DETAIL.title }),
    ).toBeDefined();
    expect(screen.getByText(MOCKED_MAPPED_MOVIE_DETAIL.tagline)).toBeDefined();
    expect(screen.getByText("2024")).toBeDefined();
    expect(screen.getAllByText(/English, Español/)[0]).toBeDefined();
    expect(
      screen.getByText(`★ ${MOCKED_MAPPED_MOVIE_DETAIL.voteAverage.toFixed(1)}`),
    ).toBeDefined();
    expect(screen.getByText(`${MOCKED_MAPPED_MOVIE_DETAIL.voteCount} #vote#`)).toBeDefined();
    expect(screen.getByText("#movie.genre.action#")).toBeDefined();
    expect(screen.getAllByText(MOCKED_MAPPED_MOVIE_DETAIL.overview).length).toBeGreaterThan(0);
    const posterImg = screen.getByAltText(
      `${MOCKED_MAPPED_MOVIE_DETAIL.title} poster`,
    ) as HTMLImageElement;
    expect(posterImg).toBeDefined();
    expect(posterImg.src).toContain("/w342/");
    expect(posterImg.src).toContain(MOCKED_MAPPED_MOVIE_DETAIL.posterPath);
    expect(screen.getByTestId("similar-movies")).toBeDefined();
    const detailWrapper = container.querySelector(".movie-detail") as HTMLElement;
    expect(detailWrapper.className).toMatch(/movie-detail--genre-action/);
  });
});
