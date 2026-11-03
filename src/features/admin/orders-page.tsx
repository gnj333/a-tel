"use client";
import { useState } from "react";
import { useMockStore } from "@/data/mock/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminHeading } from "./admin-ui";
import { filterOrders, orderStatuses } from "./admin-data";
import { OrdersTable } from "./orders-table";

export function OrdersPage() {
  const orders = useMockStore((state) => state.orders);
  const [filters, setFilters] = useState({
    query: "",
    status: "",
    from: "",
    to: "",
  });
  const filtered = filterOrders(orders, filters);
  const invalidDates = !!filters.from && !!filters.to && filters.from > filters.to;
  return (
    <>
      <AdminHeading
        title="Заказы"
        description="Заказы покупателей, статусы и информация о доставке."
      />
      <section className="admin-panel">
        <div className="grid gap-3 border-b p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-4">
          <label className="admin-filter-label">
            Номер заказа
            <Input
              className="mt-1 h-11 text-sm"
              placeholder="AT-…"
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            />
          </label>
          <label className="admin-filter-label">
            Статус
            <select
              className="admin-select mt-1"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">Все статусы</option>
              {Object.entries(orderStatuses).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-filter-label">
            Создан с
            <Input
              type="date"
              className="mt-1 h-11 text-sm"
              value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
              aria-invalid={invalidDates}
            />
          </label>
          <label className="admin-filter-label">
            Создан по
            <Input
              type="date"
              className="mt-1 h-11 text-sm"
              value={filters.to}
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
              aria-invalid={invalidDates}
            />
          </label>
        </div>
        {invalidDates && (
          <p role="alert" className="px-5 pt-4 text-sm text-destructive">
            Дата начала должна быть не позже даты окончания.
          </p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-2">
          <p role="status" className="text-xs text-muted-foreground">
            Найдено: {filtered.length} · Даты по времени Тюмени
          </p>
          <Button
            variant="ghost"
            className="min-h-10 px-2 text-xs"
            onClick={() => setFilters({ query: "", status: "", from: "", to: "" })}
          >
            Сбросить фильтры
          </Button>
        </div>
        <OrdersTable orders={filtered} />
        <p className="border-t px-5 py-3 text-xs text-muted-foreground">
          Указано количество единиц продажи. Сумма предварительная, если доставка не определена.
        </p>
      </section>
    </>
  );
}
