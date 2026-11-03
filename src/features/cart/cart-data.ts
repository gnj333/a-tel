import type { CartItem, OrderItem, Product } from "@/domain/models";
import { itemsSubtotal } from "@/lib/commerce";
import { needsBottleExchange } from "@/features/product/product-data";

export function resolveCart(items: CartItem[], products: Product[]) {
  const lines: { product: Product; quantity: number; total: number }[] = [];
  const unavailable: { productId: string; name: string }[] = [];
  for (const item of items) {
    const product = products.find((entry) => entry.id === item.productId);
    if (
      !product ||
      product.status !== "published" ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 99
    ) {
      unavailable.push({
        productId: item.productId,
        name: product?.name ?? "Товар удалён из каталога",
      });
      continue;
    }
    lines.push({
      product,
      quantity: item.quantity,
      total: (Math.round(product.price * 100) * item.quantity) / 100,
    });
  }
  const snapshot: OrderItem[] = lines.map(({ product, quantity }) => ({
    productId: product.id,
    name: product.name,
    unitPrice: product.price,
    quantity,
    volumeLiters: product.volumeLiters,
    saleUnit: product.saleUnit,
    categoryId: product.categoryId,
  }));
  return {
    lines,
    unavailable,
    snapshot,
    subtotal: itemsSubtotal(snapshot),
    quantity: lines.reduce((sum, line) => sum + line.quantity, 0),
    exchangeBottles: lines.reduce(
      (sum, line) => sum + (needsBottleExchange(line.product) ? line.quantity : 0),
      0,
    ),
    canCheckout: lines.length > 0 && unavailable.length === 0,
  };
}

export type ResolvedCart = ReturnType<typeof resolveCart>;
