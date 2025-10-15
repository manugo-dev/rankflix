import { beforeEach, describe, expect, it, vi } from "vitest";

import { createListStore } from "./list-store";

type ItemData = { title: string };

const LIST_ID = "test-list";

describe("createListStore", () => {
  beforeEach(() => {
    try {
      localStorage.removeItem(`list-${LIST_ID}`);
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  });

  it("initializes with provided metadata and empty items", () => {
    const store = createListStore<ItemData>({ description: "desc", id: LIST_ID, name: "My List" });
    const state = store.getState();
    expect(state.id).toBe(LIST_ID);
    expect(state.name).toBe("My List");
    expect(state.description).toBe("desc");
    expect(Array.isArray(state.items)).toBe(true);
    expect(state.items.length).toBe(0);
    expect(state.createdAt).toBeInstanceOf(Date);
    expect(state.updatedAt).toBeInstanceOf(Date);
  });

  it("adds an item, prevents duplicates, and reports via hasItem", () => {
    const store = createListStore<ItemData>({ id: LIST_ID, name: "L" });

    const item = { title: "First", uid: "1" };
    store.getState().addItem(item);
    let state = store.getState();
    expect(state.items.length).toBe(1);
    expect(state.items[0].uid).toBe("1");
    expect(state.hasItem("1")).toBe(true);
    const createdAt = state.items[0].createdAt;

    // Duplicate add should not change items and should warn
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    store.getState().addItem(item);
    expect(warn).toHaveBeenCalled();

    state = store.getState();
    expect(state.items.length).toBe(1);
    expect(state.items[0].createdAt).toStrictEqual(createdAt);
  });

  it("updates an existing item with updateItem preserving createdAt", () => {
    const store = createListStore<ItemData>({ id: LIST_ID, name: "L" });

    store.getState().addItem({ title: "Old", uid: "2" });
    const before = store.getState().items[0];

    store.getState().updateItem("2", { title: "Updated", uid: "2" });
    const after = store.getState().items.find((index) => index.uid === "2");
    expect(after).toBeDefined();
    expect(after!.title).toBe("Updated");
    expect(after!.createdAt).toStrictEqual(before.createdAt);
    expect(after!.updatedAt).toBeInstanceOf(Date);
  });

  it("patchItem modifies only provided fields and warns when id missing", () => {
    const store = createListStore<ItemData>({ id: LIST_ID, name: "L" });

    store.getState().addItem({ title: "T", uid: "3" });
    const before = store.getState().items[0];

    store.getState().patchItem("3", { title: "Patched", uid: "3" });
    const patched = store.getState().items.find((index) => index.uid === "3");
    expect(patched).toBeDefined();
    expect(patched!.title).toBe("Patched");
    expect(patched!.createdAt).toStrictEqual(before.createdAt);

    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    // patch non-existing id
    store.getState().patchItem("nope", { title: "X", uid: "nope" });
    expect(warn).toHaveBeenCalled();
  });

  it("removes items and clearItems empties the list", () => {
    const store = createListStore<ItemData>({ id: LIST_ID, name: "L" });

    store.getState().addItem({ title: "A", uid: "4" });
    store.getState().addItem({ title: "B", uid: "5" });
    expect(store.getState().items.length).toBe(2);

    store.getState().removeItem("4");
    expect(store.getState().hasItem("4")).toBe(false);
    expect(store.getState().items.length).toBe(1);

    store.getState().clearItems();
    expect(store.getState().items.length).toBe(0);
  });
});
