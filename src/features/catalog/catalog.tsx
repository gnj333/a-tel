"use client";
import { productHref } from "@/lib/paths";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CatalogFilterPanel, type FilterUpdate } from "./catalog-filters";
import { CatalogSkeleton } from "./catalog-skeleton";
import { filterProducts, productCount, readCatalogFilters } from "./filter-products";
import { useCatalogData } from "./use-catalog-data";

export function Catalog() {
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { ready, products, categories, items, addProduct } = useCatalogData();
  const filters = readCatalogFilters(searchParams);
  const visible = filterProducts(products, categories, filters);
  const category = categories.find((item) => item.slug === filters.category);
  const hasFilters = Boolean(
    filters.category ||
    filters.query ||
    filters.volume ||
    filters.min !== undefined ||
    filters.max !== undefined,
  );

  const update: FilterUpdate = (changes) => {
    const params = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(changes)) {
      if (value === undefined || value === "") params.delete(key);
      else params.set(key, value);
    }
    window.history.pushState(
      null,
      "",
      `${window.location.pathname}${params.size ? `?${params}` : ""}`,
    );
  };
  const reset = () =>
    update({
      category: undefined,
      volume: undefined,
      q: undefined,
      min: undefined,
      max: undefined,
    });
  const panelProps = {
    categories,
    products,
    filters,
    onUpdate: update,
    onApply: update,
    onReset: reset,
  };
  const chips = [
    ...(filters.category
      ? [
          {
            label: category?.name ?? "Неизвестная категория",
            clear: () => update({ category: undefined, volume: undefined }),
          },
        ]
      : []),
    ...(filters.volume
      ? [
          {
            label: filters.volume === "19" ? "Вода 19 л" : "Вода других объёмов",
            clear: () => update({ volume: undefined }),
          },
        ]
      : []),
    ...(filters.query
      ? [{ label: `Поиск: ${filters.query}`, clear: () => update({ q: undefined }) }]
      : []),
    ...(filters.min !== undefined || filters.max !== undefined
      ? [
          {
            label: `Цена: ${filters.min !== undefined ? `от ${filters.min}` : ""} ${filters.max !== undefined ? `до ${filters.max}` : ""} ₽`,
            clear: () => update({ min: undefined, max: undefined }),
          },
        ]
      : []),
  ];

  if (!ready) return <CatalogSkeleton />;

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Каталог" }]} />
      <div className="mb-8 mt-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-medium text-primary">Для дома и офиса</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Каталог товаров</h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Вода привычного объёма и всё для её удобной подачи.
          </p>
        </div>
        <span className="rounded-full bg-surface px-4 py-2 text-sm text-muted-foreground">
          {productCount(products.filter((product) => product.status === "published").length)} в
          каталоге
        </span>
      </div>
      <div className="grid items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside aria-label="Фильтры каталога" className="hidden rounded-2xl border p-4 lg:block">
          <CatalogFilterPanel {...panelProps} />
        </aside>
        <section aria-label="Товары каталога" className="min-w-0">
          <form
            key={filters.query}
            role="search"
            className="mb-5 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              update({ q: String(new FormData(event.currentTarget).get("q") ?? "").trim() });
            }}
          >
            <label htmlFor="catalog-search" className="sr-only">
              Поиск по названию в каталоге
            </label>
            <Input
              id="catalog-search"
              type="search"
              name="q"
              maxLength={150}
              defaultValue={filters.query}
              placeholder="Найти воду, кулер или помпу"
            />
            <Button type="submit" aria-label="Найти в каталоге" className="px-4">
              <Search size={20} />
            </Button>
          </form>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="text-sm text-muted-foreground"
            >
              Найдено:{" "}
              <span className="font-semibold text-foreground">{productCount(visible.length)}</span>
            </p>
            <label className="flex min-h-12 max-w-full items-center gap-2 text-sm">
              <span className="hidden text-muted-foreground sm:inline">Сортировка</span>
              <select
                aria-label="Сортировка товаров"
                value={filters.sort}
                onChange={(event) =>
                  update({
                    sort: event.target.value === "default" ? undefined : event.target.value,
                  })
                }
                className="min-h-12 max-w-full rounded-xl border border-input bg-white px-3 pr-7 text-sm"
              >
                <option value="default">По умолчанию</option>
                <option value="price-asc">Сначала дешевле</option>
                <option value="price-desc">Сначала дороже</option>
                <option value="name-asc">По названию: А–Я</option>
                <option value="name-desc">По названию: Я–А</option>
              </select>
            </label>
            <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="w-full lg:hidden">
                  <SlidersHorizontal size={18} />
                  Фильтры{chips.length ? ` · ${chips.length}` : ""}
                </Button>
              </DialogTrigger>
              <DialogContent presentation="sheet" className="gap-6">
                <DialogTitle className="pr-10 text-2xl font-semibold">Фильтры</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Выберите раздел и подходящую цену.
                </DialogDescription>
                <CatalogFilterPanel
                  {...panelProps}
                  onApply={(changes) => {
                    update(changes);
                    setMobileOpen(false);
                  }}
                />
                <DialogClose asChild>
                  <Button>Показать {productCount(visible.length)}</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
          {chips.length > 0 && (
            <div aria-label="Применённые фильтры" className="mb-6 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={chip.clear}
                  aria-label={`Убрать фильтр: ${chip.label}`}
                  className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-xl bg-surface px-3 text-left text-xs hover:bg-primary/10"
                >
                  <span className="break-words">{chip.label}</span>
                  <X size={14} className="shrink-0" />
                </button>
              ))}
              <Button variant="ghost" className="min-h-11 px-3 text-xs" onClick={reset}>
                Сбросить всё
              </Button>
            </div>
          )}
          {visible.length ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((product, index) => (
                <ProductCard
                  imageLoading={index < 3 ? "eager" : "lazy"}
                  key={product.id}
                  product={product}
                  detailHref={productHref(product.slug)}
                  showQuantity
                  inCartQuantity={
                    items.find((item) => item.productId === product.id)?.quantity ?? 0
                  }
                  onAdd={addProduct}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title={hasFilters ? "Ничего не нашлось" : "Каталог пока пуст"}
              description={
                hasFilters
                  ? "Попробуйте другой запрос, расширьте диапазон цены или выберите другую категорию."
                  : "Опубликованные товары появятся здесь. Уточнить ассортимент можно по телефону +7 (3452) 27-88-77."
              }
              action={
                hasFilters ? (
                  <Button onClick={reset}>Сбросить фильтры</Button>
                ) : (
                  <Button asChild>
                    <a href="tel:+73452278877">Позвонить</a>
                  </Button>
                )
              }
            />
          )}
          <p className="mt-8 border-t pt-5 text-xs text-muted-foreground">
            Тара и доставка учитываются отдельно. Наличие уточняется при заказе.
          </p>
        </section>
      </div>
    </Container>
  );
}
