import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

/** Fixed badge spec for 1536×1024 top cards — same on every image */
const BADGE = {
  x: 20,
  y: 20,
  width: 188,
  height: 104,
  radius: 12,
  fill: [255, 255, 255, 235],
  logoWidth: 120,
  innerPad: 12,
};

const py = `
from PIL import Image, ImageDraw
import json, os, sys

root = sys.argv[1]
badge = json.loads(sys.argv[2])
logo_path = os.path.join(root, "static/assets/logo.png")
data = json.load(open(os.path.join(root, "data/top_procedures.json")))

logo = Image.open(logo_path).convert("RGBA")
logo_w = badge["logoWidth"]
logo_h = int(logo.height * logo_w / logo.width)
lg = logo.resize((logo_w, logo_h), Image.Resampling.LANCZOS)

bx, by = badge["x"], badge["y"]
bw, bh = badge["width"], badge["height"]
br = badge["radius"]
fill = tuple(badge["fill"])

for item in data["items"]:
    rel = item["image"]
    path = os.path.join(root, rel)
    if not os.path.exists(path):
        print("SKIP", path)
        continue

    base = Image.open(path).convert("RGBA")

    plate = Image.new("RGBA", (bw, bh), (0, 0, 0, 0))
    draw = ImageDraw.Draw(plate)
    draw.rounded_rectangle((0, 0, bw - 1, bh - 1), radius=br, fill=fill)
    base.paste(plate, (bx, by), plate)

    lx = bx + (bw - logo_w) // 2
    ly = by + (bh - logo_h) // 2
    base.paste(lg, (lx, ly), lg)

    out = base.convert("RGB")
    ext = os.path.splitext(path)[1].lower()
    if ext == ".png":
        out.save(path, "PNG", optimize=True)
    else:
        out.save(path, "JPEG", quality=88, optimize=True)
    print("OK", rel, base.size[0], base.size[1], f"badge={bw}x{bh} logo={logo_w}x{logo_h}")
`;

const scriptPath = path.join(root, 'scripts/_overlay_logo.py');
fs.writeFileSync(scriptPath, py);
const r = spawnSync('python3', [scriptPath, root, JSON.stringify(BADGE)], { stdio: 'inherit' });
fs.unlinkSync(scriptPath);
process.exit(r.status ?? 1);
