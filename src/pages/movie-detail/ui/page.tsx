import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useNavigate, useParams } from "react-router";

import { movieApi, MovieSourceId } from "@/entities/movies";
import { movieDetailQueries } from "@/features/movie/movie-detail";
import { AddToWatchlistButton, createWatchlistItemFromMovie } from "@/features/watchlist";
import { getYear } from "@/shared/lib/date";
import { getRouteLink } from "@/shared/routes";

import "./movie-detail.scss";

export function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const movieQuery = useQuery(movieDetailQueries.getMovie(MovieSourceId.TMDB, movieId ?? ""));
  const movie = movieQuery?.data;

  const isLoading = movieQuery.isLoading;
  const hasError = movieQuery.isError;

  if (isLoading) {
    return (
      <section>
        <h1>Movie Detail Page</h1>
        <p>Loading movie details...</p>
      </section>
    );
  }

  if (hasError || !movie) {
    return navigate(getRouteLink.ERROR());
  }

  return (
    <div className="movie-detail">
      <motion.section
        className="movie-detail__hero"
        style={{
          backgroundImage: `url(${movieApi[movie.source].getMovieImage(movie.backdrop_path, "banner")})`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="movie-detail__overlay" />
        <div className="movie-detail__hero-content">
          <motion.img
            className="movie-detail__poster"
            src={movieApi[movie.source].getMovieImage(movie.posterPath, "poster")}
            alt={movie.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          />

          <motion.div
            className="movie-detail__info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="movie-detail__title">{movie.title}</h1>
            <p className="movie-detail__tagline">{movie.tagline}</p>
            <div className="movie-detail__meta">
              <span>{getYear(movie.releaseDate)}</span>
              <span>•</span>
              <span>{movie.runtime} min</span>
              <span>•</span>
              <span>{movie.voteAverage.toFixed(1)} ⭐</span>
            </div>
            <p className="movie-detail__overview">{movie.overview}</p>

            <div className="movie-detail__actions">
              <a
                href={movie.homepage}
                target="_blank"
                rel="noreferrer"
                className="movie-detail__button"
              >
                Visit official site
              </a>
              <AddToWatchlistButton item={createWatchlistItemFromMovie(movie)} />
            </div>
          </motion.div>
        </div>
      </motion.section>

      <section className="movie-detail__about">
        <h2 className="movie-detail__section-title">About</h2>
        <div className="movie-detail__grid">
          <div>
            <h3 className="movie-detail__label">Original Title</h3>
            <p className="movie-detail__value">{movie.originalTitle}</p>
          </div>
          <div>
            <h3 className="movie-detail__label">Language</h3>
            <p className="movie-detail__value">
              {movie.spokenLanguages.map((lang) => lang).join(", ")}
            </p>
          </div>
          <div>
            <h3 className="movie-detail__label">Genres</h3>
            <p className="movie-detail__value">{movie.genres.map((genre) => genre).join(", ")}</p>
          </div>
          <div>
            <h3 className="movie-detail__label">Budget</h3>
            <p className="movie-detail__value">${movie.budget.toLocaleString()}</p>
          </div>
          <div>
            <h3 className="movie-detail__label">Revenue</h3>
            <p className="movie-detail__value">${movie.revenue.toLocaleString()}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
