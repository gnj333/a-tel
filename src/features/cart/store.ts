"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartItem } from "@/domain/models";

interface CartState {
  items: CartItem[];
  savedItems: CartItem[];
  addItem: (productId: string, quantity: number) => void;
  saveForRepeat: () => void;
  repeatSaved: (availableIds: string[]) => void;
  setQuantity: (productId: string, quantity: number) => void;
}

// Shared foundation for the header now and the purchasing flow in stage 6.
export const useCartStore = create<CartState>()(persist((set) => ({
  items: [],
  savedItems: [],
  addItem: (productId, quantity) => {
    if (!productId || !Number.isSafeInteger(quantity) || quantity < 1) return;
    set((state) => ({ items: [...state.items.filter((item) => item.productId !== productId), {
      productId, quantity: Math.min(99, (state.items.find((item) => item.productId === productId)?.quantity ?? 0) + quantity),
    }] }));
  },
  saveForRepeat: () => set((state) => ({ savedItems: state.items.map((item) => ({ ...item })) })),
  repeatSaved: (availableIds) => set((state) => ({
    items: [...state.items.filter((item) => !state.savedItems.some((saved) => saved.productId === item.productId && availableIds.includes(saved.productId))),
      ...state.savedItems.filter((item) => availableIds.includes(item.productId)).map((item) => ({ ...item }))],
  })),
  setQuantity: (productId, quantity) => {
    if (!productId || !Number.isSafeInteger(quantity) || quantity < 0) return;
    set((state) => ({
      items: [...state.items.filter((item) => item.productId !== productId),
        ...(quantity > 0 ? [{ productId, quantity }] : [])],
    }));
  },
}), {
  name: "akvatel-demo-cart-v1",
  version: 1,
  skipHydration: true,
  storage: createJSONStorage(() => localStorage),
  partialize: ({ items, savedItems }) => ({ items, savedItems }),
}));

export const cartQuantity = (items: CartItem[]) => items.reduce((sum, item) => sum + item.quantity, 0);
