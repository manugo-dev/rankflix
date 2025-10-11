import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

import { type MovieGenreId, type MovieSourceId } from "@/entities/movies";
import { getRouteLink } from "@/shared/routes";

import { discoverMoviesQueries } from "../api/queries";

interface GenreSectionProps {
  source: MovieSourceId;
  genres: MovieGenreId[];
  title: string;
}

export function GenresSection({ source, genres, title }: GenreSectionProps) {
  const {
    data: movies,
    isLoading,
    error,
  } = useQuery(discoverMoviesQueries.byGenres(source, genres));

  if (isLoading) return <p>Loading {title}...</p>;
  if (error) return <p>Error loading {title}</p>;
  if (!movies?.results) return <p>No movies found</p>;

  return (
    <div>
      <h2>{title}</h2>
      <ul>
        {movies.results.map((movie) => (
          <li key={movie.id}>
            <span>Movie: {movie.title}</span>
            <Link to={getRouteLink.MOVIE_DETAIL(movie.id)}>View Details</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
