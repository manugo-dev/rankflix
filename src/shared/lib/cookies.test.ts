// shared/lib/__tests__/cookie.test.ts
import { beforeEach, describe, expect, it, vi } from "vitest";

import { deleteCookie, getCookie, setCookie } from "./cookies";

describe("Cookie Utils", () => {
  beforeEach(() => {
    for (const c of document.cookie.split(";")) {
      const eqPos = c.indexOf("=");
      const name = eqPos === -1 ? c.trim() : c.slice(0, Math.max(0, eqPos)).trim();
      // eslint-disable-next-line unicorn/no-document-cookie
      document.cookie = `${name}=;Max-Age=0;Path=/`;
    }
  });

  describe("setCookie", () => {
    it("debería establecer una cookie con valores por defecto", () => {
      setCookie("test", "value");
      const cookie = getCookie("test");
      expect(cookie).toBe("value");
    });

    it("debería establecer una cookie con opciones personalizadas", () => {
      setCookie("custom", "data", {
        maxAge: 3600,
        path: "/app",
        sameSite: "Strict",
      });
      const cookie = getCookie("custom");
      expect(cookie).toBe("data");
    });

    it("debería codificar valores especiales", () => {
      setCookie("encoded", "hello world&special=chars");
      const cookie = getCookie("encoded");
      expect(cookie).toBe("hello world&special=chars");
    });

    it("debería incluir Secure cuando sea necesario", () => {
      const documentCookieSpy = vi.spyOn(document, "cookie", "set");
      setCookie("secure", "value", { secure: true });
      expect(documentCookieSpy).toHaveBeenCalled();
      const cookieString = documentCookieSpy.mock.calls[0][0] as string;
      expect(cookieString).toContain("Secure");
    });

    it("debería incluir SameSite correcto", () => {
      const documentCookieSpy = vi.spyOn(document, "cookie", "set");
      setCookie("samesite", "value", { sameSite: "None" });
      const cookieString = documentCookieSpy.mock.calls[0][0] as string;
      expect(cookieString).toContain("SameSite=None");
    });
  });

  describe("getCookie", () => {
    it("debería retornar null si la cookie no existe", () => {
      const cookie = getCookie("nonexistent");
      expect(cookie).toBeNull();
    });

    it("debería obtener una cookie existente", () => {
      setCookie("existing", "test-value");
      const cookie = getCookie("existing");
      expect(cookie).toBe("test-value");
    });

    it("debería decodificar valores especiales", () => {
      setCookie("special", "value with spaces");
      const cookie = getCookie("special");
      expect(cookie).toBe("value with spaces");
    });

    it("debería obtener múltiples cookies diferentes", () => {
      setCookie("cookie1", "value1");
      setCookie("cookie2", "value2");
      setCookie("cookie3", "value3");

      expect(getCookie("cookie1")).toBe("value1");
      expect(getCookie("cookie2")).toBe("value2");
      expect(getCookie("cookie3")).toBe("value3");
    });

    it("debería retornar null para cookies con nombres parciales", () => {
      setCookie("language", "es");
      const cookie = getCookie("lang");
      expect(cookie).toBeNull();
    });
  });

  describe("deleteCookie", () => {
    it("debería eliminar una cookie existente", () => {
      setCookie("toDelete", "value");
      expect(getCookie("toDelete")).toBe("value");

      deleteCookie("toDelete");
      expect(getCookie("toDelete")).toBeNull();
    });

    it("debería usar path personalizado", () => {
      const documentCookieSpy = vi.spyOn(document, "cookie", "set");
      deleteCookie("test", "/app");
      const cookieString = documentCookieSpy.mock.calls[0][0] as string;
      expect(cookieString).toContain("Path=/app");
      expect(cookieString).toContain("Max-Age=0");
    });

    it("debería eliminar múltiples cookies", () => {
      setCookie("delete1", "value1");
      setCookie("delete2", "value2");
      deleteCookie("delete1");
      deleteCookie("delete2");
      expect(getCookie("delete1")).toBeNull();
      expect(getCookie("delete2")).toBeNull();
    });
  });

  describe("Casos de uso reales", () => {
    it("debería sincronizar language cookie", () => {
      setCookie("language", "es");
      expect(getCookie("language")).toBe("es");
      setCookie("language", "en");
      expect(getCookie("language")).toBe("en");
      deleteCookie("language");
      expect(getCookie("language")).toBeNull();
    });

    it("debería manejar valores vacíos correctamente", () => {
      setCookie("empty", "");
      const cookie = getCookie("empty");
      expect(cookie).toBe("");
    });

    it("debería manejar valores numéricos como strings", () => {
      setCookie("number", "123");
      const cookie = getCookie("number");
      expect(cookie).toBe("123");
      expect(typeof cookie).toBe("string");
    });

    it("debería respetar diferentes opciones en la misma sesión", () => {
      setCookie("short", "value", { maxAge: 3600 });
      setCookie("long", "value", { maxAge: 86_400 * 365 });
      expect(getCookie("short")).toBe("value");
      expect(getCookie("long")).toBe("value");
    });
  });
});
