# YA Cosmetologist

Статический сайт косметолога на HTML + Tailwind CDN.

## Сборка

```bash
npm run build
npm run serve
```

Откройте http://localhost:3000

## Данные

- `data/site-meta.json` — бренд, Telegram, Max, адрес
- `data/prices.json` — прейскурант
- `data/services.json` — лендинги услуг
- `data/navigation.json` — меню

## Перед публикацией

Замените в `site-meta.json`:
- `contacts.phone` и `contacts.phoneDisplay` — номер для шапки сайта
- `contacts.telegram` и `contacts.max` — для кнопок записи в контенте страниц
