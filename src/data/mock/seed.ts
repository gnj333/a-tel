import type { Category, Order, Product } from "@/domain/models";
const checkedAt = "2026-10-26";
export const categories: Category[] = [
  ["water", "voda", "Вода"], ["coolers", "kulery", "Кулеры"], ["pumps", "pompy", "Помпы"],
  ["accessories", "soputstvuyushchie-tovary", "Сопутствующие товары"], ["bottles", "butyli", "Бутыли"],
].map(([id, slug, name]) => ({ id, slug, name, source: { url: `https://a-tel.ru/category/${slug}/`, checkedAt } }));
export const products: Product[] = [{
  id: "water-akvatel-19", slug: "akvatel-19", name: "Акватель", categoryId: "water",
  description: "Природная вода, 19 л. Обменная тара учитывается отдельно.",
  price: 480, currency: "RUB", volumeLiters: 19, image: "/images/akvatel-19.jpg",
  imageAlt: "Бутыль природной воды «Акватель», 19 литров", status: "published", isDemo: false,
  attributes: { "Объём": "19 л", "Тара": "Обменная" },
  source: { url: "https://a-tel.ru/category/voda/", checkedAt, note: "Снимок цены из каталога; карточка в веб-индексе показывает 460 ₽. Перед публикацией перепроверить. Не оферта." },
}, {
  id: "water-akvatel-light-19", slug: "akvatel-light-19", name: "Акватель Лайт", categoryId: "water",
  description: "Менделеевская природная вода, 19 л. Обменная тара учитывается отдельно.",
  price: 420, currency: "RUB", volumeLiters: 19, image: "/images/akvatel-light-19.jpeg",
  imageAlt: "Бутыль природной воды «Акватель Лайт», 19 литров", status: "published", isDemo: false,
  attributes: { "Объём": "19 л", "Тара": "Обменная" },
  source: { url: "https://a-tel.ru/category/voda/", checkedAt, note: "Цена за одну бутыль из каталога. Снимок для прототипа, не оферта." },
}];
// Orders are added by the demo checkout in a later stage. No customer data is seeded.
export const orders: Order[] = [];
