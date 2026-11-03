import { test } from "node:test";
import assert from "node:assert/strict";
import type { Product } from "@/domain/models";
import { products } from "@/data/mock/seed";
import { refreshWaterDetails } from "@/data/mock/water-details";
import {
  findPublishedProduct,
  needsBottleExchange,
  productImages,
  productTotal,
  similarProducts,
} from "@/features/product/product-data";

test("product routes resolve the current published data and hide removed products", () => {
  const updated = { ...products[0], name: "Новое название", price: 515 };
  assert.equal(findPublishedProduct([updated], updated.slug), updated);
  assert.equal(findPublishedProduct([{ ...updated, status: "draft" }], updated.slug), undefined);
  assert.equal(findPublishedProduct([{ ...updated, status: "archived" }], updated.slug), undefined);
  assert.equal(findPublishedProduct(products, "unknown-slug"), undefined);
});

test("gallery retains photo order, supports missing primary photos and removes duplicates", () => {
  const primary = { src: products[0].image!, alt: products[0].imageAlt };
  const extra = { src: "/images/extra.jpg", alt: "Вид сбоку" };
  assert.deepEqual(productImages(products[0]), [primary]);
  assert.deepEqual(
    productImages({ ...products[0], images: [primary, extra, extra, { src: "", alt: "" }] }),
    [primary, extra],
  );
  assert.deepEqual(productImages({ ...products[0], image: undefined, images: [extra] }), [extra]);
  assert.deepEqual(productImages({ ...products[0], image: undefined }), []);
});

test("similar products only include other published products in the same category", () => {
  const source: Product[] = [...products, { ...products[0], id: "draft-water", status: "draft" }];
  const originalOrder = source.map((product) => product.id);
  assert.deepEqual(
    similarProducts(source, products[0]).map((product) => product.id),
    ["water-akvatel-light-19", "water-light-5-pack"],
  );
  assert.equal(similarProducts(source, products[0], 1).length, 1);
  assert.deepEqual(
    similarProducts(
      source,
      products.find((product) => product.id === "cooler-k12")!,
    ),
    [],
  );
  assert.deepEqual(
    source.map((product) => product.id),
    originalOrder,
  );
});

test("exchange applies to 19 litre water, not empty bottles or small packs", () => {
  assert.equal(needsBottleExchange(products[0]), true);
  assert.equal(needsBottleExchange(products.find((product) => product.id === "bottle-19")!), false);
  const pack = products.find((product) => product.id === "water-light-5-pack")!;
  assert.equal(needsBottleExchange(pack), false);
  assert.equal(productTotal(pack, 3), 1440);
  assert.equal(productTotal({ ...pack, price: 12.34 }, 3), 37.02);
});

test("water content refresh fills original product details while preserving manager edits", () => {
  const original: Product = {
    ...products[0],
    price: 515,
    status: "archived",
    description: "Природная вода, 19 л. Обменная тара учитывается отдельно.",
    image: "/images/akvatel-19.jpg",
    attributes: { Объём: "19 л", Тара: "Обменная" },
    documents: undefined,
  };
  const refreshed = refreshWaterDetails(original);
  assert.equal(refreshed.price, 515);
  assert.equal(refreshed.status, "archived");
  assert.equal(refreshed.image, "/images/akvatel-19-clean.webp");
  assert.equal(refreshed.attributes["Срок годности"], "6 месяцев");
  assert.ok(refreshed.documents?.length);
  assert.notEqual(refreshed.description, original.description);
  assert.equal(original.image, "/images/akvatel-19.jpg");

  const edited = {
    ...original,
    description: "Описание менеджера",
    image: "/images/custom.jpg",
    documents: [],
    attributes: { Тара: "Уточняется" },
  };
  const preserved = refreshWaterDetails(edited);
  assert.equal(preserved.description, edited.description);
  assert.equal(preserved.image, edited.image);
  assert.deepEqual(preserved.documents, []);
  assert.equal(preserved.attributes.Тара, "Уточняется");
  assert.deepEqual(refreshWaterDetails(refreshed), refreshed);
});
