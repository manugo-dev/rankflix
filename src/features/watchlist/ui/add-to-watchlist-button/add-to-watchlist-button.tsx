import { Button } from "@/shared/ui/button";

import {
  useWatchlistAddItem,
  useWatchlistExists,
  useWatchlistRemoveItem,
} from "../../model/watchlist-selectors";
import type { WatchlistItem } from "../../model/watchlist-types";

interface AddToWatchlistButtonProps {
  item: WatchlistItem;
}

export function AddToWatchlistButton({ item }: AddToWatchlistButtonProps) {
  const addItem = useWatchlistAddItem();
  const removeItem = useWatchlistRemoveItem();
  const exists = useWatchlistExists(item.uid);

  const handleAction = () => {
    if (exists) {
      removeItem(item.uid);
    } else {
      addItem(item);
    }
  };

  return (
    <Button
      className="add-to-watchlist"
      onClick={handleAction}
      variant={exists ? "danger" : "primary"}
    >
      {exists ? "Remove from Watchlist" : "Add to Watchlist"}
    </Button>
  );
}
