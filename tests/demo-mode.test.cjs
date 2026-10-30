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
    assert.doesNotMatch(a.run('lastPerformance("press-pecho-maquina")'), /No previous records/);
    assert.equal(a.run('recordedUses("press-pecho-maquina").length'), 5);
    assert.match(a.run('weightHistoryContent("press-pecho-maquina").body'), /weight-sparkline[\s\S]*Personal best/);
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

test('demo seeds English names and equipment while retaining canonical IDs and group keys', async () => {
  const a = app(); await a.run('init()');
  assert.deepEqual(Array.from(a.run('state.routines.map(routine => routine.name)')), [
    'Monday · Chest', 'Wednesday · Back', 'Friday · Legs',
    'Monday and Friday · Cardio', 'Wednesday · Abs',
  ]);
  assert.equal(a.run('state.exercises.every(ex => ex.name === STARTER_EXERCISES.find(starter => starter.id === ex.id).name)'), true);
  assert.equal(a.run('state.exercises.every(ex => ex.nameEs === ex.name)'), true);
  assert.equal(a.run('state.exercises.every(ex => GROUPS.includes(ex.group))'), true);
  assert.equal(a.run('getExercise("press-pecho-maquina").equipment'), 'Chest press machine');
  assert.doesNotMatch(a.run('state.exercises.map(ex => ex.equipment).join(" ")'), /Banco|Máquina|Polea|Mancuerna|Peso corporal|Colchoneta|Barra/);
  assert.equal(a.run('STARTER_EXERCISES.find(ex => ex.id === "press-pecho-maquina").equipment'), 'Máquina de press de pecho');
});

test('demo renders all tabs, history, accessible labels and dialogs in English', async () => {
  const a = app(); await a.run('init()');
  for (const [expression, expected] of [
    ['renderToday()', /Exercises in this session[\s\S]*Chest[\s\S]*sets completed[\s\S]*October 30, 2026/],
    ['renderCatalog()', /Search exercises or equipment[\s\S]*>Biceps<[\s\S]*Chest press machine/],
    ['renderRoutinesPage()', /My routines[\s\S]*Monday · Chest[\s\S]*available exercises/],
    ['renderHistory()', /History[\s\S]*October 2026[\s\S]*>Mon<[\s\S]*With activity/],
    ['renderHistorySummary(todayISO())', /Workout summary[\s\S]*Chest[\s\S]*Done/],
    ['renderHistorySummary(Object.keys(state.sessions).find(date => state.sessions[date].finishedAt))', /Workout summary[\s\S]*Session finished/],
    ['sessionPerformanceMarkup("press-pecho-maquina")', /Previous records/],
    ['renderSetFields(getExercise("caminata-cinta"), {minutes:"20", speedKmh:"5.5"}, 0)', /Minutes set 1 of Treadmill Walking/],
  ]) {
    const html = a.run(expression);
    assert.match(html, expected, expression);
    // Storage-facing attributes intentionally retain canonical Spanish group keys.
    const display = html.replace(/\b(?:value|data-filter)="[^"]*"/g, '');
    assert.doesNotMatch(display, /Bíceps|Pecho|Espalda|Ejercicios|Rutinas|Historial|Máquina|Anterior|Registros|Guardar|sesión/);
  }
  a.run('openExerciseForm("press-pecho-maquina")');
  assert.match(a.run('opened'), /Edit exercise[\s\S]*English name[\s\S]*>Chest<[\s\S]*Chest press machine[\s\S]*Save exercise/);
  a.run('openDeleteSession(todayISO())');
  assert.match(a.run('opened'), /Delete record[\s\S]*restore the sample data with Reset demo[\s\S]*Cancel/);
  a.run('openImagePreview("press-pecho-maquina")');
  assert.match(a.run('opened'), /Close illustration[\s\S]*Full illustration of Machine Chest Press/);
  assert.equal(a.run('formatMeasure("5.5")'), '5.5');
  assert.match(a.run('lastPerformance("push-up")'), /bodyweight/);
});

test('old demo samples display English without reseeding or overwriting visitor edits', async () => {
  const a = app(); await a.run('init()');
  await a.run(`state.routines[0].name = 'Lunes · Pecho';
    state.routines[1].name = 'My edited routine';
    getExercise('press-pecho-maquina').equipment = 'Máquina de press de pecho';
    getExercise('push-up').equipment = 'My edited equipment'; persistNow()`);
  const b = app({ databases: a.databases }); await b.run('init()');
  assert.equal(b.writes.length, 0);
  assert.match(b.run('renderRoutinesPage()'), /Monday · Chest[\s\S]*My edited routine/);
  assert.match(b.run('renderCatalogCards()'), /Chest press machine[\s\S]*My edited equipment/);
  assert.equal(b.run('state.routines[0].name'), 'Lunes · Pecho');
  assert.equal(b.run('getExercise("press-pecho-maquina").equipment'), 'Máquina de press de pecho');
  assert.equal(b.run('exerciseMatches(getExercise("press-pecho-maquina"), "chest")'), true);
  assert.equal(b.run('exerciseMatches(getExercise("curl-inclinado"), "biceps")'), true);
  assert.equal(b.run('demoLabel("__proto__")'), '__proto__', 'custom text must not resolve inherited properties');
});

test('normal visits retain Spanish UI, original equipment, date formatting and search', async () => {
  const a = app({ demo: false });
  a.run('startOfflineImages = async () => {}'); await a.run('init()');
  assert.match(a.run('renderToday()'), /Ejercicios de esta sesión[\s\S]*30 de octubre de 2026/);
  assert.match(a.run('renderCatalog()'), /Buscar ejercicio o equipo[\s\S]*>Bíceps<[\s\S]*Máquina de press de pecho/);
  assert.match(a.run('renderHistory()'), /Historial[\s\S]*octubre de 2026[\s\S]*>Lun</);
  assert.equal(a.run('getExercise("press-pecho-maquina").equipment'), 'Máquina de press de pecho');
  assert.equal(a.run('exerciseMatches(getExercise("press-pecho-maquina"), "máquina")'), true);
  assert.equal(a.run('exerciseMatches(getExercise("press-pecho-maquina"), "press de pecho")'), true);
  assert.equal(a.run('demoLabel("Pecho")'), 'Pecho');
  assert.deepEqual(a.opens, ['cumpafit']);
});

test('early bootstrap localizes only demo document metadata and navigation; banner is English only', () => {
  const safety = fs.readFileSync(path.join(__dirname, '../demo-mode.js'), 'utf8');
  const index = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const banner = index.match(/<aside id="demo-banner"[\s\S]*?<\/aside>/)[0];
  assert.match(banner, /Demo: sample data, nothing is saved to anyone's account/);
  assert.match(banner, /Reset demo/);
  assert.doesNotMatch(banner, /lang="es"|Modo|datos|Reiniciar/);
  for (const [search, demo] of [['?demo=1', true], ['', false], ['?demo=0', false]]) {
    const elements = new Map(); let ready;
    const element = selector => {
      if (!elements.has(selector)) elements.set(selector, { content: '', textContent: '', attributes: {},
        setAttribute(name, value) { this.attributes[name] = value; }, remove() { this.removed = true; },
        getBoundingClientRect() { return { height: 64 }; },
      });
      return elements.get(selector);
    };
    const document = { title: 'Cumpafit · Rutinas',
      documentElement: { lang: 'es', classList: { add() {} }, style: { setProperty() {} } },
      querySelector: element, head: { append() {} }, createElement: () => ({}),
      addEventListener(type, listener) { assert.equal(type, 'DOMContentLoaded'); ready = listener; },
    };
    const window = { location: { search } };
    vm.runInNewContext(safety, { window, document, URLSearchParams, ResizeObserver: class { observe() {} } });
    ready?.();
    assert.equal(window.CUMPAFIT_DEMO, demo);
    assert.equal(document.documentElement.lang, demo ? 'en' : 'es');
    assert.equal(document.title, demo ? 'DEMO · Cumpafit · Routines' : 'Cumpafit · Rutinas');
    if (demo) {
      assert.equal(element('[data-tab="today"] span').textContent, 'Session');
      assert.equal(element('[data-tab="catalog"] span').textContent, 'Exercises');
      assert.equal(element('[data-tab="routines"] span').textContent, 'Routines');
      assert.equal(element('[data-tab="history"] span').textContent, 'History');
      assert.equal(element('.bottom-nav').attributes['aria-label'], 'Main navigation');
    } else assert.equal(elements.size, 0, 'normal bootstrap must leave DOM untouched');
  }
});
