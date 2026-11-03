"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Grid2X2, MapPin, Menu, Phone, ShoppingBag } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMockStore } from "@/data/mock/store";
import { hydrateMockData } from "@/services/mock-repository";
import { cartQuantity, hydrateCartData, useCartStore } from "@/features/cart/store";
import { Brand } from "./brand";

const links = [
  { href: "/delivery", label: "Доставка и оплата" },
  { href: "/about", label: "О компании" },
];
const iconButton =
  "flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-surface";

export function StoreHeader() {
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const categories = useMockStore((state) => state.categories);
  const count = useCartStore((state) => cartQuantity(state.items));

  useEffect(() => {
    void hydrateMockData();
    void hydrateCartData();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <header className="sticky top-0 z-30 border-b bg-white">
        <Container className="flex h-16 items-center gap-0.5 sm:h-20 sm:gap-2 lg:gap-4">
          <Brand className="mr-auto sm:mr-0 max-sm:[&>span:last-child]:hidden max-[360px]:[&>span:first-child]:text-[26px]" />
          <span
            aria-label="Город: Тюмень"
            title="Тюмень"
            className="mr-auto hidden shrink-0 items-center gap-1.5 text-sm sm:inline-flex lg:mx-4"
          >
            <MapPin size={16} className="text-primary" aria-hidden="true" />
            <span className="hidden min-[400px]:inline">Тюмень</span>
          </span>
          <Button asChild className="hidden lg:mr-auto lg:inline-flex">
            <Link href="/catalog">
              <Grid2X2 size={18} />
              Каталог
            </Link>
          </Button>
          <nav
            aria-label="Основная навигация"
            className="hidden items-center gap-4 text-sm font-medium xl:flex"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className="py-3 hover:text-primary aria-[current=page]:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <a
            href="tel:+73452278877"
            aria-label="Позвонить: +7 (3452) 27-88-77"
            title="+7 (3452) 27-88-77"
            className={iconButton}
          >
            <Phone size={21} />
          </a>
          <Link
            href="/cart"
            className="flex size-11 shrink-0 items-center justify-center gap-2 rounded-xl hover:bg-surface 2xl:w-auto 2xl:px-2"
            aria-label={`Корзина: ${count} шт.`}
          >
            <span className="relative inline-flex">
              <ShoppingBag size={22} />
              <span
                aria-live="polite"
                aria-atomic="true"
                className="absolute -top-2 -right-2 flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold leading-5 text-white ring-2 ring-white"
              >
                <span key={count} className="cart-feedback">
                  {count > 99 ? "99+" : count}
                </span>
                <span className="sr-only"> товаров в корзине</span>
              </span>
            </span>
            <span className="hidden text-sm font-medium 2xl:inline">Корзина</span>
          </Link>
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label="Открыть меню"
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
              }}
              className={`${iconButton} xl:hidden`}
            >
              <Menu size={23} />
            </button>
          </DialogTrigger>
        </Container>
      </header>
      <DialogContent
        presentation="sheet"
        className="pt-8"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          triggerRef.current?.focus();
        }}
      >
        <DialogTitle className="pr-9 text-2xl font-semibold">Меню</DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          Вода и всё для её удобной подачи.
        </DialogDescription>
        <nav aria-label="Мобильная навигация" className="grid gap-1 border-b pb-4">
          {[
            { href: "/", label: "Главная" },
            ...links,
            { href: "/cart", label: `Корзина · ${count}` },
          ].map((link) => (
            <DialogClose asChild key={link.href}>
              <Link
                href={link.href}
                className="rounded-xl px-3 py-3 text-sm font-medium hover:bg-surface"
              >
                {link.label}
              </Link>
            </DialogClose>
          ))}
        </nav>
        <nav aria-label="Разделы каталога" className="grid gap-1">
          <DialogClose asChild>
            <Link
              href="/catalog"
              className="rounded-xl px-3 py-3 font-semibold text-primary hover:bg-surface"
            >
              Весь каталог
            </Link>
          </DialogClose>
          {categories.map((category) => (
            <DialogClose asChild key={category.id}>
              <Link
                href={`/catalog?category=${category.slug}`}
                className="flex items-center justify-between rounded-xl px-3 py-3 text-sm hover:bg-surface"
              >
                {category.name}
                <ArrowRight size={16} className="text-muted-foreground" />
              </Link>
            </DialogClose>
          ))}
        </nav>
      </DialogContent>
    </Dialog>
  );
}
