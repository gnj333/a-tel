"use client";
import { useState } from "react";
import { ArrowUpRight, Check, Layers } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { QuantitySelector } from "@/components/shared/quantity-selector";
import { EmptyState } from "@/components/shared/empty-state";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { products } from "@/data/mock/seed";
const colors = [
  ["Brand blue", "#087BE8"],
  ["Actions", "#0669C5"],
  ["Action hover", "#0559A8"],
  ["Surface", "#F3F8FC"],
  ["Text", "#132337"],
  ["Muted text", "#586B7D"],
  ["Border", "#E3EBF2"],
  ["Accent text", "#087D69"],
  ["Brand accent", "#13A68C"],
  ["Background", "#FFFFFF"],
];
export function DesignSystem() {
  const [quantity, setQuantity] = useState(1);
  const [example, setExample] = useState("");
  return (
    <main id="main" tabIndex={-1}>
      <Container className="py-8 sm:py-12">
        <div className="mb-12 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xl font-bold tracking-tight text-primary">
            акватель{" "}
            <span className="ml-2 text-sm font-normal text-muted-foreground">/ design system</span>
          </p>
          <Badge>Дизайн-система</Badge>
        </div>
        <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Дизайн-система" }]} />
        <div className="mb-16 mt-8 grid gap-8 border-b pb-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
              <Layers size={16} /> ОСНОВА / 01
            </div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-[56px]">
              Чистый дизайн.
              <br />
              Продуманные детали.
            </h1>
            <p className="mt-6 max-w-xl text-muted-foreground">
              Визуальная система магазина «Акватель»: ясная типографика, спокойные поверхности и
              понятные действия.
            </p>
          </div>
          <div className="flex flex-col justify-end gap-3 lg:col-span-4">
            <p className="text-sm text-muted-foreground">Premium Clean Commerce</p>
            <p className="text-xl font-medium">
              Inter · Сетка 12 колонок
              <br />
              Контейнер 1280 · Шаг 8
            </p>
            <p className="text-sm text-muted-foreground">
              Библиотека компонентов магазина и панели управления.
            </p>
          </div>
        </div>
        <section className="mb-16">
          <SectionHeading
            title="Цветовая палитра"
            description="Функциональные цвета с общей семантикой в магазине и админке."
          />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {colors.map(([name, hex]) => (
              <div className="overflow-hidden rounded-xl border" key={name}>
                <div className="h-20 border-b" style={{ background: hex }} />
                <div className="p-3">
                  <p className="text-sm font-medium">{name}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{hex}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-16 grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading title="Типографика" />
            <div className="mt-8 space-y-5">
              <p className="text-4xl font-semibold leading-tight sm:text-5xl">Вода. Каждый день.</p>
              <p className="text-3xl font-semibold">Заголовок раздела</p>
              <p className="text-xl font-semibold">Название товара</p>
              <p>Основной текст · 16 px</p>
              <p className="text-sm text-muted-foreground">Подписи и пояснения · 14 px</p>
            </div>
          </div>
          <div className="rounded-2xl bg-surface p-6 sm:p-8">
            <h3 className="text-xl font-semibold">Размеры и ритм</h3>
            <dl className="mt-6 space-y-4">
              {[
                ["Отступы", "8 / 16 / 24 / 32 / 48 / 64"],
                ["Скругления", "12 / 16 / 20 px"],
                ["Кнопки и поля", "48 px"],
                ["Hero", "48–56 px"],
                ["H2 / H3", "30–36 / 20–24 px"],
              ].map(([k, v]) => (
                <div className="flex flex-wrap justify-between gap-2 border-b pb-3" key={k}>
                  <dt className="text-sm text-muted-foreground">{k}</dt>
                  <dd className="text-sm font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
        <section className="mb-16">
          <SectionHeading
            title="Действия и ввод"
            description="Кнопки, поля ввода и состояния интерактивных элементов."
          />
          <div className="mt-8 grid gap-8 rounded-2xl border p-6 sm:p-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => toast.success("Компонент уведомления работает")}>
                  Основная <ArrowUpRight size={16} />
                </Button>
                <Button variant="secondary" onClick={() => toast("Дополнительное действие")}>
                  Дополнительная
                </Button>
                <Button disabled>Недоступна</Button>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <QuantitySelector value={quantity} onChange={setQuantity} />
                <span className="text-sm text-muted-foreground">Выбрано: {quantity}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge>Новинка</Badge>
                <Badge className="bg-accent/10 text-foreground">
                  <Check size={14} className="mr-1 text-accent" /> Активно
                </Badge>
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium" htmlFor="component-input">
                  Пример поля
                </label>
                <Input
                  id="component-input"
                  placeholder="Введите тестовый текст"
                  value={example}
                  onChange={(e) => setExample(e.target.value)}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Текст остаётся только на этой странице.
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary">Открыть диалог</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle className="pr-8 text-xl font-semibold">
                    Понятное подтверждение
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    Базовый диалог с фокусом внутри окна, закрытием по Escape и возвратом к кнопке
                    вызова.
                  </DialogDescription>
                  <DialogClose asChild>
                    <Button>Понятно</Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>
        <section className="mb-16">
          <SectionHeading
            title="Товар и состояния"
            description="Карточка товара, загрузка и пустые состояния."
          />
          <div className="mt-8 grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <ProductCard
                product={products[0]}
                onAdd={(p) => {
                  toast.success(`Пример действия: ${p.name}`, {
                    description: "Проверка компонента без изменения корзины.",
                  });
                }}
                actionLabel="Проверить"
              />
            </div>
            <div className="rounded-2xl border p-6" role="status" aria-label="Пример загрузки">
              <Skeleton className="h-56" />
              <Skeleton className="mt-6 h-6 w-2/3" />
              <Skeleton className="mt-4 h-4" />
              <Skeleton className="mt-2 h-4 w-3/4" />
              <Skeleton className="mt-6 h-12" />
              <p className="mt-4 text-sm text-muted-foreground">Пример состояния загрузки</p>
            </div>
            <EmptyState
              headingLevel="h3"
              title="Здесь пока пусто"
              description="Объясняем состояние и предлагаем понятный следующий шаг."
              action={
                <Button
                  variant="secondary"
                  onClick={() => toast("Пример действия пустого состояния")}
                >
                  Проверить действие
                </Button>
              }
            />
          </div>
        </section>
        <p className="border-t py-6 text-sm text-muted-foreground">
          Акватель · Библиотека компонентов интерфейса.
        </p>
      </Container>
    </main>
  );
}
