"use client";
import { productHref } from "@/lib/paths";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CreditCard, FileText, Recycle, Truck } from "lucide-react";
import type { Product } from "@/domain/models";
import { Container } from "@/components/shared/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { EmptyState } from "@/components/shared/empty-state";
import { ProductCard } from "@/components/product/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCatalogData } from "@/features/catalog/use-catalog-data";
import {
  findPublishedProduct,
  needsBottleExchange,
  productImages,
  similarProducts,
} from "./product-data";
import { ProductGallery } from "./product-gallery";
import { ProductPurchase } from "./product-purchase";

function ProductSkeleton() {
  return (
    <Container className="py-8 sm:py-12">
      <div role="status" aria-busy="true">
        <span className="sr-only">Загружаем товар и корзину</span>
        <Skeleton className="h-5 w-56 max-w-full" />
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square" />
          <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="mt-5 h-12" />
            <Skeleton className="mt-5 h-20" />
            <Skeleton className="mt-8 h-64" />
          </div>
        </div>
      </div>
    </Container>
  );
}

function Characteristics({ product }: { product: Product }) {
  const attributes = Object.entries(product.attributes);
  return attributes.length ? (
    <dl className="mt-5 divide-y">
      {attributes.map(([label, value]) => (
        <div key={label} className="grid grid-cols-2 gap-4 py-3 text-sm">
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="break-words font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  ) : (
    <p className="mt-4 text-sm text-muted-foreground">
      Подробные характеристики можно уточнить у компании.
    </p>
  );
}

export function ProductPage({ slug }: { slug: string }) {
  const { ready, products, categories, items, addProduct } = useCatalogData("top-center");
  const product = findPublishedProduct(products, slug);
  const category = categories.find((item) => item.id === product?.categoryId);

  if (!ready)
    return (
      <main id="main" tabIndex={-1}>
        <ProductSkeleton />
      </main>
    );

  const related = product ? similarProducts(products, product) : [];
  const exchange = product && needsBottleExchange(product);
  const categoryHref = category ? `/catalog?category=${category.slug}` : "/catalog";

  return (
    <main id="main" tabIndex={-1} className="pb-28 md:pb-0">
      <Container className="py-8 sm:py-12">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Каталог", href: "/catalog" },
            ...(category ? [{ label: category.name, href: categoryHref }] : []),
            { label: product?.name ?? "Товар недоступен" },
          ]}
        />
        {!product ? (
          <div className="mt-8">
            <EmptyState
              headingLevel="h1"
              title="Товар недоступен"
              description="Возможно, товар снят с публикации или ссылка изменилась. Выберите другой товар в каталоге."
              action={
                <Button asChild>
                  <Link href="/catalog">Открыть каталог</Link>
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <div className="mt-8 grid items-start gap-8 md:grid-cols-2 lg:gap-16">
              <ProductGallery
                key={product.id}
                images={productImages(product)}
                name={product.name}
              />
              <section aria-labelledby="product-title" className="min-w-0">
                <div className="flex flex-wrap gap-2">
                  <Badge>{category?.name ?? "Товар"}</Badge>
                  {product.volumeLiters && (
                    <Badge>
                      {product.saleUnit === "pack"
                        ? `${product.volumeLiters} л в бутыли`
                        : `${product.volumeLiters} л`}
                    </Badge>
                  )}
                </div>
                <h1
                  id="product-title"
                  className="mt-4 break-words text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
                >
                  {product.name}
                </h1>
                <p className="mt-4 text-muted-foreground">{product.description}</p>
                <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                  {Object.entries(product.attributes)
                    .slice(0, 3)
                    .map(([label, value]) => (
                      <div key={label} className="text-sm">
                        <dt className="text-xs text-muted-foreground">{label}</dt>
                        <dd className="mt-1 font-medium">{value}</dd>
                      </div>
                    ))}
                </dl>
                <a
                  href="#characteristics"
                  className="mb-6 mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary"
                >
                  Все характеристики
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
                <ProductPurchase
                  key={product.id}
                  product={product}
                  inCart={items.find((item) => item.productId === product.id)?.quantity ?? 0}
                  onAdd={addProduct}
                />
                <div className="mt-5 flex items-start gap-3 text-sm">
                  <Truck size={21} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="font-medium">Доставка в Тюмени</p>
                    <p className="mt-1 text-muted-foreground">
                      До квартиры или офиса. Стоимость и время уточняются при заказе.
                    </p>
                    <Link
                      href="/delivery"
                      className="inline-flex min-h-11 items-center text-primary underline underline-offset-4"
                    >
                      Доставка и оплата
                    </Link>
                  </div>
                </div>
              </section>
            </div>
            {exchange && (
              <section
                aria-labelledby="exchange-title"
                className="mt-10 flex gap-4 rounded-2xl border border-primary/15 bg-surface p-5 sm:mt-14 sm:p-8"
              >
                <Recycle size={26} className="mt-1 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <h2 id="exchange-title" className="text-lg font-semibold">
                    19 литров — с обменом тары
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                    При доставке передайте пустую обменную бутыль курьеру. Если обменной тары нет,
                    её нужно приобрести отдельно. Цена воды указана без дополнительной бутыли;
                    условия обмена и итоговую стоимость уточните у компании.
                  </p>
                  <Link
                    href="/catalog?category=butyli"
                    className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary"
                  >
                    Выбрать пустую бутыль
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </section>
            )}
            <div className="mt-12 grid gap-x-16 gap-y-10 border-t pt-10 md:grid-cols-2 sm:mt-16">
              <section aria-labelledby="description-title">
                <h2 id="description-title" className="text-2xl font-semibold">
                  О товаре
                </h2>
                <p className="mt-5 text-muted-foreground">{product.description}</p>
              </section>
              <section
                id="characteristics"
                aria-labelledby="characteristics-title"
                className="scroll-mt-36"
              >
                <h2 id="characteristics-title" className="text-2xl font-semibold">
                  Характеристики
                </h2>
                <Characteristics product={product} />
              </section>
              <section aria-labelledby="delivery-title" className="md:col-span-2">
                <h2 id="delivery-title" className="text-2xl font-semibold">
                  Доставка и оплата
                </h2>
                <div className="mt-5 grid gap-6 sm:grid-cols-2">
                  <div className="flex gap-3">
                    <Truck size={21} className="mt-1 shrink-0 text-primary" aria-hidden="true" />
                    <div>
                      <h3 className="font-medium">До вашей двери</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Доставка по Тюмени до квартиры или офиса. Возможность доставки в пригород,
                        стоимость и удобный интервал согласуются с компанией.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CreditCard
                      size={21}
                      className="mt-1 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="font-medium">Наличные или карта</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Оплата наличными при получении или банковской картой. Удобный способ оплаты
                        уточните при подтверждении заказа.
                      </p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/delivery"
                  className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary"
                >
                  Подробнее об условиях
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </section>
              {Boolean(product.documents?.length) && (
                <section aria-labelledby="documents-title" className="md:col-span-2">
                  <h2 id="documents-title" className="text-2xl font-semibold">
                    Документы
                  </h2>
                  <ul className="mt-4 grid gap-3">
                    {product.documents!.map((document) => (
                      <li key={document.url}>
                        <a
                          href={document.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-12 items-center gap-3 rounded-xl border px-4 py-2 text-sm text-primary hover:bg-surface"
                        >
                          <FileText size={19} aria-hidden="true" />
                          {document.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
            {related.length > 0 && (
              <section aria-labelledby="related-title" className="mt-12 border-t pt-10 sm:mt-16">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <h2 id="related-title" className="text-2xl font-semibold">
                    Похожие товары
                  </h2>
                  <Link
                    href={categoryHref}
                    className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary"
                  >
                    Вся категория
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((item) => (
                    <ProductCard
                      key={item.id}
                      product={item}
                      detailHref={productHref(item.slug)}
                      showQuantity
                      onAdd={addProduct}
                      inCartQuantity={
                        items.find((cartItem) => cartItem.productId === item.id)?.quantity ?? 0
                      }
                    />
                  ))}
                </div>
              </section>
            )}
            <Button asChild variant="ghost" className="mt-8">
              <Link href={categoryHref}>
                <ArrowLeft size={16} aria-hidden="true" />
                Вернуться в каталог
              </Link>
            </Button>
          </>
        )}
      </Container>
    </main>
  );
}
