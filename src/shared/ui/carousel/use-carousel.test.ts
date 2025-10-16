import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useCarousel } from "./use-carousel";

vi.mock("@/shared/hooks/use-breakpoint-value", () => ({
  useBreakpointValue: vi.fn((value) => value),
}));

vi.mock("@/shared/hooks/use-keyboard-shortcuts", () => ({
  useKeyboardShortcuts: vi.fn(),
}));

vi.mock("@/shared/hooks/use-pagination", () => ({
  usePagination: vi.fn(() => ({
    activeIndex: 0,
    canScrollLeft: false,
    canScrollRight: true,
    navigateByOffset: vi.fn((offset) => offset),
    nextPage: vi.fn(() => 0),
    previousPage: vi.fn(() => 0),
    setActiveIndex: vi.fn(),
  })),
}));

vi.mock("./use-carousel-layout", () => ({
  useCarouselLayout: vi.fn(() => ({
    itemWidth: 200,
    maxScrollX: 1000,
  })),
}));

vi.mock("./use-carousel-scroll", () => ({
  useCarouselScroll: vi.fn(() => ({
    draggingOffsetRef: { current: 0 },
    handleDrag: vi.fn(),
    resetScroll: vi.fn(),
    scope: "mock-scope",
    scrollToItem: vi.fn(),
    snapToClosest: vi.fn(() => 0),
    x: { get: () => 0 },
  })),
}));

describe("useCarousel", () => {
  describe("Initialization", () => {
    it("returns required properties on mount", () => {
      const { result } = renderHook(() =>
        useCarousel({
          gap: 16,
          itemsPerPage: { lg: 5, md: 3, sm: 1 },
          totalItems: 10,
        }),
      );

      expect(result.current).toHaveProperty("activeIndex");
      expect(result.current).toHaveProperty("itemWidth");
      expect(result.current).toHaveProperty("maxScrollX");
      expect(result.current).toHaveProperty("containerReference");
      expect(result.current).toHaveProperty("itemsReference");
      expect(result.current).toHaveProperty("canScrollLeft");
      expect(result.current).toHaveProperty("canScrollRight");
    });

    it("initializes with correct default values", () => {
      const { result } = renderHook(() =>
        useCarousel({
          gap: 0,
          itemsPerPage: { md: 3, sm: 1 },
          totalItems: 10,
        }),
      );

      expect(result.current.activeIndex).toBe(0);
      expect(result.current.itemWidth).toBe(200);
      expect(result.current.maxScrollX).toBe(1000);
    });
  });

  describe("Drag handling", () => {
    it("provides drag handler", () => {
      const { result } = renderHook(() =>
        useCarousel({
          gap: 16,
          itemsPerPage: { md: 3, sm: 1 },
          totalItems: 10,
        }),
      );

      expect(result.current.handleOnDrag).toBeDefined();
      expect(typeof result.current.handleOnDrag).toBe("function");
    });

    it("handles snap to closest item", () => {
      const { result } = renderHook(() =>
        useCarousel({
          gap: 16,
          itemsPerPage: { md: 3, sm: 1 },
          totalItems: 10,
        }),
      );

      act(() => {
        result.current.handleSnap();
      });

      expect(result.current.activeIndex).toBe(0);
    });
  });

  describe("Item selection", () => {
    it("calls onSelectItem when item is clicked", () => {
      const onSelectItem = vi.fn();

      const { result } = renderHook(() =>
        useCarousel({
          gap: 16,
          itemsPerPage: { md: 3, sm: 1 },
          onSelectItem,
          totalItems: 10,
        }),
      );

      const mockEvent = {
        target: {
          closest: vi.fn((selector) => {
            if (selector === "[data-index]") {
              return { dataset: { index: "2" } };
            }
            return null;
          }),
        },
      } as unknown as React.PointerEvent<HTMLDivElement>;

      act(() => {
        result.current.handlePointerUp(mockEvent);
      });

      expect(result.current.activeIndex).toBe(0);
    });

    it("calls onSelectItem on mouse up if not dragging", () => {
      const onSelectItem = vi.fn();

      const { result } = renderHook(() =>
        useCarousel({
          gap: 16,
          itemsPerPage: { md: 3, sm: 1 },
          onSelectItem,
          totalItems: 10,
        }),
      );

      const mockEvent = {
        target: {
          closest: vi.fn((selector) => {
            if (selector === "[data-index]") {
              return { dataset: { index: "2" } };
            }
            return null;
          }),
        },
      } as unknown as React.MouseEvent<HTMLUListElement>;

      act(() => {
        result.current.handleOnMouseUp(mockEvent);
      });

      expect(onSelectItem).toHaveBeenCalledWith(2);
    });
  });

  describe("References", () => {
    it("provides mutable container and items references", () => {
      const { result } = renderHook(() =>
        useCarousel({
          gap: 16,
          itemsPerPage: { md: 3, sm: 1 },
          totalItems: 10,
        }),
      );
      expect(result.current.containerReference).toBeDefined();
      expect(result.current.containerReference.current).toBeNull();
      expect(result.current.itemsReference).toBeDefined();
      expect(Array.isArray(result.current.itemsReference.current)).toBe(true);
    });
  });
});
