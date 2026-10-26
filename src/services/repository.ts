import type { Category, Order, Product } from "@/domain/models";
// Async contract can be implemented by an HTTP adapter without changing domain models.
export interface ShopRepository {
  listProducts(): Promise<Product[]>;
  listCategories(): Promise<Category[]>;
  listOrders(): Promise<Order[]>;
  saveProduct(product: Product): Promise<void>;
  saveOrder(order: Order): Promise<void>;
}
