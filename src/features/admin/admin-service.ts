"use client";
import type { OrderStatus, Product } from "@/domain/models";
import { useMockStore, type MockState } from "@/data/mock/store";
import { hydrateMockData } from "@/services/mock-repository";
import { orderStatuses } from "./admin-data";
import { productSchema, type ProductValues } from "./product-schema";

// Zustand persist writes after updating memory; restore it if the storage write fails.
function commit(change: Partial<MockState>) {
  const before = useMockStore.getState();
  try {
    useMockStore.setState(change);
  } catch (error) {
    try {
      useMockStore.setState({
        products: before.products,
        orders: before.orders,
        categories: before.categories,
      });
    } catch {
      /* Memory was restored before persist retried. */
    }
    throw error;
  }
}
export async function saveAdminProduct(values: ProductValues, id?: string) {
  await hydrateMockData();
  const parsed = productSchema.parse(values);
  const state = useMockStore.getState();
  const previous = state.products.find((product) => product.id === id);
  if (id && !previous) throw new Error("Товар больше не существует");
  if (!state.categories.some((category) => category.id === parsed.categoryId))
    throw new Error("Выберите существующую категорию");
  if (state.products.some((product) => product.slug === parsed.slug && product.id !== id))
    throw new Error("Этот slug уже занят другим товаром");
  const volumeLiters = parsed.volumeLiters === "" ? undefined : parsed.volumeLiters;
  const attributes = { ...previous?.attributes };
  delete attributes["Объём"];
  delete attributes["Объём бутыли"];
  if (volumeLiters)
    attributes[previous?.saleUnit === "pack" ? "Объём бутыли" : "Объём"] = `${volumeLiters} л`;
  const product: Product = {
    ...previous,
    ...parsed,
    volumeLiters,
    id: previous?.id ?? crypto.randomUUID(),
    currency: "RUB",
    image: parsed.image || undefined,
    imageAlt: parsed.name,
    attributes,
    isDemo: true,
    source: undefined,
    images: previous?.image === parsed.image ? previous.images : undefined,
  };
  commit({
    products: previous
      ? state.products.map((item) => (item.id === product.id ? product : item))
      : [...state.products, product],
  });
  return product;
}
export async function archiveProduct(id: string) {
  await hydrateMockData();
  const products = useMockStore.getState().products;
  if (!products.some((product) => product.id === id)) throw new Error("Товар не найден");
  commit({
    products: products.map((product) =>
      product.id === id ? { ...product, status: "archived" } : product,
    ),
  });
}
export async function changeOrderStatus(id: string, status: OrderStatus, now = new Date()) {
  await hydrateMockData();
  if (!Object.hasOwn(orderStatuses, status)) throw new Error("Неизвестный статус");
  const orders = useMockStore.getState().orders;
  const order = orders.find((item) => item.id === id);
  if (!order) throw new Error("Заказ не найден");
  if (order.status === status) return;
  commit({
    orders: orders.map((item) =>
      item.id === id
        ? {
            ...item,
            status,
            statusHistory: [...item.statusHistory, { status, changedAt: now.toISOString() }],
          }
        : item,
    ),
  });
}
