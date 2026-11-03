import { Suspense } from "react";
import type { Metadata } from "next";
import { Catalog } from "@/features/catalog/catalog";
import { CatalogSkeleton } from "@/features/catalog/catalog-skeleton";

export const metadata: Metadata = { title: "Каталог" };

export default function CatalogPage() {
  return (
    <main id="main" tabIndex={-1}>
      <Suspense fallback={<CatalogSkeleton />}>
        <Catalog />
      </Suspense>
    </main>
  );
}
