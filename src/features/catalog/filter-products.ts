import type { Category, Product } from "@/domain/models";

export const catalogSorts = [
  "default",
  "price-asc",
  "price-desc",
  "name-asc",
  "name-desc",
] as const;
export type CatalogSort = (typeof catalogSorts)[number];
export interface CatalogFilters {
  category: string;
  query: string;
  volume: "" | "19" | "other";
  min?: number;
  max?: number;
  sort: CatalogSort;
}

export function parsePrice(value: string | null): number | undefined {
  if (!value || !/^\d+(?:[.,]\d{1,2})?$/.test(value)) return undefined;
  const price = Number(value.replace(",", "."));
  return Number.isFinite(price) && price <= 1_000_000_000 ? price : undefined;
}

export function readCatalogFilters(params: Pick<URLSearchParams, "get">): CatalogFilters {
  const sort = params.get("sort");
  const volume = params.get("volume");
  return {
    category: params.get("category") ?? "",
    query: (params.get("q") ?? "").trim().slice(0, 150),
    volume: volume === "19" || volume === "other" ? volume : "",
    min: parsePrice(params.get("min")),
    max: parsePrice(params.get("max")),
    sort: catalogSorts.includes(sort as CatalogSort) ? (sort as CatalogSort) : "default",
  };
}

export function filterProducts(
  products: Product[],
  categories: Category[],
  filters: CatalogFilters,
): Product[] {
  const categoryId = filters.category
    ? categories.find((category) => category.slug === filters.category)?.id
    : undefined;
  const query = filters.query.toLocaleLowerCase("ru").replaceAll("ё", "е");
  const result = products.filter((product) => {
    if (product.status !== "published") return false;
    if (filters.category && product.categoryId !== categoryId) return false;
    if (query && !product.name.toLocaleLowerCase("ru").replaceAll("ё", "е").includes(query))
      return false;
    if (
      filters.min !== undefined &&
      Math.round(product.price * 100) < Math.round(filters.min * 100)
    )
      return false;
    if (
      filters.max !== undefined &&
      Math.round(product.price * 100) > Math.round(filters.max * 100)
    )
      return false;
    if (filters.volume && (product.categoryId !== "water" || !product.volumeLiters)) return false;
    if (filters.volume === "19" && product.volumeLiters !== 19) return false;
    return filters.volume !== "other" || product.volumeLiters !== 19;
  });
  const nameOrder = (a: Product, b: Product) =>
    a.name.localeCompare(b.name, "ru", { numeric: true });
  switch (filters.sort) {
    case "price-asc":
      return result.sort((a, b) => a.price - b.price || nameOrder(a, b));
    case "price-desc":
      return result.sort((a, b) => b.price - a.price || nameOrder(a, b));
    case "name-asc":
      return result.sort(nameOrder);
    case "name-desc":
      return result.sort((a, b) => nameOrder(b, a));
    default:
      return result;
  }
}

export function productCount(count: number): string {
  const form = new Intl.PluralRules("ru").select(count);
  return `${count} ${form === "one" ? "товар" : form === "few" ? "товара" : "товаров"}`;
}
