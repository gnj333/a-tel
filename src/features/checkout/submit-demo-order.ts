"use client";

import { useMockStore } from "@/data/mock/store";
import { hydrateCartData, useCartStore } from "@/features/cart/store";
import { hydrateMockData, mockRepository } from "@/services/mock-repository";
import type { CheckoutValues } from "./checkout-schema";
import { createDemoOrder } from "./create-demo-order";

export async function submitDemoOrder(values: CheckoutValues) {
  await Promise.all([hydrateCartData(), hydrateMockData()]);
  const order = createDemoOrder(
    values,
    useCartStore.getState().items,
    useMockStore.getState().products,
    crypto.randomUUID(),
  );
  const previousOrders = useMockStore.getState().orders;
  try {
    await mockRepository.saveOrder(order);
  } catch (error) {
    // Persist updates memory before writing storage. Roll it back on a failed write
    // so retrying cannot leave a duplicate order in the in-memory repository.
    try {
      useMockStore.setState({ orders: previousOrders });
    } catch {
      /* Memory is restored even if storage is still unavailable. */
    }
    throw error;
  }
  let storageWarning = false;
  try {
    if (values.saveBasket) useCartStore.getState().saveForRepeat();
  } catch {
    storageWarning = true;
  }
  try {
    useCartStore.getState().clear();
  } catch {
    storageWarning = true;
  }
  return { order, storageWarning };
}
