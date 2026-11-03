import { test, expect, type Page } from "@playwright/test";
import { products } from "@/data/mock/seed";

const product = products[0];
const dataKey = "akvatel-demo-data-v1";
const cartKey = "akvatel-demo-cart-v1";

async function stored(page: Page, key: string) {
  return page.evaluate((name) => JSON.parse(localStorage.getItem(name) ?? "null")?.state, key);
}

async function fillCheckout(page: Page) {
  await page.getByLabel("Имя *", { exact: true }).fill("Демо Покупатель");
  await page.getByLabel("Телефон *").fill("79990000000");
  await page.getByLabel("Улица *", { exact: true }).fill("Тестовая улица");
  await page.getByLabel("Дом, корпус *").fill("10");
  const date = page.getByLabel("Желаемая дата доставки *");
  await date.fill((await date.getAttribute("min"))!);
  await page.getByLabel(/Сохранить состав для повторной покупки/).check();
}

async function checkout(page: Page) {
  await fillCheckout(page);
  await page.getByRole("button", { name: /Оформить заказ/ }).click();
  await expect(page.getByRole("heading", { name: "Заказ оформлен" })).toBeVisible();
}

test("покупка, админка, синхронизация цены и статуса, перезагрузка и сохранение данных", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Чистая вода");
  await page
    .locator("main")
    .getByRole("link", { name: /Вся вода/ })
    .click();
  await expect(page.getByRole("heading", { name: "Каталог товаров" })).toBeVisible();
  await page.getByRole("checkbox", { name: "Вода 19 л" }).click();
  await expect(page.getByRole("checkbox", { name: "Вода 19 л" })).toBeChecked();
  await page.getByRole("combobox", { name: "Сортировка товаров" }).selectOption("price-asc");
  await expect(page.locator(".product-card")).toHaveCount(2);
  await page.locator(".product-card").getByRole("link", { name: "Акватель", exact: true }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: product.name, exact: true }),
  ).toBeVisible();
  await page
    .getByRole("group", { name: `Количество: ${product.name}`, exact: true })
    .getByRole("button", { name: "Увеличить количество" })
    .click();
  await page
    .getByRole("button", { name: `Добавить в корзину: ${product.name}`, exact: true })
    .click();
  await page.getByRole("link", { name: "Перейти в корзину", exact: true }).click();
  await expect(page).toHaveURL("/cart");
  await page.locator("main").getByRole("button", { name: "Увеличить количество" }).click();
  await page.reload();
  await expect.poll(async () => (await stored(page, cartKey))?.items[0]?.quantity).toBe(3);
  await page.getByRole("link", { name: "Перейти к оформлению" }).click();
  await page.getByRole("button", { name: /Оформить заказ/ }).click();
  await expect(page.getByText("Укажите имя: минимум 2 символа")).toBeVisible();
  await checkout(page);
  const state = await stored(page, dataKey);
  const order = state.orders.at(-1);
  expect(order.items[0].quantity).toBe(3);
  expect(order.customer.name).toBe("Покупатель");
  expect(JSON.stringify(state)).not.toContain("Тестовая улица");
  expect((await stored(page, cartKey)).items).toEqual([]);
  expect((await stored(page, cartKey)).savedItems[0].quantity).toBe(3);
  await page.screenshot({
    path: "test-results/presentation/checkout-success.jpg",
    fullPage: true,
    quality: 75,
    animations: "disabled",
  });

  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Обзор магазина" })).toBeVisible();
  await page.getByRole("button", { name: "30 дней", exact: true }).click();
  await expect(page.getByRole("button", { name: "30 дней", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.getByRole("button", { name: "90 дней", exact: true }).click();
  await expect(page.locator(".recharts-surface").first()).toBeVisible();
  await page.goto(`/admin/products/${product.id}`);
  await page.getByLabel("Цена, ₽ *").fill("515");
  await page.getByRole("button", { name: /Сохранить/ }).click();
  await expect(page).toHaveURL(/\/admin\/products$/);
  await page.goto("/catalog");
  await expect(
    page
      .locator(".product-card")
      .filter({ has: page.getByRole("link", { name: "Акватель", exact: true }) }),
  ).toContainText("515");
  await page.reload();
  await expect
    .poll(
      async () =>
        (await stored(page, dataKey))?.products.find((p: { id: string }) => p.id === product.id)
          ?.price,
    )
    .toBe(515);
  await expect(
    page
      .locator(".product-card")
      .filter({ has: page.getByRole("link", { name: "Акватель", exact: true }) }),
  ).toContainText("515");
  await page.goto(`/catalog/${product.slug}`);
  await page
    .getByRole("button", { name: `Добавить в корзину: ${product.name}`, exact: true })
    .click();
  await page.goto("/checkout");
  await checkout(page);
  const nextOrder = (await stored(page, dataKey)).orders.at(-1);
  expect(nextOrder.items[0].unitPrice).toBe(515);
  await page.goto("/admin/orders");
  await page.getByLabel("Номер заказа", { exact: true }).fill(nextOrder.number);
  await page.getByRole("link", { name: nextOrder.number, exact: true }).click();
  await page.getByLabel("Изменить статус").selectOption("confirmed");
  await page.getByRole("button", { name: "Сохранить статус" }).click();
  await expect(page.getByLabel("Изменить статус")).toHaveValue("confirmed");
  await page.reload();
  await expect(page.getByLabel("Изменить статус")).toHaveValue("confirmed");
  const saved = (await stored(page, dataKey)).orders.find(
    (o: { id: string }) => o.id === nextOrder.id,
  );
  expect(saved.statusHistory.at(-1).status).toBe("confirmed");
  expect(saved.items[0].unitPrice).toBe(515);
  expect(
    (await stored(page, dataKey)).orders.find((o: { id: string }) => o.id === order.id).items[0]
      .unitPrice,
  ).toBe(480);
  await page.goto("/");
  await page.getByRole("button", { name: "Повторить набор" }).click();
  expect((await stored(page, cartKey)).items[0].quantity).toBe(1);
  await page.getByRole("button", { name: "Повторить набор" }).click();
  expect((await stored(page, cartKey)).items[0].quantity).toBe(1);

  await page.reload();
  expect((await stored(page, dataKey)).orders).toHaveLength(50);
  await expect(page.locator("body")).not.toContainText(/демо|прототип|вымышлен/i);
  expect(errors).toEqual([]);
});

for (const width of [375, 390, 768, 1024, 1440]) {
  test(`маршруты, ресурсы и адаптивность ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("response", (response) => {
      if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
    });
    const routes = [
      "/",
      "/catalog",
      `/catalog/${product.slug}`,
      "/cart",
      "/checkout",
      "/delivery",
      "/about",
      "/account",
      "/admin",
      "/admin/products",
      "/admin/products/new",
      `/admin/products/${product.id}`,
      "/admin/orders",
      "/admin/orders/fixture-order-1",
    ];
    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status(), route).toBe(200);
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("body")).not.toContainText(/демо|прототип|вымышлен/i);
      expect(await page.title()).not.toMatch(/демо|прототип/i);
      await expect(page.locator('main [aria-busy="true"]')).toHaveCount(0);
      await page.evaluate(async () => {
        const images = Array.from(document.images);
        images.forEach((image) => {
          image.loading = "eager";
        });
        await Promise.all(images.map((image) => image.decode().catch(() => undefined)));
        await document.fonts.ready;
      });
      expect(
        await page.evaluate(() =>
          Array.from(document.images)
            .filter((image) => !image.naturalWidth)
            .map((image) => image.src),
        ),
        route,
      ).toEqual([]);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        route,
      ).toBeLessThanOrEqual(width);
      if (route === `/catalog/${product.slug}`) {
        await page
          .getByRole("button", { name: `Добавить в корзину: ${product.name}`, exact: true })
          .click();
        await expect.poll(async () => (await stored(page, cartKey))?.items[0]?.quantity).toBe(1);
      }
      if (route === "/" || route === "/admin") {
        await page.screenshot({
          path: `test-results/presentation/${route === "/" ? "store" : "admin"}-${width}.jpg`,
          fullPage: true,
          quality: 70,
          animations: "disabled",
        });
      }
      if ((route === "/cart" || route === "/checkout") && (width === 390 || width === 1440)) {
        await page.screenshot({
          path: `test-results/presentation/${route.slice(1)}-${width}.jpg`,
          fullPage: true,
          quality: 70,
          animations: "disabled",
        });
      }
    }
    await page.goto("/catalog");
    if (width < 1024) {
      await page.getByRole("button", { name: "Фильтры", exact: true }).click();
      await page.getByRole("dialog").getByRole("checkbox", { name: "Вода 19 л" }).click();
      await expect(
        page.getByRole("dialog").getByRole("checkbox", { name: "Вода 19 л" }),
      ).toBeChecked();
      await page.getByRole("button", { name: "Показать 2 товара" }).click();
      await expect(page.locator(".product-card")).toHaveCount(2);
      await page.goto("/admin");
      await page.getByRole("button", { name: "Открыть меню", exact: true }).click();
      await page.getByRole("dialog").getByRole("link", { name: "Заказы", exact: true }).click();
      await expect(page).toHaveURL("/admin/orders");
      await expect(page.getByRole("dialog")).toHaveCount(0);
    }
    expect(errors).toEqual([]);
  });
}

test("пустая выдача, корзина, недоступные товары и заказы", async ({ page }) => {
  await page.goto("/cart");
  await expect(page.getByRole("heading", { name: "Ваша корзина пока пуста" })).toBeVisible();
  await page.goto("/checkout");
  await expect(page.getByRole("heading", { name: "Ваша корзина пока пуста" })).toBeVisible();
  await page.goto("/catalog?q=несуществующий-товар");
  await expect(page.getByRole("heading", { name: "Ничего не нашлось" })).toBeVisible();
  await page.getByRole("button", { name: "Сбросить всё", exact: true }).click();
  await expect(page.locator(".product-card")).toHaveCount(products.length);
  await page.goto("/catalog/missing-product");
  await expect(page.getByRole("heading", { name: "Товар недоступен" })).toBeVisible();
  await page.goto("/admin/orders/missing-order");
  await expect(page.getByRole("heading", { name: /Заказ не найден/ })).toBeVisible();
  await page.goto("/admin/products/missing-product");
  await expect(page.getByRole("heading", { name: /Товар не найден/ })).toBeVisible();
  await page.goto("/admin/orders");
  await page.getByLabel("Номер заказа", { exact: true }).fill("missing");
  await expect(page.getByRole("heading", { name: "Заказов пока нет" })).toBeVisible();
});

test("ошибка записи заказа сохраняет корзину и позволяет повторить покупку", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`/catalog/${product.slug}`);
  await page
    .getByRole("button", { name: `Добавить в корзину: ${product.name}`, exact: true })
    .click();
  await page.goto("/checkout");
  await fillCheckout(page);
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === "akvatel-demo-data-v1")
        throw new DOMException("Storage full", "QuotaExceededError");
      original.call(this, key, value);
    };
  });
  await page.getByRole("button", { name: "Оформить заказ" }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText("Не удалось оформить заказ");
  await expect(page.getByLabel("Имя *", { exact: true })).toHaveValue("Демо Покупатель");
  expect((await stored(page, cartKey)).items[0].quantity).toBe(1);
  await page.reload();
  await checkout(page);
  expect((await stored(page, dataKey)).orders).toHaveLength(49);
  expect((await stored(page, cartKey)).items).toEqual([]);
  expect(errors).toEqual([]);
});

test("изменение товара во второй вкладке обновляет открытый каталог", async ({ page, context }) => {
  await page.goto("/catalog");
  await expect(page.locator(".product-card")).toHaveCount(8);
  const admin = await context.newPage();
  await admin.goto(`/admin/products/${product.id}`);
  await admin.getByLabel("Цена, ₽ *").fill("499");
  await admin.getByRole("button", { name: "Сохранить товар" }).click();
  await expect(admin).toHaveURL("/admin/products");
  await expect(
    page
      .locator(".product-card")
      .filter({ has: page.getByRole("link", { name: "Акватель", exact: true }) }),
  ).toContainText("499");
});

test("создание, публикация и архивация товара через интерфейс менеджера", async ({ page }) => {
  await page.goto("/admin/products/new");
  await page.getByRole("button", { name: "Сохранить товар" }).click();
  await expect(page.getByText("Введите название от 2 символов")).toBeVisible();
  await page.getByLabel("Название *", { exact: true }).fill("Тестовая вода");
  await page.getByLabel("Slug *").fill("demo-presentation-water");
  await page.getByLabel("Описание *").fill("Вымышленная вода для проверки демонстрации.");
  await page.getByLabel("Категория *").selectOption("water");
  await page.getByLabel("Цена, ₽ *").fill("123.45");
  await page.getByRole("button", { name: "Сохранить товар" }).click();
  await expect(page).toHaveURL("/admin/products");
  const created = (await stored(page, dataKey)).products.find(
    (item: { slug: string }) => item.slug === "demo-presentation-water",
  );
  expect(created.status).toBe("draft");
  await page.goto("/catalog/demo-presentation-water");
  await expect(page.getByRole("heading", { name: "Товар недоступен" })).toBeVisible();
  await page.goto(`/admin/products/${created.id}`);
  await page.getByLabel("Статус товара").selectOption("published");
  await page.getByRole("button", { name: "Сохранить товар" }).click();
  await expect(page).toHaveURL("/admin/products");
  await page.goto("/catalog/demo-presentation-water");
  await expect(page.getByRole("heading", { level: 1, name: "Тестовая вода" })).toBeVisible();
  await page.goto("/admin/products");
  await page.getByRole("button", { name: "Архивировать Тестовая вода", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "В архив", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.reload();
  expect(
    (await stored(page, dataKey)).products.find((item: { id: string }) => item.id === created.id)
      .status,
  ).toBe("archived");
  expect((await stored(page, dataKey)).orders).toHaveLength(48);
  await page.goto("/catalog/demo-presentation-water");
  await expect(page.getByRole("heading", { name: "Товар недоступен" })).toBeVisible();
});

test("неизвестный маршрут предлагает перейти в каталог", async ({ page }) => {
  const response = await page.goto("/missing-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Страница не найдена" })).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/демо|прототип/i);
  await page.getByRole("link", { name: "Открыть каталог", exact: true }).click();
  await expect(page.locator(".product-card")).toHaveCount(8);
});
