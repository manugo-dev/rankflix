import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

import logoSrc from "@/shared/assets/rankflix.svg";
import { cn } from "@/shared/lib/styles";
import { getRouteLink } from "@/shared/routes";

import { HEADER_VARIANTS_CLASSNAMES } from "./header-constants";
import type { HeaderProps } from "./header-types";

import "./header.scss";

export function Header({ variant = "default" }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const headerReference = useRef<HTMLElement>(null);

  useEffect(() => {
    if (variant !== "floating") return;
    const onScroll = () =>
      setScrolled(window.scrollY > (headerReference.current?.offsetHeight ?? 150) * 2);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  return (
    <header
      className={cn(
        "header",
        HEADER_VARIANTS_CLASSNAMES[variant] ?? HEADER_VARIANTS_CLASSNAMES.default,
        { "header--scrolled": scrolled },
      )}
      ref={headerReference}
    >
      <div className="header__inner">
        <Link to={getRouteLink.HOME()}>
          <img src={logoSrc} alt="Rankflix" width={150} className="header__logo" />
        </Link>
        <nav className="header__nav">
          <Link to={getRouteLink.HOME()} className="header__nav-link">
            Home
          </Link>
          <Link to={getRouteLink.WISHLIST()} className="header__nav-link">
            Wishlist
          </Link>
        </nav>
      </div>
    </header>
  );
}
