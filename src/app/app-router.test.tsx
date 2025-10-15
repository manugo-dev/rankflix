import { screen } from "@testing-library/react";
import { Outlet } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/tests/utilities";

import { AppRouter } from "./app-router";

vi.mock("@/pages/home", () => ({
  HomePage: () => <div data-testid="home-page">home</div>,
}));

vi.mock("@/pages/movie-detail", () => ({
  MovieDetailPage: () => <div data-testid="movie-page">movie</div>,
}));

vi.mock("@/pages/watchlist", () => ({
  WatchlistPage: () => <div data-testid="watchlist-page">watchlist</div>,
}));

vi.mock("@/pages/not-found", () => ({
  NotFoundPage: () => <div data-testid="not-found">not found</div>,
}));

vi.mock("@/app/layouts/main-layout", () => ({
  MainLayout: () => (
    <div data-testid="main-layout">
      <Outlet />
    </div>
  ),
}));

describe("AppRouter", () => {
  it("renders HomePage at root route", async () => {
    renderWithProviders(<AppRouter />, { initialEntries: [], route: "/" });
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });

  it("renders MovieDetailPage for movie detail route", async () => {
    renderWithProviders(<AppRouter />, { initialEntries: [], route: "/movie/123" });
    expect(screen.getByTestId("movie-page")).toBeInTheDocument();
  });

  it("wraps nested routes with MainLayout and renders watchlist and not-found", async () => {
    renderWithProviders(<AppRouter />, { initialEntries: [], route: "/watchlist" });
    expect(screen.getByTestId("main-layout")).toBeInTheDocument();
    expect(screen.getByTestId("watchlist-page")).toBeInTheDocument();

    renderWithProviders(<AppRouter />, { initialEntries: [], route: "/some/unknown" });
    expect(screen.getByTestId("not-found")).toBeInTheDocument();
  });
});
