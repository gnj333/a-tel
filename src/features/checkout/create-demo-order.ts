import type { CartItem, Order, Product } from "@/domain/models";
import { resolveCart } from "@/features/cart/cart-data";
import { checkoutSchema, type CheckoutValues } from "./checkout-schema";

// Only explicitly fictitious contact data enters the persisted repository.
// The form remains in memory and is discarded on completion.
export function createDemoOrder(
  values: CheckoutValues,
  items: CartItem[],
  products: Product[],
  id: string,
  now = new Date(),
): Order {
  const parsed = checkoutSchema.parse(values);
  const cart = resolveCart(items, products);
  if (!cart.canCheckout) throw new Error("Проверьте состав корзины перед оформлением");
  const createdAt = now.toISOString();
  return {
    id,
    number: `AT-${id.slice(0, 8).toUpperCase()}`,
    createdAt,
    customer: {
      id: `demo-customer-${id}`,
      name: "Покупатель",
      phone: "+7 (000) 000-00-00",
      isDemo: true,
    },
    address: { city: "Тюмень", street: "Лесная", building: "1", apartment: "10" },
    items: cart.snapshot,
    status: "new",
    statusHistory: [{ status: "new", changedAt: createdAt }],
    deliveryDate: parsed.deliveryDate,
    deliveryFee: null,
    comment: undefined,
    isDemo: true,
  };
}
