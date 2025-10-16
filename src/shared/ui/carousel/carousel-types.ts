import type { HTMLProps, ReactNode } from "react";

import type { BreakpointValueObject } from "@/shared/config";

export interface CarouselItemRenderProps extends React.HTMLAttributes<HTMLLIElement> {
  className?: string;
  "data-index": number;
  index: number;
  isActive?: boolean;
  ref?: (_element: HTMLLIElement | null) => void;
  style?: React.CSSProperties;
}

export type CarouselItemRenderer = (_props: CarouselItemRenderProps) => ReactNode;

export interface CarouselProps extends Omit<HTMLProps<HTMLDivElement>, "children"> {
  children: CarouselItemRenderer[];
  className?: string;
  gap?: number;
  itemsPerPage?: BreakpointValueObject<number>;
  onSelectItem?: (_index: number) => void;
}

export interface UseCarouselOptions {
  gap: Required<CarouselProps>["gap"];
  itemsPerPage: Required<CarouselProps>["itemsPerPage"];
  onSelectItem?: CarouselProps["onSelectItem"];
  totalItems: number;
}
