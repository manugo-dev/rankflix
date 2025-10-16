import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { BREAKPOINTS } from "@/shared/config/responsive";

import { useBreakpoints } from "./use-breakpoints";

describe("useBreakpoints", () => {
  it("returns the expected breakpoint and updates on resize", () => {
    const innerWidthSpy = vi.spyOn(globalThis, "innerWidth", "get");
    innerWidthSpy.mockReturnValue(BREAKPOINTS.xs);

    const { result } = renderHook(() => useBreakpoints());
    expect(result.current).toBe("xs");

    act(() => {
      innerWidthSpy.mockReturnValue(BREAKPOINTS.sm);
      globalThis.dispatchEvent(new Event("resize"));
    });
    expect(result.current).toBe("sm");

    act(() => {
      innerWidthSpy.mockReturnValue(BREAKPOINTS.md);
      globalThis.dispatchEvent(new Event("resize"));
    });
    expect(result.current).toBe("md");

    act(() => {
      innerWidthSpy.mockReturnValue(BREAKPOINTS.lg);
      globalThis.dispatchEvent(new Event("resize"));
    });
    expect(result.current).toBe("lg");

    act(() => {
      innerWidthSpy.mockReturnValue(BREAKPOINTS.xl);
      globalThis.dispatchEvent(new Event("resize"));
    });
    expect(result.current).toBe("xl");
    innerWidthSpy.mockRestore();
  });
});
