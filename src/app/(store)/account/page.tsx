import { InfoPage } from "@/components/store/info-page";

export default function AccountPage() {
  return <InfoPage title="Личный кабинет"><p>В демонстрационной версии вход и регистрация не подключены. Здесь не нужно вводить персональные данные.</p><p>Вопросы по реальным заказам можно задать компании по телефону <a href="tel:+73452278877" className="text-primary underline underline-offset-4">+7 (3452) 27-88-77</a>.</p></InfoPage>;
}
