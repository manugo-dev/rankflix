import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { getRouteLink } from "@/shared/routes/lib";

import { MOCKED_MAPPED_MOVIES } from "../../__mocks__";
import { MoviesCarousel } from "./movies-carousel";

const navigateFn = vi.fn();
vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router")>()),
  useNavigate: () => navigateFn,
}));

describe("MoviesCarousel", () => {
  it("renders items and marks the first as active", () => {
    render(
      <MemoryRouter>
        <MoviesCarousel movies={MOCKED_MAPPED_MOVIES} data-testid="carousel-mock" />
      </MemoryRouter>,
    );
    const list = screen.getByTestId("carousel-mock");
    expect(list).toBeInTheDocument();
    const first = screen.getByLabelText("Title1");
    const second = screen.getByLabelText("Title2");
    expect(first).toBeInTheDocument();
    expect(second).toBeInTheDocument();
  });

  it("navigates to movie detail when an item is selected", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <MoviesCarousel movies={MOCKED_MAPPED_MOVIES} />
      </MemoryRouter>,
    );
    const second = screen.getByLabelText(MOCKED_MAPPED_MOVIES[1].title);
    await user.click(second);
    expect(navigateFn).toHaveBeenCalledWith(getRouteLink.MOVIE_DETAIL(MOCKED_MAPPED_MOVIES[1].id));
  });
});
