import { cn } from "@/shared/lib/styles";

import { HEADER_VARIANTS_CLASSNAMES } from "./header-constants";
import type { HeaderProps } from "./header-types";

import "./header.scss";

export function Header({ variant = "default" }: HeaderProps) {
  return (
    <header
      className={cn(
        "header",
        HEADER_VARIANTS_CLASSNAMES[variant] ?? HEADER_VARIANTS_CLASSNAMES.default,
      )}
    >
      header
    </header>
  );
}
