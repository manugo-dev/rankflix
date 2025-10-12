import { describe, expect, it } from "vitest";

import { cleanUrl, extractParams as extractParams, matchRoute } from "./route";

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

  describe("extractParams", () => {
    it("extracts single param", () => {
      const params = extractParams("/user/123", "/user/:id");
      expect(params).toEqual({ id: "123" });
    });

    it("extracts multiple params", () => {
      const params = extractParams("/user/john/post/456", "/user/:username/post/:id");
      expect(params).toEqual({ id: "456", username: "john" });
    });

    it("returns empty object for no match", () => {
      const params = extractParams("/other", "/user/:id");
      expect(params).toEqual({});
    });

    it("returns empty object for no params", () => {
      const params = extractParams("/home", "/home");
      expect(params).toEqual({});
    });
  });

  describe("matchRoute", () => {
    const routes = [
      { name: "detail", path: "/user/:id" },
      { name: "list", path: "/users" },
      { name: "home", path: "/" },
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
