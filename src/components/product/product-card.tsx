"use client";
import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import type { Product } from "@/domain/models";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/shared/price";
import { QuantitySelector } from "@/components/shared/quantity-selector";
import { useState } from "react";
export function ProductCard({ product, onAdd, detailHref, actionLabel = "В корзину", showQuantity = false }: { product: Product; onAdd?: (product: Product, quantity: number) => void; detailHref?: string; actionLabel?: string; showQuantity?: boolean }) {
  const [quantity, setQuantity] = useState(1);
  return <article className="overflow-hidden rounded-2xl border bg-white"><div className="relative flex h-64 items-center justify-center bg-white p-6">{product.image ? <Image src={product.image} alt={product.imageAlt} fill sizes="(max-width: 640px) 100vw, 560px" className="object-contain p-6" /> : <Package size={48} className="text-muted-foreground" aria-label="Нет фотографии" />}</div><div className="space-y-4 p-6"><Badge>{product.volumeLiters ? `${product.volumeLiters} л` : "Оборудование"}</Badge><h3 className="text-xl font-semibold">{detailHref ? <Link className="hover:text-primary" href={detailHref}>{product.name}</Link> : product.name}</h3><p className="text-sm text-muted-foreground">{product.description}</p><Price amount={product.price} /><div className="flex flex-wrap items-center gap-3">{showQuantity && <QuantitySelector value={quantity} onChange={setQuantity} label={`Количество: ${product.name}`} />}{onAdd && <Button className="flex-1" disabled={product.status !== "published"} onClick={() => onAdd(product, quantity)}>{actionLabel}</Button>}</div></div></article>;
}
