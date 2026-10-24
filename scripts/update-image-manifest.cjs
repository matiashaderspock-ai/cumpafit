const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.join(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const illustrations = JSON.parse(app.match(/const STARTER_ILLUSTRATIONS = (\{[\s\S]*?\n\});/)[1]);
const files = [...new Set(['./assets/ejercicios-referencia.png', ...Object.values(illustrations)])].sort();
const manifest = Object.fromEntries(files.map(file => [file,
  crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex').slice(0, 16),
]));
const swPath = path.join(root, 'sw.js');
const source = fs.readFileSync(swPath, 'utf8');
const updated = source.replace(/const IMAGE_FILES = \{[\s\S]*?\n\};/, `const IMAGE_FILES = ${JSON.stringify(manifest, null, 2)};`);
if (process.argv.includes('--check')) {
  if (source !== updated) {
    console.error('Offline image manifest is outdated. Run node scripts/update-image-manifest.cjs');
    process.exitCode = 1;
  }
} else fs.writeFileSync(swPath, updated);
