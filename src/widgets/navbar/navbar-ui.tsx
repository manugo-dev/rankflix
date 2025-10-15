import { Link } from "react-router";

import { WatchlistLink } from "@/features/watchlist";
import { getRouteLink } from "@/shared/routes";

import "./navbar.scss";

export function Navbar() {
  return (
    <nav className="navbar">
      <Link to={getRouteLink.HOME()} className="navbar-link">
        Home
      </Link>
      <WatchlistLink />
    </nav>
  );
}
