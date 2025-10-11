import { queryOptions } from "@tanstack/react-query";

import {
  movieApi,
  MOVIE_QUERY_KEY,
  type DiscoverMoviesParams,
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
      queryKey: discoverMoviesQueryKeys.all(source, params),
      queryFn: () => movieApi[source].discover(params),
      staleTime: STALE_TIMES.DEFAULT,
    });
  },
  byGenres: (
    source: keyof typeof movieApi,
    withGenres?: MovieGenreId[],
    params?: Omit<DiscoverMoviesParams, "withGenres">,
  ) => {
    return queryOptions({
      queryKey: discoverMoviesQueryKeys.byGenres(source, sortedValuesToString(withGenres), params),
      queryFn: () => movieApi[source].discover({ ...params, withGenres }),
      staleTime: STALE_TIMES.DEFAULT,
    });
  },
  trending: (
    source: keyof typeof movieApi,
    time?: MovieTrendingTime,
    params?: TrendingMoviesParams,
  ) => {
    return queryOptions({
      queryKey: discoverMoviesQueryKeys.trending(source, time, params),
      queryFn: () => movieApi[source].trending({ ...params, timeWindow: time }),
      staleTime: STALE_TIMES.DAY,
    });
  },
};
