import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MovieSourceId } from "@/entities/movies";
import { MOCKED_MAPPED_MOVIES } from "@/entities/movies/__mocks__";
import { HomePage } from "@/pages/home/ui/page";
import { renderWithProviders } from "@/tests/utilities";

vi.mock("@tanstack/react-query", async (importActual) => ({
  ...(await importActual()),
  useQuery: vi.fn(() => ({
    data: { results: MOCKED_MAPPED_MOVIES },
    isPending: false,
  })),
}));

describe("HomePage", () => {
  it("renders Header with floating variant and Footer", () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByTestId("header").dataset.variant).toBe("floating");
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("renders TrendingSection with TMDB source", () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByTestId("trending-section").dataset.source).toBe(String(MovieSourceId.TMDB));
  });

  it("renders three GenresSection with correct genres and titles", () => {
    renderWithProviders(<HomePage />);
    const genresSections = screen.getAllByTestId("genres-section");
    expect(genresSections).toHaveLength(3);
    expect(genresSections[0]).toBeInTheDocument();
  });
});
