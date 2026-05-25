import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  renderHome,
  renderServiceLanding,
  renderAmenities,
  renderSimplePage,
  renderContactsPage,
} from './render.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(root, 'data', name), 'utf8'));
}

function writePage(relPath, html) {
  const dir = path.join(dist, path.dirname(relPath));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dist, relPath), html, 'utf8');
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

const meta = readJson('site-meta.json');
const nav = readJson('navigation.json');
const prices = readJson('prices.json');
const servicesData = readJson('services.json');
const topProcedures = readJson('top-procedures.json');
const platformRatings = readJson('platform-ratings.json');

if (fs.existsSync(dist)) fs.rmSync(dist, { recursive: true });
fs.mkdirSync(dist, { recursive: true });

copyDir(path.join(root, 'assets'), path.join(dist, 'assets'));

writePage('index.html', renderHome(meta, nav, servicesData, topProcedures, platformRatings, 0));

for (const service of servicesData.services) {
  const html = renderServiceLanding(service, meta, nav, prices, servicesData.shared, 1);
  writePage(`${service.slug}/index.html`, html);
}

writePage('amenities/index.html', renderAmenities(meta, nav, prices, 1));

const staticPages = {
  contacts: {
    title: 'Контакты',
    content: `
<p class="text-lg text-brand-text"><strong>${meta.brandName}</strong></p>
<p>${meta.address.city}, ${meta.address.street}</p>
<p>${meta.address.metro || ''}</p>
<p>Телефон: <a href="tel:${meta.contacts.phone.replace(/\s|[()\-]/g, '')}" class="text-accent font-medium hover:opacity-90">${meta.contacts.phoneDisplay}</a></p>
<p>Режим работы: ${meta.address.hours}</p>
<p class="pt-2">Запись — в Telegram или Max. Форм на сайте нет, чтобы вам было удобнее и без спама.</p>`,
  },
  company: {
    title: 'О нас',
    content: `
<p><strong>${meta.doctor.name}</strong> — ${meta.doctor.role.toLowerCase()}.</p>
<p>${meta.brandName} — косметологические услуги с индивидуальным подходом: инъекционные методики, уходовые программы, консультации.</p>
<p>${meta.doctor.bio}</p>
<p>Запишитесь через мессенджер — ответим на вопросы и подберём удобное время.</p>`,
    gallery: meta.gallery || [],
  },
  documents: {
    title: 'Документы и лицензии',
    content: `
<p>Дипломы и сертификаты специалиста. Дополнительные документы — по запросу при записи на консультацию.</p>
<p>${meta.disclaimer}</p>`,
    gallery: meta.gallery,
  },
};

for (const [slug, page] of Object.entries(staticPages)) {
  const html =
    slug === 'contacts'
      ? renderContactsPage(meta, nav, page, 1)
      : renderSimplePage(meta, nav, page, 1);
  writePage(`${slug}/index.html`, html);
}

console.log(`Built ${servicesData.services.length + 4} pages → dist/`);
