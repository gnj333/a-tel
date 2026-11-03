import { test } from "node:test";
import assert from "node:assert/strict";
import { itemsSubtotal } from "@/lib/commerce";
import { categories, products } from "@/data/mock/seed";
test("order snapshot total uses integer kopecks", () => {
  assert.equal(
    itemsSubtotal([
      { productId: "a", name: "A", unitPrice: 0.1, quantity: 3 },
      { productId: "b", name: "B", unitPrice: 0.2, quantity: 1 },
    ]),
    0.5,
  );
  assert.equal(itemsSubtotal([]), 0);
});
test("seed product references an existing category and has traceable data", () => {
  assert.equal(new Set(products.map((p) => p.id)).size, products.length);
  for (const p of products) {
    assert.ok(categories.some((category) => category.id === p.categoryId));
    assert.ok(p.price >= 0);
    assert.ok(p.isDemo || p.source?.url);
  }
});
