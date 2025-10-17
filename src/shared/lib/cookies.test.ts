import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { clearCookies, deleteCookie, getCookie, setCookie } from "./cookies";

describe("Cookie Utils", () => {
  beforeEach(() => {
    clearCookies();
  });

  afterEach(() => {
    clearCookies();
  });

  describe("setCookie", () => {
    it("should set a cookie with default values", () => {
      setCookie("test", "value");
      const cookie = getCookie("test");
      expect(cookie).toBe("value");
    });

    it("should set a cookie with custom options", () => {
      const documentCookieSpy = vi.spyOn(document, "cookie", "set");
      setCookie("custom", "data", {
        maxAge: 3600,
        path: "/app",
        sameSite: "Strict",
      });
      expect(documentCookieSpy).toHaveBeenCalled();
      const cookieString = documentCookieSpy.mock.calls[0][0] as string;
      expect(cookieString).toContain("custom=data");
      expect(cookieString).toContain("Max-Age=3600");
      expect(cookieString).toContain("Path=/app");
      expect(cookieString).toContain("SameSite=Strict");
      if (document.cookie.includes("custom=")) {
        expect(getCookie("custom")).toBe("data");
      }
    });

    it("should encode special characters correctly", () => {
      setCookie("encoded", "hello world&special=chars");
      const cookie = getCookie("encoded");
      expect(cookie).toBe("hello world&special=chars");
    });

    it("should include Secure attribute when necessary", () => {
      const documentCookieSpy = vi.spyOn(document, "cookie", "set");
      setCookie("secure", "value", { secure: true });
      expect(documentCookieSpy).toHaveBeenCalled();
      const cookieString = documentCookieSpy.mock.calls[0][0] as string;
      expect(cookieString).toContain("Secure");
    });

    it("should include SameSite attribute when necessary", () => {
      const documentCookieSpy = vi.spyOn(document, "cookie", "set");
      setCookie("samesite", "value", { sameSite: "None" });
      const cookieString = documentCookieSpy.mock.calls[0][0] as string;
      expect(cookieString).toContain("SameSite=None");
    });
  });

  describe("getCookie", () => {
    it("should return null if the cookie does not exist", () => {
      const cookie = getCookie("nonexistent");
      expect(cookie).toBeNull();
    });

    it("should retrieve an existing cookie", () => {
      setCookie("existing", "test-value");
      const cookie = getCookie("existing");
      expect(cookie).toBe("test-value");
    });

    it("should decode values with special characters", () => {
      setCookie("special", "value with spaces");
      const cookie = getCookie("special");
      expect(cookie).toBe("value with spaces");
    });

    it("should retrieve multiple cookies independently", () => {
      setCookie("cookie1", "value1");
      setCookie("cookie2", "value2");
      setCookie("cookie3", "value3");

      expect(getCookie("cookie1")).toBe("value1");
      expect(getCookie("cookie2")).toBe("value2");
      expect(getCookie("cookie3")).toBe("value3");
    });

    it("should not return partial matches for similar names", () => {
      setCookie("language", "es");
      const cookie = getCookie("lang");
      expect(cookie).toBeNull();
    });
  });

  describe("deleteCookie", () => {
    it("should delete an existing cookie", () => {
      setCookie("toDelete", "value");
      expect(getCookie("toDelete")).toBe("value");

      deleteCookie("toDelete");
      expect(getCookie("toDelete")).toBeNull();
    });

    it("should delete a cookie with a custom path", () => {
      const documentCookieSpy = vi.spyOn(document, "cookie", "set");
      deleteCookie("test", "/app");
      const cookieString = documentCookieSpy.mock.calls[0][0] as string;
      expect(cookieString).toContain("Path=/app");
      expect(cookieString).toContain("Max-Age=0");
    });

    it("should delete multiple cookies independently", () => {
      setCookie("delete1", "value1");
      setCookie("delete2", "value2");
      deleteCookie("delete1");
      deleteCookie("delete2");
      expect(getCookie("delete1")).toBeNull();
      expect(getCookie("delete2")).toBeNull();
    });
  });

  describe("Real-world scenarios", () => {
    it("should synchronize language cookie updates", () => {
      setCookie("language", "es");
      expect(getCookie("language")).toBe("es");
      setCookie("language", "en");
      expect(getCookie("language")).toBe("en");
      deleteCookie("language");
      expect(getCookie("language")).toBeNull();
    });

    it("should handle empty string values correctly", () => {
      setCookie("empty", "");
      const cookie = getCookie("empty");
      expect(cookie).toBe("");
    });

    it("should treat numeric values as strings", () => {
      setCookie("number", "123");
      const cookie = getCookie("number");
      expect(cookie).toBe("123");
      expect(typeof cookie).toBe("string");
    });

    it("should respect different options in the same session", () => {
      setCookie("short", "value", { maxAge: 3600 });
      setCookie("long", "value", { maxAge: 86_400 * 365 });
      expect(getCookie("short")).toBe("value");
      expect(getCookie("long")).toBe("value");
    });
  });
});
