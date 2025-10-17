import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
      {exists ? t("watchlist.remove-from-list") : t("watchlist.add-to-list")}
    </Button>
  );
}
