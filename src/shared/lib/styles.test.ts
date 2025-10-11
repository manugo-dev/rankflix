import { describe, it, expect } from "vitest";

import { cn } from "./styles";

describe("cn utility", () => {
  it("returns empty string when called without arguments", () => {
    expect(cn()).toBe("");
  });

  it("joins strings and ignores undefined, null, false and empty string", () => {
    expect(cn("btn", undefined, null, false, "")).toBe("btn");
  });

  it("supports objects for conditional classes", () => {
    expect(cn({ foo: true, bar: false }, "baz")).toBe("foo baz");
  });

  it("supports arrays and nested structures", () => {
    expect(cn(["a", ["b", { c: true, d: false }]])).toBe("a b c");
  });

  it("includes numeric class values", () => {
    expect(cn(1, "num", 0)).toBe("1 num");
  });
});
