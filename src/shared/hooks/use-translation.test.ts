import { useTranslation as mockedUseTranslation } from "react-i18next";
import { describe, expect, it, type Mock, vi } from "vitest";

import { useTranslate } from "./use-translation";

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn(),
}));

describe("useTranslate", () => {
  it("forwards namespace and options to useTranslation and returns its value", () => {
    const fakeReturn = { i18n: {}, t: (k: string) => `translated:${k}` };
    (mockedUseTranslation as Mock).mockReturnValue(fakeReturn);
    const result = useTranslate("common", { keyPrefix: "pref" });
    expect(mockedUseTranslation).toHaveBeenCalledWith("common", { keyPrefix: "pref" });
    expect(result).toBe(fakeReturn);
  });

  it("calls useTranslation with undefined args when none are provided and returns its value", () => {
    const fakeReturn = { i18n: {}, t: () => "x" };
    (mockedUseTranslation as Mock).mockReturnValue(fakeReturn);
    const result = useTranslate();
    expect(mockedUseTranslation).toHaveBeenCalledWith(undefined, undefined);
    expect(result).toBe(fakeReturn);
  });
});
