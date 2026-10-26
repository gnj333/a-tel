"use client";

import Link from "next/link";
import { InfoPage } from "@/components/store/info-page";
import { cartQuantity, useCartStore } from "@/features/cart/store";

export default function CartPage() {
  const count = useCartStore((state) => cartQuantity(state.items));
  return <InfoPage title="Корзина"><p>{count ? `В демонстрационной корзине товаров: ${count} шт.` : "Ваша корзина пока пуста."}</p><p>Состав корзины и оформление демонстрационного заказа появятся на этапе 6.</p><Link href="/catalog" className="inline-flex min-h-11 items-center text-primary underline underline-offset-4">Перейти в каталог</Link></InfoPage>;
}
