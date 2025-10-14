import { createListStore } from "@/entities/list";

import type { WatchlistItem } from "./watchlist-types";

export const useWatchlistStore = createListStore<WatchlistItem>({
  id: "watchlist",
  name: "Watchlist",
});
