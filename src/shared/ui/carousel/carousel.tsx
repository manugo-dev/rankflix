import { motion, useAnimationControls, useMotionValue, useMotionValueEvent } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { BREAKPOINTS, DEFAULT_CAROUSEL_ITEMS_PER_PAGE } from "@/shared/config/responsive";

import type { CarouselProps } from "./carousel-types";

import "./carousel.scss";

export function Carousel({
  children,
  gap = 16,
  itemsPerPage = DEFAULT_CAROUSEL_ITEMS_PER_PAGE,
}: CarouselProps) {
  const [width, setWidth] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const references = useRef({
    container: null as HTMLDivElement | null,
    items: [] as (HTMLLIElement | null)[],
    track: null as HTMLUListElement | null,
  });

  const x = useMotionValue(0);
  const controls = useAnimationControls();

  const childrenArray = useMemo(
    () => (Array.isArray(children) ? children : [children]),
    [children],
  );

  function getItemsPerPage(windowWidth: number): number {
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
  }

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
  }, [childrenArray.length, gap]);

  const handlePrevious = () => {
    const previousIndex = Math.max(focusedIndex - 1, 0);
    references.current.items[previousIndex]?.focus();
  };

  const handleNext = () => {
    const nextIndex = Math.min(focusedIndex + 1, childrenArray.length - 1);
    references.current.items[nextIndex]?.focus();
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedIndex, childrenArray.length]);

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

  useMotionValueEvent(x, "change", (latest) => {
    const canScrollLeft = latest < -1;
    const canScrollRight = latest > -width + 1;
    setCanScrollLeft(canScrollLeft);
    setCanScrollRight(canScrollRight);
    console.log(latest, canScrollLeft, canScrollRight);
  });

  return (
    <div
      className="carousel"
      tabIndex={-1}
      role="region"
      aria-roledescription="carousel"
      aria-live="polite"
      aria-label="Carousel"
      ref={(element) => {
        references.current.container = element;
      }}
    >
      {canScrollLeft && (
        <button
          className="carousel__control carousel__control--prev"
          onClick={handlePrevious}
          aria-label="Previous"
          tabIndex={-1}
        >
          {"<"}
        </button>
      )}

      <motion.ul
        ref={(element) => {
          references.current.track = element;
        }}
        drag="x"
        style={{ x }}
        animate={controls}
        whileDrag={{ scale: 0.98 }}
        dragElastic={0.05}
        dragMomentum={false}
        dragConstraints={{ left: -width, right: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onDragEnd={handleSnap}
        className="carousel__track"
      >
        {childrenArray.map((renderItem, index) =>
          renderItem({
            className: "carousel__item",
            index,
            onFocus: () => handleItemFocus(index),
            ref: (element: HTMLLIElement | null) => {
              references.current.items[index] = element;
            },
          }),
        )}
      </motion.ul>

      {canScrollRight && (
        <button
          className="carousel__control carousel__control--next"
          onClick={handleNext}
          aria-label="Next"
          tabIndex={-1}
        >
          {">"}
        </button>
      )}
    </div>
  );
}
