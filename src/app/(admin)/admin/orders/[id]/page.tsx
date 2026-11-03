import { OrderDetail } from "@/features/admin/order-detail";
import { products } from "@/data/mock/seed";
import { createDemoOrders } from "@/data/mock/demo-orders";

export function generateStaticParams() {
  return createDemoOrders(products).map(({ id }) => ({ id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderDetail id={id} />;
}
