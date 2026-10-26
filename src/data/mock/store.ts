"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Category, Order, Product } from "@/domain/models";
import { categories, products, orders } from "./seed";
export interface MockState { products: Product[]; categories: Category[]; orders: Order[] }
const initialState = (): MockState => structuredClone({ products, categories, orders });
interface MockStore extends MockState { upsertProduct: (product: Product) => void; addOrder: (order: Order) => void; reset: () => void }
export const useMockStore = create<MockStore>()(persist((set) => ({
  ...initialState(),
  upsertProduct: (product) => set((state) => ({ products: state.products.some((p) => p.id === product.id)
    ? state.products.map((p) => p.id === product.id ? product : p) : [...state.products, product] })),
  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
  reset: () => set(initialState()),
}), { name: "akvatel-demo-data-v1", version: 2, skipHydration: true, storage: createJSONStorage(() => localStorage),
  migrate: (persisted) => {
    const state = persisted as MockState;
    return { ...state, products: [...state.products, ...products.filter((product) => !state.products.some((saved) => saved.id === product.id))] };
  },
  partialize: ({ products, categories, orders }) => ({ products, categories, orders }) }));
