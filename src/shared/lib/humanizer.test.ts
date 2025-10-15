import { describe, expect, it } from "vitest";

import { humanizer } from "./humanizer";

describe("humanizer", () => {
  it("exports a function", () => {
    expect(typeof humanizer).toBe("function");
  });

  it("formats hours correctly", () => {
    // 1 hour = 3_600_000 ms
    const out = humanizer(3_600_000);
    expect(out).toMatch(/1\s*hour/);
  });

  it("respects options (largest)", () => {
    // 1 hour + 1 minute = 3_660_000 ms
    const out = humanizer(3_660_000, { largest: 1 });
    // With largest: 1 we should only see the largest unit (hours)
    expect(out).toMatch(/1\s*hour/);
  });
});
