import type { Order, OrderStatus, Product } from "@/domain/models";

// Fictional fixtures anchored to the day the demo repository is initialized.
export function createDemoOrders(products: Product[], now = new Date()): Order[] {
  const statuses: OrderStatus[] = [
    "new",
    "confirmed",
    "packing",
    "delivering",
    "completed",
    "cancelled",
  ];
  return Array.from({ length: 48 }, (_, index) => {
    const date = new Date(now);
    date.setUTCDate(date.getUTCDate() - Math.floor(index * 1.85));
    date.setUTCHours(7 + (index % 9), (index % 4) * 15, 0, 0);
    if (date > now) date.setTime(now.getTime() - index * 60_000);
    const createdAt = date.toISOString();
    const status = statuses[index % statuses.length];
    const product = products[index % Math.min(products.length, 5)];
    const quantity = 2 + (index % 4);
    return {
      id: `fixture-order-${index + 1}`,
      number: `AT-${String(1048 - index)}`,
      createdAt,
      customer: {
        id: `fixture-customer-${index}`,
        name: `Покупатель ${index + 1}`,
        phone: "+7 (000) 000-00-00",
        isDemo: true,
      },
      address: {
        city: "Тюмень",
        street: "Лесная",
        building: String(index + 1),
        apartment: String(10 + index),
      },
      items: [
        {
          productId: product.id,
          name: product.name,
          unitPrice: product.price,
          quantity,
          volumeLiters: product.volumeLiters,
          saleUnit: product.saleUnit,
          categoryId: product.categoryId,
        },
      ],
      status,
      statusHistory:
        status === "new"
          ? [{ status, changedAt: createdAt }]
          : [
              { status: "new", changedAt: createdAt },
              {
                status,
                changedAt: new Date(date.getTime() + 60_000).toISOString(),
              },
            ],
      deliveryFee: null,
      paymentMethod: index % 2 ? "cash" : "card",
      comment: index % 3 === 0 ? "Позвонить перед доставкой" : undefined,
      isDemo: true,
    };
  });
}
