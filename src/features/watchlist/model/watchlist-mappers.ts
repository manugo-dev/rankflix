import type { Movie } from "@/entities/movies";
import { getRouteLink } from "@/shared/routes";

import type { WatchlistItem, WatchlistItemType } from "./watchlist-types";

export const getUniqueId = (itemId: string, itemType: WatchlistItemType) => {
  return `${itemType}:${itemId}`;
};

export const createWatchlistItemFromMovie = (movie: Movie): WatchlistItem => {
  return {
    id: movie.id.toString(),
    posterUrl: movie.posterPath,
    releaseDate: movie.releaseDate,
    title: movie.title,
    type: "movie",
    uid: getUniqueId(movie.id.toString(), "movie"),
  };
};

const watchlistItemRouteMap: Record<WatchlistItemType, (_id: string) => string> = {
  movie: (id: string) => getRouteLink.MOVIE_DETAIL(id),
};

export const getRouteForWatchlistItem = (item: WatchlistItem) => {
  return watchlistItemRouteMap[item.type](item.id);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const watchlistItemCreators: Record<WatchlistItemType, (_item: any) => WatchlistItem> = {
  movie: createWatchlistItemFromMovie,
};

export const mapToWatchlistItem = (item: WatchlistItem): WatchlistItem => {
  return watchlistItemCreators[item.type](item);
};
