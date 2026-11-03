import { z } from "zod";
import type { CheckoutValues } from "./checkout-schema";

export const CHECKOUT_FORM_STORAGE_KEY = "akvatel-demo-checkout-form-v1";

// Drafts can contain incomplete input, so checkout validation only runs on submit.
const savedFormSchema = z.object({
  name: z.string().catch(""),
  phone: z.string().catch(""),
  street: z.string().catch(""),
  building: z.string().catch(""),
  apartment: z.string().catch(""),
  comment: z.string().catch(""),
  deliveryDate: z.string().catch(""),
  saveBasket: z.boolean().catch(false),
});

export const checkoutDefaultValues: CheckoutValues = savedFormSchema.parse({});

export function loadCheckoutForm(): CheckoutValues {
  try {
    return savedFormSchema.parse(
      JSON.parse(localStorage.getItem(CHECKOUT_FORM_STORAGE_KEY) ?? "{}"),
    );
  } catch {
    return { ...checkoutDefaultValues };
  }
}

export function saveCheckoutForm(values: CheckoutValues) {
  try {
    localStorage.setItem(CHECKOUT_FORM_STORAGE_KEY, JSON.stringify(values));
  } catch {
    // An unavailable or full storage must not prevent filling out the form.
  }
}
