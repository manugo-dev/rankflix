import { type RefObject, useEffect, useState } from "react";

interface UseCarouselLayoutOptions {
  containerRef: RefObject<HTMLElement | null>;
  gap: number;
  itemsPerView: number;
  totalItems: number;
}

export function useCarouselLayout({
  containerRef,
  gap,
  itemsPerView,
  totalItems,
}: UseCarouselLayoutOptions) {
  const [itemWidth, setItemWidth] = useState(0);
  const [maxScrollX, setMaxScrollX] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const calculateDimensions = () => {
      const containerWidth = container.offsetWidth;
      const newItemWidth = (containerWidth - gap * (itemsPerView - 1)) / itemsPerView;
      const totalWidth = totalItems * (newItemWidth + gap) - gap;
      const newMaxScroll = Math.max(0, totalWidth - containerWidth);

      setItemWidth(newItemWidth);
      setMaxScrollX(newMaxScroll);
    };

    calculateDimensions();
    const resizeObserver = new ResizeObserver(calculateDimensions);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [containerRef, gap, itemsPerView, totalItems]);

  return { itemWidth, maxScrollX };
}
