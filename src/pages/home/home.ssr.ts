import { MovieGenreMap, TMDB_MOVIE_SOURCE_ID } from "@/entities/movies";
import { discoverMoviesQueries } from "@/features/movie/discovery-movies";
import type { PrefetchContext } from "@/shared/lib/prefetch";
import { registerRoute } from "@/shared/lib/prefetch";
import { ROUTES } from "@/shared/routes";

registerRoute({
  path: ROUTES.HOME,
  prefetch: async ({ queryClient }: PrefetchContext) => {
    await Promise.all([
      queryClient.prefetchQuery(discoverMoviesQueries.trending(TMDB_MOVIE_SOURCE_ID)),
      queryClient.prefetchQuery(
        discoverMoviesQueries.byGenres(TMDB_MOVIE_SOURCE_ID, [MovieGenreMap.DRAMA]),
      ),
      queryClient.prefetchQuery(
        discoverMoviesQueries.byGenres(TMDB_MOVIE_SOURCE_ID, [MovieGenreMap.COMEDY]),
      ),
      queryClient.prefetchQuery(
        discoverMoviesQueries.byGenres(TMDB_MOVIE_SOURCE_ID, [MovieGenreMap.ACTION]),
      ),
    ]);
  },
});
