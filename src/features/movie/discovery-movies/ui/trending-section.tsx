import { useQuery } from "@tanstack/react-query";

import { type MovieSourceIdType, type MovieTrendingTime } from "@/entities/movies";

import { discoverMoviesQueries } from "../api/queries";

interface TrendingSectionProps {
  source: MovieSourceIdType;
  timeWindow?: MovieTrendingTime;
}

export function TrendingSection({ source, timeWindow }: TrendingSectionProps) {
  const {
    data: movies,
    isLoading,
    error,
  } = useQuery(discoverMoviesQueries.trending(source, timeWindow));

  if (isLoading) return <p>Loading Trending Movies...</p>;
  if (error) return <p>Error loading Trending Movies</p>;
  if (!movies?.results) return <p>No movies found</p>;

  return (
    <div>
      <h2>Trending Movies</h2>
      <ul>
        {movies.results.map((movie) => (
          <li key={movie.id}>Movie: {movie.title}</li>
        ))}
      </ul>
    </div>
  );
}
