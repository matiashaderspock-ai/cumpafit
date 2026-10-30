const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8').replace(/\ninit\(\);\s*$/, '\n');

// Storage double preserves database names and atomic transaction semantics.
// Browser validation additionally exercises these paths with actual IndexedDB.
function app({ demo = true, search = '', today = '2026-10-30', databases = new Map(), bootstrap = demo } = {}) {
  const opens = [], writes = [], calls = [], listeners = new Map(), timers = new Map();
  let abortNext = false, timerId = 0;
  class Clock extends Date {
    constructor(...args) { super(...(args.length ? args : [`${today}T12:00:00`])); }
  }
  const button = { disabled: false };
  const network = name => () => { calls.push(name); throw Error(`Unexpected network/transfer: ${name}`); };
  const context = vm.createContext({
    Date: Clock, Intl, URLSearchParams, structuredClone, console: { error() {}, warn() {} },
    setTimeout(fn) { timers.set(++timerId, fn); return timerId; },
    clearTimeout(id) { timers.delete(id); }, setInterval() {},
    fetch: network('fetch'), XMLHttpRequest: network('XHR'), WebSocket: network('WebSocket'),
    FileReader: network('FileReader'), Blob: network('Blob'), URL: { createObjectURL: network('download') },
    navigator: { sendBeacon: network('beacon'), serviceWorker: {
      register: network('register SW'), controller: { postMessage: network('SW message') },
      addEventListener: network('SW listener'),
    } },
    window: { CUMPAFIT_DEMO: bootstrap, location: { search }, isSecureContext: true, addEventListener() {}, scrollTo() {} },
    document: {
      addEventListener(type, fn, capture = false) { const key = `${type}:${capture}`; listeners.set(key, [...(listeners.get(key) || []), fn]); },
      querySelector(selector) {
        if (selector === '#demo-banner [data-action="reset-demo"]') return button;
        throw Error(`Unexpected DOM access: ${selector}`);
      },
      createElement: network('create transfer element'),
    },
    indexedDB: { open(name, version) {
      opens.push(name);
      assert.equal(version, 1);
      const isNew = !databases.has(name);
      if (isNew) databases.set(name, new Map());
      const records = databases.get(name);
      const request = { result: { name, createObjectStore(store) { assert.equal(store, 'data'); },
        transaction(store, mode) {
          assert.equal(store, 'data');
          const staged = structuredClone(records);
          const transaction = { objectStore() { return {
            get(key) { const get = {}; queueMicrotask(() => { get.result = structuredClone(records.get(key)); get.onsuccess(); }); return get; },
            put(snapshot, key) { writes.push({ name, key }); staged.set(key, structuredClone(snapshot)); },
            clear() { writes.push({ name, clear: true }); staged.clear(); },
          }; } };
          if (mode === 'readwrite') queueMicrotask(() => {
            if (abortNext) { abortNext = false; transaction.onabort(); return; }
            records.clear(); for (const [key, value] of staged) records.set(key, value);
            transaction.oncomplete();
          });
          return transaction;
        },
      } };
      queueMicrotask(() => { if (isNew) request.onupgradeneeded(); request.onsuccess(); });
      return request;
    } },
    file: { text: network('read backup') },
  });
  vm.runInContext(source, context);
  const run = code => vm.runInContext(code, context);
  run(`let renders = 0, closed = 0, opened = ''; render = () => { renders++; };
    closeOverlay = () => { closed++; }; openOverlay = html => { opened = html; }; showToast = () => {};`);
  return { run, opens, writes, calls, databases, button, abort() { abortNext = true; },
    async fire(type, target) { for (const fn of listeners.get(`${type}:false`) || []) await fn({ target }); },
    async flush() { const pending = [...timers.values()]; timers.clear(); pending.forEach(fn => fn()); await run('saveChain'); },
  };
}

test('demo startup opens only its own DB, seeds once, and preserves edits on reload', async () => {
  const real = new Map([['main', { private: 'real workout sentinel' }]]);
  const databases = new Map([['cumpafit', real]]);
  const a = app({ databases });
  await a.run('init()');
  assert.deepEqual(a.opens, ['cumpafit-demo']);
  assert.equal(a.run('renders'), 1);
  assert.equal(databases.get('cumpafit-demo').get('main').routines.length, 5);
  await a.run('state.routines[0].name = "Visitor edit"; persistNow()');
  const b = app({ databases });
  await b.run('init()');
  assert.equal(b.run('state.routines[0].name'), 'Visitor edit');
  assert.equal(b.writes.length, 0, 'reload must not reseed');
  assert.deepEqual(real.get('main'), { private: 'real workout sentinel' });
  assert.deepEqual(a.calls.concat(b.calls), []);
});

test('normal startup retains the original DB and does not seed sample data', async () => {
  const a = app({ demo: false });
  a.run('startOfflineImages = async () => {}');
  await a.run('init()');
  assert.deepEqual(a.opens, ['cumpafit']);
  assert.equal(a.run('state.routines.length'), 0);
  assert.equal(a.run('Object.keys(state.sessions).length'), 0);
  assert.equal(await a.run('resetDemo()'), false);
});

test('demo query fails closed if the early safety script did not load', async () => {
  const a = app({ demo: false, search: '?demo=1' });
  await assert.rejects(a.run('init()'), /Unexpected DOM access: #view/);
  assert.equal(a.run('DB_NAME'), 'cumpafit-demo');
  assert.deepEqual(a.opens, []);
  assert.deepEqual(a.calls, []);
});

test('seed spans four weeks at month/year boundaries, with valid history, cardio and planned progress', async () => {
  for (const today of ['2026-10-30', '2027-01-01', '2028-03-01']) {
    const a = app({ today }); await a.run('init()');
    assert.equal(a.run('Object.values(state.sessions).filter(s => s.finishedAt).length'), 12);
    assert.equal(a.run('Object.values(state.sessions).every(s => s.selected.every(id => !!getExercise(id)))'), true);
    assert.equal(a.run('Object.values(state.sessions).filter(s => s.finishedAt).every(s => hasSessionActivity(s) && s.date < todayISO())'), true);
    assert.equal(a.run('Object.values(state.sessions).every(s => Object.entries(s.sets).every(([id, sets]) => getExercise(id).group !== "Cardio" || sets.every(set => validCardioSet(getExercise(id), set))))'), true);
    assert.match(a.run('renderToday()'), /aria-valuemax="4" aria-valuenow="2"/);
    assert.doesNotMatch(a.run('lastPerformance("press-pecho-maquina")'), /Sin registros/);
    assert.equal(a.run('recordedUses("press-pecho-maquina").length'), 5);
    assert.match(a.run('weightHistoryContent("press-pecho-maquina").body'), /weight-sparkline[\s\S]*Máximo histórico/);
    assert.equal(a.run('new Set(recordedUses("press-pecho-maquina").map(use => use.maxKg)).size'), 4);
    assert.equal(a.run('recordedUses("push-up").some(use => use.sets.some(set => set.kg === ""))'), true);
  }
});

test('demo makes zero network sync/transfer calls through startup, direct helpers and action handlers', async () => {
  const a = app(); await a.run('init()');
  await a.run('startOfflineImages(); exportBackup(); importBackup(file); resizePhoto(file); openBackup();');
  for (const action of ['export', 'import']) {
    await a.fire('click', { closest: selector => selector === '[data-action]' ? { dataset: { action } } : null });
  }
  await a.fire('click', { closest: selector => selector === '#backup-open' ? {} : null });
  await a.fire('change', { id: 'import-file', value: 'file', files: [{}], matches: () => false });
  assert.deepEqual(a.calls, []);
  assert.equal(a.run('opened'), '');
  assert.doesNotMatch(a.run('renderHistory()'), /backup-open|data-action="(?:export|import)"/);
  a.run('openExerciseForm(STARTER_EXERCISES[0].id)');
  assert.doesNotMatch(a.run('opened'), /type="file"|exercise-photo/);
});

test('reset discards pending edits, clears only demo records, reseeds and persists after reload', async () => {
  const real = new Map([['main', { private: 'untouched' }]]);
  const databases = new Map([['cumpafit', real]]);
  const a = app({ databases }); await a.run('init()');
  databases.get('cumpafit-demo').set('extra-demo-key', 'remove me');
  await a.run('state.routines = []; persistNow()');
  a.run('state.routines.push({name:"Pending old edit"}); persist();');
  const reset = a.run('resetDemo()');
  assert.equal(a.button.disabled, true);
  assert.equal(await reset, true);
  await a.flush();
  assert.equal(a.button.disabled, false);
  assert.equal(databases.get('cumpafit-demo').size, 1);
  assert.equal(databases.get('cumpafit-demo').get('main').routines.length, 5);
  assert.deepEqual(real.get('main'), { private: 'untouched' });
  assert.equal(a.writes.filter(write => write.clear).every(write => write.name === 'cumpafit-demo'), true);
  const b = app({ databases }); await b.run('init()');
  assert.equal(b.run('state.routines.length'), 5);
  assert.equal(b.run('Object.keys(state.sessions).length'), 13);
});

test('failed reset retains saved data and permits retry', async () => {
  const a = app(); await a.run('init()');
  await a.run('state.routines[0].name = "Keep this"; persistNow()');
  a.abort();
  assert.equal(await a.run('resetDemo()'), false);
  assert.equal(a.button.disabled, false);
  assert.equal(a.run('state.routines[0].name'), 'Keep this');
  assert.equal(a.databases.get('cumpafit-demo').get('main').routines[0].name, 'Keep this');
  assert.equal(await a.run('resetDemo()'), true);
});
