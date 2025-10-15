import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./app-router", () => ({ AppRouter: () => <div data-testid="app-router" /> }));

vi.mock("./providers", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./providers")>();
  return {
    ...actual,
    QueryProvider: ({ children }: { children?: React.ReactNode }) => (
      <div data-testid="query-provider">{children}</div>
    ),
    StoreProvider: ({ children }: { children?: React.ReactNode }) => (
      <div data-testid="store-provider">{children}</div>
    ),
  };
});

describe("App", () => {
  it("renders AppRouter inside providers and forwards dehydratedState to QueryProvider", async () => {
    const { App } = await import("./app");

    render(<App dehydratedState={{ mutations: [], queries: [] }} />);

    expect(screen.getByTestId("store-provider")).toBeInTheDocument();
    expect(screen.getByTestId("query-provider")).toBeInTheDocument();
    expect(screen.getByTestId("app-router")).toBeInTheDocument();
  });
});
