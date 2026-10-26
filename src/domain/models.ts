export interface SourceRecord { url: string; checkedAt: string; note?: string }
export interface Category { id: string; slug: string; name: string; parentId?: string; source?: SourceRecord }
export interface Product {
  id: string; slug: string; name: string; categoryId: string; description: string;
  price: number; currency: "RUB"; volumeLiters?: number; image?: string; imageAlt: string;
  status: "published" | "draft" | "archived"; isDemo: boolean;
  attributes: Record<string, string>; source?: SourceRecord;
}
export interface CartItem { productId: string; quantity: number }
export interface Customer { id: string; name: string; phone: string; isDemo: boolean }
export interface DeliveryAddress { city: string; street: string; building: string; apartment?: string; entrance?: string; floor?: string }
// Snapshot keeps order history independent of future product edits.
export interface OrderItem { productId: string; name: string; unitPrice: number; quantity: number; volumeLiters?: number }
export type OrderStatus = "new" | "confirmed" | "packing" | "delivering" | "completed" | "cancelled";
export interface Order {
  id: string; number: string; createdAt: string; customer: Customer; address: DeliveryAddress;
  items: OrderItem[]; status: OrderStatus; statusHistory: { status: OrderStatus; changedAt: string }[];
  deliveryDate?: string; deliverySlot?: string; deliveryFee: number | null;
  paymentMethod?: "cash" | "card"; comment?: string; isDemo: true;
}
