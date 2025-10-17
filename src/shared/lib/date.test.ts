import dayjs from "dayjs";
import { describe, expect, it } from "vitest";

import { DEFAULT_DATE_FORMAT, formatDate, getYear, parseDate } from "./date";

describe("parseDate", () => {
  it("returns a Date matching the provided string", () => {
    const input = "2023-05-15 10:20:30";
    const result = parseDate(input);
    expect(result).toBeInstanceOf(Date);
    expect(dayjs(result).format(DEFAULT_DATE_FORMAT)).toBe("2023-05-15");
  });

  it("preserves numeric timestamps", () => {
    const timestamp = 1_700_000_000_000;
    const result = parseDate(timestamp);
    expect(result.getTime()).toBe(timestamp);
  });
});

describe("formatDate", () => {
  it("uses the default format when none is provided", () => {
    const input = "2023-05-15 10:20:30";
    expect(formatDate(input)).toBe("2023-05-15 10:20:30");
  });

  it("applies a custom format", () => {
    const date = new Date(2020, 0, 2, 3, 4, 5);
    expect(formatDate(date, "YYYY/MM/DD HH:mm")).toBe("2020/01/02 03:04");
  });
});

describe("getYear", () => {
  it("extracts the year from various date values", () => {
    expect(getYear("2023-05-15")).toBe(2023);
    expect(getYear(new Date(1999, 11, 31))).toBe(1999);
  });
});
