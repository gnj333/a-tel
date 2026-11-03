import type { Order, OrderStatus } from "@/domain/models";
import { itemsSubtotal } from "@/lib/commerce";

export const orderStatuses: Record<OrderStatus, string> = {
  new: "Новый",
  confirmed: "Подтверждён",
  packing: "В сборке",
  delivering: "В доставке",
  completed: "Выполнен",
  cancelled: "Отменён",
};
export const orderTotal = (order: Order) => itemsSubtotal(order.items) + (order.deliveryFee ?? 0);
export const orderUnits = (order: Order) =>
  order.items.reduce((sum, item) => sum + item.quantity, 0);
export const dateKey = (date: string | Date) =>
  new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Yekaterinburg" }).format(new Date(date));
export const formatDate = (date: string, time = false) =>
  new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Asia/Yekaterinburg",
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(time ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(new Date(date));
export function filterOrders(
  orders: Order[],
  filters: { query: string; status: string; from: string; to: string },
) {
  return orders
    .filter(
      (order) =>
        (!filters.query ||
          order.number.toLowerCase().includes(filters.query.toLowerCase().trim())) &&
        (!filters.status || order.status === filters.status) &&
        (!filters.from || dateKey(order.createdAt) >= filters.from) &&
        (!filters.to || dateKey(order.createdAt) <= filters.to),
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export function getAnalytics(orders: Order[], days: number, now = new Date()) {
  const today = dateKey(now);
  // Midday UTC avoids midnight and timezone edge cases when constructing calendar days.
  const end = new Date(`${today}T07:00:00Z`);
  const series = Array.from({ length: days }, (_, i) => {
    const date = new Date(end);
    date.setUTCDate(date.getUTCDate() - days + 1 + i);
    const key = dateKey(date);
    return {
      date: key,
      label: new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "short",
        timeZone: "Asia/Yekaterinburg",
      }).format(date),
      revenue: 0,
      orders: 0,
    };
  });
  const rows = new Map(series.map((row) => [row.date, row]));
  const selected = orders.filter(
    (order) => rows.has(dateKey(order.createdAt)) && order.createdAt <= now.toISOString(),
  );
  const active = selected.filter((order) => order.status !== "cancelled");
  const popular = new Map<
    string,
    { id: string; name: string; quantity: number; revenue: number }
  >();
  for (const order of active) {
    const row = rows.get(dateKey(order.createdAt))!;
    row.revenue += orderTotal(order);
    for (const item of order.items) {
      const entry = popular.get(item.productId) ?? {
        id: item.productId,
        name: item.name,
        quantity: 0,
        revenue: 0,
      };
      entry.quantity += item.quantity;
      entry.revenue += itemsSubtotal([item]);
      popular.set(item.productId, entry);
    }
  }
  for (const order of selected) rows.get(dateKey(order.createdAt))!.orders++;
  const revenue = Math.round(active.reduce((sum, order) => sum + orderTotal(order), 0) * 100) / 100;
  return {
    series,
    revenue,
    count: selected.length,
    average: active.length ? revenue / active.length : 0,
    processing: active.filter((order) => order.status !== "completed").length,
    popular: [...popular.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 5),
  };
}

export const publicationLabels = {
  published: "Опубликован",
  draft: "Черновик",
  archived: "В архиве",
};
