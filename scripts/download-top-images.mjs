import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../assets/images/top');

const items = [
  {
    file: '01-pico.jpg',
    url: 'https://static.tildacdn.com/tild3031-6536-4538-a635-333231646463/135bfda9108a045faa87.jpg',
  },
  {
    file: '02-wrinkles.jpg',
    url: 'https://static.tildacdn.com/tild3964-3932-4262-b165-303837346361/537004c4f1d725e7d680.jpg',
  },
  {
    file: '03-skin-improve.jpg',
    url: 'https://static.tildacdn.com/tild6534-6261-4531-a531-623531333132/pexels-chloe-amaya-4.jpg',
  },
  {
    file: '04-skin-treatment.jpg',
    url: 'https://static.tildacdn.com/tild3235-3366-4661-b930-373134616239/c586872e378cff2ea633.jpg',
  },
  {
    file: '05-lips.jpg',
    url: 'https://static.tildacdn.com/tild6434-6661-4664-b932-333435656432/noroot.jpg',
  },
  {
    file: '06-body.jpg',
    url: 'https://static.tildacdn.com/tild6539-3464-4165-b036-303663343130/412752247cdf74795f34.jpg',
  },
  {
    file: '07-photo.jpg',
    url: 'https://static.tildacdn.com/tild3538-3766-4736-a664-346336653431/0f5e8df62c6900ebc2b5.jpg',
  },
  {
    file: '08-contour-face.png',
    url: 'https://static.tildacdn.com/tild6262-3139-4863-b063-656131306666/noroot.png',
  },
];

fs.mkdirSync(outDir, { recursive: true });

for (const { file, url } of items) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(path.join(outDir, file), buf);
  console.log('OK', file, buf.length);
}
