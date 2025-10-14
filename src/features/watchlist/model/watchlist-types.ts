export type WatchlistItemType = "movie";

export interface WatchlistItem {
  id: string;
  posterUrl?: string;
  releaseDate?: Date;
  source?: string;
  title: string;
  type: WatchlistItemType;
  uid: string;
}

export interface WatchlistState {
  items: WatchlistItem[];
}
