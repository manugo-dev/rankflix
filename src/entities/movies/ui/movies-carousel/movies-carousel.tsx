import { useNavigate } from "react-router";

import { cn } from "@/shared/lib/styles";
import { getRouteLink } from "@/shared/routes";
import { Carousel, type CarouselProps } from "@/shared/ui/carousel";

import type { Movie } from "../../model/movies-types";
import { MovieCard } from "../movie-card/movie-card";

import "./movies-carousel.scss";

export interface MoviesCarouselProps extends Omit<CarouselProps, "children"> {
  movies: Movie[];
}

export function MoviesCarousel({ movies, ...props }: MoviesCarouselProps) {
  const navigate = useNavigate();

  return (
    <Carousel
      {...props}
      gap={10}
      className="movies-carousel"
      onSelectItem={(index) => navigate(getRouteLink.MOVIE_DETAIL(movies[index].id))}
      itemsPerPage={{ md: 5, sm: 4, xs: 2 }}
    >
      {movies.map((movie) => ({ className, isActive, ...props }) => (
        <li
          {...props}
          key={movie.id}
          className={cn(className, "movies-carousel__item", {
            "movies-carousel__item--is-active": isActive,
          })}
          aria-label={movie.title}
        >
          <MovieCard movie={movie} active={isActive} />
        </li>
      ))}
    </Carousel>
  );
}
