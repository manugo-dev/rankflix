import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MOCKED_MAPPED_MOVIES } from "../../__mocks__";
import type { Movie } from "../../model/movies-types";
import { MovieCard } from "./movie-card";

describe("MovieCard", () => {
  it("renders image using mapped URL and alt text", () => {
    render(<MovieCard movie={MOCKED_MAPPED_MOVIES[0]} />);

    const image = screen.getByAltText(MOCKED_MAPPED_MOVIES[0].title) as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.src).toContain(MOCKED_MAPPED_MOVIES[0].posterPath);
    expect(image.getAttribute("draggable")).toBe("false");
    expect(screen.getByText(/⭐\s+7\.1/)).toBeInTheDocument();
  });

  it("shows placeholder with title when image fails to load", () => {
    render(<MovieCard movie={MOCKED_MAPPED_MOVIES[0]} />);
    const image = screen.getByAltText(MOCKED_MAPPED_MOVIES[0].title);
    fireEvent.error(image);
    const matches = screen.getAllByText(MOCKED_MAPPED_MOVIES[0].title);
    const placeholder = matches.find((element) =>
      element.classList.contains("movie-card__placeholder"),
    );
    expect(placeholder).toBeTruthy();
    expect(
      screen.queryByRole("img", { name: MOCKED_MAPPED_MOVIES[0].title }),
    ).not.toBeInTheDocument();
  });

  it("renders title, year and ranking with formatted voteAverage", () => {
    render(<MovieCard movie={MOCKED_MAPPED_MOVIES[0]} />);
    expect(screen.getByText(MOCKED_MAPPED_MOVIES[0].title)).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
    expect(screen.getByText("⭐ 7.1")).toBeInTheDocument();
  });

  it("renders placeholder year and ranking dash when data missing", () => {
    const movieWithoutData: Movie = {
      id: "999",
      posterPath: "poster2.png",
      source: "TMDB",
      title: "No Data Movie",
    };
    render(<MovieCard movie={movieWithoutData} />);
    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.getByText(/⭐\s+—/)).toBeInTheDocument();
  });

  it("applies active class when active is true", () => {
    const { container } = render(<MovieCard active movie={MOCKED_MAPPED_MOVIES[0]} />);
    const article = container.querySelector(".movie-card");
    expect(article).toHaveClass("movie-card--active");
  });
});
