"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { Order } from "@/domain/models";
import { itemsSubtotal } from "@/lib/commerce";
import { Price } from "@/components/shared/price";
import { Button } from "@/components/ui/button";

export function OrderSuccess({ order, storageWarning }: { order: Order; storageWarning: boolean }) {
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    title.current?.focus();
  }, []);
  return (
    <section className="mx-auto mt-8 max-w-3xl rounded-2xl border p-5 sm:p-10">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
        <Check size={32} aria-hidden="true" />
      </div>
      <p className="mt-6 text-sm font-semibold text-primary">{order.number}</p>
      <h1
        ref={title}
        tabIndex={-1}
        className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl"
      >
        Заказ оформлен
      </h1>
      <p className="mt-4 text-muted-foreground">
        Спасибо за ваш выбор! Ниже — состав заказа и выбранная дата доставки.
      </p>
      <div className="mt-6 rounded-xl bg-surface p-5">
        <h2 className="font-semibold">Состав заказа</h2>
        <ul className="mt-3 space-y-3">
          {order.items.map((item) => (
            <li
              key={item.productId}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm"
            >
              <span className="min-w-0 break-words">
                {item.name} · {item.quantity} {item.saleUnit === "pack" ? "уп." : "шт."}
              </span>
              <Price amount={(Math.round(item.unitPrice * 100) * item.quantity) / 100} />
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap items-baseline justify-between gap-3 border-t pt-4">
          <span className="text-sm">Предварительная сумма</span>
          <Price amount={itemsSubtotal(order.items)} className="text-2xl" />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Только товары, без доставки и возможной дополнительной тары.
        </p>
      </div>
      <p className="mt-5 text-sm text-muted-foreground">
        Желаемая дата: {order.deliveryDate?.split("-").reverse().join(".")}. Дата и интервал не
        подтверждены.
      </p>
      {storageWarning && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          Заказ сохранён, но не удалось обновить корзину. Проверьте её состав перед следующей
          покупкой.
        </p>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/catalog">
            Продолжить покупки
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/">На главную</Link>
        </Button>
      </div>
    </section>
  );
}
