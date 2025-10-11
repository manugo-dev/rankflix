import { MovieSourceId } from "@/entities/movies";
import { movieDetailQueries } from "@/features/movie/movie-detail";
import { registerRoute, type PrefetchContext } from "@/shared/lib/prefetch";
import { ROUTES } from "@/shared/routes";

registerRoute({
  path: ROUTES.MOVIE_DETAIL,
  prefetch: async ({ queryClient, params }: PrefetchContext) => {
    await queryClient.prefetchQuery(
      movieDetailQueries.getMovie(MovieSourceId.TMDB, params.movieId ?? ""),
    );
  },
});
