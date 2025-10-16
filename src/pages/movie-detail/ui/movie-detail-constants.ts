import type { MovieGenreId } from "@/entities/movies";

export const movieDetailGenreStyles: Partial<Record<MovieGenreId, string>> = {
  "genres.ACTION": "movie-detail--genre-action",
  "genres.COMEDY": "movie-detail--genre-comedy",
};
