import type { Metadata } from "next";
import { CheckoutPage } from "@/features/checkout/checkout-page";

export const metadata: Metadata = { title: "Оформление заказа" };
export default function Page() {
  return <CheckoutPage />;
}
