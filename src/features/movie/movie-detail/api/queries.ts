import { queryOptions } from "@tanstack/react-query";

import { MOVIE_QUERY_KEY, movieApi } from "@/entities/movies";
import { createEntityKey } from "@/shared/lib/query";

export const movieDetailQueryKeys = {
  getMovie: (id: string) => createEntityKey(MOVIE_QUERY_KEY, "detail", id),
  getSimilar: (id: string) => createEntityKey(MOVIE_QUERY_KEY, "detail", id, "similar"),
};

export const movieDetailQueries = {
  getMovie: (source: keyof typeof movieApi, id: string) => {
    return queryOptions({
      queryFn: () => movieApi[source].details(id),
      queryKey: movieDetailQueryKeys.getMovie(id),
    });
  },
  getSimilar: (source: keyof typeof movieApi, id: string) => {
    return queryOptions({
      queryFn: () => movieApi[source].similar(id),
      queryKey: movieDetailQueryKeys.getSimilar(id),
    });
  },
};
