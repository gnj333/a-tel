import { Container } from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeleton } from "@/components/product/product-card-skeleton";

export function CatalogSkeleton() {
  return (
    <Container className="py-8 sm:py-12">
      <div role="status" aria-busy="true">
        <span className="sr-only">Загружаем каталог и корзину</span>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-8 h-12 w-56" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          <Skeleton className="hidden h-[560px] lg:block" />
          <div>
            <Skeleton className="mb-6 h-12" />
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((key) => (
                <ProductCardSkeleton key={key} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
