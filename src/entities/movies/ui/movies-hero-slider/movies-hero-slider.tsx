import { Link } from "react-router";

import { getRouteLink } from "@/shared/routes";
import { HeroSlider } from "@/shared/ui/hero-slider/hero-slider";

import { movieApi } from "../../api";
import { DEFAULT_BANNER_PATH } from "../../model/movies-constants";
import type { Movie } from "../../model/movies-types";

import "./movies-hero-slider.scss";

interface MoviesHeroSliderProps {
  className?: string;
  movies: Movie[];
}

export function MoviesHeroSlider({ className, movies }: MoviesHeroSliderProps) {
  return (
    <HeroSlider className={className}>
      {movies.map((movie) => (
        <div className="movies-hero-slider__slide" key={movie.id}>
          <img
            src={
              movieApi[movie.source].getMovieImage(movie.backdropPath, "banner") ??
              DEFAULT_BANNER_PATH
            }
            alt={movie.title}
            className="movies-hero-slider__image"
          />
          <div className="movies-hero-slider__overlay" />
          <div className="movies-hero-slider__content">
            <h3 className="movies-hero-slider__title">{movie.title}</h3>
            {movie.overview && <p className="movies-hero-slider__description">{movie.overview}</p>}
            <Link to={getRouteLink.MOVIE_DETAIL(movie.id)} className="movies-hero-slider__button">
              See more
            </Link>
          </div>
        </div>
      ))}
    </HeroSlider>
  );
}
