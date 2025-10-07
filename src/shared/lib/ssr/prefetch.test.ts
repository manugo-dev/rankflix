import { QueryClient } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from "vitest";

import { prefetchRouteData } from "./prefetch";
import { matchRoute, extractParameters } from "@/shared/lib/utils/route";

vi.mock("@/shared/lib/utils/route", () => ({
  matchRoute: vi.fn(),
  extractParameters: vi.fn(),
}));

describe("prefetchRouteData", () => {
  const url = "/users/123";
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls route prefetch with correct context when route matches", async () => {
    const mockPrefetch = vi.fn(async (_context: unknown) => {});
    (matchRoute as Mock).mockReturnValue({ path: "/users/:id", prefetch: mockPrefetch });
    (extractParameters as Mock).mockReturnValue({ id: "123" });

    await prefetchRouteData(queryClient, url);

    expect(mockPrefetch).toHaveBeenCalledTimes(1);
    const calledWith = mockPrefetch.mock.calls[0][0];
    expect(calledWith).toMatchObject({
      url,
      params: { id: "123" },
      queryClient,
    });
  });

  it("does nothing when no route match is found", async () => {
    (matchRoute as Mock).mockReturnValue(undefined);

    // Should not throw
    await expect(prefetchRouteData(queryClient, url)).resolves.toBeUndefined();
  });

  it("does nothing when matched route has no prefetch", async () => {
    (matchRoute as Mock).mockReturnValue({ path: "/users/:id" });
    await expect(prefetchRouteData(queryClient, url)).resolves.toBeUndefined();
  });

  it("logs an error when prefetch throws", async () => {
    const error = new Error("boom");
    const throwingPrefetch = vi.fn(async () => {
      throw error;
    });
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    (matchRoute as Mock).mockReturnValue({ path: "/users/:id", prefetch: throwingPrefetch });
    (extractParameters as Mock).mockReturnValue({ id: "123" });

    await expect(prefetchRouteData(queryClient, url)).resolves.toBeUndefined();

    expect(throwingPrefetch).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining(`Prefetch error for ${url}:`),
      error,
    );

    consoleErrorSpy.mockRestore();
  });
});
