import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router";

import { useWatchlistCount } from "@/features/watchlist";
import { getRouteLink } from "@/shared/routes";

import "./watchlist-link.scss";

export function WatchlistLink() {
  const watchlistCount = useWatchlistCount();

  return (
    <Link to={getRouteLink.WATCHLIST()} className="watchlist-link">
      Watchlist
      <AnimatePresence mode="popLayout">
        {watchlistCount > 0 && (
          <motion.span
            layout
            className="watchlist-link-count"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              damping: 20,
              stiffness: 400,
              type: "spring",
            }}
          >
            <motion.span
              key={watchlistCount}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {watchlistCount}
            </motion.span>
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
