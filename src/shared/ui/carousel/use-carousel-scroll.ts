import { type PanInfo, useAnimate, useMotionValue } from "motion/react";
import { type RefObject, useCallback, useRef } from "react";

interface UseCarouselScrollOptions {
  containerRef: RefObject<HTMLElement | null>;
  itemsRef: RefObject<(HTMLElement | null)[]>;
  maxScrollX: number;
}

export function useCarouselScroll({
  containerRef,
  itemsRef,
  maxScrollX,
}: UseCarouselScrollOptions) {
  const x = useMotionValue(0);
  const [scope, animate] = useAnimate();
  const draggingOffsetReference = useRef(0);

  const scrollToItem = useCallback(
    (index: number, options: { align?: "center" | "left" } = {}) => {
      const { align = "center" } = options;
      const container = containerRef.current;
      const items = itemsRef.current;
      const item = items?.[index];

      if (!container || !item) return;

      const containerWidth = container.offsetWidth;
      const targetOffset =
        align === "center"
          ? item.offsetLeft - (containerWidth - item.offsetWidth) / 2
          : item.offsetLeft;

      const clamped = Math.max(0, Math.min(targetOffset, maxScrollX));
      animate(x, -clamped, { damping: 30, stiffness: 300, type: "spring" });
    },
    [animate, maxScrollX, x, containerRef, itemsRef],
  );

  const snapToClosest = useCallback(() => {
    draggingOffsetReference.current = 0;
    const container = containerRef.current;
    const items = itemsRef.current;
    if (!container || !items || items.length === 0) return -1;

    const containerWidth = container.offsetWidth;
    const currentX = x.get();

    let closestIndex = 0;
    let closestDistance = Infinity;

    for (const [index, element] of items.entries()) {
      if (!element) continue;
      const itemCenter = element.offsetLeft + element.offsetWidth / 2;
      const viewportCenter = -currentX + containerWidth / 2;
      const distance = Math.abs(itemCenter - viewportCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    }

    scrollToItem(closestIndex, { align: "center" });
    return closestIndex;
  }, [scrollToItem, x, containerRef, itemsRef]);

  const handleDrag = useCallback(
    (_event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
      draggingOffsetReference.current = info.offset.x;
    },
    [],
  );

  const resetScroll = useCallback(() => {
    animate(x, 0, { damping: 30, stiffness: 300, type: "spring" });
  }, [animate, x]);

  return {
    draggingOffsetRef: draggingOffsetReference,
    handleDrag,
    resetScroll,
    scope,
    scrollToItem,
    snapToClosest,
    x,
  };
}
