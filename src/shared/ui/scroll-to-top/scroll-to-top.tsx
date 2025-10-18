import { useEffect } from "react";
import { useLocation } from "react-router";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ behavior: "instant", top: 0 });
  }, [pathname]);

  return null;
}
