const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const root = path.join(__dirname, '..');
const scope = 'https://example.test/cumpafit/';
const absolute = value => new URL(typeof value === 'string' ? value : value.url, scope).href;
const revision = body => crypto.createHash('sha256').update(body).digest('hex').slice(0, 16);
const image = body => new Response(body, { headers: { 'Content-Type': 'image/jpeg' } });
const bodies = { './assets/one.jpg': 'one', './assets/two.jpg': 'two', './assets/three.jpg': 'three' };
const files = Object.fromEntries(Object.entries(bodies).map(([file, body]) => [file, revision(body)]));

class MemoryCache {
  entries = new Map();
  added = [];
  failWrites = false;
  async match(key) { return this.entries.get(absolute(key))?.clone(); }
  async put(key, response) {
    if (this.failWrites) throw new Error('Simulated storage full');
    this.entries.set(absolute(key), response.clone());
  }
  async delete(key) { return this.entries.delete(absolute(key)); }
  async keys() { return [...this.entries.keys()].map(key => new Request(key)); }
  async addAll(urls) {
    this.added.push(...urls);
    for (const url of urls) await this.put(url, new Response('shell'));
  }
}
function cacheStorage() {
  const stores = new Map();
  return {
    stores,
    async open(name) { if (!stores.has(name)) stores.set(name, new MemoryCache()); return stores.get(name); },
    async keys() { return [...stores.keys()]; },
    async delete(name) { return stores.delete(name); },
    async match(key) { for (const cache of stores.values()) { const found = await cache.match(key); if (found) return found; } },
  };
}
function worker(options = {}) {
  const listeners = new Map(), calls = [], messages = [];
  const storage = options.storage || cacheStorage();
  let network = options.fetch || (async request => {
    const url = new URL(absolute(request));
    const file = `.${url.pathname.slice('/cumpafit'.length)}`;
    return image(bodies[file] || 'network');
  });
  let claims = 0, skips = 0;
  const context = vm.createContext({
    URL, Request, Response, Uint8Array, AbortController, crypto: crypto.webcrypto,
    setTimeout, clearTimeout, caches: storage,
    fetch: async (request, options) => { calls.push({ url: absolute(request), options }); return network(request, options); },
    self: {
      registration: { scope },
      addEventListener: (type, fn) => listeners.set(type, fn),
      skipWaiting: async () => { skips++; },
      clients: {
        claim: async () => { claims++; },
        matchAll: async () => [
          { url: scope, postMessage: message => messages.push(message) },
          { url: 'https://example.test/another-app/', postMessage: () => { throw Error('Wrong app'); } },
        ],
      },
    },
  });
  let source = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
  source = source.replace(/const IMAGE_FILES = \{[\s\S]*?\n\};/, `const IMAGE_FILES = ${JSON.stringify(options.files || files)};`);
  if (options.version) source = source.replace(/cumpafit-v\d+/, `cumpafit-v${options.version}`);
  vm.runInContext(source, context);
  const run = code => vm.runInContext(code, context);
  function dispatch(type, data = {}) {
    const waits = [];
    let response;
    listeners.get(type)({ ...data, waitUntil: promise => waits.push(promise), respondWith: promise => { response = promise; } });
    return { response, async settled() { for (let i = 0; i < waits.length; i++) await waits[i]; } };
  }
  return {
    run, storage, calls, messages, dispatch,
    key: file => run(`imageKey(${JSON.stringify(file)})`),
    setNetwork: fn => { network = fn; },
    warm: () => dispatch('message', { data: { type: 'CACHE_IMAGES' } }).settled(),
    request: (file, mode = 'cors') => dispatch('fetch', { request: { url: absolute(file), method: 'GET', mode } }),
    get claims() { return claims; }, get skips() { return skips; },
  };
}

test('offline manifest covers the catalog and contains actual image content revisions', () => {
  const result = spawnSync(process.execPath, ['scripts/update-image-manifest.cjs', '--check'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
  const manifest = JSON.parse(sw.match(/const IMAGE_FILES = (\{[\s\S]*?\n\});/)[1]);
  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  const illustrations = JSON.parse(app.match(/const STARTER_ILLUSTRATIONS = (\{[\s\S]*?\n\});/)[1]);
  assert.deepEqual(Object.keys(manifest).sort(), [...new Set(['./assets/ejercicios-referencia.png', ...Object.values(illustrations)])].sort());
  for (const [file, hash] of Object.entries(manifest)) assert.equal(hash, revision(fs.readFileSync(path.join(root, file))));
});

test('install saves only the small app shell, without downloading the image library', async () => {
  const w = worker();
  await w.dispatch('install').settled();
  assert.equal(w.skips, 1);
  assert.equal(w.calls.length, 0);
  const cache = await w.storage.open(w.run('CACHE'));
  assert.ok(cache.added.includes('./index.html'));
  assert.ok(cache.added.every(file => !Object.hasOwn(files, file)));
});

test('cached images return immediately without ever calling a stalled network', async () => {
  const w = worker({ fetch: () => { throw Error('Cached image must not fetch'); } });
  const cache = await w.storage.open(w.run('IMAGE_CACHE'));
  await cache.put(w.key('./assets/one.jpg'), image('one'));
  const event = w.request('./assets/one.jpg');
  assert.equal(await (await event.response).text(), 'one');
  await event.settled();
  assert.equal(w.calls.length, 0);
});

test('activation migrates legacy images without downloading and preserves unrelated caches', async () => {
  const w = worker();
  const old = await w.storage.open('cumpafit-v39');
  await old.put('./assets/one.jpg', image('one'));
  await w.storage.open('another-app-v1');
  await w.dispatch('activate').settled();
  assert.equal(w.claims, 1);
  assert.equal(w.calls.length, 0);
  assert.equal(w.storage.stores.has('cumpafit-v39'), false);
  assert.equal(w.storage.stores.has('another-app-v1'), true);
  assert.equal(await (await (await w.storage.open(w.run('IMAGE_CACHE'))).match(w.key('./assets/one.jpg'))).text(), 'one');
});

test('a storage failure during migration retains legacy copies and still activates', async () => {
  const w = worker();
  await (await w.storage.open('cumpafit-v39')).put('./assets/one.jpg', image('one'));
  (await w.storage.open(w.run('IMAGE_CACHE'))).failWrites = true;
  await w.dispatch('activate').settled();
  assert.equal(w.claims, 1);
  assert.equal(w.storage.stores.has('cumpafit-v39'), true);
  const request = w.request('./assets/one.jpg');
  assert.equal(await (await request.response).text(), 'one');
  await request.settled();
});

test('a background pass skips saved images, saves the rest, and reports ready only after completion', async () => {
  const w = worker();
  await (await w.storage.open(w.run('IMAGE_CACHE'))).put(w.key('./assets/one.jpg'), image('one'));
  await w.warm();
  assert.equal(w.calls.length, 2);
  assert.ok(w.calls.every(call => !call.url.includes('one.jpg')));
  assert.equal(w.messages[0].phase, 'loading');
  assert.equal(w.messages[0].completed, 1);
  assert.equal(w.messages.at(-1).phase, 'ready');
  assert.equal(w.messages.at(-1).completed, 3);
  await w.warm();
  assert.equal(w.calls.length, 2, 'reopening never re-downloads unchanged images');
});

test('failed downloads retain partial progress and resume only missing images', async () => {
  const w = worker({ fetch: async request => {
    if (absolute(request).includes('two.jpg')) throw Error('Offline');
    return image(absolute(request).includes('one.jpg') ? 'one' : 'three');
  } });
  await w.warm();
  assert.equal(w.messages.at(-1).phase, 'paused');
  assert.equal(w.messages.at(-1).completed, 2);
  w.calls.length = 0;
  w.setNetwork(async () => image('two'));
  await w.warm();
  assert.equal(w.calls.length, 1);
  assert.ok(w.calls[0].url.includes('two.jpg'));
  assert.equal(w.messages.at(-1).phase, 'ready');
});

test('HTML errors, 404s and outdated image bytes never become ready cached images', async () => {
  for (const response of [new Response('<html>Error</html>'), new Response('missing', { status: 404 }), image('outdated')]) {
    const w = worker({ fetch: async () => response.clone() });
    await w.warm();
    assert.equal(w.messages.at(-1).phase, 'paused');
    assert.equal(w.messages.at(-1).completed, 0);
    assert.equal((await (await w.storage.open(w.run('IMAGE_CACHE'))).keys()).length, 0);
  }
});

test('an application upgrade keeps saved images; only a changed image revision downloads', async () => {
  const first = worker();
  await first.warm();
  const next = worker({ storage: first.storage, version: 999, files: { ...files, './assets/two.jpg': revision('two-updated') }, fetch: async () => image('two-updated') });
  await next.dispatch('activate').settled();
  await next.warm();
  assert.equal(next.calls.length, 1);
  assert.ok(next.calls[0].url.includes('two.jpg'));
  const cache = await next.storage.open(next.run('IMAGE_CACHE'));
  assert.equal((await cache.keys()).length, 3, 'old revisions are removed only after the full current library is saved');
  assert.equal(await (await cache.match(next.key('./assets/two.jpg'))).text(), 'two-updated');
});

test('a changed image serves its previous version while a slow replacement downloads', async () => {
  let complete;
  const w = worker({ fetch: () => new Promise(resolve => { complete = resolve; }) });
  const cache = await w.storage.open(w.run('IMAGE_CACHE'));
  await cache.put(w.run('imageKey("./assets/one.jpg", "old")'), image('old-one'));
  const event = w.request('./assets/one.jpg');
  assert.equal(await (await event.response).text(), 'old-one');
  // Flush the cache-read promise before resolving the controlled network request.
  await new Promise(resolve => setImmediate(resolve));
  complete(image('one'));
  await event.settled();
  assert.equal(await (await cache.match(w.key('./assets/one.jpg'))).text(), 'one');
});

test('image failure returns an image placeholder; only navigation receives an HTML fallback', async () => {
  const w = worker({ fetch: async () => { throw Error('Offline'); } });
  const shell = await w.storage.open(w.run('CACHE'));
  await shell.put('./index.html', new Response('<html>App</html>'));
  const missing = w.request('./assets/one.jpg');
  const response = await missing.response;
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('content-type'), 'image/svg+xml');
  await missing.settled();
  const navigation = w.request('./?open=app', 'navigate');
  assert.equal(await (await navigation.response).text(), '<html>App</html>');
  const css = w.request('./missing.css');
  assert.equal((await css.response).type, 'error');
});

test('concurrent requests and background downloads share a single image fetch', async () => {
  const w = worker();
  const a = w.request('./assets/one.jpg'), b = w.request('./assets/one.jpg');
  const warm = w.warm();
  const [one, two] = await Promise.all([a.response, b.response]);
  assert.equal(await one.text(), 'one'); assert.equal(await two.text(), 'one');
  await Promise.all([a.settled(), b.settled(), warm]);
  assert.equal(w.calls.filter(call => call.url.includes('one.jpg')).length, 1);
});

function client(options = {}) {
  const status = { hidden: true, dataset: {}, textContent: '' };
  const swEvents = new Map(), windowEvents = new Map(), timers = new Map(), posts = [], registrations = [];
  let persistenceRequests = 0;
  const navigator = {
    onLine: true,
    serviceWorker: {
      controller: { postMessage: message => posts.push(message) },
      addEventListener: (type, fn) => swEvents.set(type, fn),
      register: async (...args) => { registrations.push(args); return {}; },
      ready: Promise.resolve({}),
    },
    storage: {
      persisted: async () => options.persistent || false,
      persist: async () => { persistenceRequests++; if (options.storageError) throw Error('Denied'); return false; },
    },
  };
  const context = vm.createContext({
    Date, Intl, structuredClone, navigator, console,
    setTimeout: fn => { const key = timers.size + 1; timers.set(key, fn); return key; },
    clearTimeout: key => timers.delete(key), setInterval: () => 0,
    document: { addEventListener() {}, visibilityState: 'visible', querySelector: selector => selector === '#offline-images-status' ? status : null },
    window: { isSecureContext: true, addEventListener: (type, fn) => windowEvents.set(type, fn) },
  });
  vm.runInContext(fs.readFileSync(path.join(root, 'app.js'), 'utf8').replace(/\ninit\(\);\s*$/, '\n'), context);
  const run = code => vm.runInContext(code, context);
  run('state = initialState(); const beforeOfflineSetup = JSON.stringify(state);');
  return { status, posts, registrations, timers, run, navigator,
    receive: data => swEvents.get('message')({ data: { type: 'OFFLINE_IMAGES_STATUS', ...data } }),
    online: () => windowEvents.get('online')(),
    changedController: () => swEvents.get('controllerchange')(),
    get persistenceRequests() { return persistenceRequests; },
  };
}

test('client shows real progress and readiness without changing workout state or rendering inputs', async () => {
  const a = client();
  await a.run('startOfflineImages()');
  assert.equal(a.registrations[0][0], './sw.js');
  assert.equal(a.registrations[0][1].updateViaCache, 'none');
  assert.equal(a.persistenceRequests, 1);
  assert.equal(a.posts.length, 1);
  a.receive({ phase: 'loading', completed: 0, total: 3 });
  assert.equal(a.status.hidden, false);
  assert.equal(a.status.textContent, 'Guardando imágenes · 0/3');
  a.receive({ phase: 'paused', completed: 2, total: 3 });
  assert.match(a.status.textContent, /2\/3 · Descarga pendiente/);
  assert.equal(a.timers.size, 1);
  a.online();
  assert.equal(a.posts.length, 2);
  assert.equal(a.timers.size, 0);
  a.receive({ phase: 'ready', completed: 3, total: 3 });
  assert.equal(a.status.textContent, '✓ Imágenes listas sin conexión');
  assert.equal(a.status.dataset.state, 'ready');
  assert.equal(a.run('JSON.stringify(state) === beforeOfflineSetup'), true);
});

test('storage denial does not stop setup; an updated worker starts or resumes downloads', async () => {
  const a = client({ storageError: true });
  await a.run('startOfflineImages()');
  a.changedController();
  assert.equal(a.posts.length, 2);
  a.receive({ phase: 'unavailable' });
  assert.equal(a.status.textContent, 'Descarga de imágenes pendiente. Se reintentará.');
  assert.equal(a.timers.size, 1);
});

test('already persistent storage is not requested again, and incomplete counts cannot claim readiness', async () => {
  const a = client({ persistent: true });
  await a.run('startOfflineImages()');
  assert.equal(a.persistenceRequests, 0);
  for (const data of [
    { phase: 'ready', completed: 2, total: 3 }, { phase: 'ready', completed: 4, total: 3 },
    { phase: 'ready', completed: 0, total: 0 }, { phase: 'other', completed: 3, total: 3 },
  ]) a.receive(data);
  assert.equal(a.status.hidden, true);
});
