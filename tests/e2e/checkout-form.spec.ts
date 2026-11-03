import { test, expect } from "@playwright/test";
import { products } from "@/data/mock/seed";

const formKey = "akvatel-demo-checkout-form-v1";
const product = products[0];

test("форма сохраняет незавершённый ввод и восстанавливается после заказа", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(`/catalog/${product.slug}`);
  await page
    .getByRole("button", { name: `Добавить в корзину: ${product.name}`, exact: true })
    .click();
  await page.goto("/checkout");
  await page.getByLabel("Имя *", { exact: true }).fill("А");
  await page.getByLabel("Телефон *").fill("79");
  await page.reload();
  await expect(page.getByLabel("Имя *", { exact: true })).toHaveValue("А");
  await expect(page.getByLabel("Телефон *")).toHaveValue("+7 (9");

  const fields = {
    name: "Демо Покупатель",
    phone: "+7 (999) 000-00-00",
    street: "Тестовая улица",
    building: "10/1",
    apartment: "12",
    comment: "Позвонить у подъезда",
    deliveryDate: (await page.locator("#deliveryDate").getAttribute("min"))!,
  };
  for (const [id, value] of Object.entries(fields)) {
    await page.locator(`#${id}`).fill(value);
  }
  await page.getByRole("checkbox", { name: /Сохранить состав/ }).check();
  await page.reload();
  for (const [id, value] of Object.entries(fields)) {
    await expect(page.locator(`#${id}`)).toHaveValue(value);
  }
  await expect(page.getByRole("checkbox", { name: /Сохранить состав/ })).toBeChecked();

  await page.locator("#comment").fill("");
  await page.getByRole("checkbox", { name: /Сохранить состав/ }).uncheck();
  await page.getByRole("link", { name: "Вернуться в корзину" }).click();
  await page.getByRole("link", { name: "Перейти к оформлению" }).click();
  await expect(page.locator("#comment")).toHaveValue("");
  await expect(page.getByRole("checkbox", { name: /Сохранить состав/ })).not.toBeChecked();
  await expect(page.locator("#street")).toHaveValue(fields.street);

  await page.getByRole("button", { name: /Оформить заказ/ }).click();
  await expect(page.getByRole("heading", { name: "Заказ оформлен" })).toBeVisible();
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), formKey)).toEqual({
    ...fields,
    comment: "",
    saveBasket: false,
  });

  await page.goto(`/catalog/${product.slug}`);
  await page
    .getByRole("button", { name: `Добавить в корзину: ${product.name}`, exact: true })
    .click();
  await page.goto("/checkout");
  await expect(page.locator("#name")).toHaveValue(fields.name);
  await expect(page.locator("#street")).toHaveValue(fields.street);
  expect(errors).toEqual([]);
});
