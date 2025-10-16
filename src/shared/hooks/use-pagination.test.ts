import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { usePagination, type UsePaginationOptions } from "./use-pagination";

describe("usePagination", () => {
  it("computes pageCount and currentPage correctly", () => {
    const { result } = renderHook(() => usePagination({ itemsPerPage: 5, totalItems: 22 }));
    expect(result.current.pageCount).toBe(5);
    expect(result.current.currentPage).toBe(0);
    expect(result.current.canScrollLeft).toBe(false);
    expect(result.current.canScrollRight).toBe(true);
  });

  it("handles zero or invalid itemsPerPage and totalItems", () => {
    const { rerender, result } = renderHook((props: UsePaginationOptions) => usePagination(props), {
      initialProps: { itemsPerPage: 0, totalItems: 0 },
    });
    expect(result.current.pageCount).toBe(1);
    rerender({ itemsPerPage: -2, totalItems: 10 });
    expect(result.current.pageCount).toBe(Math.ceil(10 / 1));
  });

  it("updates currentPage when activeIndex changes", () => {
    const { result } = renderHook(() => usePagination({ itemsPerPage: 3, totalItems: 10 }));
    act(() => {
      result.current.setActiveIndex(4); // index 4 -> page 1
    });
    expect(result.current.currentPage).toBe(1);
  });

  it("goToPage clamps to valid range and updates activeIndex", () => {
    const { result } = renderHook(() => usePagination({ itemsPerPage: 5, totalItems: 20 }));
    let index: number;
    act(() => {
      index = result.current.goToPage(2);
    });
    expect(index!).toBe(10);
    expect(result.current.activeIndex).toBe(10);
    act(() => {
      result.current.goToPage(-5);
    });
    expect(result.current.activeIndex).toBe(0);
    act(() => {
      result.current.goToPage(999);
    });
    expect(result.current.activeIndex).toBe(15); // last page -> index 15
  });

  it("nextPage and previousPage move correctly within range", () => {
    const { result } = renderHook(() => usePagination({ itemsPerPage: 2, totalItems: 6 }));
    // initial -> page 0
    act(() => {
      result.current.nextPage(); // go to page 1
    });
    expect(result.current.activeIndex).toBe(2);
    expect(result.current.currentPage).toBe(1);
    act(() => {
      result.current.nextPage(); // page 2
    });
    expect(result.current.activeIndex).toBe(4);
    expect(result.current.currentPage).toBe(2);
    act(() => {
      result.current.previousPage(); // back to page 1
    });
    expect(result.current.activeIndex).toBe(2);
    expect(result.current.currentPage).toBe(1);
  });

  it("navigateByOffset moves the index and clamps within bounds", () => {
    const { result } = renderHook(() => usePagination({ itemsPerPage: 4, totalItems: 10 }));
    act(() => {
      result.current.setActiveIndex(5);
    });
    act(() => {
      result.current.navigateByOffset(2);
    });
    expect(result.current.activeIndex).toBe(7);
    act(() => {
      result.current.navigateByOffset(999); // beyond end
    });
    expect(result.current.activeIndex).toBe(9);
    act(() => {
      result.current.navigateByOffset(-999); // below start
    });
    expect(result.current.activeIndex).toBe(0);
  });

  it("firstIndexOfPage returns expected first item index", () => {
    const { result } = renderHook(() => usePagination({ itemsPerPage: 4, totalItems: 12 }));
    expect(result.current.firstIndexOfPage(0)).toBe(0);
    expect(result.current.firstIndexOfPage(1)).toBe(4);
    expect(result.current.firstIndexOfPage(999)).toBe(11);
  });
});
