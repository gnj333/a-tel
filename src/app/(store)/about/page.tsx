import { InfoPage } from "@/components/store/info-page";

export default function AboutPage() {
  return (
    <InfoPage title="О компании">
      <p>
        «Акватель» — тюменская компания по доставке питьевой воды домой и в офис. В ассортименте
        представлены вода, кулеры, помпы, бутыли и сопутствующие товары.
      </p>
      <p>Центральный офис: Тюмень, ул. Одесская, 9.</p>
      <p>ООО «Акватель» · ИНН 7202199543 · ОГРН 1097232023426.</p>
      <p>
        <a
          href="https://a-tel.ru/site/contact/"
          className="text-primary underline underline-offset-4"
          target="_blank"
          rel="noreferrer"
        >
          Контакты и реквизиты на сайте компании ↗
        </a>
      </p>
    </InfoPage>
  );
}
