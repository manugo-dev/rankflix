import { useQuery } from "@tanstack/react-query";

import { type MovieSourceIdType, type MovieTrendingTime } from "@/entities/movies";
import { MoviesHeroSlider } from "@/entities/movies";
import { Spinner } from "@/shared/ui/spinner";

import { discoverMoviesQueries } from "../api/queries";

interface TrendingSectionProps {
  source: MovieSourceIdType;
  timeWindow?: MovieTrendingTime;
}

export function TrendingSection({ source, timeWindow }: TrendingSectionProps) {
  const {
    data: movies,
    error,
    isPending,
  } = useQuery(discoverMoviesQueries.trending(source, timeWindow));

  if (isPending) return <Spinner />;
  if (error || !movies?.results)
    return <div className="trending-section" data-testid="trending-section"></div>;

  return (
    <MoviesHeroSlider
      data-testid="trending-section"
      data-source={source}
      className="trending-section"
      movies={movies.results}
    />
  );
}
