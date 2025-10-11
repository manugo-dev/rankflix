import type { MovieDetail } from "@/entities/movies";

interface MovieDetailSectionProps {
  movie: MovieDetail;
}

export function MovieDetailSection({ movie }: MovieDetailSectionProps) {
  return (
    <section>
      <h1>{movie.title}</h1>
      <p>{movie.overview}</p>
      <p>Genres: {movie.genres.join(", ")}</p>
      <p>Release Date: {movie.release_date}</p>
      <p>Rating: {movie.vote_average}</p>
    </section>
  );
}
