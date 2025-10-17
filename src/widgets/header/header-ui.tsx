import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

import { LanguageSelector } from "@/features/language-selector";
import logoSrc from "@/shared/assets/rankflix.svg";
import { cn } from "@/shared/lib/styles";
import { getRouteLink } from "@/shared/routes";

import { Navbar } from "../navbar";
import { HEADER_VARIANTS_CLASSNAMES } from "./header-constants";
import type { HeaderProps } from "./header-types";

import "./header.scss";

export function Header({ variant = "default" }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const headerReference = useRef<HTMLElement>(null);

  useEffect(() => {
    if (variant !== "floating") return;

    const handleScroll = () => {
      const threshold = (headerReference.current?.offsetHeight ?? 100) * 1.5;
      setScrolled(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [variant]);

  return (
    <header
      ref={headerReference}
      className={cn(
        "header",
        HEADER_VARIANTS_CLASSNAMES[variant] ?? HEADER_VARIANTS_CLASSNAMES.default,
        { "header--scrolled": scrolled },
      )}
      data-testid="header"
      data-variant={variant}
    >
      <div className="header__inner">
        <Link to={getRouteLink.HOME()} className="header__logo-link">
          <img src={logoSrc} alt="Rankflix" className="header__logo" />
        </Link>
        <Navbar />
        <LanguageSelector />
      </div>
    </header>
  );
}
