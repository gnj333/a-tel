import type { OrderItem } from "@/domain/models";
export const formatPrice = (amount: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 2,
  }).format(amount);
export function itemsSubtotal(items: OrderItem[]): number {
  return (
    items.reduce((sum, item) => sum + Math.round(item.unitPrice * 100) * item.quantity, 0) / 100
  );
}
