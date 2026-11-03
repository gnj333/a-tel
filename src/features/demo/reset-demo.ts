"use client";

import { useMockStore } from "@/data/mock/store";
import { useCartStore } from "@/features/cart/store";
import { CHECKOUT_FORM_STORAGE_KEY } from "@/features/checkout/checkout-form-storage";

// Reset only this prototype's stores. Keep other applications' local data intact.
export function resetDemoData() {
  const data = useMockStore.getState();
  const cart = useCartStore.getState();
  const keys = [
    useMockStore.persist.getOptions().name!,
    useCartStore.persist.getOptions().name!,
    CHECKOUT_FORM_STORAGE_KEY,
  ];
  const stored = keys.map((key) => localStorage.getItem(key));
  try {
    useMockStore.getState().reset();
    useCartStore.setState({ items: [], savedItems: [] });
    localStorage.removeItem(CHECKOUT_FORM_STORAGE_KEY);
  } catch (error) {
    // Persist changes memory before writing. Roll back both stores on failure.
    try {
      useMockStore.setState(data, true);
    } catch {
      /* Memory is restored. */
    }
    try {
      useCartStore.setState(cart, true);
    } catch {
      /* Memory is restored. */
    }
    keys.forEach((key, index) => {
      try {
        const value = stored[index];
        if (value === null) localStorage.removeItem(key);
        else localStorage.setItem(key, value);
      } catch {
        /* Storage may still be unavailable; the caller reports failure. */
      }
    });
    throw error;
  }
}
