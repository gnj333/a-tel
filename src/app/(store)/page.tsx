import Link from "next/link";
import { ArrowDown, ArrowRight, FileText, Phone } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { HomeShopping } from "@/features/home/home-shopping";

const questions = [
  [
    "Подойдёт ли моя пустая бутыль?",
    "Вода 19 л поставляется в обменной поликарбонатной таре. Перед первым заказом уточните, подходит ли ваша бутыль для обмена: +7 (3452) 27-88-77.",
  ],
  [
    "Можно ли заказать за пределы Тюмени?",
    "Доставка в ближайшие населённые пункты согласуется отдельно. Сообщите адрес компании, чтобы узнать возможность и стоимость доставки.",
  ],
  [
    "Как сохранить заказ на следующий раз?",
    "В корзине нажмите «Сохранить набор из корзины» или отметьте сохранение состава при оформлении. На главной появится ваш набор — его можно восстановить по текущим ценам без повторного выбора товаров.",
  ],
];

export default function Home() {
  return (
    <main id="main" tabIndex={-1}>
      <HomeShopping />
      <Container>
        <section
          className="grid gap-7 border-t py-9 sm:py-14 lg:grid-cols-[0.9fr_1.1fr]"
          aria-labelledby="quality-title"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">О воде</p>
            <h2
              id="quality-title"
              className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
            >
              Разный состав.
              <br />
              Понятный выбор.
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              «Акватель» содержит магний и кальций. «Лайт» проходит умягчение и подходит для
              приготовления напитков и еды.
            </p>
          </div>
          <div className="rounded-2xl border bg-surface p-5 sm:p-7">
            <h3 className="text-lg font-semibold">Документы на обе воды</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Ссылки на декларации соответствия опубликованы в карточках производителя. Откройте
              запись в реестре Росаккредитации.
            </p>
            <div className="mt-4 grid gap-2">
              {[
                ["Акватель", "21592502"],
                ["Акватель Лайт", "20883825"],
              ].map(([name, id]) => (
                <a
                  key={id}
                  href={`https://pub.fsa.gov.ru/rds/declaration/view/${id}/common`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-12 items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3 text-sm font-medium text-primary"
                >
                  <span className="flex items-center gap-2">
                    <FileText size={18} aria-hidden="true" />
                    {name}
                  </span>
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
        </section>
        <section
          id="delivery"
          className="scroll-mt-0 border-t py-9 sm:py-14"
          aria-label="Как заказать"
        >
          <SectionHeading
            title="От выбора до вашей двери"
            description="Доставляем до квартиры или офиса в Тюмени."
            action={
              <Link
                href="/delivery"
                className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary"
              >
                Доставка и оплата <ArrowRight size={17} />
              </Link>
            }
          />
          <ol className="mt-7 grid gap-6 md:grid-cols-3">
            {[
              [
                "Соберите заказ",
                "Выберите воду и количество. Если нет обменной тары, добавьте пустую бутыль.",
              ],
              [
                "Согласуйте доставку",
                "Укажите адрес и желаемую дату. Компания подтвердит стоимость, время и способ оплаты.",
              ],
              [
                "Получите воду",
                "Встретьте курьера и передайте пустые обменные бутыли. Наличными можно оплатить при получении.",
              ],
            ].map(([title, text], index) => (
              <li key={title} className="border-l-2 border-primary/20 pl-5">
                <span className="text-xs font-semibold text-primary">0{index + 1}</span>
                <h3 className="mt-2 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </li>
            ))}
          </ol>
        </section>
        <section
          className="grid gap-6 border-t py-9 sm:py-14 lg:grid-cols-[0.9fr_1.1fr]"
          aria-label="Частые вопросы"
        >
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Остались вопросы?</h2>
          <div>
            {questions.map(([question, answer]) => (
              <details key={question} className="group border-b first:border-t">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-4 font-semibold [&::-webkit-details-marker]:hidden">
                  {question}
                  <ArrowDown
                    size={18}
                    className="shrink-0 text-primary transition-transform group-open:rotate-180"
                  />
                </summary>
                <p className="pb-5 text-sm text-muted-foreground">{answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="mb-9 flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-primary p-6 text-white sm:mb-14 sm:p-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Выберите воду — остальное согласуем
            </h2>
            <a
              href="tel:+73452278877"
              className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm text-white/90"
            >
              <Phone size={16} aria-hidden="true" />
              +7 (3452) 27-88-77
            </a>
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
