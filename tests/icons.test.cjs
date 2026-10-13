const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const root = path.join(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name));

// Decode non-interlaced 8-bit RGBA PNGs using only Node built-ins.
function pixels(file) {
  const png = read(file);
  assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  const width = png.readUInt32BE(16), height = png.readUInt32BE(20);
  assert.equal(png[24], 8); assert.equal(png[25], 6); assert.equal(png[28], 0);
  const chunks = [];
  for (let i = 8; i < png.length;) {
    const length = png.readUInt32BE(i);
    if (png.toString('ascii', i + 4, i + 8) === 'IDAT') chunks.push(png.subarray(i + 8, i + 8 + length));
    i += length + 12;
  }
  const raw = zlib.inflateSync(Buffer.concat(chunks)), stride = width * 4;
  const data = Buffer.alloc(height * stride);
  const paeth = (a, b, c) => {
    const p = a + b - c, da = Math.abs(p - a), db = Math.abs(p - b), dc = Math.abs(p - c);
    return da <= db && da <= dc ? a : db <= dc ? b : c;
  };
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    assert.ok(filter <= 4);
    for (let x = 0; x < stride; x++) {
      const i = y * stride + x;
      const a = x >= 4 ? data[i - 4] : 0, b = y ? data[i - stride] : 0;
      const c = y && x >= 4 ? data[i - stride - 4] : 0;
      const predictor = [0, a, b, Math.floor((a + b) / 2), paeth(a, b, c)][filter];
      data[i] = (raw[y * (stride + 1) + 1 + x] + predictor) & 255;
    }
  }
  return { width, height, data };
}

for (const [file, size] of [['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
  test(`${file}: glyph bounds and visual centroid are centered within 1px`, () => {
    const { width, height, data } = pixels(`assets/${file}`);
    assert.equal(width, size); assert.equal(height, size);
    assert.deepEqual([...data.subarray(0, 4)], [17, 27, 37, 255], 'preserve opaque background');
    let minX = width, maxX = -1, minY = height, maxY = -1, sumX = 0, sumY = 0, count = 0;
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (data[i + 3] && data[i] > 100 && data[i] > data[i + 2] * 1.3) {
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
        sumX += x + .5; sumY += y + .5; count++;
        // Also fits the central 80%-diameter circular maskable safe zone.
        assert.ok(Math.hypot(x + .5 - width / 2, y + .5 - height / 2) <= size * .4);
      }
    }
    assert.ok(count > 0);
    for (const center of [(minX + maxX + 1) / 2, (minY + maxY + 1) / 2, sumX / count, sumY / count]) {
      assert.ok(Math.abs(center - size / 2) <= 1, `center ${center}, canvas ${size / 2}`);
    }
    const middle = (Math.floor(height / 2) * width + Math.floor(width / 2)) * 4;
    assert.deepEqual([...data.subarray(middle, middle + 4)], [233, 168, 111, 255], 'preserve glyph color');
  });
}

test('SVG retains its design and moves only the glyph up six units', () => {
  const svg = read('assets/icon.svg').toString();
  assert.match(svg, /viewBox="0 0 64 64"/);
  assert.match(svg, /transform="translate\(0 -6\)"/);
  assert.match(svg, /stroke="#e9a86f" stroke-width="4"/);
  // Original stroked glyph bounds: x=[10,54], y=[26,50].
  assert.equal((10 + 54) / 2, 32);
  assert.equal((26 + 50) / 2 - 6, 32);
});

test('versioned icon and manifest URLs match the offline cache', () => {
  const html = read('index.html').toString(), sw = read('sw.js').toString();
  const manifest = JSON.parse(read('manifest.webmanifest'));
  assert.match(sw, /cumpafit-v32/);
  for (const icon of manifest.icons) {
    assert.ok(icon.src.endsWith('?v=32'));
    assert.ok(sw.includes(`"${icon.src}"`));
  }
  for (const url of ['./assets/apple-touch-icon.png?v=32', './assets/icon.svg?v=32', './manifest.webmanifest?v=32']) {
    assert.ok(html.includes(`href="${url}"`)); assert.ok(sw.includes(`"${url}"`));
  }
});
