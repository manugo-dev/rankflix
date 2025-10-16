import { MovieGenreMap, MovieSourceId } from "@/entities/movies";
import { discoverMoviesQueries } from "@/features/discovery-movies";
import type { PrefetchContext } from "@/shared/lib/prefetch";
import { registerRoute } from "@/shared/lib/prefetch";
import { ROUTES } from "@/shared/routes";

registerRoute({
  path: ROUTES.HOME,
  prefetch: async ({ queryClient }: PrefetchContext) => {
    await Promise.all([
      queryClient.prefetchQuery(discoverMoviesQueries.trending(MovieSourceId.TMDB)),
      queryClient.prefetchQuery(
        discoverMoviesQueries.byGenres(MovieSourceId.TMDB, [MovieGenreMap.DRAMA]),
      ),
      queryClient.prefetchQuery(
        discoverMoviesQueries.byGenres(MovieSourceId.TMDB, [MovieGenreMap.COMEDY]),
      ),
      queryClient.prefetchQuery(
        discoverMoviesQueries.byGenres(MovieSourceId.TMDB, [MovieGenreMap.ACTION]),
      ),
    ]);
  },
});
