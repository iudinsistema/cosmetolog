/**
 * Конвертирует «лого 1.pdf» в assets/logo.svg (вектор из PDF).
 * Требует: pdftocairo (poppler-utils)
 *
 *   node scripts/pdf-logo-to-svg.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const pdf = path.join(root, 'лого 1.pdf');
const outSvg = path.join(root, 'assets/logo.svg');
const tmp = path.join(root, 'assets/.logo-from-pdf-tmp');

if (!fs.existsSync(pdf)) {
  console.error('PDF not found:', pdf);
  process.exit(1);
}

const r = spawnSync('pdftocairo', ['-svg', pdf, tmp], { encoding: 'utf8' });
if (r.status !== 0) {
  console.error('pdftocairo failed. Install poppler-utils.');
  process.exit(r.status ?? 1);
}

const raw = fs.readFileSync(tmp, 'utf8');
const gMatch = raw.match(/<g id="source-5"[^>]*>([\s\S]*?)<\/g>/);
if (!gMatch) {
  console.error('Unexpected PDF SVG structure');
  process.exit(1);
}

let inner = gMatch[1];
inner = inner.replace(/fill="rgb\(0%, 0%, 0%\)" fill-opacity="1"/g, 'fill="currentColor"');
inner = inner.replace(/stroke="rgb\(0%, 0%, 0%\)" stroke-opacity="1"/g, 'stroke="currentColor"');
inner = inner.replace(/ transform="matrix\(1, 0, 0, 1, -355, -247\)"/g, '');
inner = inner.replace(
  /d="M 562\.8125 250\.023438 L 461\.1875 480\.40625 "/,
  'd="M 207.8125 3.023438 L 106.1875 233.40625 "'
);

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 311 277" fill="currentColor">
<g fill="currentColor" stroke="currentColor">
${inner.trim()}
</g>
</svg>
`;

fs.writeFileSync(outSvg, svg);
fs.unlinkSync(tmp);
console.log('Wrote', outSvg);
