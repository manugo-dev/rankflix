import { Link } from "react-router";

import { getRouteLink } from "@/shared/routes";
import { HeroSlider, HeroSliderItem } from "@/shared/ui/hero-slider/hero-slider";

import { movieApi } from "../../api";
import { DEFAULT_BANNER_PATH } from "../../model/movies-constants";
import type { Movie } from "../../model/movies-types";

import "./movies-hero-slider.scss";

interface MoviesHeroSliderProps {
  movies: Movie[];
}

export function MoviesHeroSlider({ movies }: MoviesHeroSliderProps) {
  return (
    <HeroSlider>
      {movies.map((movie) => (
        <HeroSliderItem key={movie.id}>
          <div className="movies-hero-slider__slide">
            <img
              src={
                movieApi[movie.source].getMovieImage(movie.backdropUrl, "banner") ??
                DEFAULT_BANNER_PATH
              }
              alt={movie.title}
              className="movies-hero-slider__image"
            />
            <div className="movies-hero-slider__overlay" />
            <div className="movies-hero-slider__content">
              <h2 className="movies-hero-slider__title">{movie.title}</h2>
              {movie.overview && (
                <p className="movies-hero-slider__description">{movie.overview}</p>
              )}
              <Link to={getRouteLink.MOVIE_DETAIL(movie.id)} className="movies-hero-slider__button">
                See more
              </Link>
            </div>
          </div>
        </HeroSliderItem>
      ))}
    </HeroSlider>
  );
}
