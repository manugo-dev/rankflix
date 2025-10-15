import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Header } from "./header-ui";

vi.mock("../navbar", () => ({
  Navbar: () => <nav data-testid="mock-navbar">nav</nav>,
}));

describe("Header", () => {
  beforeEach(() => {
    (globalThis as unknown as { scrollY: number }).scrollY = 0;
  });

  it("renders logo link and navbar", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    const logoLink = screen.getByRole("link", { name: /rankflix/i });
    expect(logoLink).toBeInTheDocument();

    const navbar = screen.getByTestId("mock-navbar");
    expect(navbar).toBeInTheDocument();
  });

  it("adds scrolled class when floating variant and scrolled past threshold", () => {
    const { container } = render(
      <MemoryRouter>
        <Header variant="floating" />
      </MemoryRouter>,
    );
    const header = container.querySelector(".header");
    expect(header).toBeInTheDocument();

    (globalThis as unknown as { scrollY: number }).scrollY = 10_000;
    fireEvent.scroll(globalThis as unknown as Window);

    return waitFor(() => expect(header?.className.includes("header--scrolled")).toBe(true));
  });
});
