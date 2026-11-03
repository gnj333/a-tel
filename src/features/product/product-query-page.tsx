"use client";

import { useSearchParams } from "next/navigation";
import { ProductPage } from "./product-page";

export function ProductQueryPage() {
  const slug = useSearchParams().get("slug") ?? "";
  return <ProductPage key={slug} slug={slug} />;
}
