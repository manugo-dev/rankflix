import { getTMDBMovieImage } from "../../lib/mappers/tmdb-movies-mapper";
import type { Movie } from "../../model/movies-types";

import "./movie-card.scss";

interface MovieCardProps {
  movie: Movie;
  onClick?: (_id: string) => void;
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <div className="movie-card" onClick={() => onClick?.(movie.id)}>
      <img
        className="movie-card__poster"
        src={getTMDBMovieImage(movie.posterUrl)}
        alt={movie.title}
      />
      <h3 className="movie-card__title">{movie.title}</h3>
      <span className="movie-card__release-date">{movie.releaseDate}</span>
    </div>
  );
}
