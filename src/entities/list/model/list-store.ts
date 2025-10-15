/* eslint-disable sonarjs/no-nested-functions */
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { List, ListItem, ListStore } from "./list-types";

export const createListStore = <ItemData>(
  initialData: Omit<List<ItemData>, "createdAt" | "items" | "updatedAt">,
) => {
  const now = new Date();

  return create<ListStore<ItemData>>()(
    persist(
      (set, get) => ({
        ...initialData,
        addItem: (item) =>
          set((state) => {
            const exists = state.items.some((index) => index.uid === item.uid);

            if (exists) {
              console.warn(
                `Item with list:uid ${item.uid} already exists in the list. No update performed.`,
              );
              return state;
            }

            return {
              items: [...state.items, { ...item, createdAt: new Date(), updatedAt: new Date() }],
              updatedAt: new Date(),
            };
          }),

        clearItems: () =>
          set({
            items: [],
            updatedAt: new Date(),
          }),

        createdAt: now,
        hasItem: (itemId) => get().items.some((item) => item.uid === itemId),

        items: [],

        patchItem: (itemId: string, newData: Partial<ListItem<ItemData>>) =>
          set((state) => {
            const itemIndex = state.items.findIndex((item) => item.uid === itemId);

            if (itemIndex === -1) {
              console.warn(
                `Item with id ${itemId} does not exist in the list. No update performed.`,
              );
              return state;
            }

            const updatedItems = [...state.items];
            updatedItems[itemIndex] = {
              ...updatedItems[itemIndex],
              ...newData,
              updatedAt: new Date(),
            };

            return {
              items: updatedItems,
              updatedAt: new Date(),
            };
          }),

        removeItem: (itemId) =>
          set((state) => ({
            items: state.items.filter((item) => item.uid !== itemId),
            updatedAt: new Date(),
          })),

        updatedAt: now,

        updateItem: (itemId: string, newItem: ListItem<ItemData>) =>
          set((state) => {
            const itemIndex = state.items.findIndex((item) => item.uid === itemId);

            if (itemIndex === -1) return state;

            const updatedItems = [...state.items];
            updatedItems[itemIndex] = {
              createdAt: updatedItems[itemIndex].createdAt,
              updatedAt: new Date(),
              ...newItem,
            };

            return {
              items: updatedItems,
              updatedAt: new Date(),
            };
          }),
      }),
      {
        name: `list-${initialData.id}`,
      },
    ),
  );
};
