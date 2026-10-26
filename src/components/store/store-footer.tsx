"use client";

import Link from "next/link";
import { Container } from "@/components/shared/container";
import { useMockStore } from "@/data/mock/store";
import { Brand } from "./brand";

const footerLink = "inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-primary";

export function StoreFooter() {
  const categories = useMockStore((state) => state.categories);
  return <footer className="border-t bg-surface">
    <Container className="pb-6 pt-12 sm:pt-16">
      <div className="grid gap-10 pb-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:gap-8">
        <div><Brand /><p className="mt-5 max-w-64 text-sm text-muted-foreground">Доставка питьевой воды домой и в офис в Тюмени. Вода, кулеры и сопутствующие товары.</p><p className="mt-5 inline-block rounded-lg border bg-white px-3 py-1.5 text-xs text-muted-foreground">Демонстрационная версия</p></div>
        <div><h2 className="mb-3 text-sm font-semibold">Каталог</h2><ul>{categories.map((category) => <li key={category.id}><Link href={`/catalog?category=${category.slug}`} className={footerLink}>{category.name}</Link></li>)}</ul></div>
        <div><h2 className="mb-3 text-sm font-semibold">Покупателям</h2><ul>{[["/delivery", "Доставка и оплата"], ["/about", "О компании"], ["/account", "Личный кабинет"], ["/cart", "Корзина"]].map(([href, label]) => <li key={href}><Link href={href} className={footerLink}>{label}</Link></li>)}</ul></div>
        <div><h2 className="mb-3 text-sm font-semibold">Связаться с нами</h2><a href="tel:+73452278877" className="inline-flex min-h-11 items-center text-lg font-semibold hover:text-primary">+7 (3452) 27-88-77</a><br /><a href="mailto:office@a-tel.ru" className={footerLink}>office@a-tel.ru</a><p className="mt-3 text-sm text-muted-foreground">Тюмень, ул. Одесская, 9<br />Центральный офис</p></div>
      </div>
      <div className="flex flex-col justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row sm:gap-8"><p>ООО «Акватель» · ИНН 7202199543<br />ОГРН 1097232023426</p><p className="max-w-md sm:text-right">Прототип для презентации. Реальные заказы и оплата не принимаются. <a href="https://a-tel.ru/site/contact/" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-primary">Контакты и реквизиты на сайте компании ↗</a></p></div>
    </Container>
  </footer>;
}
