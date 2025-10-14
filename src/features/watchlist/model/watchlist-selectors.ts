import { useWatchlistStore } from "./watchlist-store";

export const useWatchlistAddItem = () => useWatchlistStore((state) => state.addItem);

export const useWatchlistRemoveItem = () => useWatchlistStore((state) => state.removeItem);

export const useWatchlistClear = () => useWatchlistStore((state) => state.clearItems);

export const useWatchlistItems = () => useWatchlistStore((state) => state.items);

export const useWatchlistExists = (uid: string) =>
  useWatchlistStore((state) => state.items.some((item) => item.uid === uid));

export const useWatchlistCount = () => useWatchlistStore((state) => state.items.length);
