import { test } from "node:test";
import assert from "node:assert/strict";

test("cart quantities drive the badge and survive a persisted reload", async () => {
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  } });
  const { useCartStore, cartQuantity } = await import("../src/features/cart/store");
  const cart = useCartStore.getState();
  cart.setQuantity("water", 2);
  cart.setQuantity("pump", 1);
  assert.equal(cartQuantity(useCartStore.getState().items), 3);
  cart.setQuantity("water", 4);
  assert.equal(cartQuantity(useCartStore.getState().items), 5);
  cart.setQuantity("pump", 0);
  cart.setQuantity("water", -1);
  cart.setQuantity("water", 1.5);
  assert.deepEqual(useCartStore.getState().items, [{ productId: "water", quantity: 4 }]);
  const saved = values.get("akvatel-demo-cart-v1")!;
  useCartStore.setState({ items: [] });
  values.set("akvatel-demo-cart-v1", saved);
  await useCartStore.persist.rehydrate();
  assert.equal(cartQuantity(useCartStore.getState().items), 4);
  cart.setQuantity("water", 0);
  assert.equal(cartQuantity(useCartStore.getState().items), 0);
  delete (globalThis as { localStorage?: unknown }).localStorage;
});

test("saved basket persists independently and repeats only available products", async () => {
  const { useCartStore } = await import("../src/features/cart/store");
  useCartStore.setState({ items: [], savedItems: [] });
  const cart = useCartStore.getState();
  cart.addItem("water", 2);
  cart.addItem("water", 1);
  cart.addItem("archived", 1);
  cart.addItem("water", -1);
  cart.saveForRepeat();
  cart.setQuantity("water", 8);
  cart.setQuantity("archived", 0);
  cart.addItem("pump", 1);
  assert.deepEqual(useCartStore.getState().savedItems, [{ productId: "water", quantity: 3 }, { productId: "archived", quantity: 1 }]);
  cart.repeatSaved(["water", "pump"]);
  assert.deepEqual(useCartStore.getState().items, [{ productId: "pump", quantity: 1 }, { productId: "water", quantity: 3 }]);
  cart.repeatSaved(["water", "pump"]);
  assert.equal(useCartStore.getState().items.find((item) => item.productId === "water")?.quantity, 3);
  cart.addItem("water", 100);
  assert.equal(useCartStore.getState().items.find((item) => item.productId === "water")?.quantity, 99);
});
