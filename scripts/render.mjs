import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGO_SVG = fs
  .readFileSync(path.join(__dirname, '../assets/logo.svg'), 'utf8')
  .replace(/<\?xml[^>]*>\s*/i, '')
  .trim();

export function renderBrandLogo(className = 'h-10 md:h-12 w-auto', label = 'YA Cosmetologist') {
  return LOGO_SVG.replace(
    /<svg[^>]*>/,
    `<svg class="site-logo ${className}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 311 277" fill="currentColor" focusable="false" role="img" aria-label="${label}">`
  );
}

export function formatPrice(n) {
  if (n == null) return '';
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function assetPath(src, depth = 0) {
  if (!src || src.startsWith('http')) return src || '';
  const prefix = depth > 0 ? '../'.repeat(depth) : '';
  return `${prefix}${src.replace(/^\//, '')}`;
}

export function telegramUrl(meta, serviceName) {
  const base = meta.contacts.telegram;
  const text = serviceName
    ? `Здравствуйте! Хочу записаться на: ${serviceName}`
    : meta.contacts.telegramPrefill;
  const sep = base.includes('?') ? '&' : '?';
  return `${base}${sep}text=${encodeURIComponent(text)}`;
}

export function renderHeaderPhone(meta) {
  const phone = meta.contacts?.phone;
  const display = meta.contacts?.phoneDisplay || phone;
  if (!phone) {
    return `<span class="text-sm text-brand-muted">+7 (___) ___-__-__</span>`;
  }
  return `
<a href="tel:${phone.replace(/\s|[()\-]/g, '')}"
   class="btn-shine inline-flex items-center gap-2 bg-accent text-gray-900 font-medium rounded-pill px-5 py-2.5 text-sm whitespace-nowrap">
  <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
  </svg>
  ${display}
</a>`;
}

export function renderCta(meta, serviceName = '', compact = false) {
  const tg = telegramUrl(meta, serviceName);
  const max = meta.contacts.max;
  const size = compact
    ? 'px-4 py-2 text-sm'
    : 'px-8 py-3.5 text-base';
  return `
<div class="flex flex-wrap gap-3 justify-center" id="zapis">
  <a href="${tg}" target="_blank" rel="noopener noreferrer"
     class="btn-shine inline-flex items-center gap-2 bg-accent text-gray-900 font-medium rounded-pill ${size}">
    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
    Telegram
  </a>
  <a href="${max}" target="_blank" rel="noopener noreferrer"
     class="btn-shine btn-shine--outline inline-flex items-center gap-2 border-2 border-accent text-accent font-medium rounded-pill ${size}">
    <span class="relative z-[1]">Max</span>
  </a>
</div>`;
}

export function renderHead(meta, title, depth = 0) {
  const prefix = depth > 0 ? '../'.repeat(depth) : '';
  const fullTitle = title ? `${title} — ${meta.brandName}` : meta.brandName;
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#0c0c0c" id="meta-theme-color">
  <meta name="color-scheme" content="light dark">
  <script>
    (function () {
      var k = 'ya-theme';
      var t = localStorage.getItem(k);
      if (t !== 'light' && t !== 'dark') {
        t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      }
      document.documentElement.setAttribute('data-theme', t);
      var m = document.querySelector('meta[name="theme-color"]');
      if (m) m.setAttribute('content', t === 'light' ? '#ffffff' : '#0c0c0c');
    })();
  </script>
  <title>${fullTitle}</title>
  <meta name="description" content="${meta.seoHome || meta.tagline}">
  <link rel="icon" href="${prefix}assets/logo.svg" type="image/svg+xml">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              bg: 'var(--brand-bg)',
              surface: 'var(--brand-surface)',
              elevated: 'var(--brand-elevated)',
              line: 'var(--brand-line)',
              text: 'var(--brand-text)',
              muted: 'var(--brand-muted)',
              black: '#000000',
            },
            accent: 'var(--accent)',
          },
          fontFamily: {
            display: ['"Playfair Display"', 'Georgia', 'serif'],
            sans: ['Montserrat', 'system-ui', 'sans-serif'],
          },
          borderRadius: { pill: '30px' },
        },
      },
    };
  </script>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&family=Roboto:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
  <link rel="stylesheet" href="${prefix}assets/css/custom.css">
</head>`;
}

export function renderThemeToggle() {
  return `
<button id="theme-toggle" type="button" class="theme-toggle shrink-0 p-2 rounded-full border border-brand-line" aria-label="Переключить тему" title="Светлая / тёмная тема">
  <svg class="theme-icon-sun" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364l-1.414-1.414M6.05 6.05 4.636 4.636m12.728 0-1.414 1.414M6.05 17.95l-1.414 1.414M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
  </svg>
  <svg class="theme-icon-moon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
</button>`;
}

export function renderHeader(meta, nav, depth = 0) {
  const prefix = depth > 0 ? '../'.repeat(depth) : '';
  const home = `${prefix}index.html`;
  const menuItems = nav.menu;
  const desktopLinks = menuItems
    .map((item) => {
      if (item.items) {
        const sub = item.items
          .map((s) => `<a href="${prefix}${s.url.replace(/^\//, '')}/index.html" class="block px-4 py-2 text-sm hover:text-accent">${s.label}</a>`)
          .join('');
        return `<div class="relative group">
          <button class="text-sm font-medium uppercase tracking-wide hover:text-accent">${item.title} ▾</button>
          <div class="absolute left-0 top-full pt-2 hidden group-hover:block z-50">
            <div class="bg-brand-elevated border border-brand-line shadow-xl min-w-[220px] py-1">${sub}</div>
          </div>
        </div>`;
      }
      return `<a href="${prefix}${item.url.replace(/^\//, '')}/index.html" class="text-sm font-medium uppercase tracking-wide hover:text-accent">${item.label}</a>`;
    })
    .join('\n');

  const mobileLinks = menuItems
    .flatMap((item) => (item.items ? item.items : [item]))
    .map((s) => `<a href="${prefix}${s.url.replace(/^\//, '')}/index.html" class="block py-2 border-b border-brand-line">${s.label}</a>`)
    .join('');

  return `
<header id="site-header" class="sticky top-0 z-40 bg-brand-surface/95 backdrop-blur-md border-b border-brand-line">
  <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
    <a href="${home}" class="shrink-0 block">
      ${renderBrandLogo('h-10 md:h-12 w-auto', meta.brandName)}
    </a>
    <nav class="hidden lg:flex items-center gap-6">${desktopLinks}</nav>
    <div class="flex items-center gap-2 md:gap-3 shrink-0">
      ${renderThemeToggle()}
      <div class="hidden md:block">${renderHeaderPhone(meta)}</div>
      <button id="menu-toggle" type="button" class="lg:hidden p-2" aria-label="Меню" aria-expanded="false">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
    </button>
    </div>
  </div>
  <nav id="mobile-nav" class="hidden lg:hidden border-t border-brand-line px-4 py-4">
    <div class="pb-4 mb-4 border-b border-brand-line">${renderHeaderPhone(meta)}</div>
    ${mobileLinks}
  </nav>
</header>`;
}

export function renderFooter(meta, nav, depth = 0) {
  const prefix = depth > 0 ? '../'.repeat(depth) : '';
  const serviceLinks = nav.menu
    .find((m) => m.title === 'Услуги')?.items.map(
      (s) => `<li><a href="${prefix}${s.url.replace(/^\//, '')}/index.html" class="hover:text-accent">${s.label}</a></li>`
    )
    .join('') || '';

  return `
<footer class="bg-brand-elevated border-t border-brand-line text-brand-text mt-16">
  <div class="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
    <div>
      <div class="mb-4">${renderBrandLogo('h-10 w-auto', meta.brandName)}</div>
      <p class="text-sm text-brand-muted">${meta.tagline}</p>
    </div>
    <div>
      <h3 class="font-semibold mb-3 uppercase tracking-brand text-xs">Услуги</h3>
      <ul class="space-y-2 text-sm text-brand-muted">${serviceLinks}</ul>
    </div>
    <div>
      <h3 class="font-semibold mb-3 uppercase tracking-brand text-xs">Контакты</h3>
      <p class="text-sm text-brand-muted mb-2">${meta.address.city}</p>
      <p class="text-sm text-brand-muted mb-4">${meta.address.hours}</p>
      <a href="${prefix}amenities/index.html" class="text-sm hover:text-accent">Прейскурант</a>
    </div>
  </div>
  <div class="border-t border-brand-line px-4 py-6 text-center text-xs text-brand-muted">
    <p>${meta.disclaimer}</p>
    <p class="mt-2">© ${new Date().getFullYear()} ${meta.brandName}</p>
  </div>
</footer>`;
}

export function renderCookie(depth = 0) {
  const prefix = depth > 0 ? '../'.repeat(depth) : '';
  return `
<div id="cookie-banner" class="fixed bottom-0 left-0 right-0 z-50 bg-brand-elevated border-t border-brand-line p-4 shadow-lg">
  <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-brand-muted">
    <p>Мы используем cookies для улучшения работы сайта.</p>
    <button id="cookie-accept" type="button" class="btn-shine bg-accent text-gray-900 px-6 py-2 rounded-pill text-sm font-medium">Принять</button>
  </div>
</div>`;
}

export function renderFloating(meta, depth = 0) {
  const tg = telegramUrl(meta);
  return `
<div class="fixed bottom-6 right-4 z-40 flex flex-col gap-2 floating-contacts">
  <a href="${tg}" target="_blank" rel="noopener" class="bg-[#0088cc] text-white p-3 rounded-full" title="Telegram" aria-label="Telegram">
    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
  </a>
  <a href="${meta.contacts.max}" target="_blank" rel="noopener" class="btn-shine bg-accent text-gray-900 p-3 rounded-full text-xs font-bold" title="Max">M</a>
</div>`;
}

export function renderScripts(depth = 0, extra = '') {
  const prefix = depth > 0 ? '../'.repeat(depth) : '';
  return `
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
<script src="${prefix}assets/js/main.js"></script>
${extra}
</body></html>`;
}

export function renderHeroVisual(doctor, depth = 0) {
  const photo = assetPath(doctor.photo, depth);
  const experience = doctor.experience
    ? `<p class="hero-visual__experience text-sm text-brand-muted mt-2 leading-relaxed">${doctor.experience}</p>`
    : '';
  return `
      <div class="hero-visual flex-1 max-w-sm mx-auto w-full">
        <div class="hero-visual__frame aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
          <img src="${photo}" alt="${doctor.name}" class="hero-visual__photo w-full h-full object-cover object-top" loading="lazy">
        </div>
        <div class="hero-visual__caption mt-4 text-center md:text-left">
          <p class="hero-visual__name font-display text-xl text-brand-text">${doctor.name}</p>
          <p class="hero-visual__role text-accent font-medium mt-1">${doctor.role}</p>
          ${experience}
        </div>
      </div>`;
}

export function renderHomeUt(meta) {
  const lines = meta.heroUt?.lines;
  if (!lines?.length) {
    return `<p class="home-hero__utp-fallback">${meta.tagline}</p>`;
  }
  const rows = lines
    .map((line) => {
      const accent = line.accent ? ' home-hero__utp-line--accent' : '';
      const lead = line.highlight ? ' home-hero__utp-line--lead' : '';
      const inner = line.highlight
        ? `${line.text} <span class="home-hero__utp-highlight">${line.highlight}</span>`
        : line.text;
      return `<span class="home-hero__utp-line${lead}${accent}">${inner}</span>`;
    })
    .join('');
  return `<div class="home-hero__utp" aria-label="${meta.tagline}">${rows}</div>`;
}

export function renderHomeHero(meta, depth = 0) {
  return `
  <section id="home-hero" class="home-hero py-16 md:py-24" aria-label="Главный экран">
    <div class="home-hero__rain" aria-hidden="true">
      <canvas id="reverse-time-canvas"></canvas>
    </div>
    <div class="home-hero__inner max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-12 md:gap-14 items-center">
      <div class="home-hero__content flex-1 w-full flex flex-col items-center text-center">
        <h1 class="home-hero__logo mb-8 md:mb-10 font-normal">${renderBrandLogo('home-hero__logo-svg', meta.brandName)}</h1>
        ${renderHomeUt(meta)}
        <div class="home-hero__cta mt-9 md:mt-10 w-full flex justify-center">${renderCta(meta)}</div>
      </div>
      ${renderHeroVisual(meta.doctor, depth)}
    </div>
  </section>`;
}

export function renderPriceTable(section) {
  if (!section) return '';
  const rows = section.items
    .map((item) => {
      const price =
        item.price != null
          ? `${item.note === 'от' ? 'от ' : ''}${formatPrice(item.price)} ${item.unit || '₽'}`
          : item.note || '—';
      return `<tr><td class="font-medium">${item.name}</td><td>${price}</td></tr>`;
    })
    .join('');
  return `
<section class="py-12 bg-brand-elevated">
  <div class="max-w-3xl mx-auto px-4">
    <h2 class="font-display text-2xl mb-6">Стоимость — ${section.title}</h2>
    <table class="w-full prose-price bg-brand-surface border border-brand-line rounded-lg overflow-hidden">
      <thead><tr class="bg-accent/20 text-brand-text"><th>Услуга</th><th>Цена</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>
</section>`;
}

export function renderServiceCard(service, meta, depth = 0) {
  const prefix = depth > 0 ? '../'.repeat(depth) : '';
  const url = `${prefix}${service.slug}/index.html`;
  const h = service.hero;
  const old = h.oldPrice ? `<span class="old-price text-lg ml-2">${formatPrice(h.oldPrice)} ₽</span>` : '';
  return `
<article class="bg-brand-surface border border-brand-line rounded-2xl overflow-hidden hover:border-accent/40 transition flex flex-col">
  <a href="${url}" class="block aspect-[4/3] overflow-hidden service-card-image">
    <img src="${assetPath(service.cardImage, depth)}" alt="${h.title}" class="w-full h-full object-cover" loading="lazy">
  </a>
  <div class="p-5 flex flex-col flex-1">
    <h3 class="font-display text-xl mb-2"><a href="${url}" class="hover:text-accent">${h.title}</a></h3>
    <p class="font-display text-2xl text-brand-text mb-1">${h.priceDisplay}${old}</p>
    ${h.priceNote ? `<p class="text-sm text-brand-muted mb-2">${h.priceNote}</p>` : ''}
    <p class="text-xs text-accent mb-4">${h.bonus}</p>
    <div class="mt-auto flex flex-wrap gap-2">
      <a href="${url}" class="text-sm font-medium underline">Подробнее</a>
    </div>
  </div>
</article>`;
}

export function renderReviews(reviews) {
  const slides = reviews
    .map(
      (r) => `
<div class="swiper-slide">
  <blockquote class="border border-brand-line rounded-xl p-6 h-full bg-brand-surface">
    <p class="text-brand-muted mb-4">«${r.text}»</p>
    <footer class="font-medium">${r.author}${r.age ? `, ${r.age}` : ''}</footer>
  </blockquote>
</div>`
    )
    .join('');
  return `
<section class="py-12">
  <div class="max-w-6xl mx-auto px-4">
    <h2 class="font-display text-2xl text-center mb-8">Отзывы</h2>
    <div class="swiper review-swiper">
      <div class="swiper-wrapper">${slides}</div>
      <div class="swiper-pagination mt-6"></div>
    </div>
  </div>
</section>`;
}

export function renderDoctor(doctor, depth = 0) {
  const photo = assetPath(doctor.photo, depth);
  const withDiploma = doctor.photo?.includes('doctor-diploma');
  const imgClass = withDiploma
    ? 'w-full max-w-xs rounded-2xl object-cover object-top aspect-[3/4] border-4 border-brand-line shadow-lg shrink-0'
    : 'w-48 h-48 md:w-56 md:h-56 rounded-2xl object-cover border-4 border-brand-line shadow-lg shrink-0';
  return `
<section class="py-12 bg-brand-elevated">
  <div class="max-w-4xl mx-auto px-4 flex flex-col md:flex-row gap-8 items-center">
    <img src="${photo}" alt="${doctor.name}" class="${imgClass}" loading="lazy">
    <div>
      <h2 class="font-display text-2xl mb-2">${doctor.name}</h2>
      <p class="text-accent font-medium mb-1">${doctor.role}</p>
      <p class="text-brand-muted mb-3">${doctor.experience}</p>
      ${doctor.bio ? `<p class="text-sm text-brand-muted leading-relaxed">${doctor.bio}</p>` : ''}
    </div>
  </div>
</section>`;
}

export function renderGallery(images, depth = 0) {
  if (!images?.length) return '';
  const items = images
    .map(
      (img) => `
<div class="rounded-xl overflow-hidden border border-brand-line bg-brand-surface">
  <img src="${assetPath(img.src, depth)}" alt="${img.alt}" class="w-full h-auto object-cover" loading="lazy">
  ${img.caption ? `<p class="p-3 text-sm text-brand-muted text-center">${img.caption}</p>` : ''}
</div>`
    )
    .join('');
  return `
<section class="py-8">
  <div class="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">${items}</div>
</section>`;
}

export function renderResultPhoto(image, alt, depth = 0) {
  if (!image) return '';
  return `
<section class="py-12 bg-brand-elevated">
  <div class="max-w-2xl mx-auto px-4">
    <h2 class="font-display text-2xl mb-6 text-center">Результат процедуры</h2>
    <img src="${assetPath(image, depth)}" alt="${alt}" class="w-full rounded-2xl shadow-md" loading="lazy">
  </div>
</section>`;
}

export function renderTrustCards(cards) {
  const items = cards
    .map(
      (c) => `
<div class="border border-brand-line rounded-xl p-6 bg-brand-surface text-center">
  <h3 class="font-semibold mb-2">${c.title}</h3>
  <p class="text-sm text-brand-muted">${c.text}</p>
</div>`
    )
    .join('');
  return `
<section class="py-12">
  <div class="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-6">${items}</div>
</section>`;
}

export function renderServiceLanding(service, meta, nav, prices, shared, depth = 1) {
  const section = prices.sections.find((s) => s.id === service.priceSectionId);
  const h = service.hero;
  const old = h.oldPrice
    ? `<span class="old-price text-2xl md:text-3xl ml-3">${formatPrice(h.oldPrice)} ₽</span>`
    : '';
  const steps = service.visitSteps
    .map((s) => `<li class="flex gap-3"><span class="text-accent">✓</span><span>${s}</span></li>`)
    .join('');
  const promo = service.promoBanner
    ? `<div class="bg-accent/15 border-y border-accent/25 text-center py-3 px-4 text-sm font-medium text-accent">${service.promoBanner}</div>`
    : '';
  const doctor = { ...meta.doctor, ...(service.doctor || {}) };
  const heroImgClass = service.heroImage?.includes('product-')
    ? 'rounded-2xl shadow-lg w-full object-contain bg-brand-elevated p-6 max-h-[420px]'
    : 'rounded-2xl shadow-lg w-full object-cover aspect-[4/5]';
  const heroImg = service.heroImage
    ? `<div class="mt-10 md:mt-0 md:flex-1 max-w-md mx-auto">
        <img src="${assetPath(service.heroImage, depth)}" alt="${h.title}" class="${heroImgClass}" loading="lazy">
       </div>`
    : '';

  const midCta = `
<section class="py-16 bg-brand-surface border-y border-brand-line text-center">
  <div class="max-w-2xl mx-auto px-4">
    <h2 class="font-display text-2xl md:text-3xl mb-2">${h.title}</h2>
    <p class="font-display text-3xl mb-2 text-accent">${h.priceDisplay}${old}</p>
    <p class="text-brand-muted mb-6">${h.bonus}</p>
    <p class="text-sm text-brand-muted mb-6">Напишите в мессенджер — ответим и запишем на удобное время</p>
    ${renderCta(meta, h.title)}
  </div>
</section>`;

  return (
    renderHead(meta, h.title, depth) +
    `<body class="font-sans text-brand-text antialiased bg-brand-bg">` +
    renderHeader(meta, nav, depth) +
    `
<main>
  <section class="py-16 md:py-24">
    <div class="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-10 items-center">
      <div class="flex-1 text-center md:text-left">
        <h1 class="font-display text-3xl md:text-5xl mb-4">${h.title}</h1>
        <p class="font-display text-4xl md:text-5xl text-accent mb-2">${h.priceDisplay}${old}</p>
        ${h.priceNote ? `<p class="text-brand-muted mb-4">${h.priceNote}</p>` : ''}
        <p class="text-sm uppercase tracking-wider text-accent font-medium mb-8">с ${h.bonus}</p>
        <div class="text-left max-w-md mx-auto md:mx-0 mb-10">
          <p class="font-semibold mb-4">${shared.visitTitle}</p>
          <ul class="space-y-3 text-brand-muted">${steps}</ul>
        </div>
        ${renderCta(meta, h.title)}
      </div>
      ${heroImg}
    </div>
  </section>
  ${promo}
  ${renderReviews(shared.reviews)}
  ${renderDoctor(doctor, depth)}
  ${renderTrustCards(shared.trustCards)}
  ${midCta}
  ${renderResultPhoto(service.resultImage, h.title, depth)}
  <section class="py-12">
    <div class="max-w-3xl mx-auto px-4">
      <h2 class="font-display text-2xl mb-4 text-center">Результат</h2>
      <p class="text-brand-muted text-center leading-relaxed">${service.resultText}</p>
    </div>
  </section>
  ${renderPriceTable(section)}
  <section class="py-16 text-center">
    <div class="max-w-xl mx-auto px-4">
      <h2 class="font-display text-2xl mb-4">Записаться</h2>
      ${renderCta(meta, h.title)}
    </div>
  </section>
</main>` +
    renderFooter(meta, nav, depth) +
    renderCookie(depth) +
    renderFloating(meta, depth) +
    renderScripts(depth)
  );
}

const PLATFORM_LOGOS = {
  '2gis': `<svg class="platform-ratings__logo platform-ratings__logo--2gis" viewBox="0 0 88 28" fill="currentColor" aria-hidden="true">
    <circle cx="14" cy="14" r="11" fill="none" stroke="currentColor" stroke-width="2.2"/>
    <circle cx="14" cy="14" r="3.5"/>
    <text x="30" y="19" font-family="Montserrat, Arial, sans-serif" font-size="15" font-weight="700">2GIS</text>
  </svg>`,
  vk: `<img src="__PREFIX__assets/images/platforms/vk.svg" alt="" class="platform-ratings__logo platform-ratings__logo--vk" width="40" height="40" loading="lazy">`,
  yandex: `<svg class="platform-ratings__logo platform-ratings__logo--yandex" viewBox="0 0 108 28" fill="currentColor" aria-hidden="true">
    <text x="0" y="21" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="700" letter-spacing="-0.5">Яндекс</text>
  </svg>`,
};

function renderPlatformLogo(id, depth = 0) {
  const raw = PLATFORM_LOGOS[id] || '';
  if (!raw) return '';
  const prefix = depth > 0 ? '../'.repeat(depth) : '';
  return raw.replaceAll('__PREFIX__', prefix);
}

export function renderPlatformRatings(ratings, depth = 0) {
  if (!ratings?.items?.length) return '';
  const items = ratings.items
    .map((item) => {
      const logo = renderPlatformLogo(item.id, depth);
      const inner = `
  <div class="platform-ratings__logo-wrap">${logo}</div>
  <div class="platform-ratings__stats">
    <div class="platform-ratings__count-block">
      <span class="platform-ratings__count">${item.count}</span>
      <span class="platform-ratings__label">ОТЗЫВОВ</span>
    </div>
    <span class="platform-ratings__rating">${item.rating}</span>
  </div>`;
      if (item.url) {
        return `<a href="${item.url}" target="_blank" rel="noopener noreferrer" class="platform-ratings__item">${inner}</a>`;
      }
      return `<div class="platform-ratings__item">${inner}</div>`;
    })
    .join('');

  return `
<section class="platform-ratings" aria-label="Рейтинги на площадках">
  <div class="max-w-4xl mx-auto px-4">
    <div class="platform-ratings__grid">${items}</div>
  </div>
</section>`;
}

export function renderTopProcedures(topProcedures, depth = 0) {
  const prefix = depth > 0 ? '../'.repeat(depth) : '';
  const items = topProcedures.items
    .map((item) => {
      const href = `${prefix}${item.slug}/index.html`;
      const img = assetPath(item.image, depth);
      return `
<a href="${href}" class="top-procedure-card overflow-hidden group">
  <img src="${img}" alt="${item.label}" class="absolute inset-0 w-full h-full object-cover object-center" loading="lazy">
  <div class="top-procedure-card__overlay absolute inset-0 flex items-end justify-center pb-6 px-3">
    <span class="text-white text-center text-[11px] sm:text-xs md:text-sm font-semibold uppercase tracking-wide leading-tight max-w-[95%]">${item.label}</span>
  </div>
</a>`;
    })
    .join('');

  return `
<section class="py-12 md:py-16 bg-brand-bg">
  <div class="max-w-[1200px] mx-auto px-4">
    <h2 class="text-2xl md:text-[28px] font-bold text-center text-brand-text mb-2 tracking-tight">${topProcedures.title}</h2>
    <p class="text-center text-brand-muted text-sm md:text-base mb-8 md:mb-10">${topProcedures.subtitle}</p>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-1.5 md:gap-2">${items}</div>
  </div>
</section>`;
}

export function renderHome(meta, nav, servicesData, topProcedures, platformRatings, depth = 0) {
  const cards = servicesData.services
    .filter((s) => s.slug !== 'consultation')
    .map((s) => renderServiceCard(s, meta, depth))
    .join('');

  return (
    renderHead(meta, null, depth) +
    `<body class="font-sans text-brand-text antialiased bg-brand-bg">` +
    renderHeader(meta, nav, depth) +
    `
<main>
  ${renderHomeHero(meta, depth)}
  ${renderPlatformRatings(platformRatings, depth)}
  ${renderTopProcedures(topProcedures, depth)}
  <section class="py-12">
    <div class="max-w-6xl mx-auto px-4">
      <h2 class="font-display text-2xl text-center mb-10">Услуги и цены</h2>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">${cards}</div>
    </div>
  </section>
  ${renderDoctor(meta.doctor, depth)}
  ${renderReviews(servicesData.shared.reviews)}
  <section class="py-16 text-center border-t border-brand-line">
    <div class="max-w-xl mx-auto px-4">
      <h2 class="font-display text-2xl mb-4">Запишитесь в мессенджере</h2>
      <p class="text-brand-muted mb-6">Без форм на сайте — напишите напрямую в Telegram или Max</p>
      ${renderCta(meta)}
    </div>
  </section>
  <section class="py-12">
    <div class="max-w-3xl mx-auto px-4 text-sm text-brand-muted leading-relaxed">
      <p>${meta.seoHome}</p>
    </div>
  </section>
</main>` +
    renderFooter(meta, nav, depth) +
    renderCookie(depth) +
    renderFloating(meta, depth) +
    renderScripts(
      depth,
      `<script src="${depth > 0 ? '../'.repeat(depth) : ''}assets/vendor/three.min.js"></script>
<script src="${depth > 0 ? '../'.repeat(depth) : ''}assets/js/reverse-time.js" defer></script>`
    )
  );
}

export function renderAmenities(meta, nav, prices, depth = 1) {
  const toc = prices.sections
    .map((s) => `<a href="#${s.id}" class="hover:text-accent">${s.title}</a>`)
    .join(' · ');
  const blocks = prices.sections
    .map((section) => {
      const rows = section.items
        .map((item) => {
          const price =
            item.price != null
              ? `${item.note === 'от' ? 'от ' : ''}${formatPrice(item.price)} ${item.unit || '₽'}`
              : item.note || '—';
          return `<tr><td>${item.name}</td><td class="whitespace-nowrap font-medium">${price}</td></tr>`;
        })
        .join('');
      return `
<section class="py-10 border-b border-brand-line" id="${section.id}">
  <h2 class="font-display text-2xl mb-6">${section.title}</h2>
  <table class="w-full prose-price">
    <tbody>${rows}</tbody>
  </table>
</section>`;
    })
    .join('');

  return (
    renderHead(meta, 'Прейскурант', depth) +
    `<body class="font-sans text-brand-text antialiased bg-brand-bg">` +
    renderHeader(meta, nav, depth) +
    `
<main>
  <section class="py-12 bg-brand-elevated">
    <div class="max-w-3xl mx-auto px-4 text-center">
      <h1 class="font-display text-4xl mb-4">Прейскурант</h1>
      <p class="text-brand-muted mb-4">Актуально на ${prices.updated}</p>
      <p class="text-sm flex flex-wrap justify-center gap-2">${toc}</p>
    </div>
  </section>
  <section class="py-8">
    <div class="max-w-3xl mx-auto px-4">${blocks}</div>
  </section>
  <section class="py-12 text-center">
    <h2 class="font-display text-xl mb-4">Записаться</h2>
    ${renderCta(meta)}
  </section>
</main>` +
    renderFooter(meta, nav, depth) +
    renderCookie(depth) +
    renderFloating(meta, depth) +
    renderScripts(depth)
  );
}

export function renderMap(address) {
  if (!address?.map) return '';
  const { lon, lat, zoom = 16 } = address.map;
  const src = `https://yandex.ru/map-widget/v1/?ll=${lon}%2C${lat}&z=${zoom}&l=map&pt=${lon}%2C${lat}%2Cpm2rdm`;
  const label = [address.city, address.street, address.metro].filter(Boolean).join(', ');
  return `
<section class="mt-10">
  <h2 class="font-display text-xl mb-2">Как нас найти</h2>
  <p class="text-sm text-brand-muted mb-4">${label}</p>
  <div class="rounded-2xl overflow-hidden border border-brand-line shadow-sm">
    <iframe
      src="${src}"
      class="w-full min-h-[360px] md:min-h-[420px]"
      title="Карта — ${label}"
      allowfullscreen
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
</section>`;
}

export function renderContactsHero(meta, content, depth = 1) {
  const photo = assetPath(meta.doctor.photo, depth);
  const withDiploma = meta.doctor.photo?.includes('doctor-diploma');
  const imgClass = withDiploma
    ? 'w-full max-w-[280px] rounded-2xl object-cover object-top aspect-[3/4] shadow-md'
    : 'w-full max-w-[280px] rounded-2xl object-cover aspect-[3/4] shadow-md';
  return `
<div class="flex flex-col md:flex-row gap-8 md:gap-10 items-start mb-10">
  <div class="shrink-0 w-full md:w-auto mx-auto md:mx-0">
    <img src="${photo}" alt="${meta.doctor.name}" class="${imgClass}" loading="lazy">
    <p class="mt-3 text-center md:text-left font-medium">${meta.doctor.name}</p>
    <p class="text-sm text-accent text-center md:text-left">${meta.doctor.role}</p>
  </div>
  <div class="flex-1 text-brand-muted space-y-4 leading-relaxed min-w-0">${content}</div>
</div>`;
}

export function renderContactsPage(meta, nav, { title, content }, depth = 1) {
  return (
    renderHead(meta, title, depth) +
    `<body class="font-sans text-brand-text antialiased bg-brand-bg">` +
    renderHeader(meta, nav, depth) +
    `
<main class="py-16">
  <div class="max-w-4xl mx-auto px-4">
    <h1 class="font-display text-4xl mb-8">${title}</h1>
    ${renderContactsHero(meta, content, depth)}
    ${renderMap(meta.address)}
    <div class="mt-12">${renderCta(meta)}</div>
  </div>
</main>` +
    renderFooter(meta, nav, depth) +
    renderCookie(depth) +
    renderFloating(meta, depth) +
    renderScripts(depth)
  );
}

export function renderSimplePage(meta, nav, { title, content, gallery, showMap }, depth = 1) {
  const maxW = showMap ? 'max-w-4xl' : 'max-w-3xl';
  return (
    renderHead(meta, title, depth) +
    `<body class="font-sans text-brand-text antialiased bg-brand-bg">` +
    renderHeader(meta, nav, depth) +
    `
<main class="py-16">
  <div class="${maxW} mx-auto px-4">
    <h1 class="font-display text-4xl mb-8">${title}</h1>
    <div class="page-content text-brand-muted space-y-4 leading-relaxed">${content}</div>
    ${showMap ? renderMap(meta.address) : ''}
    ${renderGallery(gallery, depth)}
    <div class="mt-12">${renderCta(meta)}</div>
  </div>
</main>` +
    renderFooter(meta, nav, depth) +
    renderCookie(depth) +
    renderFloating(meta, depth) +
    renderScripts(depth)
  );
}
