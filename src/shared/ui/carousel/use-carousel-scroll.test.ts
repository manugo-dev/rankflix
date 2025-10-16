import { act, renderHook } from "@testing-library/react";
import { useAnimate, useMotionValue } from "motion/react";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";

import { useCarouselScroll } from "./use-carousel-scroll";

vi.mock("motion/react", async (importActual) => ({
  ...(await importActual()),
  useAnimate: vi.fn(),
  useMotionValue: vi.fn(),
}));

const createMockElement = (offsetLeft: number, offsetWidth: number) =>
  ({ offsetLeft, offsetWidth }) as unknown as HTMLElement;

const createContainerReference = (offsetWidth: number = 1000) => ({
  current: { offsetWidth } as HTMLElement,
});

const createItemsReference = (items: Array<{ offsetLeft: number; offsetWidth: number }>) => ({
  current: items.map(({ offsetLeft, offsetWidth }) => createMockElement(offsetLeft, offsetWidth)),
});

describe("useCarouselScroll", () => {
  let mockAnimateFn: Mock;
  let mockMotionValue: (() => number) & {
    get: Mock<() => number>;
    set: Mock<(_v: number) => void>;
  };

  beforeEach(() => {
    let motionValue = 0;

    mockMotionValue = Object.assign(() => motionValue, {
      get: vi.fn(() => motionValue),
      set: vi.fn((v: number) => {
        motionValue = v;
      }),
    });

    mockAnimateFn = vi.fn();

    (useAnimate as Mock).mockReturnValue(["scope", mockAnimateFn]);
    (useMotionValue as Mock).mockReturnValue(mockMotionValue);
    mockAnimateFn.mockClear();
  });

  describe("Hook structure", () => {
    it("returns all required properties", () => {
      const containerReference = createContainerReference();
      const itemsReference = createItemsReference([
        { offsetLeft: 0, offsetWidth: 100 },
        { offsetLeft: 200, offsetWidth: 100 },
      ]);

      const { result } = renderHook(() =>
        useCarouselScroll({
          containerRef: containerReference,
          itemsRef: itemsReference,
          maxScrollX: 500,
        }),
      );

      expect(result.current).toHaveProperty("scrollToItem");
      expect(result.current).toHaveProperty("snapToClosest");
      expect(result.current).toHaveProperty("resetScroll");
      expect(result.current).toHaveProperty("handleDrag");
      expect(result.current).toHaveProperty("x");
      expect(result.current).toHaveProperty("scope");
      expect(result.current).toHaveProperty("draggingOffsetRef");
    });

    it("returns stable references across renders", () => {
      const containerReference = createContainerReference();
      const itemsReference = createItemsReference([{ offsetLeft: 0, offsetWidth: 100 }]);

      const { rerender, result } = renderHook(() =>
        useCarouselScroll({
          containerRef: containerReference,
          itemsRef: itemsReference,
          maxScrollX: 500,
        }),
      );

      const firstScrollToItem = result.current.scrollToItem;
      const firstSnapToClosest = result.current.snapToClosest;
      const firstHandleDrag = result.current.handleDrag;
      const firstResetScroll = result.current.resetScroll;

      rerender();

      expect(result.current.scrollToItem).toBe(firstScrollToItem);
      expect(result.current.snapToClosest).toBe(firstSnapToClosest);
      expect(result.current.handleDrag).toBe(firstHandleDrag);
      expect(result.current.resetScroll).toBe(firstResetScroll);
    });
  });

  describe("scrollToItem", () => {
    it("centers item by default", () => {
      const containerReference = createContainerReference(1000);
      const itemsReference = createItemsReference([
        { offsetLeft: 0, offsetWidth: 100 },
        { offsetLeft: 200, offsetWidth: 100 },
        { offsetLeft: 400, offsetWidth: 100 },
      ]);

      const { result } = renderHook(() =>
        useCarouselScroll({
          containerRef: containerReference,
          itemsRef: itemsReference,
          maxScrollX: 300,
        }),
      );

      act(() => {
        result.current.scrollToItem(1, { align: "center" });
      });

      expect(mockAnimateFn).toHaveBeenCalled();
      expect(mockAnimateFn).toHaveBeenCalledWith(
        expect.anything(),
        expect.any(Number),
        expect.objectContaining({ type: "spring" }),
      );
    });

    it("aligns left when specified", () => {
      const containerReference = createContainerReference(1000);
      const itemsReference = createItemsReference([
        { offsetLeft: 0, offsetWidth: 100 },
        { offsetLeft: 200, offsetWidth: 100 },
      ]);

      const { result } = renderHook(() =>
        useCarouselScroll({
          containerRef: containerReference,
          itemsRef: itemsReference,
          maxScrollX: 50,
        }),
      );

      act(() => {
        result.current.scrollToItem(1, { align: "left" });
      });

      expect(mockAnimateFn).toHaveBeenCalled();
      const [, scrollValue] = mockAnimateFn.mock.calls[0];
      expect(scrollValue).toBe(-50);
    });

    it("clamps scroll value to maxScrollX", () => {
      const containerReference = createContainerReference(1000);
      const itemsReference = createItemsReference([
        { offsetLeft: 0, offsetWidth: 100 },
        { offsetLeft: 500, offsetWidth: 100 },
      ]);

      const { result } = renderHook(() =>
        useCarouselScroll({
          containerRef: containerReference,
          itemsRef: itemsReference,
          maxScrollX: 100,
        }),
      );

      act(() => {
        result.current.scrollToItem(1, { align: "left" });
      });

      expect(mockAnimateFn).toHaveBeenCalled();
      const [, scrollValue] = mockAnimateFn.mock.calls[0];
      expect(scrollValue).toBeLessThanOrEqual(-100);
    });

    it("does nothing when container is missing", () => {
      const containerReference = { current: null };
      const itemsReference = createItemsReference([{ offsetLeft: 0, offsetWidth: 100 }]);

      const { result } = renderHook(() =>
        useCarouselScroll({
          containerRef: containerReference,
          itemsRef: itemsReference,
          maxScrollX: 100,
        }),
      );

      act(() => {
        result.current.scrollToItem(0);
      });

      expect(mockAnimateFn).not.toHaveBeenCalled();
    });

    it("does nothing when item is missing", () => {
      const containerReference = createContainerReference();
      const itemsReference = { current: [] };

      const { result } = renderHook(() =>
        useCarouselScroll({
          containerRef: containerReference,
          itemsRef: itemsReference,
          maxScrollX: 100,
        }),
      );

      act(() => {
        result.current.scrollToItem(5);
      });

      expect(mockAnimateFn).not.toHaveBeenCalled();
    });

    it("uses spring animation with correct config", () => {
      const containerReference = createContainerReference();
      const itemsReference = createItemsReference([
        { offsetLeft: 0, offsetWidth: 100 },
        { offsetLeft: 200, offsetWidth: 100 },
      ]);

      const { result } = renderHook(() =>
        useCarouselScroll({
          containerRef: containerReference,
          itemsRef: itemsReference,
          maxScrollX: 500,
        }),
      );

      act(() => {
        result.current.scrollToItem(0);
      });

      expect(mockAnimateFn).toHaveBeenCalledWith(
        expect.anything(),
        expect.any(Number),
        expect.objectContaining({ damping: 30, stiffness: 300, type: "spring" }),
      );
    });
  });

  describe("snapToClosest", () => {
    it("finds closest item to viewport center", () => {
      const containerReference = createContainerReference(1000);
      const itemsReference = createItemsReference([
        { offsetLeft: 0, offsetWidth: 100 },
        { offsetLeft: 200, offsetWidth: 100 },
        { offsetLeft: 400, offsetWidth: 100 },
      ]);

      const { result } = renderHook(() =>
        useCarouselScroll({
          containerRef: containerReference,
          itemsRef: itemsReference,
          maxScrollX: 500,
        }),
      );

      act(() => {
        (mockMotionValue.get as Mock).mockReturnValue(-210);
        const closestIndex = result.current.snapToClosest();
        expect([0, 1, 2]).toContain(closestIndex);
      });
    });

    it("triggers scrollToItem with found index", () => {
      const containerReference = createContainerReference(1000);
      const itemsReference = createItemsReference([
        { offsetLeft: 0, offsetWidth: 100 },
        { offsetLeft: 200, offsetWidth: 100 },
      ]);

      const { result } = renderHook(() =>
        useCarouselScroll({
          containerRef: containerReference,
          itemsRef: itemsReference,
          maxScrollX: 500,
        }),
      );

      act(() => {
        (mockMotionValue.get as Mock).mockReturnValue(-100);
        result.current.snapToClosest();
      });

      expect(mockAnimateFn).toHaveBeenCalled();
    });

    it("returns -1 when container is missing", () => {
      const containerReference = { current: null };
      const itemsReference = { current: [] };

      const { result } = renderHook(() =>
        useCarouselScroll({
          containerRef: containerReference,
          itemsRef: itemsReference,
          maxScrollX: 100,
        }),
      );

      const closestIndex = result.current.snapToClosest();
      expect(closestIndex).toBe(-1);
    });

    it("returns -1 when items are missing", () => {
      const containerReference = createContainerReference();
      const itemsReference = { current: [] };

      const { result } = renderHook(() =>
        useCarouselScroll({
          containerRef: containerReference,
          itemsRef: itemsReference,
          maxScrollX: 100,
        }),
      );

      const closestIndex = result.current.snapToClosest();
      expect(closestIndex).toBe(-1);
    });

    it("resets dragging offset after snap", () => {
      const containerReference = createContainerReference(1000);
      const itemsReference = createItemsReference([
        { offsetLeft: 0, offsetWidth: 100 },
        { offsetLeft: 200, offsetWidth: 100 },
      ]);

      const { result } = renderHook(() =>
        useCarouselScroll({
          containerRef: containerReference,
          itemsRef: itemsReference,
          maxScrollX: 500,
        }),
      );

      act(() => {
        result.current.draggingOffsetRef.current = 50;
        result.current.snapToClosest();
      });

      expect(result.current.draggingOffsetRef.current).toBe(0);
    });

    it("handles items with null elements gracefully", () => {
      const containerReference = createContainerReference(1000);
      const itemsReference = {
        current: [
          createMockElement(0, 100),
          null as unknown as HTMLElement,
          createMockElement(400, 100),
        ],
      };

      const { result } = renderHook(() =>
        useCarouselScroll({
          containerRef: containerReference,
          itemsRef: itemsReference,
          maxScrollX: 500,
        }),
      );

      act(() => {
        (mockMotionValue.get as Mock).mockReturnValue(0);
        const closestIndex = result.current.snapToClosest();
        expect([0, 2]).toContain(closestIndex);
      });
    });
  });

  describe("handleDrag", () => {
    it("updates dragging offset from pan info", () => {
      const containerReference = createContainerReference();
      const itemsReference = createItemsReference([{ offsetLeft: 0, offsetWidth: 100 }]);

      const { result } = renderHook(() =>
        useCarouselScroll({
          containerRef: containerReference,
          itemsRef: itemsReference,
          maxScrollX: 100,
        }),
      );

      act(() => {
        result.current.handleDrag({} as PointerEvent, {
          delta: { x: 10, y: 0 },
          offset: { x: 123, y: 0 },
          point: { x: 100, y: 50 },
          velocity: { x: 50, y: 0 },
        });
      });

      expect(result.current.draggingOffsetRef.current).toBe(123);
    });

    it("handles negative offset values", () => {
      const containerReference = createContainerReference();
      const itemsReference = createItemsReference([{ offsetLeft: 0, offsetWidth: 100 }]);

      const { result } = renderHook(() =>
        useCarouselScroll({
          containerRef: containerReference,
          itemsRef: itemsReference,
          maxScrollX: 100,
        }),
      );

      act(() => {
        result.current.handleDrag({} as PointerEvent, {
          delta: { x: -10, y: 0 },
          offset: { x: -50, y: 0 },
          point: { x: 100, y: 50 },
          velocity: { x: 0, y: 0 },
        });
      });

      expect(result.current.draggingOffsetRef.current).toBe(-50);
    });

    it("handles zero offset", () => {
      const containerReference = createContainerReference();
      const itemsReference = createItemsReference([{ offsetLeft: 0, offsetWidth: 100 }]);

      const { result } = renderHook(() =>
        useCarouselScroll({
          containerRef: containerReference,
          itemsRef: itemsReference,
          maxScrollX: 100,
        }),
      );

      act(() => {
        result.current.handleDrag({} as PointerEvent, {
          delta: { x: 0, y: 0 },
          offset: { x: 0, y: 0 },
          point: { x: 100, y: 50 },
          velocity: { x: 0, y: 0 },
        });
      });

      expect(result.current.draggingOffsetRef.current).toBe(0);
    });
  });

  describe("resetScroll", () => {
    it("animates scroll back to zero", () => {
      const containerReference = createContainerReference();
      const itemsReference = createItemsReference([{ offsetLeft: 0, offsetWidth: 100 }]);

      const { result } = renderHook(() =>
        useCarouselScroll({
          containerRef: containerReference,
          itemsRef: itemsReference,
          maxScrollX: 500,
        }),
      );

      act(() => {
        result.current.resetScroll();
      });

      expect(mockAnimateFn).toHaveBeenCalledWith(
        expect.anything(),
        0,
        expect.objectContaining({ damping: 30, stiffness: 300, type: "spring" }),
      );
    });

    it("uses spring animation with correct config", () => {
      const containerReference = createContainerReference();
      const itemsReference = createItemsReference([{ offsetLeft: 0, offsetWidth: 100 }]);

      const { result } = renderHook(() =>
        useCarouselScroll({
          containerRef: containerReference,
          itemsRef: itemsReference,
          maxScrollX: 500,
        }),
      );

      act(() => {
        result.current.resetScroll();
      });

      const animationConfig = mockAnimateFn.mock.calls[0][2];
      expect(animationConfig).toEqual({
        damping: 30,
        stiffness: 300,
        type: "spring",
      });
    });
  });
});
