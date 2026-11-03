"use client";
import { productHref } from "@/lib/paths";

import Image from "@/components/shared/image";
import Link from "next/link";
import { ArrowRight, Check, Recycle, Truck } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Price } from "@/components/shared/price";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { ProductCardSkeleton } from "@/components/product/product-card-skeleton";
import { useCatalogData } from "@/features/catalog/use-catalog-data";
import { RepeatOrder } from "./repeat-order";

export function HomeShopping() {
  const { ready, products, items, addProduct } = useCatalogData();
  const water = products.filter(
    (product) =>
      product.categoryId === "water" &&
      product.volumeLiters === 19 &&
      product.status === "published",
  );
  const bottle = products.find(
    (product) => product.id === "bottle-19" && product.status === "published",
  );
  const equipment = ["bottle-19", "pump-mr01", "cooler-k12"].flatMap((id) => {
    const product = products.find((entry) => entry.id === id && entry.status === "published");
    return product ? [product] : [];
  });
  const heroProduct = water[0];

  return (
    <>
      <section className="overflow-hidden border-b bg-surface" aria-labelledby="home-title">
        <Container className="grid items-center gap-8 py-8 sm:py-12 md:grid-cols-[1.2fr_0.8fr] lg:py-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
              Домой и в офис · Тюмень
            </p>
            <h1
              id="home-title"
              className="mt-4 max-w-2xl text-[34px] font-semibold leading-[1.1] tracking-[-0.045em] sm:text-5xl xl:text-[56px]"
            >
              Чистая вода 19 л<br />с доставкой в Тюмени
            </h1>
            <p className="mt-4 max-w-lg text-muted-foreground sm:text-lg">
              «Акватель» и «Акватель Лайт» — выберите воду для питья, чая и приготовления еды.
            </p>
            <div className="mt-5 min-h-9">
              {ready && water.length > 0 && (
                <p className="flex flex-wrap items-baseline gap-2">
                  <span className="text-sm text-muted-foreground">от</span>{" "}
                  <Price
                    amount={Math.min(...water.map((product) => product.price))}
                    className="text-3xl"
                  />
                  <span className="text-sm text-muted-foreground">
                    за бутыль · без тары и доставки
                  </span>
                </p>
              )}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
              <Button asChild>
                <a href="#popular">
                  Выбрать воду <ArrowRight size={18} />
                </a>
              </Button>
              <a
                href="#delivery"
                className="inline-flex min-h-12 items-center gap-2 text-sm font-semibold"
              >
                Как доставляем <ArrowRight size={16} />
              </a>
            </div>
            <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground sm:text-sm">
              {["До квартиры и офиса", "Заказ без регистрации"].map((text) => (
                <span key={text} className="inline-flex items-center gap-2">
                  <Check size={15} className="text-accent" aria-hidden="true" />
                  {text}
                </span>
              ))}
            </p>
          </div>
          {heroProduct?.image && (
            <div className="relative hidden h-80 md:block lg:h-96">
              <div className="absolute inset-8 rounded-full bg-white/70" />
              <Image
                src={heroProduct.image}
                alt={heroProduct.imageAlt}
                fill
                preload
                sizes="(max-width: 767px) 1px, 440px"
                className="object-contain p-4 mix-blend-multiply"
              />
            </div>
          )}
        </Container>
      </section>
      <Container>
        <RepeatOrder ready={ready} />
        <section
          id="popular"
          className="scroll-mt-0 py-9 sm:py-14"
          aria-label="Выбор воды"
          aria-busy={!ready}
        >
          <SectionHeading
            title="Выберите свою воду"
            description="Цена за воду. Дополнительная тара и доставка в неё не входят."
            action={
              <Link
                href="/catalog?category=voda"
                className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary"
              >
                Вся вода <ArrowRight size={18} />
              </Link>
            }
          />
          {!ready ? (
            <div role="status" className="mt-6 grid gap-5 md:grid-cols-2">
              <span className="sr-only">Загружаем ассортимент и вашу корзину</span>
              {[0, 1].map((index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : water.length ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {water.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  detailHref={productHref(product.slug)}
                  compact
                  showQuantity
                  inCartQuantity={
                    items.find((item) => item.productId === product.id)?.quantity ?? 0
                  }
                  onAdd={addProduct}
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border bg-surface p-6">
              <h3 className="text-lg font-semibold">Вода пока недоступна для выбора</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Уточните ассортимент по телефону{" "}
                <a href="tel:+73452278877" className="font-medium text-primary underline">
                  +7 (3452) 27-88-77
                </a>
                .
              </p>
            </div>
          )}
          <div className="mt-5 grid gap-4 rounded-2xl bg-surface p-5 text-sm sm:grid-cols-2 sm:gap-6">
            <div className="flex gap-3">
              <Recycle size={21} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <h3 className="font-semibold">Есть пустая бутыль?</h3>
                <p className="mt-1 text-muted-foreground">
                  Передайте её курьеру при получении. Если подходящей тары нет, добавьте пустую
                  бутыль к заказу
                  {ready && bottle ? (
                    <>
                      {" "}
                      — <Price amount={bottle.price} className="text-sm font-medium" />
                    </>
                  ) : null}
                  .
                </p>
                <a
                  href={equipment.length ? "#first-order" : "/catalog?category=butyli"}
                  className="inline-flex min-h-11 items-center gap-2 font-medium text-primary"
                >
                  Всё для первого заказа <ArrowRight size={15} />
                </a>
              </div>
            </div>
            <div className="flex gap-3">
              <Truck size={21} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <h3 className="font-semibold">Доставка до двери</h3>
                <p className="mt-1 text-muted-foreground">
                  Стоимость, минимальное количество и доступный интервал уточните до подтверждения
                  заказа.
                </p>
                <a
                  href="tel:+73452278877"
                  className="inline-flex min-h-11 items-center font-medium text-primary"
                >
                  +7 (3452) 27-88-77
                </a>
              </div>
            </div>
          </div>
        </section>
        {(!ready || equipment.length > 0) && (
          <section
            id="first-order"
            className="scroll-mt-0 border-t py-9 sm:py-14"
            aria-label="Для первого заказа"
          >
            <SectionHeading
              title="Заказываете впервые?"
              description="Без своей тары понадобится пустая бутыль. Для подачи воды можно выбрать помпу или кулер."
              action={
                <Link
                  href="/catalog"
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary"
                >
                  Весь каталог <ArrowRight size={18} />
                </Link>
              }
            />
            {ready && bottle && water.length > 0 && (
              <p className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
                <span>Вода + новая бутыль — от</span>
                <Price
                  amount={Math.min(...water.map((product) => product.price)) + bottle.price}
                  className="text-lg"
                />
                <span className="text-muted-foreground">без доставки</span>
              </p>
            )}
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {ready
                ? equipment.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      detailHref={productHref(product.slug)}
                      compact
                      accessory
                      onAdd={addProduct}
                      inCartQuantity={
                        items.find((item) => item.productId === product.id)?.quantity ?? 0
                      }
                    />
                  ))
                : [0, 1, 2].map((index) => <ProductCardSkeleton key={index} />)}
            </div>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm font-medium text-primary">
              <Link
                className="inline-flex min-h-11 items-center gap-2"
                href="/catalog?category=pompy"
              >
                Все помпы <ArrowRight size={15} />
              </Link>
              <Link
                className="inline-flex min-h-11 items-center gap-2"
                href="/catalog?category=kulery"
              >
                Все кулеры <ArrowRight size={15} />
              </Link>
              <Link
                className="inline-flex min-h-11 items-center gap-2"
                href="/catalog?category=soputstvuyushchie-tovary"
              >
                Аксессуары <ArrowRight size={15} />
              </Link>
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
