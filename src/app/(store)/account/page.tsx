import { InfoPage } from "@/components/store/info-page";

export default function AccountPage() {
  return (
    <InfoPage title="Личный кабинет">
      <p>
        Сохраните набор любимых товаров на главной, чтобы быстро повторить покупку. Для оформления
        заказа достаточно указать имя, телефон и адрес доставки.
      </p>
      <p>
        По вопросам о заказах звоните{" "}
        <a href="tel:+73452278877" className="text-primary underline underline-offset-4">
          +7 (3452) 27-88-77
        </a>
        .
      </p>
    </InfoPage>
  );
}
