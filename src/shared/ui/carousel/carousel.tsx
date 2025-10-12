import { motion, useAnimationControls, useMotionValue } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const [canScrollRight, setCanScrollRight] = useState(true);

  const carouselContainerReference = useRef<HTMLDivElement>(null);
  const carouselTrackReference = useRef<HTMLUListElement | null>(null);
  const itemReferences = useRef<(HTMLLIElement | null)[]>([]);

  const x = useMotionValue(0);
  const controls = useAnimationControls();
  const childrenArray = Array.isArray(children) ? children : [children];

  const getItemsPerPage = useCallback(
    (windowWidth: number): number => {
      if (typeof itemsPerPage === "number") return itemsPerPage;
      const sortedBreakpoints = Object.entries(BREAKPOINTS).toSorted((a, b) => a[1] - b[1]) as [
        keyof typeof BREAKPOINTS,
        number,
      ][];
      let selectedItems = itemsPerPage.xs || 1;
      for (const [breakpoint, minWidth] of sortedBreakpoints) {
        if (windowWidth >= minWidth && itemsPerPage[breakpoint]) {
          selectedItems = itemsPerPage[breakpoint]!;
        }
      }
      return selectedItems;
    },
    [itemsPerPage],
  );

  useEffect(() => {
    const track = carouselTrackReference.current;
    const container = carouselContainerReference.current;
    if (!track || !container) return;

    const calculateDimensions = () => {
      const itemsPerView = getItemsPerPage(window.innerWidth);
      const trackScrollWidth = track.scrollWidth;
      const containerWidth = container.offsetWidth;
      const maxScrollX = Math.max(0, trackScrollWidth - containerWidth + gap);

      setWidth(maxScrollX);
      track.style.setProperty("--items-per-page", itemsPerView.toString());
      track.style.setProperty("--gap", `${gap}px`);

      const clampedX = Math.max(Math.min(x.get(), 0), -maxScrollX);
      controls.stop();
      controls.set({ x: clampedX });
      x.set(clampedX);
    };

    calculateDimensions();
    window.addEventListener("resize", calculateDimensions);
    return () => window.removeEventListener("resize", calculateDimensions);
  }, [childrenArray.length, controls, focusedIndex, gap, getItemsPerPage, x]);

  useEffect(() => {
    const updateScrollButtons = () => {
      const currentX = x.get();
      setCanScrollLeft(currentX < -1);
      setCanScrollRight(currentX > -width + 1);
    };
    updateScrollButtons();
    const unsubscribe = x.on("change", updateScrollButtons);
    return unsubscribe;
  }, [x, width]);

  const scrollToItem = useCallback(
    (index: number) => {
      const item = itemReferences.current[index];
      const track = carouselTrackReference.current;
      if (!item || !track) return;

      const container = carouselContainerReference.current;
      if (!container) return;

      const itemLeft = item.offsetLeft;
      const itemWidth = item.offsetWidth;
      const visibleWidth = container.offsetWidth;

      let targetX = -itemLeft + (visibleWidth - itemWidth) / 2;
      targetX = Math.max(Math.min(targetX, 0), -width);

      controls.start({ x: targetX });
      x.set(targetX);
    },
    [controls, width, x],
  );

  const handleNext = useCallback(() => {
    const nextIndex = Math.min(focusedIndex + 1, childrenArray.length - 1);
    itemReferences.current[nextIndex]?.focus();
  }, [childrenArray.length, focusedIndex]);

  const handlePrevious = useCallback(() => {
    const previousIndex = Math.max(focusedIndex - 1, 0);
    itemReferences.current[previousIndex]?.focus();
  }, [focusedIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNext();
      }
    };
    const container = carouselContainerReference.current;
    if (!container) return;
    container.addEventListener("keydown", handleKeyDown);
    return () => {
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext, handlePrevious]);

  const handleItemFocus = useCallback(
    (index: number) => {
      setFocusedIndex(index);
      scrollToItem(index);
    },
    [scrollToItem],
  );

  return (
    <div
      className="carousel"
      tabIndex={-1}
      role="region"
      aria-label="Carousel"
      ref={carouselContainerReference}
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
        ref={carouselTrackReference}
        drag="x"
        style={{ x }}
        animate={controls}
        whileDrag={{ scale: 0.98 }}
        dragElastic={0.05}
        dragMomentum={false}
        dragConstraints={{ left: -width, right: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="carousel__track"
      >
        {childrenArray.map((renderItem, index) =>
          renderItem({
            className: "carousel__item",
            index,
            isFocused: focusedIndex === index,
            onFocus: () => handleItemFocus(index),
            ref: (element: HTMLLIElement | null) => {
              itemReferences.current[index] = element;
            },
            totalItems: childrenArray.length,
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
