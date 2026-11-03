"use client";

import { useId, useState } from "react";
import type { Category, Product } from "@/domain/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parsePrice, type CatalogFilters } from "./filter-products";

export type FilterUpdate = (changes: Record<string, string | undefined>) => void;

export function CatalogFilterPanel({
  categories,
  products,
  filters,
  onUpdate,
  onApply,
  onReset,
}: {
  categories: Category[];
  products: Product[];
  filters: CatalogFilters;
  onUpdate: FilterUpdate;
  onApply: FilterUpdate;
  onReset: () => void;
}) {
  const id = useId();
  const published = products.filter((product) => product.status === "published");
  const options = [
    { slug: "", name: "Все товары", count: published.length },
    ...categories.map((category) => ({
      slug: category.slug,
      name: category.name,
      count: published.filter((product) => product.categoryId === category.id).length,
    })),
  ];

  return (
    <div className="space-y-7">
      <fieldset>
        <legend className="mb-3 font-semibold">Категории</legend>
        <div className="grid gap-1">
          {options.map((option) => (
            <label
              key={option.slug}
              className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 text-sm ${filters.category === option.slug ? "bg-primary/10 font-semibold text-primary" : "hover:bg-surface"}`}
            >
              <input
                type="radio"
                name={`${id}-category`}
                value={option.slug}
                checked={filters.category === option.slug}
                onChange={() => onUpdate({ category: option.slug, volume: undefined })}
                className="size-4 accent-primary"
              />
              <span className="flex-1">{option.name}</span>
              <span className="text-xs tabular-nums text-muted-foreground">{option.count}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-3 font-semibold">Объём воды</legend>
        <div className="grid gap-1">
          {[
            { value: "19", label: "Вода 19 л" },
            { value: "other", label: "Вода других объёмов" },
          ].map((option) => (
            <label
              key={option.value}
              className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 text-sm hover:bg-surface"
            >
              <input
                type="checkbox"
                checked={filters.volume === option.value}
                onChange={() =>
                  onUpdate({
                    category:
                      categories.find((category) => category.id === "water")?.slug ?? "voda",
                    volume: filters.volume === option.value ? undefined : option.value,
                  })
                }
                className="size-4 accent-primary"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>
      <CatalogPriceFilter key={JSON.stringify(filters)} filters={filters} onApply={onApply} />
      <Button variant="ghost" className="w-full" onClick={onReset}>
        Сбросить фильтры
      </Button>
    </div>
  );
}

function CatalogPriceFilter({
  filters,
  onApply,
}: {
  filters: CatalogFilters;
  onApply: FilterUpdate;
}) {
  const id = useId();
  const [error, setError] = useState("");
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const min = String(data.get("min") ?? "");
        const max = String(data.get("max") ?? "");
        const minimum = parsePrice(min);
        const maximum = parsePrice(max);
        if ((min && minimum === undefined) || (max && maximum === undefined)) {
          setError("Укажите положительную цену с точностью до копеек.");
          return;
        }
        if (minimum !== undefined && maximum !== undefined && minimum > maximum) {
          setError("Цена «от» должна быть не больше цены «до».");
          return;
        }
        setError("");
        onApply({ min: minimum?.toString(), max: maximum?.toString() });
      }}
    >
      <fieldset>
        <legend className="mb-3 font-semibold">Цена, ₽</legend>
        <div className="grid grid-cols-2 gap-2">
          <label htmlFor={`${id}-min`} className="text-xs text-muted-foreground">
            От
            <Input
              id={`${id}-min`}
              name="min"
              type="number"
              inputMode="decimal"
              min="0"
              max="1000000000"
              step="0.01"
              defaultValue={filters.min ?? ""}
              placeholder="0"
              className="mt-1 px-3"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${id}-error` : undefined}
            />
          </label>
          <label htmlFor={`${id}-max`} className="text-xs text-muted-foreground">
            До
            <Input
              id={`${id}-max`}
              name="max"
              type="number"
              inputMode="decimal"
              min="0"
              max="1000000000"
              step="0.01"
              defaultValue={filters.max ?? ""}
              placeholder="Любая"
              className="mt-1 px-3"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${id}-error` : undefined}
            />
          </label>
        </div>
        {error && (
          <p id={`${id}-error`} role="alert" className="mt-2 text-xs text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" variant="secondary" className="mt-3 w-full">
          Применить цену
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">
          За единицу продажи. Вода 5 л — упаковками по 4 бутыли.
        </p>
      </fieldset>
    </form>
  );
}
