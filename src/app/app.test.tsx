import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./app-router", () => ({ AppRouter: () => <div data-testid="app-router" /> }));

describe("App", () => {
  it("renders AppRouter inside providers", async () => {
    const { App } = await import("./app");

    render(<App dehydratedState={{ mutations: [], queries: [] }} />);
    expect(screen.getByTestId("app-router")).toBeInTheDocument();
  });
});
