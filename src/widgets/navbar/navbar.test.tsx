import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/tests/utilities";

import { Navbar } from "./navbar-ui";

vi.mock("@/features/watchlist", () => ({
  WatchlistLink: () => <a data-testid="mock-watchlist">watchlist</a>,
}));

describe("Navbar", () => {
  it("renders WatchlistLink", () => {
    renderWithProviders(<Navbar />);
    const home = screen.getByRole("link", { name: /home/i });
    expect(home).toBeInTheDocument();
  });

  it("renders Home link", () => {
    renderWithProviders(<Navbar />);
    const watchlist = screen.getByTestId("mock-watchlist");
    expect(watchlist).toBeInTheDocument();
  });

  it("navigates to home when Home link is clicked", async () => {
    renderWithProviders(
      <Routes>
        <Route path="/" element={<div data-testid="home-page">home</div>} />
        <Route path="*" element={<Navbar />} />
      </Routes>,
      { initialEntries: ["/start"] },
    );
    const homeLink = screen.getByRole("link", { name: /home/i });
    await userEvent.click(homeLink);
    await waitFor(() => expect(screen.getByTestId("home-page")).toBeInTheDocument());
  });
});
