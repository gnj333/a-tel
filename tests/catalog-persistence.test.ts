import { after, test } from "node:test";
import assert from "node:assert/strict";
import { categories, products } from "@/data/mock/seed";

let values = new Map<string, string>();

const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
after(() => {
  if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
  else delete (globalThis as { localStorage?: unknown }).localStorage;
});

test("stage 3 data gains catalog products without overwriting saved edits or orders", async () => {
  const savedProduct = {
    ...products[0],
    price: 555,
    status: "archived" as const,
  };
  const savedOrder = { id: "demo-order", isDemo: true };
  values = new Map([
    [
      "akvatel-demo-data-v1",
      JSON.stringify({
        version: 2,
        state: { products: [savedProduct], categories, orders: [savedOrder] },
      }),
    ],
  ]);
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    },
  });
  const { useMockStore } = await import("@/data/mock/store");
  await useMockStore.persist.rehydrate();
  const state = useMockStore.getState();
  assert.deepEqual(
    state.products.find((item) => item.id === savedProduct.id),
    savedProduct,
  );
  assert.equal(state.products.length, products.length);
  assert.deepEqual(
    state.orders.find((order) => order.id === savedOrder.id),
    savedOrder,
  );
  assert.equal(state.orders.length, 49);
  await useMockStore.persist.rehydrate();
  assert.equal(useMockStore.getState().orders.length, 49);
  assert.equal(JSON.parse(values.get("akvatel-demo-data-v1")!).version, 6);
});

test("version 4 orders lose old presentation labels without losing prices, statuses or edits", async () => {
  const { createDemoOrders } = await import("@/data/mock/demo-orders");
  const { useMockStore } = await import("@/data/mock/store");
  const original = createDemoOrders(products)[0];
  const legacy = {
    ...original,
    number: "DEMO-1048",
    customer: { ...original.customer, name: "Демо-покупатель 1" },
    address: { ...original.address, street: "Демонстрационная улица", apartment: "Демо" },
    comment: "Вымышленный заказ для демонстрации интерфейса. Не требует обработки.",
  };
  const custom = {
    ...original,
    id: "custom-order",
    number: "AT-CUSTOM",
    customer: { ...original.customer, name: "Алексей" },
    address: { ...original.address, street: "Садовая", apartment: "25" },
    comment: "Позвонить у подъезда",
  };
  values = new Map([
    [
      "akvatel-demo-data-v1",
      JSON.stringify({ version: 4, state: { products, categories, orders: [legacy, custom] } }),
    ],
  ]);
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    },
  });
  await useMockStore.persist.rehydrate();
  const migrated = useMockStore.getState().orders;
  const order = migrated.find((entry) => entry.id === legacy.id)!;
  assert.equal(order.number, "AT-1048");
  assert.doesNotMatch(JSON.stringify(order), /DEMO-|демо|вымышлен/i);
  assert.deepEqual(order.items, JSON.parse(JSON.stringify(legacy.items)));
  assert.deepEqual(order.statusHistory, legacy.statusHistory);
  assert.equal(order.createdAt, legacy.createdAt);
  assert.equal(order.status, legacy.status);
  assert.deepEqual(
    migrated.find((entry) => entry.id === custom.id),
    JSON.parse(JSON.stringify(custom)),
  );
  assert.equal(migrated.length, 49);
  await useMockStore.persist.rehydrate();
  assert.equal(JSON.stringify(useMockStore.getState().orders), JSON.stringify(migrated));
});
