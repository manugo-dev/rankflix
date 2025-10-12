import { describe, expect, it } from "vitest";

import { createBidirectionalMap } from "./mapping";

describe("createBidirectionalMap", () => {
  it("maps forward and reverse and provides toValue/toKey/has helpers", () => {
    const entries = { A: "a", B: "b" } as const;
    const map = createBidirectionalMap(entries);

    expect(map.forward).toStrictEqual(entries);
    expect(map.reverse).toEqual({ a: "A", b: "B" });

    expect(map.toValue("A")).toBe("a");
    expect(map.toValue("B")).toBe("b");
    expect(map.toValue("C" as keyof typeof map.forward)).toBeUndefined();

    expect(map.toKey("a")).toBe("A");
    expect(map.toKey("b")).toBe("B");
    expect(map.toKey("c" as keyof typeof map.reverse)).toBeUndefined();

    expect(map.hasKey("A")).toBe(true);
    expect(map.hasKey("C" as keyof typeof map.forward)).toBe(false);

    expect(map.hasValue("a")).toBe(true);
    expect(map.hasValue("c" as keyof typeof map.reverse)).toBe(false);
  });

  it("handles duplicate values: last key wins in reverse mapping", () => {
    const entries = { X: "v", Y: "v" } as const;
    const map = createBidirectionalMap(entries);

    expect(map.forward).toStrictEqual(entries);
    // Y overwrote X for value 'v'
    expect(map.reverse).toStrictEqual({ v: "Y" });
    expect(map.toKey("v")).toBe("Y");
    expect(map.hasValue("v")).toBe(true);
  });

  it("works with empty entries", () => {
    const entries: Record<string, string> = {};
    const map = createBidirectionalMap(entries);

    expect(map.forward).toStrictEqual({});
    expect(map.reverse).toStrictEqual({});

    expect(map.toValue("anything")).toBeUndefined();
    expect(map.toKey("anything")).toBeUndefined();
    expect(map.hasKey("anything")).toBe(false);
    expect(map.hasValue("anything")).toBe(false);
  });

  it("shows current behavior for empty-string keys/values (falsy checks)", () => {
    const entries = { "": "" };
    const map = createBidirectionalMap(entries);

    // forward contains the empty-string key/value
    expect(map.forward[""]).toBe("");
    expect(map.reverse[""]).toBe("");

    // hasKey/hasValue use "in" and therefore detect the empty-string key/value
    expect(map.hasKey("")).toBe(true);
    expect(map.hasValue("")).toBe(true);

    // toValue/toKey use truthy checks and return undefined for empty string
    expect(map.toValue("")).toBeUndefined();
    expect(map.toKey("")).toBeUndefined();
  });
});
