import Link from "next/link";
import type { ReactNode } from "react";
import { Recycle, Truck } from "lucide-react";
import { Price } from "@/components/shared/price";
import type { ResolvedCart } from "./cart-data";

export function OrderSummary({
  cart,
  children,
  showItems = false,
}: {
  cart: ResolvedCart;
  children?: ReactNode;
  showItems?: boolean;
}) {
  return (
    <aside
      aria-labelledby="order-summary-title"
      className="min-w-0 rounded-2xl border bg-surface p-5 sm:p-6 lg:sticky lg:top-36"
    >
      <h2 id="order-summary-title" className="text-xl font-semibold">
        Ваш заказ
      </h2>
      {showItems && (
        <ul className="mt-5 space-y-3 border-b pb-5">
          {cart.lines.map(({ product, quantity, total }) => (
            <li key={product.id} className="flex items-start justify-between gap-3 text-sm">
              <div className="min-w-0">
                <span className="block break-words font-medium">{product.name}</span>
                <span className="text-muted-foreground">
                  {quantity} {product.saleUnit === "pack" ? "уп." : "шт."}
                </span>
              </div>
              <Price amount={total} className="shrink-0 text-sm" />
            </li>
          ))}
        </ul>
      )}
      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex flex-wrap justify-between gap-2">
          <dt className="text-muted-foreground">Товары · {cart.quantity} ед.</dt>
          <dd>
            <Price amount={cart.subtotal} />
          </dd>
        </div>
        <div className="flex flex-wrap justify-between gap-2">
          <dt className="text-muted-foreground">Доставка</dt>
          <dd>Уточняется</dd>
        </div>
        {cart.exchangeBottles > 0 && (
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="text-muted-foreground">Обменная тара</dt>
            <dd>{cart.exchangeBottles} шт.</dd>
          </div>
        )}
      </dl>
      <div aria-live="polite" aria-atomic="true" className="mt-5 border-t pt-5">
        <p className="text-sm font-medium">Предварительная сумма</p>
        <Price amount={cart.subtotal} className="mt-1 block text-3xl" />
        <p className="mt-2 text-xs text-muted-foreground">
          Сумма товаров. Доставка
          {cart.exchangeBottles > 0 ? " и возможная покупка обменной тары" : ""} не включены.
        </p>
      </div>
      {children && <div className="mt-6">{children}</div>}
      <div className="mt-6 space-y-4 border-t pt-5 text-xs text-muted-foreground">
        <p className="flex gap-2">
          <Truck size={17} className="shrink-0 text-primary" aria-hidden="true" />
          Стоимость и время доставки требуют согласования с компанией.
        </p>
        {cart.exchangeBottles > 0 && (
          <div className="flex gap-2">
            <Recycle size={17} className="shrink-0 text-primary" aria-hidden="true" />
            <p>
              Передайте пустые обменные бутыли при получении. Если их нет, тару приобретают
              отдельно.{" "}
              <Link
                href="/catalog?category=butyli"
                className="text-primary underline underline-offset-4"
              >
                Выбрать бутыль
              </Link>
              .
            </p>
          </div>
        )}
        <Link
          href="/delivery"
          className="inline-flex min-h-11 items-center text-primary underline underline-offset-4"
        >
          Доставка и оплата
        </Link>
      </div>
    </aside>
  );
}
