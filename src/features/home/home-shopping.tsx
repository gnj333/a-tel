"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProductCardSkeleton } from "@/components/product/product-card-skeleton";
import { useMockStore } from "@/data/mock/store";
import { hydrateCartData, useCartStore } from "@/features/cart/store";
import { hydrateMockData } from "@/services/mock-repository";
import { RepeatOrder } from "./repeat-order";

export function HomeShopping() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const products = useMockStore((state) => state.products);
  const items = useCartStore((state) => state.items);
  const water = products.filter(
    (product) =>
      product.categoryId === "water" &&
      product.volumeLiters === 19 &&
      product.status === "published",
  );

  useEffect(() => {
    let active = true;
    void Promise.all([hydrateMockData(), hydrateCartData()]).then(() => {
      if (active) setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <section
        id="popular"
        className="scroll-mt-36 py-14 sm:py-20"
        aria-label="Популярная вода"
        aria-busy={!ready}
      >
        <SectionHeading
          title="Вода на каждый день"
          description="Для дома, офиса и привычного ритма жизни."
          action={
            <Link
              href="/catalog?category=voda"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary"
            >
              Вся вода <ArrowRight size={18} />
            </Link>
          }
        />
        {!ready ? (
          <div role="status" className="mt-8 grid gap-6 md:grid-cols-2">
            <span className="sr-only">Загружаем ассортимент и вашу корзину</span>
            {[0, 1].map((index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : water.length ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {water.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                detailHref={`/catalog/${product.slug}`}
                showQuantity
                inCartQuantity={items.find((item) => item.productId === product.id)?.quantity ?? 0}
                onAdd={(selected, quantity) => {
                  const added = useCartStore.getState().addItem(selected.id, quantity);
                  const action = { label: "В корзину", onClick: () => router.push("/cart") };
                  if (!added) {
                    toast.info("В корзине уже 99 шт. этого товара", { action });
                    return 0;
                  }
                  toast.success(`${selected.name} · ${added} шт. добавлено`, {
                    action,
                    description:
                      added < quantity
                        ? "В корзине можно сохранить до 99 шт. одного товара."
                        : undefined,
                  });
                  return added;
                }}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border bg-surface p-6">
            <h3 className="text-lg font-semibold">Вода пока недоступна для выбора</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Ассортимент можно уточнить по телефону{" "}
              <a
                href="tel:+73452278877"
                className="font-medium text-primary underline underline-offset-4"
              >
                +7 (3452) 27-88-77
              </a>
              .
            </p>
          </div>
        )}
        <p className="mt-5 text-xs text-muted-foreground">Тара и доставка учитываются отдельно.</p>
      </section>
      <RepeatOrder ready={ready} />
    </>
  );
}
