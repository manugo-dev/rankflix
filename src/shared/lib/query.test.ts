import { describe, expect, it } from "vitest";

import { createEntityKey, serializeObjectEntries } from "./query";

describe("createEntityKey", () => {
  it("combines entity and simple parts", () => {
    expect(createEntityKey("movie", "1", "2")).toEqual(["movie", "1", "2"]);
  });

  it("flattens one-level arrays in parts", () => {
    expect(createEntityKey("ent", ["a", "b"], "c")).toEqual(["ent", "a", "b", "c"]);
  });

  it("filters falsy values (0, false, '', null, undefined, NaN) but preserves truthy ones", () => {
    const result = createEntityKey("x", 0, false, "", null, undefined, Number.NaN, "ok", true, 1);
    expect(result).toEqual(["x", "ok", true, 1]);
  });

  it("filters falsy values inside arrays passed as parts", () => {
    expect(createEntityKey("e", ["a", "", 0, false, null, "b"])).toEqual(["e", "a", "b"]);
  });
});

describe("serializeObjectEntries", () => {
  it("returns empty array when no object is provided", () => {
    expect(serializeObjectEntries()).toEqual([]);
  });

  it("serializes primitive values and joins array values with commas", () => {
    const source = { a: "x", b: 2, c: [1, 2, "3"], d: true };
    expect(serializeObjectEntries(source)).toEqual(["a:x", "b:2", "c:1,2,3", "d:true"]);
  });

  it("serializes undefined and empty arrays in a predictable way", () => {
    expect(serializeObjectEntries({ missing: undefined })).toEqual(["missing:undefined"]);
    expect(serializeObjectEntries({ emptyArr: [] })).toEqual(["emptyArr:"]);
  });
});
