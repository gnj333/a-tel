import Link from "next/link";
import type { Order } from "@/domain/models";
import { formatPrice } from "@/lib/commerce";
import { formatDate, orderTotal, orderUnits } from "./admin-data";
import { StatusBadge } from "./admin-ui";
import { EmptyState } from "@/components/shared/empty-state";

export function OrdersTable({ orders, compact = false }: { orders: Order[]; compact?: boolean }) {
  if (!orders.length)
    return (
      <div className="p-4">
        <EmptyState
          title="Заказов пока нет"
          description="Измените фильтры или оформите заказ в магазине."
        />
      </div>
    );
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="admin-table">
          <caption className="sr-only">{compact ? "Последние заказы" : "Все заказы"}</caption>
          <thead>
            <tr>
              <th>Заказ</th>
              <th>Покупатель</th>
              <th>Дата</th>
              {!compact && (
                <>
                  <th>Телефон</th>
                  <th>Единиц</th>
                </>
              )}
              <th className="text-right">Сумма</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {order.number}
                  </Link>
                </td>
                <td>{order.customer.name}</td>
                <td className="whitespace-nowrap text-muted-foreground">
                  {formatDate(order.createdAt)}
                </td>
                {!compact && (
                  <>
                    <td className="whitespace-nowrap text-muted-foreground">
                      {order.customer.phone}
                    </td>
                    <td>{orderUnits(order)}</td>
                  </>
                )}
                <td className="whitespace-nowrap text-right font-medium tabular-nums">
                  {formatPrice(orderTotal(order))}
                </td>
                <td>
                  <StatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="divide-y md:hidden">
        {orders.map((order) => (
          <article key={order.id} className="space-y-3 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Link
                href={`/admin/orders/${order.id}`}
                className="text-sm font-semibold text-primary"
              >
                {order.number}
              </Link>
              <StatusBadge status={order.status} />
            </div>
            <div className="flex justify-between gap-3 text-sm">
              <div>
                <p>{order.customer.name}</p>
                <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                {!compact && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {order.customer.phone} · {orderUnits(order)} ед.
                  </p>
                )}
              </div>
              <span className="shrink-0 font-medium tabular-nums">
                {formatPrice(orderTotal(order))}
              </span>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
