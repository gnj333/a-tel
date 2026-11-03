import { after, test } from "node:test";
import assert from "node:assert/strict";

const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
const values = new Map<string, string>();
let failKey: string | undefined;
Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      if (key === failKey) throw new Error("Storage full");
      values.set(key, value);
    },
    removeItem: (key: string) => values.delete(key),
  },
});
after(() => {
  if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
  else delete (globalThis as { localStorage?: unknown }).localStorage;
});

test("reset restores fixtures and both baskets, persists after reload and preserves unrelated keys", async () => {
  const { useMockStore } = await import("@/data/mock/store");
  const { useCartStore } = await import("@/features/cart/store");
  const { resetDemoData } = await import("@/features/demo/reset-demo");
  useMockStore.setState({ products: [], orders: [] });
  useCartStore.setState({
    items: [{ productId: "old", quantity: 5 }],
    savedItems: [{ productId: "old", quantity: 3 }],
  });
  values.set("other-application", "keep");
  values.set("akvatel-demo-checkout-form-v1", JSON.stringify({ name: "Черновик" }));
  resetDemoData();
  await useMockStore.persist.rehydrate();
  await useCartStore.persist.rehydrate();
  assert.equal(useMockStore.getState().products.length, 8);
  assert.equal(useMockStore.getState().products[0].price, 480);
  assert.equal(useMockStore.getState().orders.length, 48);
  assert.equal(new Set(useMockStore.getState().orders.map((order) => order.status)).size, 6);
  assert.deepEqual(useCartStore.getState().items, []);
  assert.deepEqual(useCartStore.getState().savedItems, []);
  assert.equal(values.get("other-application"), "keep");
  assert.equal(values.has("akvatel-demo-checkout-form-v1"), false);
});

test("a failed second reset write rolls back the catalog, orders, baskets and stored data", async () => {
  const { useMockStore } = await import("@/data/mock/store");
  const { useCartStore } = await import("@/features/cart/store");
  const { resetDemoData } = await import("@/features/demo/reset-demo");
  useMockStore.setState({ products: [], orders: [] });
  useCartStore.setState({
    items: [{ productId: "old", quantity: 5 }],
    savedItems: [{ productId: "old", quantity: 3 }],
  });
  values.set("akvatel-demo-checkout-form-v1", JSON.stringify({ street: "Тестовая" }));
  const before = new Map(values);
  failKey = "akvatel-demo-cart-v1";
  try {
    assert.throws(resetDemoData, /Storage full/);
  } finally {
    failKey = undefined;
  }
  assert.equal(useMockStore.getState().products.length, 0);
  assert.equal(useMockStore.getState().orders.length, 0);
  assert.deepEqual(useCartStore.getState().items, [{ productId: "old", quantity: 5 }]);
  assert.deepEqual(useCartStore.getState().savedItems, [{ productId: "old", quantity: 3 }]);
  assert.deepEqual(values, before);
});
