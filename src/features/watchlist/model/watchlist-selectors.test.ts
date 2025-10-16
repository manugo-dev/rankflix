import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderHookWithProviders } from "@/tests/utilities";

import {
  useWatchlistAddItem,
  useWatchlistClear,
  useWatchlistCount,
  useWatchlistExists,
  useWatchlistItems,
  useWatchlistRemoveItem,
} from "./watchlist-selectors";
import { useWatchlistStore } from "./watchlist-store";
import type { WatchlistItem } from "./watchlist-types";

const DEFAULT_ITEM: WatchlistItem = {
  id: "1",
  posterUrl: "img.png",
  releaseDate: new Date("2024-01-01T00:00:00.000Z"),
  title: "Test Movie",
  type: "movie",
  uid: "movie:1",
};

describe("watchlist-selectors", () => {
  it("adds and lists items", async () => {
    useWatchlistStore.setState({ items: [] });
    const { result: addItemResult } = renderHookWithProviders(() => useWatchlistAddItem());
    const { result: itemsResult } = renderHookWithProviders(() => useWatchlistItems());
    await act(async () => {
      addItemResult.current(DEFAULT_ITEM);
    });
    expect(itemsResult.current).toHaveLength(1);
    expect(itemsResult.current[0]).toMatchObject({ title: "Test Movie", uid: DEFAULT_ITEM.uid });
  });

  it("removes items and updates count", async () => {
    useWatchlistStore.setState({ items: [] });
    const { result: addItemResult } = renderHookWithProviders(() => useWatchlistAddItem());
    const { result: removeItemResult } = renderHookWithProviders(() => useWatchlistRemoveItem());
    const { result: countResult } = renderHookWithProviders(() => useWatchlistCount());

    await act(async () => {
      addItemResult.current(DEFAULT_ITEM);
    });

    expect(countResult.current).toBe(1);
    await act(async () => {
      removeItemResult.current(DEFAULT_ITEM.uid);
    });
    expect(countResult.current).toBe(0);
  });

  it("clears items", async () => {
    useWatchlistStore.setState({ items: [] });

    const { result: addItemResult } = renderHookWithProviders(() => useWatchlistAddItem());
    const { result: clearResult } = renderHookWithProviders(() => useWatchlistClear());
    const { result: itemsResult } = renderHookWithProviders(() => useWatchlistItems());

    await act(async () => {
      addItemResult.current(DEFAULT_ITEM);
    });
    expect(itemsResult.current).toHaveLength(1);

    await act(async () => {
      clearResult.current();
    });
    expect(itemsResult.current).toHaveLength(0);
  });

  it("exists returns correct boolean", async () => {
    useWatchlistStore.setState({ items: [] });

    const { result: addItemResult } = renderHookWithProviders(() => useWatchlistAddItem());
    const { result: existsResultBefore } = renderHook(() => useWatchlistExists(DEFAULT_ITEM.uid));

    expect(existsResultBefore.current).toBe(false);
    await act(async () => {
      addItemResult.current(DEFAULT_ITEM);
    });
    const { result: existsResultAfter } = renderHook(() => useWatchlistExists(DEFAULT_ITEM.uid));
    expect(existsResultAfter.current).toBe(true);
  });
});
