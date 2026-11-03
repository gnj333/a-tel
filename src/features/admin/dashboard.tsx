"use client";
import { adminProductHref } from "@/lib/paths";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Banknote, ShoppingBag, ReceiptText, Clock3 } from "lucide-react";
import {
  CartesianGrid,
  ComposedChart,
  Line,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMockStore } from "@/data/mock/store";
import { formatPrice } from "@/lib/commerce";
import { AdminHeading } from "./admin-ui";
import { getAnalytics } from "./admin-data";
import { OrdersTable } from "./orders-table";
import { EmptyState } from "@/components/shared/empty-state";

export function Dashboard() {
  const orders = useMockStore((state) => state.orders);
  const [days, setDays] = useState(7);
  const analytics = getAnalytics(orders, days);
  const latest = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const metrics = [
    {
      label: "Выручка",
      value: formatPrice(analytics.revenue),
      icon: Banknote,
      note: "Без отменённых заказов",
    },
    {
      label: "Заказы",
      value: analytics.count,
      icon: ShoppingBag,
      note: "За выбранный период",
    },
    {
      label: "Средний чек",
      value: formatPrice(Math.round(analytics.average)),
      icon: ReceiptText,
      note: "Без отменённых заказов",
    },
    {
      label: "В обработке",
      value: analytics.processing,
      icon: Clock3,
      note: "Активные за выбранный период",
    },
  ];
  return (
    <>
      <AdminHeading
        title="Обзор магазина"
        description="Продажи, заказы и популярные товары за выбранный период."
        action={
          <div
            className="flex rounded-xl border bg-white p-1"
            role="group"
            aria-label="Период аналитики"
          >
            {[7, 30, 90].map((period) => (
              <button
                key={period}
                onClick={() => setDays(period)}
                aria-pressed={days === period}
                className={`min-h-10 rounded-lg px-3 text-sm font-medium sm:px-4 ${days === period ? "bg-foreground text-white" : "text-muted-foreground hover:bg-surface"}`}
              >
                {period} дней
              </button>
            ))}
          </div>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon, note }) => (
          <section key={label} className="admin-panel p-5">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <h2>{label}</h2>
              <Icon size={18} aria-hidden="true" />
            </div>
            <p className="my-3 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
            <p className="text-xs text-muted-foreground">{note}</p>
          </section>
        ))}
      </div>
      <section className="admin-panel my-6 p-4 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Динамика продаж</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Сумма заказов, включая невыполненные. Доставка без тарифа не учтена.
            </p>
          </div>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-2">
              <i className="size-2 rounded-full bg-primary" />
              Выручка, ₽
            </span>
            <span className="flex items-center gap-2">
              <i className="size-2 rounded-full bg-accent" />
              Заказы
            </span>
          </div>
        </div>
        <div
          className="h-[300px] min-w-0"
          role="img"
          aria-label={`За ${days} дней: ${analytics.count} заказов, сумма ${formatPrice(analytics.revenue)}. Подробные значения доступны в таблице под графиком.`}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            initialDimension={{ width: 700, height: 300 }}
          >
            <ComposedChart
              data={analytics.series}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
              accessibilityLayer
            >
              <defs>
                <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#087be8" stopOpacity={0.14} />
                  <stop offset="100%" stopColor="#087be8" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e3ebf2" vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                minTickGap={40}
                tick={{ fontSize: 11, fill: "#586b7d" }}
                tickMargin={12}
              />
              <YAxis
                yAxisId="revenue"
                width={48}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#586b7d" }}
                tickFormatter={(value: number) => (value >= 1000 ? `${value / 1000}к` : `${value}`)}
              />
              <YAxis
                yAxisId="orders"
                orientation="right"
                width={28}
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#586b7d" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e3ebf2",
                  fontSize: 12,
                }}
              />
              <Area
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                name="Выручка, ₽"
                stroke="#087be8"
                strokeWidth={2}
                fill="url(#revenue-fill)"
                isAnimationActive={false}
              />
              <Line
                yAxisId="orders"
                dataKey="orders"
                name="Заказы"
                stroke="#087d69"
                strokeWidth={2}
                dot={false}
                strokeDasharray="4 4"
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <details className="mt-4 text-xs text-muted-foreground">
          <summary className="w-fit cursor-pointer py-2">Данные графика таблицей</summary>
          <div className="max-h-64 overflow-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Заказы</th>
                  <th>Выручка</th>
                </tr>
              </thead>
              <tbody>
                {analytics.series.map((row) => (
                  <tr key={row.date}>
                    <td>{row.label}</td>
                    <td>{row.orders}</td>
                    <td>{formatPrice(row.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </section>
      <div className="grid items-start gap-6 2xl:grid-cols-[1fr_330px]">
        <section className="admin-panel min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
            <h2 className="font-semibold">Последние заказы</h2>
            <Link
              className="flex min-h-8 items-center gap-2 text-sm text-primary"
              href="/admin/orders"
            >
              Все заказы
              <ArrowRight size={15} />
            </Link>
          </div>
          <OrdersTable orders={latest} compact />
          <p className="border-t px-5 py-3 text-xs text-muted-foreground">
            Суммы предварительные, если стоимость доставки не определена.
          </p>
        </section>
        <section className="admin-panel p-5">
          <h2 className="font-semibold">Популярные товары</h2>
          <p className="mt-1 text-xs text-muted-foreground">По количеству за выбранный период</p>
          {analytics.popular.length ? (
            <ol className="mt-5 space-y-5">
              {analytics.popular.map((product, index) => (
                <li key={product.id} className="flex items-start gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-surface text-xs text-muted-foreground">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link
                      className="text-sm font-medium hover:text-primary"
                      href={adminProductHref(product.id)}
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {product.quantity} ед. · {formatPrice(product.revenue)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="mt-5">
              <EmptyState title="Нет продаж" description="Выберите другой период." />
            </div>
          )}
        </section>
      </div>
    </>
  );
}
