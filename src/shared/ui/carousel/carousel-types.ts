import type { ReactNode } from "react";

export interface CarouselItemRenderProps {
  className?: string;
  index: number;
  onFocus: () => void;
  ref?: (_element: HTMLLIElement | null) => void;
}

export type CarouselItemRenderer = (_props: CarouselItemRenderProps) => ReactNode;

export interface CarouselProps {
  children: CarouselItemRenderer[];
  gap?: number;
  itemsPerPage?: number | { lg?: number; md?: number; sm?: number; xl?: number; xs?: number };
}
