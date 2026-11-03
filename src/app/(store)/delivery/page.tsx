import Link from "next/link";
import { ArrowRight, Banknote, MapPin, Recycle, Truck } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

export default function DeliveryPage() {
  return (
    <main id="main" tabIndex={-1}>
      <Container className="py-8 sm:py-12">
        <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Доставка и оплата" }]} />
        <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
          Доставка и оплата
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Привезём воду до квартиры или офиса в Тюмени. Перед подтверждением заказа согласуйте
          адрес, время и полную стоимость.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {[
            {
              icon: MapPin,
              title: "Куда доставляем",
              text: "По Тюмени — до квартиры или офиса. Доставка в ближайшие населённые пункты согласуется отдельно.",
            },
            {
              icon: Truck,
              title: "Когда и сколько стоит",
              text: "Укажите желаемую дату при оформлении. Доступный интервал, стоимость доставки и минимальное количество бутылей подтвердит компания до выполнения заказа.",
            },
            {
              icon: Recycle,
              title: "Как работает обмен тары",
              text: "При получении воды 19 л передайте курьеру подходящие пустые поликарбонатные бутыли. Если тары нет, добавьте пустую бутыль из каталога. Её цена не входит в стоимость воды.",
            },
            {
              icon: Banknote,
              title: "Как оплатить",
              text: "Наличными при получении. Возможность оплаты банковской картой и способ проведения платежа уточните при подтверждении заказа.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <section key={title} className="rounded-2xl border p-6">
              <Icon size={25} className="text-primary" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-semibold">{title}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{text}</p>
              {title === "Как работает обмен тары" && (
                <Link
                  href="/catalog?category=butyli"
                  className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary"
                >
                  Выбрать пустую бутыль <ArrowRight size={16} />
                </Link>
              )}
            </section>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-surface p-6">
          <div>
            <h2 className="font-semibold">Уточнить условия по вашему адресу</h2>
            <a
              className="mt-1 inline-flex min-h-11 items-center text-xl font-semibold text-primary"
              href="tel:+73452278877"
            >
              +7 (3452) 27-88-77
            </a>
          </div>
          <Button asChild>
            <Link href="/catalog?category=voda">
              Выбрать воду <ArrowRight size={17} />
            </Link>
          </Button>
        </div>
        <a
          className="mt-5 inline-flex min-h-11 items-center text-sm text-muted-foreground underline underline-offset-4"
          href="https://a-tel.ru/delivery-and-payment/"
          target="_blank"
          rel="noreferrer"
        >
          Условия на сайте компании ↗
        </a>
      </Container>
    </main>
  );
}
