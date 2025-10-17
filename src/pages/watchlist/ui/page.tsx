import { useWatchlistItems, WatchlistCard } from "@/features/watchlist";
import { useTranslate } from "@/shared/hooks/use-translation";

import "./watchlist.scss";

export function WatchlistPage() {
  const watchlistItems = useWatchlistItems();
  const { t } = useTranslate();

  return (
    <main className="page boxed-container watchlist-page">
      <h1>{t("watchlist.title")}</h1>
      {watchlistItems.length === 0 ? (
        <p data-testid="empty-watchlist-message">{t("watchlist.empty")}</p>
      ) : (
        <div className="watchlist-grid">
          {watchlistItems.map((watchlistItem) => (
            <WatchlistCard key={watchlistItem.id} item={watchlistItem} />
          ))}
        </div>
      )}
    </main>
  );
}
