import { InfoPage } from "@/components/store/info-page";

export default function DeliveryPage() {
  return (
    <InfoPage title="Доставка и оплата">
      <p>
        Компания доставляет воду до квартиры или офиса в Тюмени. Возможность доставки за город
        уточняется отдельно.
      </p>
      <p>
        Вода «Акватель» и «Акватель Лайт» объёмом 19 л поставляется в обменной поликарбонатной таре.
        При отсутствии обменной тары её приобретают отдельно.
      </p>
      <p>
        Оплатить заказ можно наличными при получении или банковской картой. Удобный способ оплаты
        уточните при подтверждении заказа.
      </p>
      <p>
        Стоимость, доступное время доставки и условия обмена тары уточняйте у компании:{" "}
        <a className="text-primary underline underline-offset-4" href="tel:+73452278877">
          +7 (3452) 27-88-77
        </a>
        .
      </p>
      <p>
        <a
          className="text-primary underline underline-offset-4"
          href="https://a-tel.ru/delivery-and-payment/"
          target="_blank"
          rel="noreferrer"
        >
          Условия на сайте компании ↗
        </a>
      </p>
    </InfoPage>
  );
}
