"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Bookmark, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Price } from "@/components/shared/price";
import { useMockStore } from "@/data/mock/store";
import { useCartStore } from "@/features/cart/store";
import { itemsSubtotal } from "@/lib/commerce";

export function RepeatOrder({ ready }: { ready: boolean }) {
  const router = useRouter();
  const products = useMockStore((state) => state.products);
  const items = useCartStore((state) => state.items);
  const savedItems = useCartStore((state) => state.savedItems);
  const available = products.filter((product) => product.status === "published");
  const saved = savedItems.flatMap((item) => {
    const product = available.find((product) => product.id === item.productId);
    return product ? [{ ...item, name: product.name, unitPrice: product.price }] : [];
  });

  return (
    <section
      className="grid gap-8 rounded-3xl bg-surface p-6 sm:p-10 lg:grid-cols-2"
      aria-labelledby="repeat-title"
      aria-busy={!ready}
    >
      <div>
        <RotateCcw className="mb-5 text-primary" size={28} aria-hidden="true" />
        <h2 id="repeat-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Заказываете воду регулярно?
        </h2>
        <p className="mt-3 max-w-lg text-muted-foreground">
          Сохраните привычный набор, чтобы в следующий раз добавить его одним нажатием.
        </p>
        <p className="mt-5 text-sm text-muted-foreground">
          Сохраните любимые товары, чтобы быстро добавить их в корзину в следующий раз.
        </p>
      </div>
      <div className="flex min-w-0 flex-col justify-center rounded-2xl border bg-white p-6">
        {!ready ? (
          <div role="status">
            <span className="sr-only">Загружаем сохранённый набор</span>
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="mt-4 h-14" />
            <Skeleton className="mt-5 h-12" />
          </div>
        ) : (
          <>
            {savedItems.length ? (
              <>
                <h3 className="font-semibold">Ваш сохранённый набор</h3>
                <ul className="mt-3 divide-y text-sm">
                  {savedItems.map((item) => {
                    const product = available.find((product) => product.id === item.productId);
                    const name =
                      products.find((product) => product.id === item.productId)?.name ??
                      "Товар недоступен";
                    return (
                      <li
                        key={item.productId}
                        className="flex items-start justify-between gap-4 py-3"
                      >
                        <span className="min-w-0 break-words">
                          {name}
                          {!product && (
                            <span className="mt-1 block text-xs text-muted-foreground">
                              Сейчас недоступен
                            </span>
                          )}
                        </span>
                        <span className="shrink-0 text-muted-foreground">
                          {item.quantity}{" "}
                          {products.find((entry) => entry.id === item.productId)?.saleUnit ===
                          "pack"
                            ? "уп."
                            : "шт."}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                {!!saved.length && (
                  <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2 border-t pt-4">
                    <span className="text-sm text-muted-foreground">Доступные товары</span>
                    <Price amount={itemsSubtotal(saved)} />
                  </div>
                )}
                {saved.length < savedItems.length && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Недоступные товары не будут добавлены. Обновите набор из корзины, чтобы изменить
                    состав.
                  </p>
                )}
                <p className="mt-3 text-xs text-muted-foreground">
                  Количество сохранённых позиций восстановится, остальные товары останутся в
                  корзине. Тара и доставка учитываются отдельно.
                </p>
                <Button
                  className="mt-5 self-start"
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
              </>
            ) : (
              <>
                <h3 className="font-semibold">Начните со своего первого набора</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Добавьте воду в корзину и сохраните её здесь. В следующий раз выбирать товары
                  заново не придётся.
                </p>
              </>
            )}
            {!!items.length && (
              <Button
                variant="secondary"
                className="mt-4 h-auto min-h-12 self-start whitespace-normal text-left"
                onClick={() => {
                  useCartStore.getState().saveForRepeat();
                  toast.success("Текущая корзина сохранена для повторения");
                }}
              >
                <Bookmark size={17} className="shrink-0" />
                {savedItems.length ? "Сохранить текущую корзину" : "Сохранить набор из корзины"}
              </Button>
            )}
            {!items.length && !savedItems.length && (
              <Button asChild variant="secondary" className="mt-5 self-start">
                <a href="#popular">Выбрать воду</a>
              </Button>
            )}
            {!!items.length && (
              <Link
                href="/cart"
                className="mt-3 inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-primary"
              >
                Открыть корзину <ArrowRight size={16} />
              </Link>
            )}
          </>
        )}
      </div>
    </section>
  );
}
