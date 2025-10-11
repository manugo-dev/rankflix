import { queryOptions } from "@tanstack/react-query";

import { MOVIE_QUERY_KEY, movieApi } from "@/entities/movies";
import { createEntityKey } from "@/shared/lib/query";

export const movieDetailQueryKeys = {
  getMovie: (id: string) => createEntityKey(MOVIE_QUERY_KEY, "detail", id),
};

export const movieDetailQueries = {
  getMovie: (source: keyof typeof movieApi, id: string) => {
    return queryOptions({
      queryKey: movieDetailQueryKeys.getMovie(id),
      queryFn: () => movieApi[source].details(id),
    });
  },
};
