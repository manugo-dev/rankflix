import { describe, it, expect } from "vitest";

import { cleanUrl, extractParameters as extractParameters, matchRoute } from "./route";

describe("Route Utils", () => {
  describe("cleanUrl", () => {
    it("removes query string", () => {
      expect(cleanUrl("/users?page=2")).toBe("/users");
    });

    it("removes hash", () => {
      expect(cleanUrl("/users#section")).toBe("/users");
    });

    it("removes both query and hash", () => {
      expect(cleanUrl("/users?page=2#section")).toBe("/users");
    });

    it("returns unchanged url without query or hash", () => {
      expect(cleanUrl("/users")).toBe("/users");
    });
  });

  describe("extractParameters", () => {
    it("extracts single param", () => {
      const parameters = extractParameters("/user/123", "/user/:id");
      expect(parameters).toEqual({ id: "123" });
    });

    it("extracts multiple params", () => {
      const parameters = extractParameters("/user/john/post/456", "/user/:username/post/:id");
      expect(parameters).toEqual({ username: "john", id: "456" });
    });

    it("returns empty object for no match", () => {
      const parameters = extractParameters("/other", "/user/:id");
      expect(parameters).toEqual({});
    });

    it("returns empty object for no params", () => {
      const parameters = extractParameters("/home", "/home");
      expect(parameters).toEqual({});
    });
  });

  describe("matchRoute", () => {
    const routes = [
      { path: "/user/:id", name: "detail" },
      { path: "/users", name: "list" },
      { path: "/", name: "home" },
    ];

    it("matches exact route", () => {
      const match = matchRoute("/users", routes);
      expect(match?.name).toBe("list");
    });

    it("matches dynamic route", () => {
      const match = matchRoute("/user/123", routes);
      expect(match?.name).toBe("detail");
    });

    it("matches root route", () => {
      const match = matchRoute("/", routes);
      expect(match?.name).toBe("home");
    });

    it("returns null for no match", () => {
      const match = matchRoute("/unknown", routes);
      expect(match).toBeUndefined();
    });

    it("cleans url before matching", () => {
      const match = matchRoute("/users?page=2#top", routes);
      expect(match?.name).toBe("list");
    });

    it("works with Map", () => {
      const routeMap = new Map(routes.map((r) => [r.path, r]));
      const match = matchRoute("/users", routeMap);
      expect(match?.name).toBe("list");
    });
  });
});
