import { useEffect, useState } from "react";

import { BREAKPOINTS } from "../config/responsive";

export type Breakpoint = keyof typeof BREAKPOINTS;

function getCurrentBreakpoint(width: number): Breakpoint {
  if (width >= BREAKPOINTS.xl) return "xl";
  if (width >= BREAKPOINTS.lg) return "lg";
  if (width >= BREAKPOINTS.md) return "md";
  if (width >= BREAKPOINTS.sm) return "sm";
  if (width >= BREAKPOINTS.xs) return "xs";
  return "xs";
}

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("xs");

  useEffect(() => {
    // eslint-disable-next-line unicorn/prefer-global-this
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setBreakpoint(getCurrentBreakpoint(window.innerWidth));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
}
