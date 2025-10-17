import { MovieGenreMap, MovieSourceId } from "@/entities/movies";
import { GenresSection, TrendingSection } from "@/features/discovery-movies";
import { useTranslate } from "@/shared/hooks/use-translation";
import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";

export function HomePage() {
  const { t } = useTranslate();

  return (
    <>
      <Header variant="floating" />
      <main className="home-page">
        <TrendingSection source={MovieSourceId.TMDB} />
        <div className="page boxed-container">
          <GenresSection
            source={MovieSourceId.TMDB}
            genres={[MovieGenreMap.DRAMA]}
            title={t("movie.genre.drama")}
          />
          <GenresSection
            source={MovieSourceId.TMDB}
            genres={[MovieGenreMap.COMEDY]}
            title={t("movie.genre.comedy")}
          />
          <GenresSection
            source={MovieSourceId.TMDB}
            genres={[MovieGenreMap.ACTION]}
            title={t("movie.genre.action")}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
