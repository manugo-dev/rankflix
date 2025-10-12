import { motion } from "motion/react";
import { useMemo } from "react";

import { DEFAULT_CAROUSEL_ITEMS_PER_PAGE } from "@/shared/config/responsive";

import type { CarouselProps } from "./carousel-types";
import { useCarousel } from "./use-carousel";

import "./carousel.scss";

export function Carousel({
  children,
  gap = 16,
  itemsPerPage = DEFAULT_CAROUSEL_ITEMS_PER_PAGE,
}: CarouselProps) {
  const childrenArray = useMemo(
    () => (Array.isArray(children) ? children : [children]),
    [children],
  );

  const {
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
  } = useCarousel({
    gap,
    itemsPerPage,
    totalItems: childrenArray.length,
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
        onAnimationComplete={handleAnimationCompleted}
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
