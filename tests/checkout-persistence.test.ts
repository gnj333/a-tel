import { after, test } from "node:test";
import assert from "node:assert/strict";
import type { CheckoutValues } from "@/features/checkout/checkout-schema";

const storage = new Map<string, string>();
let failOrders = false;
const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => {
      if (failOrders && key === "akvatel-demo-data-v1") throw new Error("Storage unavailable");
      storage.set(key, value);
    },
    removeItem: (key: string) => storage.delete(key),
  },
});
after(() => {
  if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
  else delete (globalThis as { localStorage?: unknown }).localStorage;
});

const values: CheckoutValues = {
  name: "Тестовое имя",
  phone: "+7 (000) 123-45-67",
  street: "Тестовый адрес",
  building: "123",
  apartment: "456",
  comment: "Не сохранять этот текст",
  deliveryDate: "2099-01-01",
  saveBasket: false,
};

test("checkout persists one anonymous snapshot, clears the cart and only replaces the repeat basket with consent", async () => {
  const { useCartStore } = await import("@/features/cart/store");
  const { useMockStore } = await import("@/data/mock/store");
  const { submitDemoOrder } = await import("@/features/checkout/submit-demo-order");
  const { mockRepository } = await import("@/services/mock-repository");
  useMockStore.getState().reset();
  useMockStore.setState({ orders: [] });
  const items = [{ productId: "water-akvatel-19", quantity: 2 }];
  const savedItems = [{ productId: "pump-mr01", quantity: 1 }];
  useCartStore.setState({ items, savedItems });
  const result = await submitDemoOrder(values);
  assert.equal(result.storageWarning, false);
  assert.equal(result.order.items[0].quantity, 2);
  assert.equal((await mockRepository.listOrders()).length, 1);
  assert.deepEqual(useCartStore.getState().items, []);
  assert.deepEqual(useCartStore.getState().savedItems, savedItems);
  const persisted = storage.get("akvatel-demo-data-v1")!;
  assert.ok(!persisted.includes(values.name));
  assert.ok(!persisted.includes(values.street));
  assert.ok(!persisted.includes(values.comment));
  useMockStore.setState({ orders: [] });
  storage.set("akvatel-demo-data-v1", persisted);
  await useMockStore.persist.rehydrate();
  assert.equal(useMockStore.getState().orders[0].id, result.order.id);
  await assert.rejects(submitDemoOrder(values));
  assert.equal(useMockStore.getState().orders.length, 1);
  useCartStore.setState({ items });
  await submitDemoOrder({ ...values, saveBasket: true });
  assert.deepEqual(useCartStore.getState().savedItems, items);
  assert.deepEqual(useCartStore.getState().items, []);
  assert.equal(useMockStore.getState().orders.length, 2);
});

test("a failed order write preserves the cart, rolls back memory and can be retried without duplication", async () => {
  const { useCartStore } = await import("@/features/cart/store");
  const { useMockStore } = await import("@/data/mock/store");
  const { submitDemoOrder } = await import("@/features/checkout/submit-demo-order");
  const items = [{ productId: "water-akvatel-light-19", quantity: 1 }];
  useCartStore.setState({ items });
  const count = useMockStore.getState().orders.length;
  failOrders = true;
  try {
    await assert.rejects(submitDemoOrder(values), /Storage unavailable/);
  } finally {
    failOrders = false;
  }
  assert.equal(useMockStore.getState().orders.length, count);
  assert.deepEqual(useCartStore.getState().items, items);
  await submitDemoOrder(values);
  assert.equal(useMockStore.getState().orders.length, count + 1);
  assert.deepEqual(useCartStore.getState().items, []);
});
