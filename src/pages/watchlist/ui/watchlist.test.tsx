import { screen } from "@testing-library/react";
import { describe, expect, type Mock, test, vi } from "vitest";

import { useWatchlistItems } from "@/features/watchlist";
import { renderWithProviders } from "@/tests/utilities";

import { WatchlistPage } from "./page";

vi.mock("@/features/watchlist", async (importActual) => {
  return {
    ...(await importActual()),
    useWatchlistItems: vi.fn(() => [
      { id: "1", title: "Inception", type: "movie" },
      { id: "2", title: "Interstellar", type: "movie" },
    ]),
  };
});

describe("Watchlist UI", () => {
  test("shows empty state when there are no watchlist items", () => {
    (useWatchlistItems as Mock).mockReturnValueOnce([]);
    renderWithProviders(<WatchlistPage />);
    expect(screen.getByTestId("empty-watchlist-message")).toBeInTheDocument();
  });

  test("renders items from localStorage", () => {
    renderWithProviders(<WatchlistPage />);
    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByText("Interstellar")).toBeInTheDocument();
  });
});
