import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { useCarouselLayout } from "./use-carousel-layout";

const createMockContainerElement = (initialWidth: number) => {
  let currentWidth = initialWidth;
  const element = {} as HTMLElement;

  Object.defineProperty(element, "offsetWidth", {
    configurable: true,
    get: () => currentWidth,
  });

  return {
    element,
    setWidth: (nextWidth: number) => {
      currentWidth = nextWidth;
    },
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MockedResizeObserver: any = globalThis.ResizeObserver;

describe("useCarouselLayout", () => {
  beforeEach(() => {
    MockedResizeObserver.reset();
  });

  it("computes itemWidth correctly on mount", () => {
    const { element } = createMockContainerElement(1000);
    const containerReference = { current: element };

    const { result } = renderHook(() =>
      useCarouselLayout({
        containerRef: containerReference,
        gap: 10,
        itemsPerView: 5,
        totalItems: 10,
      }),
    );

    // Container: 1000px
    // Gap spaces: 4 gaps × 10px = 40px
    // Available: 1000 - 40 = 960px
    // Item width: 960 / 5 = 192px
    expect(result.current.itemWidth).toBe(192);
  });

  it("computes maxScrollX correctly on mount", () => {
    const { element } = createMockContainerElement(1000);
    const containerReference = { current: element };

    const { result } = renderHook(() =>
      useCarouselLayout({
        containerRef: containerReference,
        gap: 10,
        itemsPerView: 5,
        totalItems: 10,
      }),
    );

    // Total items: 10
    // Item width: 192px
    // Gaps: 9 gaps × 10px = 90px
    // Total: (10 × 192) + 90 = 1920 + 90 = 2010px
    // Max scroll: 2010 - 1000 = 1010px
    expect(result.current.maxScrollX).toBe(1010);
  });

  it("recalculates layout when container width changes", () => {
    const { element, setWidth } = createMockContainerElement(1000);
    const containerReference = { current: element };

    const { result } = renderHook(() =>
      useCarouselLayout({
        containerRef: containerReference,
        gap: 10,
        itemsPerView: 5,
        totalItems: 10,
      }),
    );

    // Initial state at 1000px width
    expect(result.current.itemWidth).toBe(192);
    expect(result.current.maxScrollX).toBe(1010);

    // Resize container to 600px
    setWidth(600);
    act(() => {
      MockedResizeObserver.triggerResize();
    });

    // New calculations:
    // Container: 600px
    // Gap spaces: 4 gaps × 10px = 40px
    // Available: 600 - 40 = 560px
    // Item width: 560 / 5 = 112px
    expect(result.current.itemWidth).toBe(112);
    expect(result.current.maxScrollX).toBe(610);
  });

  it("disconnects ResizeObserver on unmount", () => {
    const { element } = createMockContainerElement(1000);
    const containerReference = { current: element };

    const { unmount } = renderHook(() =>
      useCarouselLayout({
        containerRef: containerReference,
        gap: 10,
        itemsPerView: 5,
        totalItems: 10,
      }),
    );
    expect(MockedResizeObserver.disconnectCount).toBe(0);
    unmount();
    expect(MockedResizeObserver.disconnectCount).toBe(1);
  });
});
