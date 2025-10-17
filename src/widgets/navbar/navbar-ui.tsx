import { Link } from "react-router";

import { WatchlistLink } from "@/features/watchlist";
import { useTranslate } from "@/shared/hooks/use-translation";
import { getRouteLink } from "@/shared/routes";

import "./navbar.scss";

export function Navbar() {
  const { t } = useTranslate();

  return (
    <nav className="navbar">
      <Link to={getRouteLink.HOME()} className="navbar-link">
        {t("navbar.home")}
      </Link>
      <WatchlistLink />
    </nav>
  );
}
