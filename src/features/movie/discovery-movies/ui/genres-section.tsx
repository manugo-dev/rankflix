import { useQuery } from "@tanstack/react-query";

import { type MovieGenreId, MoviesCarousel, type MovieSourceIdType } from "@/entities/movies";

import { discoverMoviesQueries } from "../api/queries";

interface GenreSectionProps {
  source: MovieSourceIdType;
  genres: MovieGenreId[];
  title: string;
}

export function GenresSection({ genres, source, title }: GenreSectionProps) {
  const {
    data: movies,
    error,
    isLoading,
  } = useQuery(discoverMoviesQueries.byGenres(source, genres));

  if (isLoading) return <p>Loading {title}...</p>;
  if (error) return <p>Error loading {title}</p>;
  if (!movies?.results) return <p>No movies found</p>;

  return (
    <div>
      <h2>{title}</h2>
      <MoviesCarousel movies={movies.results} />
    </div>
  );
}
