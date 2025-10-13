import { type PanInfo, useAnimate, useMotionValue } from "motion/react";
import {
  type FocusEvent,
  type MouseEventHandler,
  type PointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useBreakpointValue } from "@/shared/hooks/use-breakpoint-value";

import type { UseCarouselOptions } from "./carousel-types";

const THROTTLE_KEYBOARD = 50;

export function useCarousel({
  gap = 16,
  itemsPerPage,
  onSelectItem,
  totalItems,
}: UseCarouselOptions) {
  const itemsPerView = useBreakpointValue<number>(itemsPerPage, 1);
  const x = useMotionValue(0);
  const [scope, animate] = useAnimate();

  const [activeIndex, setActiveIndex] = useState(-1);
  const [maxScrollX, setMaxScrollX] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);

  const containerReference = useRef<HTMLDivElement | null>(null);
  const itemsReference = useRef<(HTMLLIElement | null)[]>([]);
  const draggingOffsetReference = useRef(0);

  // --- Helpers base ---
  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(totalItems / Math.max(1, itemsPerView))),
    [totalItems, itemsPerView],
  );

  const currentPage = useMemo(() => {
    if (activeIndex < 0) return 0;
    return Math.floor(activeIndex / Math.max(1, itemsPerView));
  }, [activeIndex, itemsPerView]);

  const firstIndexOfPage = useCallback(
    (page: number) => Math.min(totalItems - 1, page * Math.max(1, itemsPerView)),
    [itemsPerView, totalItems],
  );

  const canScrollLeft = currentPage > 0;
  const canScrollRight = currentPage < pageCount - 1;

  // --- Scroll Animations ---
  const scrollToItem = useCallback(
    (index: number, { align = "center" }: { align?: "center" | "left" } = {}) => {
      const container = containerReference.current;
      const item = itemsReference.current[index];
      if (!container || !item) return;

      const containerWidth = container.offsetWidth;

      const targetOffset =
        align === "center"
          ? item.offsetLeft - (containerWidth - item.offsetWidth) / 2
          : item.offsetLeft;

      item.scrollIntoView({ behavior: "smooth", block: "center" });
      const clamped = Math.max(0, Math.min(targetOffset, maxScrollX));
      animate(x, -clamped, { damping: 30, stiffness: 300, type: "spring" });
    },
    [animate, maxScrollX, x],
  );

  // --- PAGE Navigation (for buttons) ---
  const goToPage = useCallback(
    (page: number) => {
      const container = containerReference.current;
      if (!container) return;
      const safePage = Math.min(Math.max(0, page), pageCount - 1);
      const firstIndex = firstIndexOfPage(safePage);
      setActiveIndex(firstIndex);
      scrollToItem(firstIndex, { align: "left" });
      container.focus();
    },
    [firstIndexOfPage, pageCount, scrollToItem],
  );

  const handleNext = useCallback(() => goToPage(currentPage + 1), [goToPage, currentPage]);
  const handlePrevious = useCallback(() => goToPage(currentPage - 1), [goToPage, currentPage]);

  // --- ITEM Navigation (for keyboard) ---
  const navigateItem = useCallback(
    (direction: 1 | -1) => {
      setActiveIndex((previous) => {
        const next = Math.min(Math.max(previous + direction, 0), totalItems - 1);
        scrollToItem(next, { align: "center" });
        return next;
      });
    },
    [scrollToItem, totalItems],
  );

  // --- Snap on drag end ---
  const handleSnap = useCallback(() => {
    draggingOffsetReference.current = 0;
    const container = containerReference.current;
    const items = itemsReference.current;
    if (!container || items.length === 0) return;

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

    setActiveIndex(closestIndex);
    scrollToItem(closestIndex, { align: "center" });
  }, [scrollToItem, x]);

  // --- Pointer + Focus ---
  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const item = target.closest("[data-index]") as HTMLElement | null;
    if (!item) return;
    const index = Number(item.dataset.index);
    if (!Number.isNaN(index)) setActiveIndex(index);
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const container = containerReference.current;
    const nextFocused = event.relatedTarget as HTMLElement | null;
    if (!container || (nextFocused && container.contains(nextFocused))) return;
    setActiveIndex(-1);
    animate(x, 0, { damping: 30, stiffness: 300, type: "spring" });
  };

  const handleOnDrag = (_event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    draggingOffsetReference.current = info.offset.x;
  };

  const handleOnMouseUp: MouseEventHandler<HTMLUListElement> = (event) => {
    if (Math.abs(draggingOffsetReference?.current ?? 0) < 10) {
      const target = event.target as HTMLElement;
      const item = target.closest("[data-index]") as HTMLElement | null;
      if (!item) return;
      const index = Number(item.dataset.index);
      if (Number.isNaN(index)) return;
      onSelectItem?.(index);
    }
  };

  // --- Dynamic sizes ---
  useEffect(() => {
    const container = containerReference.current;
    if (!container) return;

    const calc = () => {
      const containerWidth = container.offsetWidth;
      const newItemWidth = (containerWidth - gap * (itemsPerView - 1)) / itemsPerView;
      const totalWidth = totalItems * (newItemWidth + gap) - gap;
      const newMaxScroll = Math.max(0, totalWidth - containerWidth);

      setItemWidth(newItemWidth);
      setMaxScrollX(newMaxScroll);
    };

    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(container);
    return () => ro.disconnect();
  }, [gap, itemsPerView, totalItems]);

  // --- Keyboard Navigation (element by element, centered) ---
  useEffect(() => {
    const container = containerReference.current;
    if (!container) return;

    let lastTime = 0;
    const onKeyDown = (event: KeyboardEvent) => {
      const now = Date.now();
      if (now - lastTime < THROTTLE_KEYBOARD) return;

      switch (event.key) {
        case "ArrowRight": {
          event.preventDefault();
          lastTime = now;
          navigateItem(1);
          break;
        }
        case "ArrowLeft": {
          event.preventDefault();
          lastTime = now;
          navigateItem(-1);
          break;
        }
        case "Enter": {
          onSelectItem?.(activeIndex);
          break;
        }
      }
    };

    container.addEventListener("keydown", onKeyDown);
    return () => container.removeEventListener("keydown", onKeyDown);
  }, [navigateItem, activeIndex, onSelectItem]);

  return {
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
  };
}
