import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router";

import { cn } from "@/shared/lib/styles";

import { getRouteForWatchlistItem } from "../../model/watchlist-mappers";
import type { WatchlistItem } from "../../model/watchlist-types";

import "./watchlist-card.scss";

interface WatchlistCardProps {
  active?: boolean;
  item: WatchlistItem;
}

export function WatchlistCard({ active = false, item }: WatchlistCardProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const movieYear = item.releaseDate ? new Date(item.releaseDate).getFullYear() : "—";
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(getRouteForWatchlistItem(item));
  };

  return (
    <motion.article
      className={cn("watchlist-card", { "watchlist-card--active": active })}
      initial={false}
      animate={active ? "hover" : "rest"}
      whileHover="hover"
      variants={{
        hover: { scale: 1.02, y: -6 },
        rest: { scale: 1, y: 0 },
      }}
      onClick={handleCardClick}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <motion.div className="watchlist-card__image-container">
        {hasImageError ? (
          <div className="watchlist-card__placeholder">{item.title}</div>
        ) : (
          <motion.img
            src={item.posterUrl}
            alt={item.title}
            className="watchlist-card__image"
            onError={() => setHasImageError(true)}
          />
        )}
      </motion.div>
      <motion.div
        className="watchlist-card__info"
        variants={{
          hover: { opacity: 1, y: 0 },
          rest: { opacity: 0, y: 10 },
        }}
        transition={{ delay: 0.05, duration: 0.3 }}
      >
        <h3 className="watchlist-card__title">{item.title}</h3>
        <p className="watchlist-card__year">{movieYear}</p>
      </motion.div>
    </motion.article>
  );
}
