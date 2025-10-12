import { useAnimationControls, useMotionValue } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { BREAKPOINTS } from "@/shared/config/responsive";

import type { UseCarouselOptions } from "./carousel-types";

export function useCarousel({ gap, itemsPerPage, totalItems }: UseCarouselOptions) {
  const [width, setWidth] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const x = useMotionValue(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const references = useRef({
    container: null as HTMLDivElement | null,
    items: [] as (HTMLLIElement | null)[],
    track: null as HTMLUListElement | null,
  });

  const controls = useAnimationControls();

  const getItemsPerPage = (windowWidth: number): number => {
    if (typeof itemsPerPage === "number") return itemsPerPage;
    let selectedItems = itemsPerPage.xs || 1;
    for (const [breakpoint, minWidth] of Object.entries(BREAKPOINTS).toSorted(
      (a, b) => a[1] - b[1],
    ) as [keyof typeof BREAKPOINTS, number][]) {
      if (windowWidth >= minWidth && itemsPerPage[breakpoint]) {
        selectedItems = itemsPerPage[breakpoint]!;
      }
    }
    return selectedItems;
  };

  useEffect(() => {
    const track = references.current.track;
    const container = references.current.container;
    if (!track || !container) return;

    const calculateDimensions = () => {
      const itemsPerView = getItemsPerPage(window.innerWidth);
      const maxScrollX = Math.max(0, track.scrollWidth - container.offsetWidth + gap);

      setWidth(maxScrollX);
      track.style.setProperty("--items-per-page", itemsPerView.toString());
      track.style.setProperty("--gap", `${gap}px`);

      const clampedX = Math.max(Math.min(x.get(), 0), -maxScrollX);
      controls.stop();
      controls.set({ x: clampedX });
    };

    calculateDimensions();

    window.addEventListener("resize", calculateDimensions);
    return () => window.removeEventListener("resize", calculateDimensions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, gap]);

  const handlePrevious = useCallback(() => {
    const previousIndex = Math.max(focusedIndex - 1, 0);
    references.current.items[previousIndex]?.focus();
  }, [focusedIndex]);

  const handleNext = useCallback(() => {
    const nextIndex = Math.min(focusedIndex + 1, totalItems - 1);
    references.current.items[nextIndex]?.focus();
  }, [focusedIndex, totalItems]);

  useEffect(() => {
    const container = references.current.container;
    if (!container) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNext();
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [focusedIndex, totalItems, handleNext, handlePrevious]);

  function scrollToItem(index: number) {
    const item = references.current.items[index];
    const track = references.current.track;
    const container = references.current.container;
    if (!item || !track || !container) return;

    const itemLeft = item.offsetLeft;
    const itemWidth = item.offsetWidth;
    const visibleWidth = container.offsetWidth;

    let targetX = -itemLeft + (visibleWidth - itemWidth) / 2;
    targetX = Math.max(Math.min(targetX, 0), -width);
    controls.stop();
    controls.start({ x: targetX });
  }

  function handleItemFocus(index: number) {
    setFocusedIndex(index);
    scrollToItem(index);
  }

  function handleSnap() {
    const container = references.current.container;
    const items = references.current.items;
    if (!container || items.length === 0) return;

    const containerWidth = container.offsetWidth;
    const currentX = x.get();

    let closestIndex = 0;
    let smallestDistance = Infinity;

    for (const [index, item] of items.entries()) {
      if (!item) continue;

      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const viewportCenter = -currentX + containerWidth / 2;
      const distance = Math.abs(itemCenter - viewportCenter);

      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestIndex = index;
      }
    }

    scrollToItem(closestIndex);
  }

  const handleAnimationCompleted = () => {
    const currentX = x.get();
    setCanScrollLeft(currentX < -1);
    setCanScrollRight(currentX > -width + 1);
  };

  return {
    canScrollLeft,
    canScrollRight,
    controls,
    handleAnimationCompleted,
    handleItemFocus,
    handleNext,
    handlePrevious,
    handleSnap,
    references,
    width,
    x,
  };
}
