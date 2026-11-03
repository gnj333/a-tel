import { Suspense } from "react";
import { ProductQueryPage } from "@/features/product/product-query-page";
import { CatalogSkeleton } from "@/features/catalog/catalog-skeleton";

export default function Page() {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <ProductQueryPage />
    </Suspense>
  );
}
