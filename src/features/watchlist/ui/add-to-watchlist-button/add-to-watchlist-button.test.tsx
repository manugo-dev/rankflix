import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, type Mock, vi } from "vitest";

import { useWatchlistExists } from "../../model/watchlist-selectors";
import type { WatchlistItem } from "../../model/watchlist-types";
import { AddToWatchlistButton } from "./add-to-watchlist-button";

const addItemFn = vi.fn();
const removeItemFn = vi.fn();

vi.mock("../../model/watchlist-selectors", () => ({
  useWatchlistAddItem: () => addItemFn,
  useWatchlistExists: vi.fn(),
  useWatchlistRemoveItem: () => removeItemFn,
}));

const DEFAULT_ITEM: WatchlistItem = {
  id: "1",
  posterUrl: "img.png",
  releaseDate: new Date("2024-01-01T00:00:00.000Z"),
  title: "Test Movie",
  type: "movie",
  uid: "movie:1",
};

describe("AddToWatchlistButton", () => {
  it("renders add to watchlist button when item already exists", () => {
    (useWatchlistExists as Mock).mockReturnValue(true);
    render(<AddToWatchlistButton item={DEFAULT_ITEM} />);
    const button = screen.getByRole("button", { name: /Remove from watchlist/i });
    expect(button).toBeInTheDocument();
  });

  it("renders add to watchlist button when item does not exists", () => {
    (useWatchlistExists as Mock).mockReturnValue(false);
    render(<AddToWatchlistButton item={DEFAULT_ITEM} />);
    const button = screen.getByRole("button", { name: /Add to watchlist/i });
    expect(button).toBeInTheDocument();
  });

  it("should call add item to store when user clicks add button", async () => {
    const user = userEvent.setup();
    render(<AddToWatchlistButton item={DEFAULT_ITEM} />);
    const button = screen.getByRole("button", { name: /add to watchlist/i });
    expect(button).toBeInTheDocument();
    await user.click(button);
    expect(addItemFn).toHaveBeenCalledWith(DEFAULT_ITEM);
  });
});
