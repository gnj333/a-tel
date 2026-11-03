"use client";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useMockStore } from "@/data/mock/store";
import type { Order, OrderStatus } from "@/domain/models";
import { Button } from "@/components/ui/button";
import { formatPrice, itemsSubtotal } from "@/lib/commerce";
import { AdminHeading, MissingRecord, StatusBadge } from "./admin-ui";
import { orderStatuses, formatDate, orderTotal, orderUnits } from "./admin-data";
import { changeOrderStatus } from "./admin-service";

export function OrderDetail({ id }: { id: string }) {
  const order = useMockStore((state) => state.orders.find((item) => item.id === id));
  if (!order) return <MissingRecord kind="order" />;
  return <OrderContent key={`${order.id}-${order.status}`} order={order} />;
}
function OrderContent({ order }: { order: Order }) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [saving, setSaving] = useState(false);
  const bottles = order.items.reduce(
    (sum, item) =>
      sum + (item.volumeLiters ? item.quantity * (item.saleUnit === "pack" ? 4 : 1) : 0),
    0,
  );
  const exchange = order.items.reduce(
    (sum, item) =>
      sum +
      (item.volumeLiters === 19 &&
      (item.categoryId === "water" || (!item.categoryId && item.productId.startsWith("water-")))
        ? item.quantity
        : 0),
    0,
  );
  async function saveStatus() {
    if (saving) return;
    setSaving(true);
    try {
      await changeOrderStatus(order.id, status);
      toast.success("Статус заказа сохранён");
    } catch {
      toast.error("Не удалось сохранить статус. Попробуйте ещё раз.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <>
      <AdminHeading
        title={`Заказ ${order.number}`}
        description={`Создан ${formatDate(order.createdAt, true)} · Время Тюмени`}
        action={
          <Button asChild variant="secondary">
            <Link href="/admin/orders">Все заказы</Link>
          </Button>
        }
      />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <section className="admin-panel overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b p-5">
              <h2 className="font-semibold">Состав заказа</h2>
              <span className="text-xs text-muted-foreground">
                {orderUnits(order)} ед. продажи · Бутылей: {bottles}
              </span>
            </div>
            <div className="divide-y">
              {order.items.map((item, index) => (
                <div
                  key={`${item.productId}-${index}`}
                  className="flex flex-wrap items-start justify-between gap-3 p-5"
                >
                  <div className="min-w-0">
                    <p className="break-words text-sm font-medium">{item.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.volumeLiters ? `${item.volumeLiters} л · ` : ""}
                      {item.saleUnit === "pack" ? "упаковка 4 шт. · " : ""}
                      {formatPrice(item.unitPrice)} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums">
                    {formatPrice(itemsSubtotal([item]))}
                  </p>
                </div>
              ))}
            </div>
            <dl className="space-y-3 border-t bg-surface/50 p-5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Товары</dt>
                <dd>{formatPrice(itemsSubtotal(order.items))}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Доставка</dt>
                <dd>
                  {order.deliveryFee === null ? "Не определена" : formatPrice(order.deliveryFee)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Обменная тара</dt>
                <dd>{exchange} шт.</dd>
              </div>
              <div className="flex justify-between gap-4 border-t pt-3 font-semibold">
                <dt>{order.deliveryFee === null ? "Предварительный итог" : "Итого"}</dt>
                <dd>{formatPrice(orderTotal(order))}</dd>
              </div>
            </dl>
          </section>
          <section className="admin-panel p-5 sm:p-6">
            <h2 className="mb-5 font-semibold">Покупатель и доставка</h2>
            <dl className="grid gap-5 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Имя</dt>
                <dd className="mt-1">{order.customer.name}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Телефон</dt>
                <dd className="mt-1">{order.customer.phone}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Адрес</dt>
                <dd className="mt-1">
                  {order.address.city}, {order.address.street}, д. {order.address.building}
                  {order.address.apartment && `, кв./офис ${order.address.apartment}`}
                  {order.address.entrance && `, подъезд ${order.address.entrance}`}
                  {order.address.floor && `, этаж ${order.address.floor}`}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Желаемая дата</dt>
                <dd className="mt-1">
                  {order.deliveryDate
                    ? formatDate(`${order.deliveryDate}T07:00:00Z`)
                    : "Не указана"}
                  {order.deliverySlot && ` · ${order.deliverySlot}`}
                  <span className="mt-1 block text-xs text-muted-foreground">
                    Доставка не согласована
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Способ оплаты</dt>
                <dd className="mt-1">
                  {order.paymentMethod === "cash"
                    ? "Наличные"
                    : order.paymentMethod === "card"
                      ? "Карта"
                      : "Не определён"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-muted-foreground">Комментарий</dt>
                <dd className="mt-1 whitespace-pre-wrap break-words">
                  {order.comment || "Без комментария"}
                </dd>
              </div>
            </dl>
          </section>
        </div>
        <aside className="space-y-6">
          <section className="admin-panel p-5">
            <div className="mb-5 flex items-center justify-between gap-2">
              <h2 className="font-semibold">Статус заказа</h2>
              <StatusBadge status={order.status} />
            </div>
            <label className="admin-label" htmlFor="order-status">
              Изменить статус
            </label>
            <select
              id="order-status"
              className="admin-select"
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              disabled={saving}
            >
              {Object.entries(orderStatuses).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <Button
              className="mt-4 w-full"
              disabled={saving || order.status === status}
              onClick={saveStatus}
            >
              {saving ? "Сохраняем…" : "Сохранить статус"}
            </Button>
          </section>
          <section className="admin-panel p-5">
            <h2 className="mb-5 font-semibold">История статусов</h2>
            <ol className="space-y-5">
              {[...order.statusHistory].reverse().map((entry, index) => (
                <li key={`${entry.changedAt}-${index}`} className="flex items-start gap-3">
                  <span
                    className="mt-1.5 size-2 shrink-0 rounded-full bg-border"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-medium">{orderStatuses[entry.status]}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(entry.changedAt, true)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </>
  );
}
