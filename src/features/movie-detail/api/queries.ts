import { queryOptions } from "@tanstack/react-query";

import { MOVIE_QUERY_KEY, movieApi } from "@/entities/movies";
import { i18n } from "@/shared/config";
import { createEntityKey } from "@/shared/lib/query";

export const movieDetailQueryKeys = {
  getMovie: (id: string) => createEntityKey(MOVIE_QUERY_KEY, "detail", id, i18n.language),
  getSimilar: (id: string) =>
    createEntityKey(MOVIE_QUERY_KEY, "detail", id, "similar", i18n.language),
};

export const movieDetailQueries = {
  getMovie: (source: keyof typeof movieApi, id: string) => {
    return queryOptions({
      queryFn: () => movieApi[source].details(id, i18n.language),
      queryKey: movieDetailQueryKeys.getMovie(id),
    });
  },
  getSimilar: (source: keyof typeof movieApi, id: string) => {
    return queryOptions({
      queryFn: () => movieApi[source].similar(id, i18n.language),
      queryKey: movieDetailQueryKeys.getSimilar(id),
    });
  },
};
