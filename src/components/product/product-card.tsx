"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import type { Product } from "@/domain/models";
import { Badge } from "@/components/ui/badge";
import { CartAddButton } from "./cart-add-button";
import { Price } from "@/components/shared/price";
import { QuantitySelector } from "@/components/shared/quantity-selector";

interface ProductCardProps {
  product: Product;
  onAdd?: (product: Product, quantity: number) => number | void;
  detailHref?: string;
  actionLabel?: string;
  showQuantity?: boolean;
  inCartQuantity?: number;
  imageLoading?: "eager" | "lazy";
}

export function ProductCard({
  product,
  onAdd,
  detailHref,
  actionLabel = "В корзину",
  showQuantity = false,
  inCartQuantity,
  imageLoading = "lazy",
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [failed, setFailed] = useState(false);
  const unit = product.saleUnit === "pack" ? "уп." : "шт.";
  const photo =
    product.image && !failed ? (
      <Image
        src={product.image}
        alt={product.imageAlt || product.name}
        loading={imageLoading}
        fill
        sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) 45vw, (max-width: 1279px) 35vw, 380px"
        onError={() => setFailed(true)}
        className="object-contain p-6 transition-transform duration-200 motion-safe:group-hover:scale-105 motion-safe:group-focus-visible:scale-105"
      />
    ) : (
      <span className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
        <Package size={48} aria-hidden="true" />
        Фото недоступно
      </span>
    );

  return (
    <article
      aria-label={product.name}
      className="product-card flex h-full flex-col overflow-hidden rounded-2xl border bg-white"
    >
      {detailHref ? (
        <Link
          href={detailHref}
          aria-label={`Подробнее: ${product.name}`}
          className="group relative flex h-64 items-center justify-center bg-white p-6 focus-visible:-outline-offset-4"
        >
          {photo}
        </Link>
      ) : (
        <div className="relative flex h-64 items-center justify-center bg-white p-6">{photo}</div>
      )}
      <div className="flex flex-1 flex-col items-start p-6">
        <Badge>
          {product.volumeLiters
            ? `${product.volumeLiters} л`
            : (product.attributes["Тип"] ?? "Оборудование")}
        </Badge>
        <h3 className="mt-4 text-xl font-semibold">
          {detailHref ? (
            <Link className="hover:text-primary" href={detailHref}>
              {product.name}
            </Link>
          ) : (
            product.name
          )}
        </h3>
        <p className="mb-5 mt-2 text-sm text-muted-foreground">{product.description}</p>
        <div className="mt-auto flex flex-wrap items-baseline gap-2">
          <Price amount={product.price} />
          <span className="text-xs text-muted-foreground">
            {product.saleUnit === "pack" ? "за упаковку" : "за 1 шт."}
          </span>
        </div>
        <div className="mt-4 flex w-full flex-wrap items-center gap-3">
          {showQuantity && (
            <QuantitySelector
              value={quantity}
              onChange={setQuantity}
              label={`Количество: ${product.name}`}
            />
          )}
          {onAdd && (
            <CartAddButton
              className="flex-1"
              disabled={product.status !== "published"}
              label={actionLabel}
              feedbackLabel={actionLabel === "В корзину" ? "Добавлено" : "Готово"}
              accessibleLabel={`${actionLabel}: ${product.name}`}
              onAdd={() => onAdd(product, quantity)}
            />
          )}
        </div>
        {inCartQuantity !== undefined && (
          <p aria-live="polite" aria-atomic="true" className="mt-3 text-xs text-muted-foreground">
            {inCartQuantity
              ? `В корзине: ${inCartQuantity} ${unit}`
              : product.saleUnit === "pack"
                ? "Количество указано в упаковках"
                : "Выберите количество и добавьте в корзину"}
          </p>
        )}
      </div>
    </article>
  );
}
