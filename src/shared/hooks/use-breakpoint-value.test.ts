import { renderHook } from "@testing-library/react";
import { describe, expect, it, type Mock, vi } from "vitest";

import { useBreakpointValue } from "./use-breakpoint-value";
import { useBreakpoints } from "./use-breakpoints";

vi.mock("./use-breakpoints", () => ({
  useBreakpoints: vi.fn(() => "md"),
}));

describe("useBreakpointValue", () => {
  it("returns exact value for current breakpoint when available", () => {
    const { result } = renderHook(() => useBreakpointValue({ lg: 4, md: 3, sm: 2, xl: 5, xs: 1 }));
    expect(result.current).toBe(3);
  });

  it("falls back to lower breakpoint when current is not defined", async () => {
    (useBreakpoints as Mock).mockReturnValue("lg");
    const { result } = renderHook(() => useBreakpointValue({ md: "medium", sm: "small" }));
    expect(result.current).toBe("medium");
  });

  it("returns default value when no breakpoints match", () => {
    (useBreakpoints as Mock).mockReturnValue("sm");
    const { result } = renderHook(() => useBreakpointValue({ md: 10 }, 99));
    expect(result.current).toBe(99);
  });
});
