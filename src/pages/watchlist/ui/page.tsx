import { useWatchlistItems, WatchlistCard } from "@/features/watchlist";

import "./watchlist.scss";

export function WatchlistPage() {
  const watchlistItems = useWatchlistItems();

  return (
    <main className="page boxed-container watchlist-page">
      <h1>My Watchlist</h1>
      <div className="watchlist-grid">
        {watchlistItems.map((watchlistItem) => (
          <WatchlistCard key={watchlistItem.id} item={watchlistItem} />
        ))}
      </div>
    </main>
  );
}
