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
    <Carousel>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onClick={() => navigate(getRouteLink.MOVIE_DETAIL(movie.id))}
        />
      ))}
    </Carousel>
  );
}
