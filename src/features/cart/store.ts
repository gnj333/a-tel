"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartItem } from "@/domain/models";

interface CartState {
  items: CartItem[];
  savedItems: CartItem[];
  addItem: (productId: string, quantity: number) => number;
  saveForRepeat: () => void;
  repeatSaved: (availableIds: string[]) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
}

// Shared cart for the storefront, header and checkout.
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      savedItems: [],
      addItem: (productId, quantity) => {
        if (!productId || !Number.isSafeInteger(quantity) || quantity < 1) return 0;
        let added = 0;
        set((state) => {
          const previous = state.items.find((item) => item.productId === productId)?.quantity ?? 0;
          added = Math.max(0, Math.min(quantity, 99 - previous));
          if (!added) return state;
          return {
            items: [
              ...state.items.filter((item) => item.productId !== productId),
              {
                productId,
                quantity: previous + added,
              },
            ],
          };
        });
        return added;
      },
      saveForRepeat: () =>
        set((state) => ({ savedItems: state.items.map((item) => ({ ...item })) })),
      repeatSaved: (availableIds) =>
        set((state) => ({
          items: [
            ...state.items.filter(
              (item) =>
                !state.savedItems.some(
                  (saved) =>
                    saved.productId === item.productId && availableIds.includes(saved.productId),
                ),
            ),
            ...state.savedItems
              .filter((item) => availableIds.includes(item.productId))
              .map((item) => ({ ...item })),
          ],
        })),
      setQuantity: (productId, quantity) => {
        if (!productId || !Number.isSafeInteger(quantity) || quantity < 0) return;
        set((state) => ({
          items:
            quantity === 0
              ? state.items.filter((item) => item.productId !== productId)
              : state.items.some((item) => item.productId === productId)
                ? state.items.map((item) =>
                    item.productId === productId
                      ? { productId, quantity: Math.min(quantity, 99) }
                      : item,
                  )
                : [...state.items, { productId, quantity: Math.min(quantity, 99) }],
        }));
      },
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((item) => item.productId !== productId) })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "akvatel-demo-cart-v1",
      version: 1,
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ items, savedItems }) => ({ items, savedItems }),
    },
  ),
);

export const cartQuantity = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.quantity, 0);

// The header and home share one restore, including on client-side navigation.
let hydration: Promise<void> | undefined;
export function hydrateCartData() {
  hydration ??= Promise.resolve(useCartStore.persist.rehydrate());
  return hydration;
}
