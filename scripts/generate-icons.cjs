// Development-only dependency: sharp. Runtime and tests remain dependency-free.
// Run from any directory with `node scripts/generate-icons.cjs`.
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const root = path.join(__dirname, '..');

async function main() {
  const svg = await fs.readFile(path.join(root, 'assets/icon.svg'));
  for (const [name, size] of [['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
    // Existing PNGs have an opaque square background; iOS applies its own mask.
    await sharp(svg, { density: size * 72 / 64 }).resize(size, size)
      .flatten({ background: '#111b25' }).ensureAlpha().png()
      .toFile(path.join(root, 'assets', name));
  }
  await fs.copyFile(path.join(root, 'assets/icon-512.png'), path.join(root, 'docs/icon-centering/after.png'));
  const before = await fs.readFile(path.join(root, 'docs/icon-centering/before.png'));
  const after = await fs.readFile(path.join(root, 'docs/icon-centering/after.png'));
  const image = (bytes, x) => `<image x="${x}" y="60" width="256" height="256" href="data:image/png;base64,${bytes.toString('base64')}"/>`;
  // Guide lines mark canvas centers, not the displaced glyph's center.
  const guides = x => `<path d="M${x + 128} 60v256M${x} 188h256" stroke="#ffffff" stroke-opacity=".45" stroke-dasharray="4 4"/>`;
  const preview = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="350">
    <rect width="600" height="350" fill="#f7f5f0"/>
    <g font-family="sans-serif" font-size="22" fill="#111b25" text-anchor="middle"><text x="150" y="36">Antes</text><text x="450" y="36">Después</text></g>
    ${image(before, 22)}${image(after, 322)}${guides(22)}${guides(322)}
  </svg>`;
  await sharp(Buffer.from(preview)).png().toFile(path.join(root, 'docs/icon-centering/comparison.png'));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
