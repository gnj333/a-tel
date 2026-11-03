"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/domain/models";
import { CartAddButton } from "@/components/product/cart-add-button";
import { Price } from "@/components/shared/price";
import { QuantitySelector } from "@/components/shared/quantity-selector";
import { productTotal } from "./product-data";

interface ProductPurchaseProps {
  product: Product;
  inCart: number;
  onAdd: (product: Product, quantity: number) => number;
}

export function ProductPurchase({ product, inCart, onAdd }: ProductPurchaseProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(0);
  const [showSticky, setShowSticky] = useState(false);
  const purchase = useRef<HTMLDivElement>(null);
  const unit = product.saleUnit === "pack" ? "уп." : "шт.";
  const total = productTotal(product, quantity);

  useEffect(() => {
    const node = purchase.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting), {
      // The shop header occupies 104–120 px on mobile and tablet.
      rootMargin: "-120px 0px 0px 0px",
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function add() {
    const result = onAdd(product, quantity);
    setAdded(result);
    return result;
  }

  return (
    <>
      <div
        ref={purchase}
        id="product-purchase"
        className="scroll-mt-36 rounded-2xl border bg-surface p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <Price amount={product.price} className="text-3xl sm:text-4xl" />
          <span className="text-sm text-muted-foreground">
            {product.saleUnit === "pack" ? "за упаковку" : "за 1 шт."}
          </span>
        </div>
        {product.saleUnit === "pack" && (
          <p className="mt-2 text-sm text-muted-foreground">Количество выбирается в упаковках.</p>
        )}
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p id="product-quantity-label" className="mb-2 text-sm font-medium">
              Количество, {unit}
            </p>
            <QuantitySelector
              value={quantity}
              onChange={setQuantity}
              label={`Количество: ${product.name}`}
            />
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              Сумма за {quantity} {unit}
            </p>
            <Price amount={total} className="text-xl" />
          </div>
        </div>
        <CartAddButton
          onAdd={add}
          label="Добавить в корзину"
          accessibleLabel={`Добавить в корзину: ${product.name}`}
          className="mt-5 w-full"
        />
        <p aria-live="polite" aria-atomic="true" className="mt-3 text-xs text-muted-foreground">
          {inCart
            ? `В корзине: ${inCart} ${unit}`
            : "Выберите количество и добавьте товар в корзину"}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Без стоимости доставки
          {product.categoryId === "water" && product.volumeLiters === 19
            ? " и дополнительной тары"
            : ""}
          . Наличие уточняется при заказе.
        </p>
      </div>
      {added > 0 && (
        <div className="state-enter mt-4 rounded-xl border border-accent/25 bg-accent/5 p-4">
          <p role="status" className="text-sm font-medium">
            Добавлено: {added} {unit}
            {added < quantity ? " · достигнут лимит 99 единиц" : ""}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
            <Link
              href="/cart"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary"
            >
              Перейти в корзину
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              href="/catalog"
              className="inline-flex min-h-11 items-center text-sm text-muted-foreground underline underline-offset-4"
            >
              Продолжить покупки
            </Link>
          </div>
        </div>
      )}
      {showSticky && (
        <div
          aria-label="Быстрая покупка"
          className="purchase-bar fixed inset-x-0 bottom-0 z-20 border-t bg-white p-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_#1323370a] md:hidden"
        >
          <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
            <a href="#product-purchase" className="min-w-0 py-1">
              <span className="block text-xs text-muted-foreground">
                За {quantity} {unit} · изменить
              </span>
              <Price amount={total} className="text-base sm:text-xl" />
            </a>
            <CartAddButton
              onAdd={add}
              accessibleLabel={`Добавить в корзину: ${product.name}, ${quantity} ${unit}`}
            />
          </div>
        </div>
      )}
    </>
  );
}
