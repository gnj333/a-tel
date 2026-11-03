import { after, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import {
  CHECKOUT_FORM_STORAGE_KEY,
  checkoutDefaultValues,
  loadCheckoutForm,
  saveCheckoutForm,
} from "@/features/checkout/checkout-form-storage";

const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
const storage = new Map<string, string>();
let unavailable = false;
Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  get: () => {
    if (unavailable) throw new Error("Storage unavailable");
    return {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    };
  },
});

beforeEach(() => {
  storage.clear();
  unavailable = false;
});

after(() => {
  if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
  else delete (globalThis as { localStorage?: unknown }).localStorage;
});

test("restores incomplete input and explicitly cleared fields without checkout validation", () => {
  const draft = {
    ...checkoutDefaultValues,
    name: "А",
    phone: "+7 (9",
    street: "Тестовая",
    saveBasket: true,
  };
  saveCheckoutForm(draft);
  assert.deepEqual(loadCheckoutForm(), draft);
  saveCheckoutForm({ ...draft, street: "", saveBasket: false });
  assert.deepEqual(loadCheckoutForm(), { ...draft, street: "", saveBasket: false });
});

test("handles missing, malformed and partial saved forms, ignoring fields of the wrong type", () => {
  assert.deepEqual(loadCheckoutForm(), checkoutDefaultValues);
  for (const raw of ["{", "null", "[]", '"invalid"']) {
    storage.set(CHECKOUT_FORM_STORAGE_KEY, raw);
    assert.deepEqual(loadCheckoutForm(), checkoutDefaultValues);
  }
  storage.set(
    CHECKOUT_FORM_STORAGE_KEY,
    JSON.stringify({ name: "Тест", phone: 123, street: null, saveBasket: "true" }),
  );
  assert.deepEqual(loadCheckoutForm(), { ...checkoutDefaultValues, name: "Тест" });
});

test("storage access errors do not break the form", () => {
  unavailable = true;
  assert.deepEqual(loadCheckoutForm(), checkoutDefaultValues);
  assert.doesNotThrow(() => saveCheckoutForm(checkoutDefaultValues));
});
