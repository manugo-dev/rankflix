import type { MovieGenreId } from "@/entities/movies";

export const movieDetailGenreStyles: Partial<Record<MovieGenreId, string>> = {
  "movie.genre.action": "movie-detail--genre-action",
  "movie.genre.comedy": "movie-detail--genre-comedy",
};
