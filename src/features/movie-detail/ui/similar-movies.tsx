import { useQuery } from "@tanstack/react-query";

import { MoviesCarousel, MovieSourceId } from "@/entities/movies";
import { Spinner } from "@/shared/ui/spinner/spinner";

import { movieDetailQueries } from "../api/queries";

export interface SimilarMoviesProps {
  movieId: string;
}

export function SimilarMovies({ movieId }: SimilarMoviesProps) {
  const similarMoviesQuery = useQuery({
    ...movieDetailQueries.getSimilar(MovieSourceId.TMDB, movieId),
  });

  if (similarMoviesQuery.isPending) {
    return <Spinner />;
  }

  if (similarMoviesQuery.data?.results && similarMoviesQuery.data.results.length > 0) {
    return <MoviesCarousel movies={similarMoviesQuery.data.results} />;
  }

  return <p>We could not find similar titles right now.</p>;
}
