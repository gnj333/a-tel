# Обновление главной — 3 ноября 2026

Главная выстроена по сценарию: предложение и цена → выбор воды → условия тары и доставки → первый заказ и оборудование → документы → доставка → оставшиеся вопросы.

Сохранённый набор показывается только после его сохранения; действие находится в корзине и при оформлении. Повторение сохраняет прежнюю семантику: восстанавливает количество доступных позиций без удвоения, оставляет остальные товары корзины. Убраны ссылки на несуществующую функциональность личного кабинета; старый маршрут `/account` объясняет повторный заказ.

Цена в первом экране, цена тары и сумма воды с новой бутылью берутся из актуального локального каталога. При обновлении хранилища до версии 6 цены, статусы, заказы, изображения менеджера и изменённые описания сохраняются. Исходные описания воды и фотографии обновляются, добавляются опубликованные производителем характеристики и документы.

## Источники содержания

Проверены 2026-11-03:

- [Акватель 19 л](https://a-tel.ru/voda-akvatyel-19lit/): магний и кальций, употребление без кипячения, срок годности 6 месяцев, поликарбонатная тара, первая категория качества; ссылка на декларацию.
- [Акватель Лайт 19 л](https://a-tel.ru/akvatel-layt-mendeleevskaya-19-l-prirodnaya-voda/): умягчение, коррекция водно-солевого состава, применение для напитков и еды, срок годности 6 месяцев; ссылка на декларацию.
- [Каталог воды](https://a-tel.ru/category/voda/): 480 ₽ и 420 ₽. В карточке «Лайт» отображается 400 ₽: сохранена цена каталога 420 ₽. Локальные правки цены остаются приоритетными.
- [Доставка и оплата](https://a-tel.ru/delivery-and-payment/): до квартиры или офиса по Тюмени, обмен тары, наличные при получении. Расписание в тексте и общем виджете различается, поэтому точные интервалы не перенесены. Тариф, минимальное количество и доставку за город необходимо подтвердить у компании.
- Декларации приведены по ссылкам из карточек производителя: [Акватель](https://pub.fsa.gov.ru/rds/declaration/view/21592502/common), [Лайт](https://pub.fsa.gov.ru/rds/declaration/view/20883825/common). Реестр не ответил при проверке; актуальный статус записей независимо не подтверждён. На сайте нет утверждения, что он подтверждён.

## Изображения

Применён встроенный инструмент image_gen, режим редактирования с прозрачным фоном. Результаты проверены визуально, затем уменьшены и сохранены в WebP с альфа-каналом:

- `public/images/akvatel-19-clean.webp` — исходник `public/images/akvatel-19-hero.jpg`.
- `public/images/akvatel-light-19-clean.webp` — [исходник производителя 640 px](https://a-tel.ru/wa-data/public/shop/products/70/16/1670/images/1697/1697.0x640.jpeg).

Это обработанные с помощью AI вырезки исходных фотографий; исходные файлы сохранены. Этикетки не следует использовать как источник характеристик или юридических сведений о товаре.

Финальные промпты (built-in image_gen, transparent_background=true):

### Акватель

Use case: background-extraction. Edit target: the supplied actual Akvatel 19L water bottle product photograph. Create one clean ecommerce cutout of ONLY the foreground blue-cap bottle, perfectly centered with small even margins. Remove the faded oversized bottle in background, all background and vertical text outside the bottle. Preserve the foreground bottle exactly: same blue cap, proportions, transparent polycarbonate ridges and blue label with Cyrillic Акватель and its existing typography. Do not redesign the label, invent product features, or add objects. Preserve photographic realism; transparent alpha background, no artificial illustration, no shadow outside the bottle. The goal is background removal for a factual product photo.

### Акватель Лайт

Use case: background-extraction. Edit target: the supplied actual Akvatel Light 19L water bottle product photograph. Create one clean ecommerce cutout of ONLY the foreground green-cap bottle, perfectly centered with small even margins. Remove faded oversized bottle in background, all background and vertical text outside the bottle. Preserve the foreground bottle exactly: same green cap, proportions, transparent polycarbonate ridges and original white/cyan label with blue droplets, green leaves and Cyrillic Акватель Лайт typography. Do not redesign label, invent product features, or add objects. Preserve photographic realism; transparent alpha background, no artificial illustration, no shadow outside the bottle. The goal is background removal for a factual product photo.
