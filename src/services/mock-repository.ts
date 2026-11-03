"use client";
import { useMockStore } from "@/data/mock/store";
import type { ShopRepository } from "./repository";
// Rehydrate once before reads. Client components use the same Zustand store for subscriptions.
let hydration: Promise<void> | undefined;
export function hydrateMockData() {
  if (!hydration) {
    hydration = Promise.resolve(useMockStore.persist.rehydrate());
    if (typeof window !== "undefined") {
      window.addEventListener("storage", (event) => {
        if (
          event.storageArea === localStorage &&
          (event.key === useMockStore.persist.getOptions().name || event.key === null)
        ) {
          void useMockStore.persist.rehydrate();
        }
      });
    }
  }
  return hydration;
}
export const mockRepository: ShopRepository = {
  async listProducts() {
    await hydrateMockData();
    return structuredClone(useMockStore.getState().products);
  },
  async listCategories() {
    await hydrateMockData();
    return structuredClone(useMockStore.getState().categories);
  },
  async listOrders() {
    await hydrateMockData();
    return structuredClone(useMockStore.getState().orders);
  },
  async saveProduct(product) {
    await hydrateMockData();
    useMockStore.getState().upsertProduct(structuredClone(product));
  },
  async saveOrder(order) {
    await hydrateMockData();
    useMockStore.getState().addOrder(structuredClone(order));
  },
};
