import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";

export function CartLoading() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"
    >
      <span className="sr-only">Загружаем корзину</span>
      <div className="space-y-4">
        <Skeleton className="h-44" />
        <Skeleton className="h-44" />
      </div>
      <Skeleton className="h-96" />
    </div>
  );
}

export function CartEmpty() {
  return (
    <div className="mx-auto mt-10 max-w-2xl">
      <EmptyState
        title="Ваша корзина пока пуста"
        description="Выберите воду для дома или офиса, помпу или другие товары. Они появятся здесь, и вы сможете оформить заказ."
        action={
          <Button asChild>
            <Link href="/catalog">Перейти в каталог</Link>
          </Button>
        }
      />
    </div>
  );
}
