import { test } from "node:test";
import assert from "node:assert/strict";
import { products } from "@/data/mock/seed";
import { resolveCart } from "@/features/cart/cart-data";
import {
  checkoutSchema,
  deliveryToday,
  formatPhone,
  phoneDigits,
  type CheckoutValues,
} from "@/features/checkout/checkout-schema";
import { createDemoOrder } from "@/features/checkout/create-demo-order";

const values: CheckoutValues = {
  name: "Тестовый покупатель",
  phone: "+7 (000) 111-22-33",
  street: "Тестовая улица",
  building: "99",
  apartment: "42",
  comment: "Тестовый комментарий, который не должен сохраняться",
  deliveryDate: "2099-06-15",
  saveBasket: false,
};

test("cart totals use current prices and count packs as sale units, not bottles", () => {
  const cart = resolveCart(
    [
      { productId: products[0].id, quantity: 2 },
      { productId: products[2].id, quantity: 3 },
      { productId: products[7].id, quantity: 1 },
    ],
    products,
  );
  assert.equal(cart.canCheckout, true);
  assert.equal(cart.quantity, 6);
  assert.equal(cart.exchangeBottles, 2);
  assert.equal(cart.subtotal, 3000);
  assert.equal(cart.snapshot[1].saleUnit, "pack");
  assert.equal(
    resolveCart([{ productId: products[0].id, quantity: 2 }], [{ ...products[0], price: 0.15 }])
      .subtotal,
    0.3,
  );
});

test("missing, unpublished and malformed cart lines block checkout rather than disappearing", () => {
  assert.equal(resolveCart([], products).canCheckout, false);
  for (const status of ["draft", "archived"] as const) {
    const cart = resolveCart(
      [{ productId: products[0].id, quantity: 1 }],
      [{ ...products[0], status }],
    );
    assert.equal(cart.canCheckout, false);
    assert.equal(cart.unavailable.length, 1);
    assert.equal(cart.subtotal, 0);
  }
  for (const quantity of [0, -1, 1.5, 100, NaN, Infinity]) {
    assert.equal(
      resolveCart([{ productId: products[0].id, quantity }], products).canCheckout,
      false,
    );
  }
  const mixed = resolveCart(
    [
      { productId: products[0].id, quantity: 2 },
      { productId: "deleted", quantity: 1 },
    ],
    products,
  );
  assert.equal(mixed.lines.length, 1);
  assert.equal(mixed.canCheckout, false);
  assert.equal(mixed.unavailable[0].productId, "deleted");
});

test("checkout validates required fields, complete Russian phone and calendar dates", () => {
  assert.equal(checkoutSchema.safeParse(values).success, true);
  for (const patch of [
    { name: " " },
    { phone: "+7 (000) 123" },
    { street: " " },
    { building: " " },
    { deliveryDate: "2020-01-01" },
    { deliveryDate: "2099-02-30" },
    { deliveryDate: "" },
    { comment: "x".repeat(501) },
  ]) {
    assert.equal(
      checkoutSchema.safeParse({ ...values, ...patch }).success,
      false,
      JSON.stringify(patch),
    );
  }
  assert.equal(checkoutSchema.safeParse({ ...values, apartment: "", comment: "" }).success, true);
  assert.equal(deliveryToday(new Date("2026-10-28T20:00:00Z")), "2026-10-29");
});

test("phone mask handles paste, prefix 8, incremental typing and backspacing", () => {
  assert.equal(formatPhone("8 000 111 22 33"), "+7 (000) 111-22-33");
  assert.equal(formatPhone("0001112233"), "+7 (000) 111-22-33");
  assert.equal(phoneDigits("8 (000) 111-22-33"), "70001112233");
  assert.equal(formatPhone(""), "");
  let current = "";
  for (const digit of "70001112233") current = formatPhone(current + digit);
  assert.equal(current, "+7 (000) 111-22-33");
  for (let index = 0; index < 12; index++) current = formatPhone(current.slice(0, -1));
  assert.equal(current, "");
});

test("demo order freezes prices and replaces all free-text personal data with fixtures", () => {
  const mutableProducts = structuredClone(products);
  const order = createDemoOrder(
    values,
    [{ productId: products[2].id, quantity: 2 }],
    mutableProducts,
    "abcdef00-1234-5678",
    new Date("2026-10-28T10:00:00Z"),
  );
  mutableProducts[2].name = "Изменённое имя";
  mutableProducts[2].price = 9999;
  assert.equal(order.items[0].unitPrice, 480);
  assert.equal(order.items[0].name, products[2].name);
  assert.equal(order.items[0].saleUnit, "pack");
  assert.equal(order.status, "new");
  assert.deepEqual(order.statusHistory, [{ status: "new", changedAt: order.createdAt }]);
  assert.equal(order.deliveryFee, null);
  assert.equal(order.deliveryDate, values.deliveryDate);
  assert.equal(order.isDemo, true);
  const persisted = JSON.stringify(order);
  for (const value of [values.name, values.phone, values.street, values.comment])
    assert.ok(!persisted.includes(value));
  assert.throws(() => createDemoOrder(values, [], products, "empty"));
  assert.throws(() =>
    createDemoOrder(values, [{ productId: "deleted", quantity: 1 }], products, "missing"),
  );
});
