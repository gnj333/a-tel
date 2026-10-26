"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Grid2X2, MapPin, Menu, Phone, Search, ShoppingBag, UserRound } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMockStore } from "@/data/mock/store";
import { hydrateMockData } from "@/services/mock-repository";
import { cartQuantity, useCartStore } from "@/features/cart/store";
import { Brand } from "./brand";

const links = [{ href: "/delivery", label: "Доставка и оплата" }, { href: "/about", label: "О компании" }];
const iconButton = "flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-surface";

export function StoreHeader() {
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<"catalog" | "search" | "menu">("menu");
  const [query, setQuery] = useState("");
  const categories = useMockStore((state) => state.categories);
  const products = useMockStore((state) => state.products);
  const count = useCartStore((state) => cartQuantity(state.items));
  const matches = query.trim() ? products.filter((product) => product.status === "published" && product.name.toLocaleLowerCase("ru").includes(query.trim().toLocaleLowerCase("ru"))) : [];

  useEffect(() => {
    void hydrateMockData();
    void useCartStore.persist.rehydrate();
  }, []);

  return <Dialog open={open} onOpenChange={setOpen}>
    <header className="sticky top-0 z-30 border-b bg-white">
      <div className="border-b bg-surface text-xs sm:text-sm">
        <Container className="flex min-h-10 items-center justify-between gap-4">
          <span className="inline-flex items-center gap-1.5"><MapPin size={14} className="text-primary" />Тюмень</span>
          <Link href="/delivery" className="hidden hover:text-primary sm:inline">Информация о доставке</Link>
          <a href="tel:+73452278877" className="inline-flex min-h-10 items-center gap-2 font-semibold hover:text-primary"><Phone size={14} />+7 (3452) 27-88-77</a>
        </Container>
      </div>
      <Container className="flex h-20 items-center gap-2 lg:gap-4">
        <Brand className="mr-auto lg:mr-2" />
        <DialogTrigger asChild><Button className="hidden lg:inline-flex" onClick={(event) => { triggerRef.current = event.currentTarget; setPanel("catalog"); }}><Grid2X2 size={18} />Каталог</Button></DialogTrigger>
        <DialogTrigger asChild><button type="button" onClick={(event) => { triggerRef.current = event.currentTarget; setPanel("search"); }} aria-label="Поиск товаров" className="flex size-11 shrink-0 items-center justify-center gap-2 rounded-xl text-muted-foreground hover:bg-surface lg:h-12 lg:w-auto lg:min-w-36 lg:flex-1 lg:justify-start lg:border lg:px-4"><Search size={20} /><span className="hidden text-sm lg:inline">Поиск товаров</span></button></DialogTrigger>
        <nav aria-label="Основная навигация" className="hidden items-center gap-4 text-sm font-medium xl:flex">{links.map((link) => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined} className="py-3 hover:text-primary aria-[current=page]:text-primary">{link.label}</Link>)}</nav>
        <Link href="/account" aria-label="Личный кабинет" className={`${iconButton} hidden lg:flex`}><UserRound size={21} /></Link>
        <Link href="/cart" className="relative flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-2 hover:bg-surface" aria-label={`Корзина: ${count} шт.`}><ShoppingBag size={22} /><span className="hidden text-sm font-medium 2xl:inline">Корзина</span><span aria-live="polite" aria-atomic="true" className="flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold leading-5 text-white">{count > 99 ? "99+" : count}<span className="sr-only"> товаров в корзине</span></span></Link>
        <DialogTrigger asChild><button type="button" aria-label="Открыть меню" onClick={(event) => { triggerRef.current = event.currentTarget; setPanel("menu"); }} className={`${iconButton} xl:hidden`}><Menu size={23} /></button></DialogTrigger>
      </Container>
    </header>
    <DialogContent className="max-w-xl pt-8" onCloseAutoFocus={(event) => { event.preventDefault(); triggerRef.current?.focus(); }}>
      <DialogTitle className="pr-9 text-2xl font-semibold">{panel === "search" ? "Поиск товаров" : panel === "catalog" ? "Каталог" : "Меню"}</DialogTitle>
      <DialogDescription className="text-sm text-muted-foreground">{panel === "search" ? "Поиск по названиям в демонстрационном ассортименте." : "Вода и всё для её удобной подачи."}</DialogDescription>
      {panel === "search" ? <>
        <form action="/catalog" method="get" role="search" onSubmit={() => setOpen(false)} className="flex gap-2">
          <label htmlFor="store-search" className="sr-only">Название товара</label>
          <Input id="store-search" name="q" type="search" placeholder="Например, Акватель" value={query} onChange={(event) => setQuery(event.target.value)} maxLength={150} />
          <Button type="submit" aria-label="Найти"><Search size={20} /></Button>
        </form>
        <div aria-live="polite" className="text-sm">
          {!query.trim() ? <p className="text-muted-foreground">Введите название товара.</p> : matches.length ? <ul>{matches.map((product) => <li key={product.id}><DialogClose asChild><Link href={`/catalog?q=${encodeURIComponent(product.name)}`} className="flex min-h-12 items-center justify-between gap-4 rounded-xl px-3 hover:bg-surface"><span>{product.name}{product.volumeLiters ? ` · ${product.volumeLiters} л` : ""}</span><ArrowRight size={18} /></Link></DialogClose></li>)}</ul> : <p className="text-muted-foreground">Ничего не найдено. Попробуйте другое название.</p>}
        </div>
      </> : <>
        {panel === "menu" && <nav aria-label="Мобильная навигация" className="grid gap-1 border-b pb-4">{[{ href: "/", label: "Главная" }, ...links, { href: "/account", label: "Личный кабинет" }, { href: "/cart", label: `Корзина · ${count}` }].map((link) => <DialogClose asChild key={link.href}><Link href={link.href} className="rounded-xl px-3 py-3 text-sm font-medium hover:bg-surface">{link.label}</Link></DialogClose>)}</nav>}
        <nav aria-label="Разделы каталога" className="grid gap-1">
          <DialogClose asChild><Link href="/catalog" className="rounded-xl px-3 py-3 font-semibold text-primary hover:bg-surface">Весь каталог</Link></DialogClose>
          {categories.map((category) => <DialogClose asChild key={category.id}><Link href={`/catalog?category=${category.slug}`} className="flex items-center justify-between rounded-xl px-3 py-3 text-sm hover:bg-surface">{category.name}<ArrowRight size={16} className="text-muted-foreground" /></Link></DialogClose>)}
        </nav>
      </>}
    </DialogContent>
  </Dialog>;
}
