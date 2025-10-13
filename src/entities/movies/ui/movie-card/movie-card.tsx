import { motion } from "motion/react";

import { cn } from "@/shared/lib/styles";

import { movieApi } from "../../api";
import type { Movie } from "../../model/movies-types";

import "./movie-card.scss";

interface MovieCardProps {
  active?: boolean;
  movie: Movie;
}

export function MovieCard({ active = false, movie }: MovieCardProps) {
  const movieYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : "—";

  return (
    <motion.article
      className={cn("movie-card", { "movie-card--active": active })}
      initial={false}
      animate={active ? "hover" : "rest"}
      whileHover="hover"
      variants={{
        hover: { scale: 1.02, y: -6 },
        rest: { scale: 1, y: 0 },
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <motion.div className="movie-card__image-container">
        <motion.img
          src={movieApi[movie.source].getMovieImage(movie.posterUrl)}
          alt={movie.title}
          className="movie-card__image"
          variants={{
            hover: { height: "75%" },
            rest: { height: "100%" },
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          draggable={false}
          style={{ viewTransitionName: `movie-${movie.id}` }}
        />
      </motion.div>
      <motion.div
        className="movie-card__ranking"
        variants={{
          hover: { opacity: 1, y: 0 },
          rest: { opacity: 0, y: 16 },
        }}
        transition={{ duration: 0.3 }}
      >
        ⭐ {movie.voteAverage?.toFixed(1) ?? "—"}
      </motion.div>
      <motion.div
        className="movie-card__info"
        variants={{
          hover: { opacity: 1, y: 0 },
          rest: { opacity: 0, y: 10 },
        }}
        transition={{ delay: 0.05, duration: 0.3 }}
      >
        <h3 className="movie-card__title">{movie.title}</h3>
        <p className="movie-card__year">{movieYear}</p>
      </motion.div>
    </motion.article>
  );
}
