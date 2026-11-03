import { after, test } from "node:test";
import assert from "node:assert/strict";
import { products } from "@/data/mock/seed";
import { createDemoOrders } from "@/data/mock/demo-orders";
import { filterOrders, getAnalytics, dateKey, orderTotal } from "@/features/admin/admin-data";
import { productSchema, type ProductValues } from "@/features/admin/product-schema";
import { findPublishedProduct } from "@/features/product/product-data";

const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
const values = new Map<string, string>();
let failWrite = false;
Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      if (failWrite) throw new Error("Storage full");
      values.set(key, value);
    },
    removeItem: (key: string) => values.delete(key),
  },
});
after(() => {
  if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
  else delete (globalThis as { localStorage?: unknown }).localStorage;
});
const now = new Date("2026-10-28T09:30:00Z");
const fixtures = createDemoOrders(products, now);
const form: ProductValues = {
  name: "Демо-вода",
  slug: "demo-water",
  categoryId: "water",
  description: "Описание демонстрационного товара",
  price: 123.45,
  volumeLiters: 19,
  image: "/images/akvatel-19.jpg",
  status: "published",
};

test("analytics changes calendar period, excludes cancelled revenue, and includes checkout snapshots", () => {
  const week = getAnalytics(fixtures, 7, now);
  const month = getAnalytics(fixtures, 30, now);
  const quarter = getAnalytics(fixtures, 90, now);
  assert.ok(week.count < month.count && month.count < quarter.count);
  assert.equal(quarter.count, 48);
  assert.equal(
    quarter.revenue,
    fixtures
      .filter((order) => order.status !== "cancelled")
      .reduce((sum, order) => sum + orderTotal(order), 0),
  );
  assert.equal(week.series.length, 7);
  assert.equal(week.series.at(-1)?.date, "2026-10-28");
  assert.ok(quarter.popular[0].quantity >= quarter.popular[1].quantity);
  assert.equal(getAnalytics([], 7, now).average, 0);
});

test("order filters combine number, status and inclusive Tyumen calendar dates", () => {
  const order = { ...fixtures[0], createdAt: "2026-10-27T20:00:00Z" };
  assert.equal(dateKey(order.createdAt), "2026-10-28");
  assert.deepEqual(
    filterOrders([order], {
      query: "at-1048",
      status: "new",
      from: "2026-10-28",
      to: "2026-10-28",
    }),
    [order],
  );
  assert.equal(
    filterOrders([order], { query: "", status: "completed", from: "", to: "" }).length,
    0,
  );
  assert.equal(
    filterOrders([order], {
      query: "",
      status: "",
      from: "2026-10-29",
      to: "2026-10-28",
    }).length,
    0,
  );
});

test("product schema rejects invalid prices, slugs, volumes and executable images", () => {
  assert.ok(productSchema.safeParse(form).success);
  for (const change of [
    { price: 0 },
    { price: 1.001 },
    { slug: "Русский slug" },
    { volumeLiters: -1 },
    { image: "javascript:alert(1)" },
    { image: "/images/../secret.jpg" },
    { image: "data:image/svg+xml;base64,abcd" },
  ]) {
    assert.equal(productSchema.safeParse({ ...form, ...change }).success, false);
  }
});

test("admin create/edit/archive uses the public data and keeps historical snapshots after reload", async () => {
  const { useMockStore } = await import("@/data/mock/store");
  const { saveAdminProduct, archiveProduct } = await import("@/features/admin/admin-service");
  const { mockRepository } = await import("@/services/mock-repository");
  const product = await saveAdminProduct(form);
  assert.equal(findPublishedProduct(await mockRepository.listProducts(), form.slug)?.price, 123.45);
  await assert.rejects(saveAdminProduct(form), /slug/);
  await assert.rejects(
    saveAdminProduct({ ...form, slug: "new-slug", categoryId: "missing" }),
    /категорию/,
  );
  const snapshot = structuredClone(useMockStore.getState().orders);
  const edited = await saveAdminProduct(
    { ...form, slug: "updated-water", price: 555, volumeLiters: 5 },
    product.id,
  );
  assert.equal(edited.attributes["Объём"], "5 л");
  await archiveProduct(product.id);
  assert.equal(findPublishedProduct(useMockStore.getState().products, edited.slug), undefined);
  const persisted = values.get("akvatel-demo-data-v1")!;
  useMockStore.setState({ products: [], orders: [] });
  values.set("akvatel-demo-data-v1", persisted);
  await useMockStore.persist.rehydrate();
  assert.equal(
    useMockStore.getState().products.find((item) => item.id === product.id)?.status,
    "archived",
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(useMockStore.getState().orders)),
    JSON.parse(JSON.stringify(snapshot)),
  );
});

test("status history persists, ignores no-op updates and rolls back failed writes", async () => {
  const { useMockStore } = await import("@/data/mock/store");
  const { changeOrderStatus } = await import("@/features/admin/admin-service");
  const id = useMockStore.getState().orders[0].id;
  const before = useMockStore.getState().orders[0];
  await changeOrderStatus(id, "delivering", now);
  await changeOrderStatus(id, "delivering", now);
  const updated = useMockStore.getState().orders[0];
  assert.equal(updated.statusHistory.length, before.statusHistory.length + 1);
  assert.deepEqual(updated.statusHistory.at(-1), {
    status: "delivering",
    changedAt: now.toISOString(),
  });
  await useMockStore.persist.rehydrate();
  assert.equal(useMockStore.getState().orders[0].status, "delivering");
  failWrite = true;
  try {
    await assert.rejects(changeOrderStatus(id, "completed"), /Storage full/);
  } finally {
    failWrite = false;
  }
  assert.equal(useMockStore.getState().orders[0].status, "delivering");
  assert.equal(
    useMockStore.getState().orders[0].statusHistory.length,
    updated.statusHistory.length,
  );
});

test("a failed product save leaves the published catalog unchanged", async () => {
  const { useMockStore } = await import("@/data/mock/store");
  const { saveAdminProduct } = await import("@/features/admin/admin-service");
  const before = structuredClone(useMockStore.getState().products);
  failWrite = true;
  try {
    await assert.rejects(saveAdminProduct({ ...form, slug: "failed-water" }), /Storage full/);
  } finally {
    failWrite = false;
  }
  assert.deepEqual(useMockStore.getState().products, before);
});
