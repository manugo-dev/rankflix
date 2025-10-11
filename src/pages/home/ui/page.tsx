import { MovieGenreMap, TMDB_MOVIE_SOURCE_ID } from "@/entities/movies";
import { GenresSection, TrendingSection } from "@/features/movie/discovery-movies";

export function HomePage() {
  return (
    <section>
      <h1>Home Page</h1>
      <p>Welcome to Rankflix!</p>
      <TrendingSection source={TMDB_MOVIE_SOURCE_ID} />
      <GenresSection
        source={TMDB_MOVIE_SOURCE_ID}
        genres={[MovieGenreMap.DRAMA]}
        title="Drama Movies"
      />
      <GenresSection
        source={TMDB_MOVIE_SOURCE_ID}
        genres={[MovieGenreMap.COMEDY]}
        title="Comedy Movies"
      />
      <GenresSection
        source={TMDB_MOVIE_SOURCE_ID}
        genres={[MovieGenreMap.ACTION]}
        title="Action Movies"
      />
    </section>
  );
}
