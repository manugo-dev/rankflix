import { MovieSourceId } from "@/entities/movies";
import { movieDetailQueries } from "@/features/movie-detail";
import { type PrefetchContext, registerRoute } from "@/shared/lib/prefetch";
import { ROUTES } from "@/shared/routes";

registerRoute({
  path: ROUTES.MOVIE_DETAIL,
  prefetch: async ({ params, queryClient }: PrefetchContext) => {
    await queryClient.prefetchQuery(
      movieDetailQueries.getMovie(MovieSourceId.TMDB, params.movieId ?? ""),
    );
  },
});
