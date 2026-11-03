"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Category, Order, Product } from "@/domain/models";
import { categories, products } from "./seed";
import { createDemoOrders } from "./demo-orders";
export interface MockState {
  products: Product[];
  categories: Category[];
  orders: Order[];
}
const initialState = (): MockState =>
  structuredClone({ products, categories, orders: createDemoOrders(products) });
interface MockStore extends MockState {
  upsertProduct: (product: Product) => void;
  addOrder: (order: Order) => void;
  reset: () => void;
}
export const useMockStore = create<MockStore>()(
  persist(
    (set) => ({
      ...initialState(),
      upsertProduct: (product) =>
        set((state) => ({
          products: state.products.some((p) => p.id === product.id)
            ? state.products.map((p) => (p.id === product.id ? product : p))
            : [...state.products, product],
        })),
      addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
      reset: () => set(initialState()),
    }),
    {
      name: "akvatel-demo-data-v1",
      version: 5,
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      migrate: (persisted) => {
        const state = persisted as MockState;
        return {
          ...state,
          orders: [
            ...state.orders.map((order) => ({
              ...order,
              ...(order.number?.startsWith("DEMO-") && {
                number: order.number.replace(/^DEMO-/, "AT-"),
              }),
              ...(order.customer && {
                customer: {
                  ...order.customer,
                  name: order.customer.name
                    .replace(/^Демо-покупатель /, "Покупатель ")
                    .replace(/^Демонстрационный покупатель$/, "Покупатель"),
                },
              }),
              ...(order.address && {
                address: {
                  ...order.address,
                  street:
                    order.address.street === "Демонстрационная улица"
                      ? "Лесная"
                      : order.address.street,
                  apartment: order.address.apartment === "Демо" ? "10" : order.address.apartment,
                },
              }),
              ...(/^(Демонстрационный заказ|Вымышленный заказ)/.test(order.comment ?? "") && {
                comment: undefined,
              }),
            })),
            ...createDemoOrders(products).filter(
              (order) => !state.orders.some((saved) => saved.id === order.id),
            ),
          ],
          products: [
            ...state.products,
            ...products.filter(
              (product) => !state.products.some((saved) => saved.id === product.id),
            ),
          ],
        };
      },
      partialize: ({ products, categories, orders }) => ({
        products,
        categories,
        orders,
      }),
    },
  ),
);
