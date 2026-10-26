"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Bookmark, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { useMockStore } from "@/data/mock/store";
import { useCartStore } from "@/features/cart/store";

export function HomeShopping() {
  const router = useRouter();
  const products = useMockStore((state) => state.products);
  const items = useCartStore((state) => state.items);
  const savedItems = useCartStore((state) => state.savedItems);
  const water = products.filter((product) => product.categoryId === "water" && product.status === "published");
  const available = products.filter((product) => product.status === "published");
  const saved = savedItems.filter((item) => available.some((product) => product.id === item.productId));
  return <>
    <section id="popular" className="scroll-mt-36 py-14 sm:py-20" aria-label="Популярная вода">
      <SectionHeading title="Вода на каждый день" description="Для дома, офиса и привычного ритма жизни." action={<Link href="/catalog?category=voda" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary">Вся вода <ArrowRight size={18} /></Link>} />
      <div className="mt-8 grid gap-6 md:grid-cols-2">{water.map((product) => <ProductCard key={product.id} product={product} showQuantity onAdd={(selected, quantity) => {
        useCartStore.getState().addItem(selected.id, quantity);
        toast.success(`${selected.name} · ${quantity} шт. добавлено`, { action: { label: "В корзину", onClick: () => router.push("/cart") } });
      }} />)}</div>
      {!water.length && <p className="mt-8 rounded-2xl border p-6 text-muted-foreground">Сейчас нет опубликованной воды. Ассортимент можно уточнить по телефону компании.</p>}
      <p className="mt-5 text-xs text-muted-foreground">Цены — снимок каталога a-tel.ru от 26.10.2026, не оферта. Тара и доставка учитываются отдельно.</p>
    </section>
    <section className="grid gap-8 rounded-3xl bg-surface p-6 sm:p-10 lg:grid-cols-[1fr_1fr]" aria-labelledby="repeat-title">
      <div><RotateCcw className="mb-5 text-primary" size={28} /><h2 id="repeat-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">Заказываете воду регулярно?</h2><p className="mt-3 max-w-lg text-muted-foreground">Сохраните привычный набор, чтобы в следующий раз добавить его одним нажатием.</p></div>
      <div className="flex flex-col justify-center rounded-2xl border bg-white p-6">
        {savedItems.length ? <><h3 className="font-semibold">Ваш сохранённый набор</h3><ul className="mt-3 space-y-2 text-sm text-muted-foreground">{savedItems.map((item) => <li key={item.productId}>{products.find((product) => product.id === item.productId)?.name ?? "Товар недоступен"} · {item.quantity} шт.</li>)}</ul>{saved.length < savedItems.length && <p className="mt-3 text-sm text-muted-foreground">Недоступные товары не будут добавлены.</p>}<p className="mt-3 text-xs text-muted-foreground">Количество сохранённых позиций будет восстановлено в корзине. Остальные товары останутся. Цены — текущие в прототипе.</p><Button className="mt-5 self-start" disabled={!saved.length} onClick={() => { useCartStore.getState().repeatSaved(available.map((product) => product.id)); toast.success("Сохранённый набор добавлен в корзину"); }}>Повторить набор <ArrowRight size={17} /></Button></> : <><h3 className="font-semibold">Начните со своего первого набора</h3><p className="mt-2 text-sm text-muted-foreground">Добавьте воду в корзину и сохраните её здесь. Набор будет доступен в этом браузере.</p></>}
        {!!items.length && <Button variant="secondary" className="mt-4 self-start" onClick={() => { useCartStore.getState().saveForRepeat(); toast.success("Текущая корзина сохранена для повторения"); }}><Bookmark size={17} />{savedItems.length ? "Сохранить текущую корзину" : "Сохранить набор из корзины"}</Button>}
        {!items.length && !savedItems.length && <Button asChild variant="secondary" className="mt-5 self-start"><a href="#popular">Выбрать воду</a></Button>}
      </div>
    </section>
  </>;
}
