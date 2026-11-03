"use client";
import type { ReactNode } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ChevronRight,
  LayoutDashboard,
  Menu,
  Package,
  ShoppingBag,
  Droplets,
} from "lucide-react";
import { hydrateMockData } from "@/services/mock-repository";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Обзор", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Заказы", icon: ShoppingBag },
  { href: "/admin/products", label: "Товары", icon: Package },
];
function Navigation({ close }: { close?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Административная панель" className="space-y-1">
      {links.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={close}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
              active
                ? "bg-primary/8 text-primary"
                : "text-muted-foreground hover:bg-surface hover:text-foreground",
            )}
          >
            <Icon size={19} aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
function Identity() {
  return (
    <Link href="/admin" className="flex items-center gap-3 px-2 py-2">
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-white">
        <Droplets size={23} />
      </span>
      <span className="text-lg font-semibold tracking-tight">
        Акватель
        <span className="block text-xs font-normal tracking-normal text-muted-foreground">
          Управление магазином
        </span>
      </span>
    </Link>
  );
}
export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    void hydrateMockData()
      .then(() => {
        if (active) setReady(true);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, []);
  const section = pathname.startsWith("/admin/products")
    ? "Товары"
    : pathname.startsWith("/admin/orders")
      ? "Заказы"
      : "Обзор";
  const sectionHref = section === "Товары" ? "/admin/products" : "/admin/orders";
  const detail = pathname.split("/").filter(Boolean).length > 2;
  return (
    <div data-layout="admin" className="flex min-h-dvh items-start bg-[#f7f9fc]">
      <aside className="sticky top-0 z-30 hidden h-dvh w-[248px] shrink-0 flex-col border-r bg-white px-4 py-6 lg:flex">
        <Identity />
        <p className="mb-3 mt-10 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Магазин
        </p>
        <Navigation />
        <div className="mt-auto space-y-5 px-2">
          <Link
            href="/"
            className="flex min-h-11 items-center justify-between text-sm text-muted-foreground hover:text-primary"
          >
            Открыть магазин
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex min-h-20 items-center justify-between gap-3 border-b bg-white px-4 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  className="size-11 min-h-11 px-0 lg:hidden"
                  aria-label="Открыть меню"
                >
                  <Menu size={20} />
                </Button>
              </DialogTrigger>
              <DialogContent
                presentation="sheet"
                className="left-0 right-auto rounded-l-none rounded-r-2xl"
              >
                <DialogTitle className="text-xl font-semibold">Акватель</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Управление магазином
                </DialogDescription>
                <Navigation close={() => setOpen(false)} />
                <Button variant="secondary" asChild>
                  <Link href="/" onClick={() => setOpen(false)}>
                    Открыть магазин
                    <ArrowUpRight size={17} />
                  </Link>
                </Button>
              </DialogContent>
            </Dialog>
            <nav
              aria-label="Хлебные крошки"
              className="flex min-w-0 flex-wrap items-center gap-2 text-sm text-muted-foreground"
            >
              <Link href="/admin" className="hidden hover:text-primary sm:inline">
                Управление
              </Link>
              <ChevronRight aria-hidden="true" size={14} className="hidden sm:block" />
              {detail ? (
                <>
                  <Link href={sectionHref} className="hover:text-primary">
                    {section}
                  </Link>
                  <ChevronRight size={14} aria-hidden="true" />
                  <span aria-current="page">
                    {pathname.endsWith("/new") ? "Новый товар" : "Карточка"}
                  </span>
                </>
              ) : (
                <span aria-current="page" className="text-foreground">
                  {section}
                </span>
              )}
            </nav>
          </div>
        </header>
        <main id="main" tabIndex={-1} className="mx-auto max-w-[1600px] px-4 py-7 sm:px-8 sm:py-9">
          {error ? (
            <div role="alert" className="admin-panel p-6">
              Не удалось загрузить данные.
              <Button className="mt-4 block" onClick={() => window.location.reload()}>
                Повторить
              </Button>
            </div>
          ) : ready ? (
            children
          ) : (
            <div role="status" aria-label="Загрузка панели" className="space-y-6">
              <Skeleton className="h-12 w-64" />
              <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
              <Skeleton className="h-80 w-full" />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
