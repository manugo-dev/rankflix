import { screen } from "@testing-library/dom";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/tests/utilities";

import { NotFoundPage } from "./page";

describe("NotFoundPage page", () => {
  it("renders without crashing", () => {
    const { container } = renderWithProviders(<NotFoundPage />);
    expect(container).toBeTruthy();
  });

  it("matches snapshot", () => {
    const { container } = renderWithProviders(<NotFoundPage />);
    expect(container).toMatchSnapshot();
  });

  it('shows either a "404" text and go to home link', () => {
    const { queryByText } = renderWithProviders(<NotFoundPage />);
    const notFoundText = queryByText(/404/i);
    const goToHomeLink = screen.getByTestId("go-to-home-link");
    expect(notFoundText).toBeInTheDocument();
    expect(goToHomeLink).toBeInTheDocument();
  });
});
