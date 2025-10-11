import { describe, it, expect } from "vitest";

import { sortedValuesToString } from "./array";

describe("sortedValuesToString", () => {
  it("returns empty string for undefined input", () => {
    expect(sortedValuesToString(undefined)).toBe("");
  });

  it("returns empty string for empty array", () => {
    expect(sortedValuesToString([])).toBe("");
  });

  it("sorts string values lexicographically and joins with comma by default", () => {
    expect(sortedValuesToString(["b", "a"])).toBe("a,b");
  });

  it("sorts numeric values as strings (lexicographic) by default", () => {
    expect(sortedValuesToString([10, 2])).toBe("10,2");
  });

  it("uses custom join character when provided", () => {
    expect(sortedValuesToString(["b", "a"], ";")).toBe("a;b");
  });

  it("handles undefined elements: undefined alone becomes empty string", () => {
    expect(sortedValuesToString([undefined])).toBe("");
  });

  it("places undefined elements according to sort order and treats them as empty in join", () => {
    expect(sortedValuesToString([undefined, "a"])).toBe("a");
    expect(sortedValuesToString([2, undefined, 10])).toBe("10,2");
  });
});
