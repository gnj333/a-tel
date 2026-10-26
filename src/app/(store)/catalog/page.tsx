import Link from "next/link";
import { InfoPage } from "@/components/store/info-page";
import { categories } from "@/data/mock/seed";

export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const params = await searchParams;
  const category = categories.find((item) => item.slug === params.category);
  return <InfoPage title="Каталог"><p>Каталог с карточками товаров и фильтрами появится на этапе 4.</p>{category && <p>Выбран раздел: <strong className="text-foreground">{category.name}</strong>.</p>}{params.q && <p>Поисковый запрос: <strong className="break-words text-foreground">{params.q.slice(0, 150)}</strong>. Он сохранён в адресе страницы.</p>}<Link href="/design-system" className="inline-flex min-h-11 items-center text-primary underline underline-offset-4">Посмотреть пример карточки в дизайн-системе</Link></InfoPage>;
}
