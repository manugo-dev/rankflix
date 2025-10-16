import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/tests/utilities";

import { getRouteForWatchlistItem } from "../../model/watchlist-mappers";
import type { WatchlistItem } from "../../model/watchlist-types";
import { WatchlistCard } from "./watchlist-card";

const DEFAULT_ITEM: WatchlistItem = {
  id: "42",
  posterUrl: "poster.png",
  releaseDate: new Date("2024-02-01T00:00:00.000Z"),
  title: "Movie Detail",
  type: "movie",
  uid: "movie:42",
};

const navigateFn = vi.fn();
vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router")>()),
  useNavigate: () => navigateFn,
}));

describe("WatchlistCard", () => {
  it("renders item details", () => {
    renderWithProviders(<WatchlistCard item={DEFAULT_ITEM} />);
    expect(screen.getByRole("article")).toBeInTheDocument();
    expect(screen.getByAltText(DEFAULT_ITEM.title)).toBeInTheDocument();
    expect(screen.getByText(DEFAULT_ITEM.title)).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  it("navigates to item route on click", async () => {
    const user = userEvent.setup();
    renderWithProviders(<WatchlistCard item={DEFAULT_ITEM} />);

    const card = screen.getByRole("article");
    await user.click(card);
    expect(navigateFn).toHaveBeenCalledWith(getRouteForWatchlistItem(DEFAULT_ITEM));
  });

  it("shows placeholder on image error", () => {
    renderWithProviders(<WatchlistCard item={DEFAULT_ITEM} />);

    const image = screen.getByAltText(DEFAULT_ITEM.title);
    fireEvent.error(image);

    const placeholders = screen.getAllByText(DEFAULT_ITEM.title);
    const placeholderDiv = placeholders.find((element) =>
      element.classList.contains("watchlist-card__placeholder"),
    );
    expect(placeholderDiv).toBeTruthy();
  });
});
