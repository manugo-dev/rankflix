import { MovieGenreMap, MovieSourceId } from "@/entities/movies";
import { GenresSection, TrendingSection } from "@/features/movie/discovery-movies";
import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";

export function HomePage() {
  return (
    <>
      <Header variant="floating" />
      <section>
        <TrendingSection source={MovieSourceId.TMDB} />
        <GenresSection
          source={MovieSourceId.TMDB}
          genres={[MovieGenreMap.DRAMA]}
          title="Drama Movies"
        />
        <GenresSection
          source={MovieSourceId.TMDB}
          genres={[MovieGenreMap.COMEDY]}
          title="Comedy Movies"
        />
        <GenresSection
          source={MovieSourceId.TMDB}
          genres={[MovieGenreMap.ACTION]}
          title="Action Movies"
        />
      </section>
      <Footer />
    </>
  );
}
