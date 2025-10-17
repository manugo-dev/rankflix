import { Link } from "react-router";

import { useTranslate } from "@/shared/hooks/use-translation";
import { getRouteLink } from "@/shared/routes";
import { HeroSlider, type HeroSliderProps } from "@/shared/ui/hero-slider";

import { movieApi } from "../../api";
import { DEFAULT_BANNER_PATH } from "../../model/movies-constants";
import type { Movie } from "../../model/movies-types";

import "./movies-hero-slider.scss";

interface MoviesHeroSliderProps extends HeroSliderProps {
  className?: string;
  movies: Movie[];
}

export function MoviesHeroSlider({ className, movies, ...props }: MoviesHeroSliderProps) {
  const { t } = useTranslate();

  return (
    <HeroSlider className={className} {...props}>
      {movies.map((movie, index) => (
        <div className="movies-hero-slider__slide" key={movie.id}>
          <img
            src={
              movieApi[movie.source].getMovieImage(movie.backdropPath, "banner") ??
              DEFAULT_BANNER_PATH
            }
            alt={movie.title}
            fetchPriority={index === 0 ? "high" : "low"}
            className="movies-hero-slider__image"
          />
          <div className="movies-hero-slider__overlay" />
          <div className="movies-hero-slider__content">
            <h3 className="movies-hero-slider__title">{movie.title}</h3>
            {movie.overview && <p className="movies-hero-slider__description">{movie.overview}</p>}
            <Link to={getRouteLink.MOVIE_DETAIL(movie.id)} className="movies-hero-slider__button">
              {t("movie.see-details")}
            </Link>
          </div>
        </div>
      ))}
    </HeroSlider>
  );
}
