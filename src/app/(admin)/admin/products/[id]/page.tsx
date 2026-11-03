import { ProductEditor } from "@/features/admin/product-form";
import { products } from "@/data/mock/seed";

export function generateStaticParams() {
  return products.map(({ id }) => ({ id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductEditor id={id} />;
}
