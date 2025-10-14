import { motion } from "motion/react";
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
  const movieYear = item.releaseDate ? new Date(item.releaseDate).getFullYear() : "—";
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(getRouteForWatchlistItem(item));
  };

  return (
    <motion.article
      className={cn("movie-card", { "movie-card--active": active })}
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
      <motion.div className="movie-card__image-container">
        <motion.img
          src={item.posterUrl}
          alt={item.title}
          className="movie-card__image"
          variants={{
            hover: { height: "75%" },
            rest: { height: "100%" },
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          draggable={false}
        />
      </motion.div>
      <motion.div
        className="movie-card__info"
        variants={{
          hover: { opacity: 1, y: 0 },
          rest: { opacity: 0, y: 10 },
        }}
        transition={{ delay: 0.05, duration: 0.3 }}
      >
        <h3 className="movie-card__title">{item.title}</h3>
        <p className="movie-card__year">{movieYear}</p>
      </motion.div>
    </motion.article>
  );
}
