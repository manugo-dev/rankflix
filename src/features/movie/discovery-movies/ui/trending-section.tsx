import { useQuery } from "@tanstack/react-query";

import { type MovieSourceIdType, type MovieTrendingTime } from "@/entities/movies";
import { MoviesHeroSlider } from "@/entities/movies/ui/movies-hero-slider/movies-hero-slider";

import { discoverMoviesQueries } from "../api/queries";

interface TrendingSectionProps {
  source: MovieSourceIdType;
  timeWindow?: MovieTrendingTime;
}

export function TrendingSection({ source, timeWindow }: TrendingSectionProps) {
  const {
    data: movies,
    error,
    isLoading,
  } = useQuery(discoverMoviesQueries.trending(source, timeWindow));

  if (isLoading) return <p>Loading Trending Movies...</p>;
  if (error) return <p>Error loading Trending Movies</p>;
  if (!movies?.results) return <p>No movies found</p>;

  return <MoviesHeroSlider movies={movies.results} />;
}
