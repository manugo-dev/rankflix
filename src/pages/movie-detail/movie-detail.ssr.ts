import { TMDB_MOVIE_SOURCE_ID } from "@/entities/movies";
import { movieDetailsQueries } from "@/features/movie/movie-details";
import { registerRoute, type PrefetchContext } from "@/shared/lib/prefetch";
import { ROUTES } from "@/shared/routes";

registerRoute({
  path: ROUTES.MOVIE_DETAIL,
  prefetch: async ({ queryClient, params }: PrefetchContext) => {
    await queryClient.prefetchQuery(
      movieDetailsQueries.getMovie(TMDB_MOVIE_SOURCE_ID, params.movieId ?? ""),
    );
  },
});
