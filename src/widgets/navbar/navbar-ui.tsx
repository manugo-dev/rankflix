import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router";

import { WatchlistLink } from "@/features/watchlist";
import { useTranslate } from "@/shared/hooks/use-translation";
import { getRouteLink } from "@/shared/routes";

import "./navbar.scss";

export function Navbar() {
  const { t } = useTranslate();
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen((previous) => !previous);
  const closeMenu = () => setOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar__links">
        <Link to={getRouteLink.HOME()} className="navbar-link">
          {t("navbar.home")}
        </Link>
        <WatchlistLink />
      </div>
      <button
        className={`navbar__hamburger ${open ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        <span />
        <span />
        <span />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="navbar__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="navbar__menu"
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ damping: 20, stiffness: 200, type: "spring" }}
            >
              <Link to={getRouteLink.HOME()} onClick={closeMenu}>
                {t("navbar.home")}
              </Link>
              <WatchlistLink />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
