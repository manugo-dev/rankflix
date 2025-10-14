import { type FocusEvent, type MouseEventHandler, type PointerEvent, useMemo, useRef } from "react";

import { useBreakpointValue } from "@/shared/hooks/use-breakpoint-value";
import { useKeyboardShortcuts } from "@/shared/hooks/use-keyboard-shortcuts";
import { usePagination } from "@/shared/hooks/use-pagination";

import type { UseCarouselOptions } from "./carousel-types";
import { useCarouselLayout } from "./use-carousel-layout";
import { useCarouselScroll } from "./use-carousel-scroll";

export function useCarousel({
  gap = 16,
  itemsPerPage,
  onSelectItem,
  totalItems,
}: UseCarouselOptions) {
  const itemsPerView = useBreakpointValue<number>(itemsPerPage, 1);

  const containerReference = useRef<HTMLDivElement | null>(null);
  const itemsReference = useRef<(HTMLLIElement | null)[]>([]);

  const pagination = usePagination({ itemsPerPage: itemsPerView, totalItems });

  const layout = useCarouselLayout({
    containerRef: containerReference,
    gap,
    itemsPerView,
    totalItems,
  });

  const scroll = useCarouselScroll({
    containerRef: containerReference,
    itemsRef: itemsReference,
    maxScrollX: layout.maxScrollX,
  });

  const keyboardShortcuts = useMemo(
    () => ({
      ArrowLeft: {
        handler: () => {
          const newIndex = pagination.navigateByOffset(-1);
          scroll.scrollToItem(newIndex, { align: "center" });
        },
        preventDefault: true,
        throttle: true,
      },
      ArrowRight: {
        handler: () => {
          const newIndex = pagination.navigateByOffset(1);
          scroll.scrollToItem(newIndex, { align: "center" });
        },
        preventDefault: true,
        throttle: true,
      },
      Enter: {
        handler: () => {
          if (pagination.activeIndex >= 0) {
            onSelectItem?.(pagination.activeIndex);
          }
        },
        preventDefault: true,
        throttle: false,
      },
    }),
    [pagination, scroll, onSelectItem],
  );

  useKeyboardShortcuts({
    containerRef: containerReference,
    keys: keyboardShortcuts,
  });

  const handleNext = () => {
    const firstIndex = pagination.nextPage();
    scroll.scrollToItem(firstIndex, { align: "left" });
    containerReference.current?.focus();
  };

  const handlePrevious = () => {
    const firstIndex = pagination.previousPage();
    scroll.scrollToItem(firstIndex, { align: "left" });
    containerReference.current?.focus();
  };

  const handleSnap = () => {
    const closestIndex = scroll.snapToClosest();
    if (closestIndex >= 0) {
      pagination.setActiveIndex(closestIndex);
    }
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const item = target.closest("[data-index]") as HTMLElement | null;
    if (!item) return;
    const index = Number(item.dataset.index);
    if (!Number.isNaN(index)) pagination.setActiveIndex(index);
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextFocused = event.relatedTarget as HTMLElement | null;
    if (
      !containerReference.current ||
      (nextFocused && containerReference.current.contains(nextFocused))
    ) {
      return;
    }
    pagination.setActiveIndex(-1);
    scroll.resetScroll();
  };

  const handleOnMouseUp: MouseEventHandler<HTMLUListElement> = (event) => {
    if (Math.abs(scroll.draggingOffsetRef?.current ?? 0) < 10) {
      const target = event.target as HTMLElement;
      const item = target.closest("[data-index]") as HTMLElement | null;
      if (!item) return;
      const index = Number(item.dataset.index);
      if (Number.isNaN(index)) return;
      onSelectItem?.(index);
    }
  };

  return {
    activeIndex: pagination.activeIndex,
    canScrollLeft: pagination.canScrollLeft,
    canScrollRight: pagination.canScrollRight,
    containerReference: containerReference,
    handleBlur,
    handleNext,
    handleOnDrag: scroll.handleDrag,
    handleOnMouseUp,
    handlePointerUp,
    handlePrevious,
    handleSnap,
    itemsReference: itemsReference,
    itemWidth: layout.itemWidth,
    maxScrollX: layout.maxScrollX,
    scope: scroll.scope,
    x: scroll.x,
  };
}
