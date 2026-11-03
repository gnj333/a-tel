"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/shared/price";
import { useMockStore } from "@/data/mock/store";
import { useCartStore } from "@/features/cart/store";
import { itemsSubtotal } from "@/lib/commerce";

export function RepeatOrder({ ready }: { ready: boolean }) {
  const router = useRouter();
  const products = useMockStore((state) => state.products);
  const savedItems = useCartStore((state) => state.savedItems);
  const available = products.filter((product) => product.status === "published");
  const saved = savedItems.flatMap((item) => {
    const product = available.find((product) => product.id === item.productId);
    return product ? [{ ...item, name: product.name, unitPrice: product.price }] : [];
  });

  if (!ready || !savedItems.length) return null;

  return (
    <section
      className="mt-7 rounded-2xl border bg-surface p-5 sm:p-6"
      aria-labelledby="repeat-title"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 id="repeat-title" className="flex items-center gap-2 text-xl font-semibold">
            <RotateCcw size={21} className="text-primary" aria-hidden="true" />
            Ваш сохранённый набор
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Повторите выбор по текущим ценам.</p>
        </div>
        {!!saved.length && <Price amount={itemsSubtotal(saved)} />}
      </div>
      <ul className="mt-3 divide-y text-sm">
        {savedItems.map((item) => {
          const product = products.find((product) => product.id === item.productId);
          const published = product?.status === "published";
          return (
            <li key={item.productId} className="flex items-start justify-between gap-4 py-2">
              <span className="min-w-0 break-words">
                {product?.name ?? "Товар недоступен"}
                {!published && (
                  <span className="ml-2 text-muted-foreground">· сейчас недоступен</span>
                )}
              </span>
              <span className="shrink-0 text-muted-foreground">
                {item.quantity} {product?.saleUnit === "pack" ? "уп." : "шт."}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        <Button
          disabled={!saved.length}
          onClick={() => {
            useCartStore.getState().repeatSaved(available.map((product) => product.id));
            toast.success("Сохранённый набор восстановлен в корзине", {
              action: { label: "В корзину", onClick: () => router.push("/cart") },
            });
          }}
        >
          Повторить набор <ArrowRight size={17} />
        </Button>
        <Link
          href="/cart"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary"
        >
          Изменить в корзине <ArrowRight size={16} />
        </Link>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        {saved.length < savedItems.length ? "Недоступные товары не добавятся. " : ""}Количество
        позиций набора восстановится, остальные товары останутся в корзине. Тара и доставка
        учитываются отдельно.
      </p>
    </section>
  );
}
