# YA Cosmetologist

Статический сайт косметолога: [Hugo](https://gohugo.io/) (шаблоны и контент) + [Tailwind CSS](https://tailwindcss.com/) (стили через CLI). Интерактив на главной — анимация «обратного дождя» на Three.js.

## Требования

| Инструмент | Назначение |
|------------|------------|
| [Hugo](https://gohugo.io/installation/) ≥ 0.120 | Сборка HTML |
| Node.js 18+ | Tailwind, утилиты в `scripts/` |
| `poppler-utils` (опционально) | `pdftocairo` для конвертации логотипа из PDF |
| Python 3 + Pillow (опционально) | Наложение бейджа на фото «Топ процедур» |

Extended-версия Hugo **не обязательна**: CSS собирается отдельно через `tailwindcss`, результат кладётся в `static/assets/css/site.css`.

## Быстрый старт

```bash
npm install
npm run dev
```

Сайт: http://localhost:1313

В отдельном терминале — автопересборка стилей при правках CSS:

```bash
npm run build:css:watch
```

Продакшен-сборка:

```bash
npm run build
```

Артефакты: каталог `public/` (настроено в `hugo.toml` → `publishDir`).

## NPM-скрипты

| Команда | Действие |
|---------|----------|
| `npm run build:css` | Tailwind: `assets/css/main.css` → `static/assets/css/site.css` (minify) |
| `npm run build:css:watch` | То же, в режиме watch |
| `npm run build` | CSS + `hugo --minify` → `public/` |
| `npm run dev` | CSS + `hugo server -D` |
| `npm run preview` | Hugo без fast render (отладка шаблонов) |

## Структура проекта

```
cosmetolog/
├── hugo.toml              # конфиг Hugo
├── package.json           # npm-скрипты, Tailwind
├── tailwind.config.js     # сканирует layouts/ и content/
├── assets/css/main.css    # @tailwind + кастом (btn-shine, hero, …)
├── content/               # страницы (front matter + layout)
├── data/                  # JSON для шаблонов (site.Data.*)
├── layouts/               # шаблоны Hugo и partials
├── static/assets/         # публичные файлы как есть (js, css, images, vendor)
├── scripts/               # разовые утилиты (не в сборке)
└── public/                # результат сборки (в .gitignore)
```

Каталог `dist/` — **устаревший** вывод старого Node-сборщика; Hugo его не использует. Каталог `templates/` не участвует в сборке (остался от прежней схемы).

## Страницы сайта

| URL | Источник | Layout |
|-----|----------|--------|
| `/` | `content/_index.md` | `layouts/index.html` |
| `/consultation` … `/peeling` | `content/<slug>/_index.md` | `service` → `layouts/_default/service.html` |
| `/amenities` | `content/amenities/_index.md` | `amenities` |
| `/contacts` | `content/contacts/_index.md` | `contacts` |
| `/company`, `/documents` | `content/company|documents/_index.md` | `page` |

Услуги (10 шт.): `consultation`, `botox`, `mesotherapy`, `biorevitalization`, `aesthefill`, `lipolytics`, `lips`, `facialcleansing`, `peeling`.

Контент услуги в Markdown минимальный — тексты и цены берутся из `data/services.json` по полю `service_slug` в front matter:

```yaml
---
title: "botox"
layout: service
service_slug: "botox"
---
```

Заголовок `<title>` и H1 на странице задаёт `services.json` → `hero.title`, а не `title` в front matter.

## Данные (`data/`)

Hugo превращает имя файла в ключ: дефисы и точки → подчёркивания. Например, `site-meta.json` доступен как `site.Data.site_meta`.

| Файл | Ключ в шаблонах | Содержимое |
|------|-----------------|------------|
| `site-meta.json` или `site_meta.json` | `site_meta` | Бренд, контакты, адрес, врач, галерея, УТП (`heroUt`), SEO |
| `navigation.json` | `navigation` | Пункты меню |
| `services.json` | `services` | Лендинги услуг, отзывы, trust-карточки |
| `prices.json` | `prices` | Прейскурант (секции для amenities и услуг) |
| `platform-ratings.json` | `platform_ratings` | Блок рейтингов на главной |
| `top-procedures.json` | `top_procedures` | Карточки «Топ процедур» |

Рекомендация: держать **один** файл на сущность (например, только `site-meta.json`), чтобы не расходились дубликаты.

Пути к картинкам в JSON — от корня сайта, без ведущего слэша: `assets/images/...` (физически `static/assets/images/...`).

## Шаблоны (`layouts/`)

- `layouts/_default/baseof.html` — каркас: head, header, footer, cookie, floating-кнопки
- `layouts/partials/` — блоки (hero, CTA, price-table, map, platform logos, …)
- `layouts/index.html` — главная + подключение Three.js в `extra-scripts`

Переиспользуемые partials: `home-hero`, `home-ut`, `hero-visual`, `service-card`, `doctor`, `reviews`, `price-table`, `gallery`, `format-price` (форматирование цен без lookahead в regex).

## Стили

1. Редактировать `assets/css/main.css` (директивы Tailwind + кастомные классы: `.home-hero`, `.btn-shine`, `.platform-ratings`, …).
2. Запустить `npm run build:css` (или watch).
3. В шаблоне подключается собранный `static/assets/css/site.css` (через `relURL`).

Конфиг Tailwind: `tailwind.config.js` — цвета через CSS-переменные (`--brand-bg`, `--accent`), шрифты Montserrat / Playfair Display.

## Скрипты на странице

| Файл | Где |
|------|-----|
| `static/assets/js/main.js` | Все страницы (Swiper, тема, cookie) |
| `static/assets/vendor/three.min.js` | Только главная |
| `static/assets/js/reverse-time.js` | Только главная — canvas в `#home-hero` |

Анимация: три слоя точек, реакция на курсор, слой за портретом врача. Параметры скорости и силы отталкивания — в начале `reverse-time.js`.

## Утилиты (`scripts/`)

Не входят в `npm run build`; запускаются вручную при необходимости.

```bash
# PDF «лого 1.pdf» → SVG в static/assets/
node scripts/pdf-logo-to-svg.mjs

# Бейдж с логотипом на карточках «Топ процедур» (нужны Pillow и static/assets/logo.png)
node scripts/overlay-logo-top.mjs

# Скачать исходники фото в static/assets/images/top/
node scripts/download-top-images.mjs
```

## Перед публикацией

1. **`hugo.toml`** — заменить `baseURL` на боевой домен.
2. **`data/site-meta.json`** — реальные `contacts.phone`, `phoneDisplay`, `telegram`, `max`; при необходимости адрес и координаты карты.
3. Проверить, что все изображения из JSON лежат в `static/assets/images/`.
4. Собрать: `npm run build` и отдавать содержимое `public/` (nginx, S3, Netlify, GitHub Pages и т.д.).

## Деплой (пример)

```bash
npm ci
npm run build
# загрузить public/ на хостинг
```

Для CI достаточно установить Hugo и Node, затем `npm run build`.

## Добавление новой услуги

1. Запись в `data/services.json` (`slug`, `url`, `hero`, …).
2. Секция в `data/prices.json` (если нужна в прейскуранте).
3. Пункт в `data/navigation.json` (при необходимости).
4. `content/<slug>/_index.md` с `layout: service` и `service_slug: "<slug>"`.
5. `npm run build` и проверка URL.

## Лицензия и контент

Тексты и изображения — собственность заказчика. Сторонние CDN: Swiper, шрифты (см. `layouts/partials/head.html`).
