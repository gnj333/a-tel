import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Check,
  CupSoda,
  Droplets,
  GlassWater,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { HomeShopping } from "@/features/home/home-shopping";

const categories = [
  { name: "Вода", slug: "voda", text: "На каждый день", icon: Droplets },
  { name: "Кулеры", slug: "kulery", text: "Для дома и команды", icon: GlassWater },
  { name: "Помпы", slug: "pompy", text: "Удобная подача воды", icon: PackageCheck },
  {
    name: "Аксессуары",
    slug: "soputstvuyushchie-tovary",
    text: "Полезные дополнения",
    icon: CupSoda,
  },
];
const questions = [
  [
    "Нужна ли обменная бутыль?",
    "Вода 19 л поставляется в обменной поликарбонатной таре. Если подходящей пустой бутыли нет, её приобретают отдельно. Условия и стоимость уточняйте у компании.",
  ],
  [
    "Когда привезут воду?",
    "Доступный день, интервал и стоимость доставки нужно уточнить у компании. Доставка за пределы Тюмени согласовывается отдельно.",
  ],
  [
    "Как можно оплатить заказ?",
    "Заказ можно оплатить наличными при получении или банковской картой. Удобный способ оплаты уточните при подтверждении заказа.",
  ],
  [
    "Как повторить свой выбор?",
    "Добавьте товары в корзину и нажмите «Сохранить набор из корзины» в блоке повторного заказа. В следующий раз выберите сохранённый набор и добавьте его в корзину одним нажатием.",
  ],
];

export default function Home() {
  return (
    <main id="main" tabIndex={-1}>
      <section className="overflow-hidden border-b bg-surface" aria-labelledby="home-title">
        <Container className="grid items-center gap-4 py-9 sm:py-12 lg:grid-cols-[1.2fr_1fr] lg:gap-8">
          <div className="relative z-10">
            <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
              <span className="size-1.5 rounded-full bg-primary" />
              Вода для вашего дня · Тюмень
            </p>
            <h1
              id="home-title"
              className="max-w-2xl text-[32px] min-[375px]:text-[36px] font-semibold leading-[1.12] tracking-[-0.045em] sm:text-5xl xl:text-[56px]"
            >
              Чистая вода
              <br />с доставкой домой
              <br />и в офис
            </h1>
            <p className="mt-6 max-w-md text-base text-muted-foreground sm:text-lg">
              Природная вода «Акватель» и всё для её удобной подачи. Выберите воду для себя, семьи
              или команды.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button asChild>
                <a href="#popular">
                  Заказать воду <ArrowRight size={18} />
                </a>
              </Button>
              <Link
                href="/delivery"
                className="inline-flex min-h-12 items-center gap-2 text-sm font-semibold"
              >
                Условия доставки <ArrowRight size={16} />
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-xs text-muted-foreground sm:text-sm">
              {["До квартиры и офиса", "Обменная тара 19 л", "Сохранение набора"].map((text) => (
                <span key={text} className="inline-flex items-center gap-2">
                  <Check size={15} className="text-accent" />
                  {text}
                </span>
              ))}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            <div className="relative h-72 sm:h-96 lg:h-[440px]">
              <Image
                src="/images/akvatel-19-hero.jpg"
                alt="Фирменная 19-литровая бутыль природной воды «Акватель»"
                fill
                preload
                sizes="(max-width: 1024px) 90vw, 500px"
                className="object-contain mix-blend-multiply"
              />
            </div>
            <div className="absolute bottom-3 right-0 rounded-2xl border bg-white px-5 py-3 sm:bottom-5">
              <p className="text-2xl font-semibold tracking-tight">19 литров</p>
              <p className="text-xs text-muted-foreground">воды для привычных дел</p>
            </div>
          </div>
        </Container>
      </section>
      <Container>
        <HomeShopping />
        <section className="py-14 sm:py-20" aria-label="Категории каталога">
          <SectionHeading
            title="Всё для вашей воды"
            description="От бутыли до удобного места для неё."
          />
          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-5">
            {categories.map(({ name, slug, text, icon: Icon }) => (
              <Link
                key={slug}
                href={`/catalog?category=${slug}`}
                className="group min-w-0 rounded-2xl border p-4 transition-colors hover:border-primary hover:bg-surface sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-surface text-primary">
                    <Icon size={25} strokeWidth={1.5} />
                  </span>
                  <ArrowRight
                    size={18}
                    className="text-muted-foreground transition-transform group-hover:translate-x-1"
                  />
                </div>
                <h3 className="mt-6 text-base font-semibold sm:text-lg">{name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </Link>
            ))}
          </div>
        </section>
        <section className="border-y py-12 sm:py-16" aria-label="Как заказать">
          <SectionHeading title="Вода — в три простых шага" />
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              ["Выберите воду", "Подберите подходящую воду и количество бутылей."],
              ["Укажите адрес и время", "Согласуйте с компанией доставку и обменную тару."],
              ["Получите заказ", "Встретьте доставку дома или в офисе."],
            ].map(([title, text], index) => (
              <li key={title}>
                <span className="text-sm font-semibold text-primary">0{index + 1}</span>
                <h3 className="mt-3 text-xl font-semibold">{title}</h3>
                <p className="mt-2 max-w-xs text-sm text-muted-foreground">{text}</p>
              </li>
            ))}
          </ol>
        </section>
        <section
          className="grid gap-6 py-14 md:grid-cols-2 sm:py-20"
          aria-label="О сервисе и продукции"
        >
          <div className="rounded-2xl bg-surface p-7 sm:p-9">
            <Truck size={28} className="text-primary" />
            <h2 className="mt-6 text-2xl font-semibold">Доставка и оплата</h2>
            <p className="mt-3 text-muted-foreground">
              Воду доставляют до квартиры или офиса в Тюмени. Стоимость, время и условия обмена тары
              уточняйте при заказе.
            </p>
            <Link
              href="/delivery"
              className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary"
            >
              Доставка и оплата <ArrowRight size={17} />
            </Link>
          </div>
          <div className="rounded-2xl border p-7 sm:p-9">
            <ShieldCheck size={28} className="text-accent" />
            <h2 className="mt-6 text-2xl font-semibold">Знайте, какую воду выбираете</h2>
            <p className="mt-3 text-muted-foreground">
              В подборке — природная вода «Акватель» и «Акватель Лайт». Сведения о составе и
              документы на продукцию можно запросить у компании.
            </p>
            <Link
              href="/about"
              className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary"
            >
              О компании <ArrowRight size={17} />
            </Link>
          </div>
        </section>
        <section
          className="grid gap-8 pb-14 lg:grid-cols-[0.8fr_1.2fr] sm:pb-20"
          aria-label="Частые вопросы"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Полезно знать
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Прежде чем
              <br />
              заказать воду
            </h2>
          </div>
          <div className="border-t">
            {questions.map(([question, answer]) => (
              <details key={question} className="group border-b">
                <summary className="flex min-h-18 cursor-pointer list-none items-center justify-between gap-5 py-5 font-semibold [&::-webkit-details-marker]:hidden">
                  {question}
                  <ArrowDown
                    size={18}
                    className="shrink-0 text-primary transition-transform group-open:rotate-180"
                  />
                </summary>
                <p className="pb-6 text-sm text-muted-foreground">{answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="mb-14 flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-primary p-7 text-white sm:mb-20 sm:p-10">
          <div>
            <span className="flex items-center gap-1.5 text-sm text-white/85">
              <MapPin size={16} />
              Тюмень
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Пусть вода всегда будет рядом.
            </h2>
            <p className="mt-3 text-sm text-white/85">
              Начните с одной бутыли или соберите привычный набор.
            </p>
          </div>
          <Button asChild variant="secondary">
            <a href="#popular">
              Выбрать воду <ArrowRight size={18} />
            </a>
          </Button>
        </section>
      </Container>
    </main>
  );
}
