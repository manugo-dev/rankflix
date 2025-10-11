import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";

import { MovieSourceId } from "@/entities/movies";
import { MovieDetailSection, movieDetailQueries } from "@/features/movie/movie-detail";
import { getRouteLink } from "@/shared/routes";

export function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const movieQuery = useQuery(movieDetailQueries.getMovie(MovieSourceId.TMDB, movieId ?? ""));

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
    <>
      <MovieDetailSection movie={movieQuery.data!} />
      <Link to={getRouteLink.HOME()}>Back to Home</Link>
    </>
  );
}
