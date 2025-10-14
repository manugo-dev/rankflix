import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router";

import { useWatchlistCount } from "@/features/watchlist";
import { getRouteLink } from "@/shared/routes";

export function WatchlistLink() {
  const watchlistCount = useWatchlistCount();

  return (
    <Link to={getRouteLink.WATCHLIST()} className="header__watchlist-link">
      Watchlist
      <AnimatePresence>
        {watchlistCount > 0 && (
          <motion.span
            key={watchlistCount}
            className="header__watchlist-count"
            initial={{ opacity: 0, scale: 0, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: -5 }}
            transition={{ damping: 18, stiffness: 400, type: "spring" }}
          >
            {watchlistCount}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
