import { useQuery } from "@tanstack/react-query";

import { type MovieGenreId, MoviesCarousel, type MovieSourceIdType } from "@/entities/movies";
import { TitlesSkeleton } from "@/shared/ui/skeleton";

import { discoverMoviesQueries } from "../api/queries";

import "./genres-section.scss";

interface GenreSectionProps {
  genres: MovieGenreId[];
  source: MovieSourceIdType;
  title: string;
}

export function GenresSection({ genres, source, title }: GenreSectionProps) {
  const {
    data: movies,
    error,
    isLoading,
  } = useQuery(discoverMoviesQueries.byGenres(source, genres));

  if (isLoading)
    return (
      <section aria-label={title} className="genres-section">
        <h2 className="genres-section__title">{title}</h2>
        <TitlesSkeleton />
      </section>
    );

  if (error)
    return (
      <section aria-label={title} className="genres-section">
        <h2 className="genres-section__title">{title}</h2>
        <p className="genres-section__error-text">Something happened downloading the catalog</p>
      </section>
    );

  if (!movies?.results)
    return (
      <section aria-label={title} className="genres-section">
        <h2 className="genres-section__title">{title}</h2>
        <p className="genres-section__not-found-text">No movies found</p>
      </section>
    );

  return (
    <section aria-label={title} className="genres-section">
      <h2 className="genres-section__title">{title}</h2>
      <MoviesCarousel movies={movies.results} />
    </section>
  );
}
