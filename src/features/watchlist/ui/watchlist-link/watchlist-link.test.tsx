import { screen } from "@testing-library/react";
import { describe, expect, it, type Mock, vi } from "vitest";

import { renderWithProviders } from "@/tests/utilities";

import { useWatchlistCount } from "../../model/watchlist-selectors";
import { WatchlistLink } from "./watchlist-link";

vi.mock("../../model/watchlist-selectors", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../model/watchlist-selectors")>()),
  useWatchlistCount: vi.fn(),
}));

describe("WatchlistLink", () => {
  it("renders without count when zero", () => {
    (useWatchlistCount as Mock).mockReturnValue(0);
    renderWithProviders(<WatchlistLink />);
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("renders animated count when greater than zero", () => {
    (useWatchlistCount as Mock).mockReturnValue(3);
    renderWithProviders(<WatchlistLink />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});
