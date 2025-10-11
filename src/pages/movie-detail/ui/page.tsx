import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

import { TMDB_MOVIE_SOURCE_ID } from "@/entities/movies";
import { movieDetailsQueries } from "@/features/movie/movie-details";

export function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const movieQuery = useQuery(movieDetailsQueries.getMovie(TMDB_MOVIE_SOURCE_ID, movieId ?? ""));

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

  if (hasError) {
    return (
      <section>
        <h1>Movie Detail Page</h1>
        <p>Error loading movie details. Please try again later.</p>
      </section>
    );
  }

  return (
    <section>
      <h1>Movie Detail Page</h1>
      <h2>{movieQuery.data?.title}</h2>
    </section>
  );
}
