import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/tests/utilities";

import { MainLayout } from "./main-layout";

vi.mock("@/widgets/header", () => ({ Header: () => <header data-testid="header" /> }));
vi.mock("@/widgets/footer", () => ({ Footer: () => <footer data-testid="footer" /> }));

describe("MainLayout", () => {
  it("renders Header, Footer and Outlet child", async () => {
    const Child = () => <div data-testid="outlet-child">child</div>;

    renderWithProviders(
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Child />} />
        </Route>
      </Routes>,
      { initialEntries: ["/"], route: "/" },
    );

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByTestId("outlet-child")).toBeInTheDocument();
  });
});
