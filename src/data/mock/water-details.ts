import type { Product } from "@/domain/models";

// Facts from the supplier's product pages, checked 2026-11-03.
export const waterDetails: Record<
  string,
  Pick<Product, "description" | "attributes" | "documents" | "image">
> = {
  "water-akvatel-19": {
    image: "/images/akvatel-19-clean.webp",
    description: "Природная питьевая вода с магнием и кальцием. Для питья без кипячения.",
    attributes: {
      Объём: "19 л",
      Тара: "Обменная",
      "Особенности воды": "Содержит магний и кальций",
      "Срок годности": "6 месяцев",
      "Материал бутыли": "Поликарбонат",
      "Категория качества": "Первая",
    },
    documents: [
      {
        name: "Декларация соответствия · Акватель",
        url: "https://pub.fsa.gov.ru/rds/declaration/view/21592502/common",
      },
    ],
  },
  "water-akvatel-light-19": {
    image: "/images/akvatel-light-19-clean.webp",
    description: "Умягчённая питьевая вода. Для чайника, кофемашины и приготовления еды.",
    attributes: {
      Объём: "19 л",
      Тара: "Обменная",
      "Особенности воды": "Умягчённая, скорректирован водно-солевой состав",
      "Срок годности": "6 месяцев",
      "Материал бутыли": "Поликарбонат",
    },
    documents: [
      {
        name: "Декларация соответствия · Акватель Лайт",
        url: "https://pub.fsa.gov.ru/rds/declaration/view/20883825/common",
      },
    ],
  },
};

const legacyDescriptions = [
  "Природная вода, 19 л. Обменная тара учитывается отдельно.",
  "Менделеевская природная вода, 19 л. Обменная тара учитывается отдельно.",
];

// Refresh original copy without replacing a manager's price, status, image or custom text.
export function refreshWaterDetails(product: Product): Product {
  const details = waterDetails[product.id];
  if (!details) return product;
  return {
    ...product,
    image: ["/images/akvatel-19.jpg", "/images/akvatel-light-19.jpeg"].includes(product.image ?? "")
      ? details.image
      : product.image,
    description: legacyDescriptions.includes(product.description)
      ? details.description
      : product.description,
    attributes: { ...details.attributes, ...product.attributes },
    documents: product.documents ?? details.documents,
  };
}
