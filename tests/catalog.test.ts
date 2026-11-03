import { test } from "node:test";
import assert from "node:assert/strict";
import type { Product } from "@/domain/models";
import { categories, products } from "@/data/mock/seed";
import { filterProducts, parsePrice, readCatalogFilters } from "@/features/catalog/filter-products";

const select = (query: string, source = products) =>
  filterProducts(source, categories, readCatalogFilters(new URLSearchParams(query)));

test("catalog combines category, search, inclusive price range and sorting", () => {
  assert.deepEqual(
    select("category=pompy&q=помпа&min=350&max=700&sort=price-desc").map((item) => item.id),
    ["pump-k7", "pump-mr01"],
  );
  assert.deepEqual(
    select("category=pompy&min=350&max=350").map((item) => item.id),
    ["pump-mr01"],
  );
  assert.equal(select("category=does-not-exist").length, 0);
  assert.equal(select("q=несуществующийтовар").length, 0);
  assert.equal(select("min=900&max=100").length, 0);
});

test("water volume filters exclude empty bottles and separate small packs", () => {
  assert.deepEqual(
    select("volume=19").map((item) => item.id),
    ["water-akvatel-19", "water-akvatel-light-19"],
  );
  const small = select("category=voda&volume=other");
  assert.equal(small.length, 1);
  assert.equal(small[0].saleUnit, "pack");
  assert.equal(small[0].price, 4 * 120);
});

test("catalog hides unpublished products and sorts a copy in both directions", () => {
  const source: Product[] = [
    ...products,
    { ...products[0], id: "hidden", status: "draft" },
    { ...products[0], id: "removed", status: "archived" },
  ];
  const original = source.map((item) => item.id);
  assert.equal(select("", source).length, products.length);
  for (const [asc, desc] of [
    ["price-asc", "price-desc"],
    ["name-asc", "name-desc"],
  ]) {
    const sorted = select(`sort=${asc}`, source);
    const reversed = select(`sort=${desc}`, source);
    if (asc === "name-asc")
      assert.deepEqual(
        sorted.map((item) => item.id),
        reversed.map((item) => item.id).reverse(),
      );
    else {
      assert.equal(sorted[0].price, 200);
      assert.equal(reversed[0].price, 5800);
    }
  }
  assert.deepEqual(
    source.map((item) => item.id),
    original,
  );
});

test("catalog tolerates malformed URLs and handles decimal prices in kopecks", () => {
  for (const value of [null, "", "-1", "Infinity", "NaN", "1e2", "1000000001", "12.345", "hello"])
    assert.equal(parsePrice(value), undefined);
  assert.equal(parsePrice("0"), 0);
  assert.equal(parsePrice("12,34"), 12.34);
  const filters = readCatalogFilters(
    new URLSearchParams("sort=invalid&volume=bad&min=NaN&q=%20Акватель%20"),
  );
  assert.equal(filters.sort, "default");
  assert.equal(filters.volume, "");
  assert.equal(filters.min, undefined);
  assert.equal(filters.query, "Акватель");
  assert.equal(select("min=12.34&max=12.34", [{ ...products[0], price: 12.34 }]).length, 1);
});
