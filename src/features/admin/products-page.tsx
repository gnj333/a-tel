"use client";
import { adminProductHref } from "@/lib/paths";

import Link from "next/link";
import Image from "@/components/shared/image";
import { useRef, useState } from "react";
import { Archive, Pencil, Plus, Package } from "lucide-react";
import { toast } from "sonner";
import { useMockStore } from "@/data/mock/store";
import type { Product } from "@/domain/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { formatPrice } from "@/lib/commerce";
import { AdminHeading } from "./admin-ui";
import { archiveProduct } from "./admin-service";
import { publicationLabels } from "./admin-data";

function ProductThumb({ product }: { product: Product }) {
  const [failedImage, setFailedImage] = useState<string>();
  return (
    <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white">
      {product.image && failedImage !== product.image ? (
        <Image
          src={product.image}
          alt=""
          fill
          sizes="48px"
          className="object-contain p-1"
          onError={() => setFailedImage(product.image)}
        />
      ) : (
        <Package size={20} className="text-muted-foreground" />
      )}
    </div>
  );
}
function ProductActions({
  product,
  onArchive,
}: {
  product: Product;
  onArchive: (product: Product, trigger: HTMLButtonElement) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" asChild className="size-11 min-h-11 px-0">
        <Link href={adminProductHref(product.id)} aria-label={`Редактировать ${product.name}`}>
          <Pencil size={17} />
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="size-11 min-h-11 px-0 text-muted-foreground"
        aria-label={`Архивировать ${product.name}`}
        disabled={product.status === "archived"}
        onClick={(event) => onArchive(product, event.currentTarget)}
      >
        <Archive size={17} />
      </Button>
    </div>
  );
}
function Publication({ product }: { product: Product }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium ${product.status === "published" ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-600"}`}
    >
      {publicationLabels[product.status]}
    </span>
  );
}

export function ProductsPage() {
  const products = useMockStore((state) => state.products);
  const categories = useMockStore((state) => state.categories);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [archiving, setArchiving] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const archiveTrigger = useRef<HTMLButtonElement | null>(null);
  function openArchive(product: Product, trigger: HTMLButtonElement) {
    archiveTrigger.current = trigger;
    setArchiving(product);
  }
  const filtered = products.filter(
    (product) =>
      product.name.toLowerCase().includes(query.trim().toLowerCase()) &&
      (!category || product.categoryId === category) &&
      (!status || product.status === status),
  );
  const categoryName = (id: string) =>
    categories.find((item) => item.id === id)?.name ?? "Без категории";
  async function confirmArchive() {
    if (!archiving || saving) return;
    setSaving(true);
    try {
      await archiveProduct(archiving.id);
      toast.success("Товар перемещён в архив");
      setArchiving(null);
    } catch {
      toast.error("Не удалось сохранить изменения. Попробуйте ещё раз.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <>
      <AdminHeading
        title="Товары"
        description={`${products.length} товаров в общем каталоге магазина`}
        action={
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus size={18} />
              Добавить товар
            </Link>
          </Button>
        }
      />
      <section className="admin-panel">
        <div className="grid gap-3 border-b p-4 sm:grid-cols-[minmax(180px,1fr)_1fr_1fr] sm:p-5">
          <label className="admin-filter-label">
            Поиск
            <Input
              className="mt-1 h-11 text-sm"
              placeholder="Название товара"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <label className="admin-filter-label">
            Категория
            <select
              className="admin-select mt-1"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Все категории</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-filter-label">
            Публикация
            <select
              className="admin-select mt-1"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Все статусы</option>
              {Object.entries(publicationLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="px-5 py-3 text-xs text-muted-foreground" role="status">
          Найдено: {filtered.length}
        </p>
        {filtered.length ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="admin-table">
                <caption className="sr-only">Товары магазина</caption>
                <thead>
                  <tr>
                    <th>Товар</th>
                    <th>Категория</th>
                    <th className="text-right">Цена</th>
                    <th>Публикация</th>
                    <th>
                      <span className="sr-only">Действия</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <ProductThumb product={product} />
                          <div>
                            <Link
                              className="font-medium hover:text-primary"
                              href={adminProductHref(product.id)}
                            >
                              {product.name}
                            </Link>
                            <p className="text-xs text-muted-foreground">/{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-muted-foreground">{categoryName(product.categoryId)}</td>
                      <td className="whitespace-nowrap text-right font-medium tabular-nums">
                        {formatPrice(product.price)}
                      </td>
                      <td>
                        <Publication product={product} />
                      </td>
                      <td>
                        <ProductActions product={product} onArchive={openArchive} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="divide-y md:hidden">
              {filtered.map((product) => (
                <article key={product.id} className="p-4">
                  <div className="flex gap-3">
                    <ProductThumb product={product} />
                    <div className="min-w-0 flex-1">
                      <Link
                        className="break-words text-sm font-medium text-primary"
                        href={adminProductHref(product.id)}
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {categoryName(product.categoryId)}
                      </p>
                      <p className="mt-1 font-semibold">{formatPrice(product.price)}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <Publication product={product} />
                    <ProductActions product={product} onArchive={openArchive} />
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="p-5">
            <EmptyState
              title="Товары не найдены"
              description="Попробуйте изменить запрос или сбросить фильтры."
              action={
                <Button
                  variant="secondary"
                  onClick={() => {
                    setQuery("");
                    setCategory("");
                    setStatus("");
                  }}
                >
                  Сбросить фильтры
                </Button>
              }
            />
          </div>
        )}
      </section>
      <p className="mt-4 text-xs text-muted-foreground">
        Архивные товары скрыты в магазине. Состав и цены прежних заказов сохраняются.
      </p>
      <Dialog
        open={!!archiving}
        onOpenChange={(open) => {
          if (!open && !saving) setArchiving(null);
        }}
      >
        <DialogContent
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            const trigger = archiveTrigger.current;
            if (trigger?.isConnected) {
              if (!trigger.disabled) trigger.focus();
              else (trigger.previousElementSibling as HTMLElement | null)?.focus();
            }
          }}
        >
          <DialogTitle className="pr-8 text-xl font-semibold">
            Переместить товар в архив?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            «{archiving?.name}» исчезнет из магазина. История заказов сохранится. Вернуть товар
            можно в форме редактирования.
          </DialogDescription>
          <div className="flex flex-wrap justify-end gap-3">
            <DialogClose asChild>
              <Button variant="secondary" disabled={saving}>
                Отмена
              </Button>
            </DialogClose>
            <Button disabled={saving} onClick={confirmArchive}>
              {saving ? "Сохраняем…" : "В архив"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
