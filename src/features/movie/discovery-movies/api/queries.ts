import { queryOptions } from "@tanstack/react-query";

import {
  type DiscoverMoviesParams,
  MOVIE_QUERY_KEY,
  movieApi,
  type MovieGenreId,
  type MovieTrendingTime,
  type TrendingMoviesParams,
} from "@/entities/movies";
import { STALE_TIMES } from "@/shared/config";
import { sortedValuesToString } from "@/shared/lib/array";
import { createEntityKey, serializeObjectEntries } from "@/shared/lib/query";

export const discoverMoviesQueryKeys = {
  all: (source: string, params?: DiscoverMoviesParams) =>
    createEntityKey(MOVIE_QUERY_KEY, "discover", source, serializeObjectEntries(params)),
  byGenres: (source: string, genres?: string, params?: DiscoverMoviesParams) =>
    createEntityKey(MOVIE_QUERY_KEY, "discover", source, genres, serializeObjectEntries(params)),
  trending: (source: string, time?: MovieTrendingTime, params?: TrendingMoviesParams) =>
    createEntityKey(
      MOVIE_QUERY_KEY,
      "discover",
      "trending",
      source,
      time,
      serializeObjectEntries(params),
    ),
};

export const discoverMoviesQueries = {
  all: (source: keyof typeof movieApi, params?: DiscoverMoviesParams) => {
    return queryOptions({
      queryFn: () => movieApi[source].discover(params),
      queryKey: discoverMoviesQueryKeys.all(source, params),
      staleTime: STALE_TIMES.DEFAULT,
    });
  },
  byGenres: (
    source: keyof typeof movieApi,
    withGenres?: MovieGenreId[],
    params?: Omit<DiscoverMoviesParams, "withGenres">,
  ) => {
    return queryOptions({
      queryFn: () => movieApi[source].discover({ ...params, withGenres }),
      queryKey: discoverMoviesQueryKeys.byGenres(source, sortedValuesToString(withGenres), params),
      staleTime: STALE_TIMES.DEFAULT,
    });
  },
  trending: (
    source: keyof typeof movieApi,
    time?: MovieTrendingTime,
    params?: TrendingMoviesParams,
  ) => {
    return queryOptions({
      queryFn: () => movieApi[source].trending({ ...params, timeWindow: time }),
      queryKey: discoverMoviesQueryKeys.trending(source, time, params),
      staleTime: STALE_TIMES.DAY,
    });
  },
};
