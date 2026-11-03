import type { Metadata } from "next";
import { products } from "@/data/mock/seed";
import { findPublishedProduct } from "@/features/product/product-data";
import { ProductPage as ProductDetails } from "@/features/product/product-page";

type ProductRouteProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map(({ slug }) => ({ slug }));
}

// Browser-only edits are rendered by ProductDetails; metadata uses the server seed.
export async function generateMetadata({ params }: ProductRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const product = findPublishedProduct(products, slug);
  return {
    title: product?.name ?? "Товар",
    description: product?.description ?? "Товар из каталога «Акватель».",
  };
}

export default async function ProductPage({ params }: ProductRouteProps) {
  const { slug } = await params;
  return <ProductDetails key={slug} slug={slug} />;
}
