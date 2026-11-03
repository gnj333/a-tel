import { after, test } from "node:test";
import assert from "node:assert/strict";

const values = new Map<string, string>();
const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
after(() => {
  if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
  else delete (globalThis as { localStorage?: unknown }).localStorage;
});

test("cart quantities drive the badge and survive a persisted reload", async () => {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    },
  });
  const { useCartStore, cartQuantity } = await import("@/features/cart/store");
  const cart = useCartStore.getState();
  cart.setQuantity("water", 2);
  cart.setQuantity("pump", 1);
  assert.equal(cartQuantity(useCartStore.getState().items), 3);
  cart.setQuantity("water", 4);
  assert.equal(cartQuantity(useCartStore.getState().items), 5);
  cart.setQuantity("pump", 0);
  cart.setQuantity("water", -1);
  cart.setQuantity("water", 1.5);
  assert.deepEqual(useCartStore.getState().items, [{ productId: "water", quantity: 4 }]);
  const saved = values.get("akvatel-demo-cart-v1")!;
  useCartStore.setState({ items: [] });
  values.set("akvatel-demo-cart-v1", saved);
  await useCartStore.persist.rehydrate();
  assert.equal(cartQuantity(useCartStore.getState().items), 4);
  cart.setQuantity("water", 0);
  assert.equal(cartQuantity(useCartStore.getState().items), 0);
});

test("saved basket persists independently and repeats only available products", async () => {
  const { useCartStore } = await import("@/features/cart/store");
  useCartStore.setState({ items: [], savedItems: [] });
  const cart = useCartStore.getState();
  cart.addItem("water", 2);
  cart.addItem("water", 1);
  cart.addItem("archived", 1);
  cart.addItem("water", -1);
  cart.saveForRepeat();
  const persisted = values.get("akvatel-demo-cart-v1")!;
  useCartStore.setState({ items: [], savedItems: [] });
  values.set("akvatel-demo-cart-v1", persisted);
  await useCartStore.persist.rehydrate();
  cart.setQuantity("water", 8);
  cart.setQuantity("archived", 0);
  cart.addItem("pump", 1);
  assert.deepEqual(useCartStore.getState().savedItems, [
    { productId: "water", quantity: 3 },
    { productId: "archived", quantity: 1 },
  ]);
  cart.repeatSaved(["water", "pump"]);
  assert.deepEqual(useCartStore.getState().items, [
    { productId: "pump", quantity: 1 },
    { productId: "water", quantity: 3 },
  ]);
  cart.repeatSaved(["water", "pump"]);
  assert.equal(
    useCartStore.getState().items.find((item) => item.productId === "water")?.quantity,
    3,
  );
  cart.addItem("water", 100);
  assert.equal(
    useCartStore.getState().items.find((item) => item.productId === "water")?.quantity,
    99,
  );
});

test("adding reports only the quantity that fits within the cart limit", async () => {
  const { useCartStore } = await import("@/features/cart/store");
  useCartStore.setState({ items: [], savedItems: [] });
  const cart = useCartStore.getState();
  assert.equal(cart.addItem("water", 98), 98);
  assert.equal(cart.addItem("water", 3), 1);
  assert.equal(cart.addItem("water", 1), 0);
  for (const quantity of [0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.equal(cart.addItem("other", quantity), 0);
  }
  assert.equal(cart.addItem("", 1), 0);
  assert.deepEqual(useCartStore.getState().items, [{ productId: "water", quantity: 99 }]);
});

test("an unavailable saved basket leaves the current cart unchanged", async () => {
  const { useCartStore } = await import("@/features/cart/store");
  const items = [{ productId: "other", quantity: 2 }];
  const savedItems = [{ productId: "archived", quantity: 3 }];
  useCartStore.setState({ items, savedItems });
  useCartStore.getState().repeatSaved(["other"]);
  assert.deepEqual(useCartStore.getState().items, items);
  assert.deepEqual(useCartStore.getState().savedItems, savedItems);
});

test("stage 2 carts without a saved basket retain their contents", async () => {
  const { useCartStore } = await import("@/features/cart/store");
  useCartStore.setState({ items: [], savedItems: [] });
  const items = [{ productId: "water", quantity: 2 }];
  values.set("akvatel-demo-cart-v1", JSON.stringify({ state: { items }, version: 1 }));
  await useCartStore.persist.rehydrate();
  assert.deepEqual(useCartStore.getState().items, items);
  assert.deepEqual(useCartStore.getState().savedItems, []);
});

test("cart edits cap quantities, removal and checkout clearing preserve the saved basket", async () => {
  const { useCartStore } = await import("@/features/cart/store");
  useCartStore.setState({ items: [], savedItems: [{ productId: "saved", quantity: 2 }] });
  const cart = useCartStore.getState();
  cart.setQuantity("water", 100);
  assert.equal(useCartStore.getState().items[0].quantity, 99);
  cart.addItem("pump", 2);
  cart.removeItem("water");
  assert.deepEqual(useCartStore.getState().items, [{ productId: "pump", quantity: 2 }]);
  cart.clear();
  assert.deepEqual(useCartStore.getState().items, []);
  assert.deepEqual(useCartStore.getState().savedItems, [{ productId: "saved", quantity: 2 }]);
  const persisted = JSON.parse(values.get("akvatel-demo-cart-v1")!).state;
  assert.deepEqual(persisted.items, []);
  assert.deepEqual(persisted.savedItems, [{ productId: "saved", quantity: 2 }]);
});
