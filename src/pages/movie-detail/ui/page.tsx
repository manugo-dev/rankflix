import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Navigate, useParams } from "react-router";

import { movieApi, MovieSourceId } from "@/entities/movies";
import { SimilarMovies } from "@/features/discovery-movies";
import { movieDetailQueries } from "@/features/movie-detail";
import { AddToWatchlistButton, createWatchlistItemFromMovie } from "@/features/watchlist";
import { formatDate, getYear } from "@/shared/lib/date";
import { humanizer } from "@/shared/lib/humanizer";
import { cn } from "@/shared/lib/styles";
import { getRouteLink } from "@/shared/routes";
import { Spinner } from "@/shared/ui/spinner";

import { movieDetailGenreStyles } from "./movie-detail-constants";

import "./movie-detail.scss";

export function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();

  const movieQuery = useQuery({
    ...movieDetailQueries.getMovie(MovieSourceId.TMDB, movieId!),
    enabled: Boolean(movieId),
  });

  const movie = movieQuery.data;

  if (movieQuery.isPending) {
    return (
      <section className="movie-detail">
        <Spinner />
      </section>
    );
  }

  if (!movieId || movieQuery.isError || !movie) {
    return <Navigate to={getRouteLink.ERROR()} />;
  }

  const heroBackgroundImage = movieApi[movie.source].getMovieImage(movie.backdropPath, "backdrop");
  const posterImage = movieApi[movie.source].getMovieImage(movie.posterPath, "poster");

  const genreWithStyle = movie.genres?.find((genre) => {
    return genre in movieDetailGenreStyles;
  });

  return (
    <div className={cn("movie-detail", genreWithStyle && movieDetailGenreStyles[genreWithStyle])}>
      <motion.section
        className="movie-detail__hero"
        style={heroBackgroundImage ? { backgroundImage: `url(${heroBackgroundImage})` } : undefined}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="movie-detail__hero-overlay" />
        <div className="movie-detail__hero-inner boxed-container">
          <motion.div
            className="movie-detail__poster"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {posterImage ? (
              <img src={posterImage} alt={`${movie.title} poster`} loading="lazy" />
            ) : (
              <div className="movie-detail__poster-placeholder">{movie.title}</div>
            )}
          </motion.div>

          <motion.div
            className="movie-detail__headline"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            <div className="movie-detail__chips">
              {movie.genres?.map((genre) => (
                <span key={genre} className="movie-detail__chip">
                  {genre}
                </span>
              ))}
            </div>

            <h1 className="movie-detail__title">{movie.title}</h1>

            {movie.tagline && <p className="movie-detail__tagline">{movie.tagline}</p>}

            <div className="movie-detail__meta">
              <span className="movie-detail__meta-item">{getYear(movie.releaseDate)}</span>
              {movie.runtimeMilliseconds && (
                <span className="movie-detail__meta-item">
                  {humanizer(movie.runtimeMilliseconds)}
                </span>
              )}
              {movie.spokenLanguages && (
                <span className="movie-detail__meta-item">
                  {movie.spokenLanguages?.join(", ") || "—"}
                </span>
              )}
            </div>

            <div className="movie-detail__rating">
              <span className="movie-detail__rating-score">★ {movie.voteAverage.toFixed(1)}</span>
              <span className="movie-detail__rating-count">{movie.voteCount} votes</span>
            </div>

            <p className="movie-detail__overview">{movie.overview}</p>

            <div className="movie-detail__actions">
              {movie.homepage && (
                <a className="button-link" href={movie.homepage} rel="noreferrer" target="_blank">
                  Visit Official Site
                </a>
              )}
              <AddToWatchlistButton item={createWatchlistItemFromMovie(movie)} />
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="boxed-container movie-detail__content"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.6 }}
      >
        <div className="movie-detail__sections">
          <div className="movie-detail__section">
            <h2 className="movie-detail__section-title">Overview</h2>
            <p className="movie-detail__section-text">{movie.overview}</p>
          </div>

          <div className="movie-detail__section">
            <h2 className="movie-detail__section-title">Details</h2>
            <div className="movie-detail__info-grid">
              <div>
                <span className="movie-detail__label">Original Title</span>
                <p className="movie-detail__value">{movie.originalTitle}</p>
              </div>
              <div>
                <span className="movie-detail__label">Release Date</span>
                <p className="movie-detail__value">{formatDate(movie.releaseDate)}</p>
              </div>
              <div>
                <span className="movie-detail__label">Genres</span>
                <p className="movie-detail__value">
                  {movie.genres && movie.genres?.length > 0 ? movie.genres.join(" • ") : "—"}
                </p>
              </div>
              <div>
                <span className="movie-detail__label">Languages</span>
                <p className="movie-detail__value">{movie.spokenLanguages?.join(", ") || "—"}</p>
              </div>
              <div>
                <span className="movie-detail__label">Production</span>
                <p className="movie-detail__value">
                  {movie?.productionCompanies?.map((company) => company.name).join(", ") || "—"}
                </p>
              </div>
              <div>
                <span className="movie-detail__label">Countries</span>
                <p className="movie-detail__value">
                  {movie.productionCountries?.map((country) => country.name).join(", ") || "—"}
                </p>
              </div>
              <div>
                <span className="movie-detail__label">IMDB</span>
                <p className="movie-detail__value">
                  <a
                    href={`https://www.imdb.com/title/${movie.imdbId}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {movie.imdbId}
                  </a>
                </p>
              </div>
            </div>
          </div>

          {movie.productionCompanies && movie.productionCompanies?.length > 0 && (
            <div className="movie-detail__section movie-detail__section--production">
              <h2 className="movie-detail__section-title">Production Studios</h2>
              <div className="movie-detail__companies">
                {movie.productionCompanies.map((company) => (
                  <motion.div
                    key={company.id}
                    className="movie-detail__company"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                  >
                    {company.logoImage ? (
                      <img
                        alt={`${company.name} logo`}
                        className="movie-detail__company-logo"
                        src={company.logoImage}
                        loading="lazy"
                      />
                    ) : (
                      <span className="movie-detail__company-name">{company.name}</span>
                    )}
                    {company.originCountry && (
                      <span className="movie-detail__company-country">{company.originCountry}</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {movieId && (
          <motion.section
            className="boxed-container movie-detail__similar"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.2, once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="movie-detail__section-title">Similar Titles</h2>
            <SimilarMovies movieId={movieId} />
          </motion.section>
        )}
      </motion.section>
    </div>
  );
}
