import type { ReactNode } from "react";
import Link from "next/link";
import type { OrderStatus } from "@/domain/models";
import { orderStatuses } from "./admin-data";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
const statusStyles: Record<OrderStatus, string> = {
  new: "bg-blue-50 text-blue-700",
  confirmed: "bg-indigo-50 text-indigo-700",
  packing: "bg-amber-50 text-amber-800",
  delivering: "bg-cyan-50 text-cyan-800",
  completed: "bg-emerald-50 text-emerald-800",
  cancelled: "bg-slate-100 text-slate-600",
};
export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {orderStatuses[status]}
    </span>
  );
}
export function AdminHeading({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-[30px]">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}
export function MissingRecord({ kind }: { kind: "product" | "order" }) {
  return (
    <EmptyState
      headingLevel="h1"
      title={kind === "product" ? "Товар не найден" : "Заказ не найден"}
      description="Запись не найдена. Возможно, она была удалена или ссылка изменилась."
      action={
        <Button asChild>
          <Link href={`/admin/${kind === "product" ? "products" : "orders"}`}>
            Вернуться к списку
          </Link>
        </Button>
      }
    />
  );
}
