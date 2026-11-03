"use client";
import { productHref } from "@/lib/paths";

import { useEffect, useRef, useState } from "react";
import Image from "@/components/shared/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Bookmark, Package, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Container } from "@/components/shared/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Price } from "@/components/shared/price";
import { QuantitySelector } from "@/components/shared/quantity-selector";
import { Button } from "@/components/ui/button";
import { useCatalogData } from "@/features/catalog/use-catalog-data";
import { resolveCart } from "./cart-data";
import { useCartStore } from "./store";
import { OrderSummary } from "./order-summary";
import { CartEmpty, CartLoading } from "./cart-states";

export function CartPage() {
  const { ready, products, items } = useCatalogData();
  const cart = resolveCart(items, products);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const title = useRef<HTMLHeadingElement>(null);
  const productLinks = useRef(new Map<string, HTMLAnchorElement>());
  const pendingFocus = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (pendingFocus.current === undefined) return;
    const target = pendingFocus.current
      ? productLinks.current.get(pendingFocus.current)
      : title.current;
    (target ?? title.current)?.focus();
    pendingFocus.current = undefined;
  }, [items]);

  function remove(id: string) {
    const remaining = cart.lines.filter((line) => line.product.id !== id);
    const index = cart.lines.findIndex((line) => line.product.id === id);
    pendingFocus.current =
      remaining[Math.max(0, Math.min(index, remaining.length - 1))]?.product.id ?? null;
    removeItem(id);
    toast.success("Товар удалён из корзины");
  }

  return (
    <main id="main" tabIndex={-1}>
      <Container className="py-8 sm:py-12">
        <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Корзина" }]} />
        <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-primary">01 / Корзина</p>
            <h1
              ref={title}
              tabIndex={-1}
              className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Всё для вашего заказа
            </h1>
          </div>
          <Link
            href="/catalog"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary"
          >
            <ArrowLeft size={17} aria-hidden="true" />
            Продолжить покупки
          </Link>
        </div>
        {!ready ? (
          <CartLoading />
        ) : !items.length ? (
          <CartEmpty />
        ) : (
          <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
            <section aria-label="Товары в корзине" className="min-w-0">
              {cart.unavailable.length > 0 && (
                <div
                  role="alert"
                  className="mb-5 rounded-2xl border border-destructive/20 bg-destructive/5 p-5"
                >
                  <h2 className="font-semibold">Проверьте состав корзины</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Некоторые позиции недоступны или имеют некорректное количество. Удалите их,
                    чтобы продолжить.
                  </p>
                  <ul className="mt-3 divide-y">
                    {cart.unavailable.map((item) => (
                      <li
                        key={item.productId}
                        className="flex items-center justify-between gap-3 py-2"
                      >
                        <span className="min-w-0 break-words text-sm">{item.name}</span>
                        <Button
                          variant="ghost"
                          onClick={() => remove(item.productId)}
                          aria-label={`Удалить: ${item.name}`}
                          className="shrink-0 px-3"
                        >
                          <Trash2 size={18} aria-hidden="true" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <ul className="divide-y rounded-2xl border px-4 sm:px-6">
                {cart.lines.map(({ product, quantity, total }) => (
                  <li
                    key={product.id}
                    className="grid grid-cols-[72px_minmax(0,1fr)] gap-4 py-6 sm:grid-cols-[100px_minmax(0,1fr)] sm:gap-6"
                  >
                    <Link
                      ref={(node) => {
                        if (node) productLinks.current.set(product.id, node);
                        else productLinks.current.delete(product.id);
                      }}
                      href={productHref(product.slug)}
                      aria-label={`Открыть товар: ${product.name}`}
                      className="relative flex aspect-square items-center justify-center self-start rounded-xl bg-surface"
                    >
                      {product.image && !failedImages.includes(product.image) ? (
                        <Image
                          src={product.image}
                          alt={product.imageAlt || product.name}
                          onError={() =>
                            setFailedImages((previous) => [...previous, product.image!])
                          }
                          fill
                          sizes="(max-width: 639px) 72px, 100px"
                          className="object-contain p-2"
                        />
                      ) : (
                        <Package className="text-muted-foreground" aria-hidden="true" />
                      )}
                    </Link>
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            href={productHref(product.slug)}
                            className="break-words text-base font-semibold hover:text-primary sm:text-lg"
                          >
                            {product.name}
                          </Link>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {Object.entries(product.attributes)
                              .slice(0, 2)
                              .map(([label, value]) => `${label}: ${value}`)
                              .join(" · ")}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(product.id)}
                          aria-label={`Удалить: ${product.name}`}
                          className="-mr-2 -mt-2 flex size-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-surface hover:text-destructive"
                        >
                          <Trash2 size={18} aria-hidden="true" />
                        </button>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        <Price amount={product.price} className="font-normal" /> /{" "}
                        {product.saleUnit === "pack" ? "упаковка" : "шт."}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <QuantitySelector
                          value={quantity}
                          onChange={(value) => setQuantity(product.id, value)}
                          label={`Количество: ${product.name}`}
                        />
                        <Price amount={total} className="text-lg" />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs text-muted-foreground">
                Проверьте состав и количество товаров перед оформлением заказа.
              </p>
              {cart.canCheckout && (
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface p-5">
                  <div>
                    <h2 className="font-semibold">Заказываете то же самое?</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Сохраните состав — в следующий раз он будет на главной.
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    className="h-auto min-h-12 whitespace-normal"
                    onClick={() => {
                      useCartStore.getState().saveForRepeat();
                      toast.success("Текущая корзина сохранена для повторения");
                    }}
                  >
                    <Bookmark size={17} className="shrink-0" />
                    Сохранить набор из корзины
                  </Button>
                </div>
              )}
            </section>
            <OrderSummary cart={cart}>
              {cart.canCheckout ? (
                <Button asChild className="w-full">
                  <Link href="/checkout">
                    Перейти к оформлению
                    <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                </Button>
              ) : (
                <Button disabled className="w-full">
                  Проверьте состав корзины
                </Button>
              )}
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Оформление без регистрации
              </p>
            </OrderSummary>
          </div>
        )}
      </Container>
    </main>
  );
}
