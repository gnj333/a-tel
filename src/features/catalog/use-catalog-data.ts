"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, type ExternalToast } from "sonner";
import type { Product } from "@/domain/models";
import { useMockStore } from "@/data/mock/store";
import { hydrateMockData } from "@/services/mock-repository";
import { hydrateCartData, useCartStore } from "@/features/cart/store";

// Subscriptions keep the catalog in sync with the shared repository after hydration.
export function useCatalogData(toastPosition?: ExternalToast["position"]) {
  const [ready, setReady] = useState(false);
  const products = useMockStore((state) => state.products);
  const categories = useMockStore((state) => state.categories);
  const items = useCartStore((state) => state.items);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    void Promise.all([hydrateMockData(), hydrateCartData()]).then(() => {
      if (active) setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  function addProduct(product: Product, quantity: number) {
    const current = useMockStore.getState().products.find((item) => item.id === product.id);
    if (!ready || current?.status !== "published") return 0;
    const added = useCartStore.getState().addItem(current.id, quantity);
    const action = { label: "В корзину", onClick: () => router.push("/cart") };
    if (!added) {
      toast.info("Достигнут лимит: 99 единиц этого товара", { action, position: toastPosition });
      return 0;
    }
    toast.success(
      `${current.name} · ${added} ${current.saleUnit === "pack" ? "уп." : "шт."} добавлено`,
      {
        action,
        position: toastPosition,
        description:
          added < quantity ? "Количество ограничено 99 единицами одного товара." : undefined,
      },
    );
    return added;
  }

  return { ready, products, categories, items, addProduct };
}
