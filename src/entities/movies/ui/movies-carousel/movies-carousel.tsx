import { useNavigate } from "react-router";

import { getRouteLink } from "@/shared/routes";
import { Carousel } from "@/shared/ui/carousel/carousel";

import type { Movie } from "../../model/movies-types";
import { MovieCard } from "../movie-card/movie-card";

import "./movies-carousel.scss";

interface MoviesCarouselProps {
  movies: Movie[];
}

export function MoviesCarousel({ movies }: MoviesCarouselProps) {
  const navigate = useNavigate();

  return (
    <Carousel gap={20}>
      {movies.map((movie) => (props) => (
        <li
          key={movie.id}
          ref={props.ref}
          onFocus={props.onFocus}
          tabIndex={0}
          className="movies-carousel__item"
          onClick={() => navigate(getRouteLink.MOVIE_DETAIL(movie.id))}
        >
          <MovieCard movie={movie} />
        </li>
      ))}
    </Carousel>
  );
}
