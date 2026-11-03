import { InfoPage } from "@/components/store/info-page";

export default function AccountPage() {
  return (
    <InfoPage title="Повторный заказ">
      <p>
        Сохраните набор товаров в корзине или при оформлении заказа. На главной появится ваш
        сохранённый набор — его можно добавить в корзину по текущим ценам одним нажатием.
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
