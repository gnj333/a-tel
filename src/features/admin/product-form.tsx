"use client";
import { productHref } from "@/lib/paths";

import Link from "next/link";
import Image from "@/components/shared/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Package, Save } from "lucide-react";
import { useMockStore } from "@/data/mock/store";
import type { Product } from "@/domain/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminHeading, MissingRecord } from "./admin-ui";
import { productSchema, type ProductValues } from "./product-schema";
import { saveAdminProduct } from "./admin-service";
import { publicationLabels } from "./admin-data";

export function ProductEditor({ id }: { id?: string }) {
  const product = useMockStore((state) => state.products.find((item) => item.id === id));
  if (id && !product) return <MissingRecord kind="product" />;
  return <ProductForm key={id ?? "new"} product={product} />;
}
function ProductForm({ product }: { product?: Product }) {
  const categories = useMockStore((state) => state.categories);
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [failedImage, setFailedImage] = useState<string>();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      categoryId: product?.categoryId ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
      volumeLiters: product?.volumeLiters ?? "",
      image: product?.image ?? "",
      status: product?.status ?? "draft",
    },
  });
  const image = useWatch({ control, name: "image" });
  const name = useWatch({ control, name: "name" });
  const canPreview =
    productSchema.shape.image.safeParse(image).success && !!image && image !== failedImage;
  const inputProps = (field: keyof ProductValues) => ({
    id: field,
    "aria-invalid": !!errors[field],
    "aria-describedby": errors[field] ? `${field}-error` : undefined,
  });
  const error = (field: keyof ProductValues) =>
    errors[field] && (
      <p id={`${field}-error`} role="alert" className="mt-1 text-xs text-destructive">
        {errors[field]?.message}
      </p>
    );
  async function submit(values: ProductValues) {
    if (values.image && values.image === failedImage) {
      setError("image", {
        message: "Изображение недоступно. Загрузите файл или исправьте путь.",
      });
      return;
    }
    try {
      await saveAdminProduct(values, product?.id);
      toast.success(product ? "Товар обновлён в магазине" : "Товар создан");
      router.push("/admin/products");
    } catch (err) {
      setError("root", {
        message: err instanceof Error ? err.message : "Не удалось сохранить товар",
      });
      toast.error("Товар не сохранён");
    }
  }
  async function upload(file?: File) {
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 1024 * 1024) {
      setError("image", {
        message: "Выберите PNG, JPEG или WebP размером до 1 МБ",
      });
      return;
    }
    setUploading(true);
    try {
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      setValue("image", data, { shouldDirty: true, shouldValidate: true });
    } catch {
      setError("image", { message: "Не удалось прочитать изображение" });
    } finally {
      setUploading(false);
    }
  }
  return (
    <>
      <AdminHeading
        title={product ? "Редактирование товара" : "Новый товар"}
        description="Управляйте описанием, ценой и публикацией товара."
        action={
          product?.status === "published" ? (
            <Button variant="secondary" asChild>
              <Link href={productHref(product.slug)}>Открыть в магазине</Link>
            </Button>
          ) : undefined
        }
      />
      <form
        onSubmit={handleSubmit(submit)}
        noValidate
        className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]"
      >
        <div className="space-y-6">
          <section className="admin-panel space-y-5 p-5 sm:p-6">
            <h2 className="font-semibold">Основная информация</h2>
            <div>
              <label className="admin-label" htmlFor="name">
                Название *
              </label>
              <Input {...inputProps("name")} {...register("name")} placeholder="Название товара" />
              {error("name")}
            </div>
            <div>
              <label className="admin-label" htmlFor="slug">
                Slug *
              </label>
              <Input {...inputProps("slug")} {...register("slug")} placeholder="water-19" />
              <p className="mt-1 text-xs text-muted-foreground">
                Адрес карточки: /catalog/slug. Уникальное значение латиницей.
              </p>
              {error("slug")}
            </div>
            <div>
              <label className="admin-label" htmlFor="description">
                Описание *
              </label>
              <textarea
                {...inputProps("description")}
                {...register("description")}
                rows={5}
                className="admin-textarea"
              />
              {error("description")}
            </div>
            <div>
              <label className="admin-label" htmlFor="categoryId">
                Категория *
              </label>
              <select
                className="admin-select"
                {...inputProps("categoryId")}
                {...register("categoryId")}
              >
                <option value="">Выберите категорию</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {error("categoryId")}
            </div>
          </section>
          <section className="admin-panel p-5 sm:p-6">
            <h2 className="mb-5 font-semibold">Цена и характеристики</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="admin-label" htmlFor="price">
                  Цена, ₽ *
                </label>
                <Input
                  type="number"
                  min="0.01"
                  max="1000000"
                  step="0.01"
                  inputMode="decimal"
                  {...inputProps("price")}
                  {...register("price", { valueAsNumber: true })}
                />
                {error("price")}
              </div>
              <div>
                <label className="admin-label" htmlFor="volumeLiters">
                  Объём, л
                </label>
                <Input
                  type="number"
                  min="0.01"
                  step="any"
                  inputMode="decimal"
                  {...inputProps("volumeLiters")}
                  {...register("volumeLiters", {
                    setValueAs: (value) => (value === "" ? "" : Number(value)),
                  })}
                />
                {error("volumeLiters")}
              </div>
            </div>
            {product?.saleUnit === "pack" && (
              <p className="mt-3 text-xs text-muted-foreground">
                Цена указана за упаковку; объём — одной бутыли. Состав упаковки сохраняется.
              </p>
            )}
          </section>
          <section className="admin-panel space-y-4 p-5 sm:p-6">
            <h2 className="font-semibold">Изображение</h2>
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="relative flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-white">
                {canPreview ? (
                  <Image
                    src={image}
                    alt={name || "Предпросмотр товара"}
                    fill
                    sizes="160px"
                    className="object-contain p-3"
                    onError={() => setFailedImage(image)}
                  />
                ) : (
                  <Package size={36} className="text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <label className="admin-label" htmlFor="image-file">
                  Загрузить изображение
                </label>
                <input
                  id="image-file"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  disabled={uploading || isSubmitting}
                  className="block min-h-11 w-full max-w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-surface file:px-3 file:py-2 file:text-primary"
                  onChange={(e) => {
                    void upload(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
                <p className="mt-2 text-xs text-muted-foreground">PNG, JPEG, WebP до 1 МБ.</p>
                {uploading && (
                  <p role="status" className="mt-2 text-xs">
                    Загрузка…
                  </p>
                )}
                <Button
                  variant="ghost"
                  className="mt-2 px-0"
                  disabled={!image}
                  onClick={() =>
                    setValue("image", "", {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                >
                  Убрать изображение
                </Button>
              </div>
            </div>
            <div>
              <label className="admin-label" htmlFor="image">
                Или путь к файлу в public/images
              </label>
              <Input
                {...inputProps("image")}
                {...register("image")}
                placeholder="/images/akvatel-19.jpg"
                value={image.startsWith("data:") ? "" : image}
                onChange={(e) =>
                  setValue("image", e.target.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
              {image.startsWith("data:") && (
                <p className="mt-1 text-xs text-accent">Используется загруженный файл</p>
              )}
              {failedImage === image && !!image && (
                <p className="mt-1 text-xs text-destructive">
                  Изображение по этому пути не найдено. Проверьте путь или загрузите файл.
                </p>
              )}
              {error("image")}
            </div>
          </section>
        </div>
        <aside className="admin-panel space-y-5 p-5 xl:sticky xl:top-6">
          <h2 className="font-semibold">Публикация</h2>
          <div>
            <label className="admin-label" htmlFor="status">
              Статус товара
            </label>
            <select className="admin-select" {...inputProps("status")} {...register("status")}>
              {Object.entries(publicationLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {error("status")}
          </div>
          <p className="text-xs text-muted-foreground">
            В магазине видны только опубликованные товары. Черновики и архивные товары скрыты от
            покупателей.
          </p>
          {errors.root && (
            <p role="alert" className="text-sm text-destructive">
              {errors.root.message}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={isSubmitting || uploading}>
            <Save size={17} />
            {isSubmitting ? "Сохраняем…" : "Сохранить товар"}
          </Button>
          <Button variant="secondary" className="w-full" asChild>
            <Link href="/admin/products">Вернуться к списку</Link>
          </Button>
          <p className="text-xs text-muted-foreground" role="status">
            {isDirty ? "Есть несохранённые изменения" : "Все поля актуальны"}
          </p>
        </aside>
      </form>
    </>
  );
}
