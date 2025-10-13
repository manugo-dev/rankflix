import { motion } from "motion/react";
import { useMemo } from "react";

import { DEFAULT_CAROUSEL_ITEMS_PER_PAGE } from "@/shared/config";
import { cn } from "@/shared/lib/styles";

import type { CarouselProps } from "./carousel-types";
import { useCarousel } from "./use-carousel";

import "./carousel.scss";

export function Carousel({
  children,
  gap = 16,
  itemsPerPage = DEFAULT_CAROUSEL_ITEMS_PER_PAGE,
  onSelectItem,
}: CarouselProps) {
  const childrenArray = useMemo(
    () => (Array.isArray(children) ? children : [children]),
    [children],
  );

  const {
    activeIndex,
    canScrollLeft,
    canScrollRight,
    containerReference,
    handleBlur,
    handleNext,
    handleOnDrag,
    handleOnMouseUp,
    handlePointerUp,
    handlePrevious,
    handleSnap,
    itemsReference,
    itemWidth,
    maxScrollX,
    scope,
    x,
  } = useCarousel({
    gap,
    itemsPerPage,
    onSelectItem,
    totalItems: childrenArray.length,
  });

  return (
    <div
      ref={containerReference}
      className="carousel"
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Carousel"
      onPointerUp={handlePointerUp}
      onBlur={handleBlur}
    >
      <motion.ul
        ref={scope}
        className="carousel__track"
        drag="x"
        animate={{ x: 0 }}
        style={{ gap, x }}
        dragConstraints={{ left: -maxScrollX, right: 0 }}
        dragElastic={0.08}
        dragMomentum={false}
        whileDrag={{ scale: 0.97 }}
        onDrag={handleOnDrag}
        onDragEnd={handleSnap}
        onMouseUp={handleOnMouseUp}
      >
        {childrenArray.map((render, index) =>
          render({
            className: cn("carousel__item", { "carousel__item--active": index === activeIndex }),
            "data-index": index,
            index,
            isActive: index === activeIndex,
            ref: (element: HTMLLIElement | null) => {
              itemsReference.current[index] = element;
            },
            style: { flex: `0 0 ${itemWidth}px` },
          }),
        )}
      </motion.ul>
      {canScrollLeft && (
        <motion.button
          className="carousel__control carousel__control--prev"
          onClick={handlePrevious}
          aria-label="Previous"
          whileHover={{
            backgroundColor: "rgba(0,0,0,0.4)",
            boxShadow: "0 0 2rem rgba(255,255,255,0.3)",
            color: "var(--color-text-white)",
            scale: 1.2,
          }}
          whileTap={{
            backgroundColor: "rgba(255,255,255,0.3)",
            boxShadow: "0 0 1rem rgba(255,255,255,0.2)",
            scale: 0.8,
          }}
        >
          {"‹"}
        </motion.button>
      )}
      {canScrollRight && (
        <motion.button
          className="carousel__control carousel__control--next"
          onClick={handleNext}
          aria-label="Next"
          whileHover={{
            backgroundColor: "rgba(0,0,0,0.4)",
            boxShadow: "0 0 2rem rgba(255,255,255,0.3)",
            color: "var(--color-text-white)",
            scale: 1.2,
          }}
          whileTap={{
            backgroundColor: "rgba(255,255,255,0.3)",
            boxShadow: "0 0 1rem rgba(255,255,255,0.2)",
            scale: 0.8,
          }}
        >
          {"›"}
        </motion.button>
      )}
    </div>
  );
}
