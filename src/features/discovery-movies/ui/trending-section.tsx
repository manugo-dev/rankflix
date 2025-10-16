import { useQuery } from "@tanstack/react-query";

import { type MovieSourceIdType, type MovieTrendingTime } from "@/entities/movies";
import { MoviesHeroSlider } from "@/entities/movies/ui/movies-hero-slider/movies-hero-slider";
import { Spinner } from "@/shared/ui/spinner";

import { discoverMoviesQueries } from "../api/queries";

import "./trending-section.scss";

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

  if (isLoading) return <Spinner />;
  if (error || !movies?.results) return <div className="trending-section"></div>;

  return <MoviesHeroSlider className="trending-section" movies={movies.results} />;
}
