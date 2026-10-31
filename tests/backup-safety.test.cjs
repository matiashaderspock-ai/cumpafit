const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function app() {
  const writes = [], messages = [];
  let confirmations = 0, fail = false;
  const context = vm.createContext({
    Date, Intl, structuredClone, setTimeout, clearTimeout, setInterval() {},
    console: { error() {} }, document: { addEventListener() {} },
    window: { addEventListener() {}, scrollTo() {} },
    confirm() { confirmations++; return true; },
    recordToast(message) { messages.push(message); },
    store(snapshot) {
      if (fail) return Promise.reject(new Error('QuotaExceededError'));
      writes.push(structuredClone(snapshot));
      return Promise.resolve();
    },
  });
  vm.runInContext(fs.readFileSync(__dirname + '/../app.js', 'utf8').replace(/\ninit\(\);\s*$/, '\n'), context);
  const run = code => vm.runInContext(code, context);
  run('state = initialState(); writeState = store; showToast = recordToast; render = () => {}; closeOverlay = () => {};');
  return { run, writes, messages, fail() { fail = true; }, get confirmations() { return confirmations; },
    context,
    async import(backup) { context.file = { text: async () => JSON.stringify(backup) }; await run('importBackup(file)'); },
  };
}

function backup() {
  return { version: 1, exercises: [{ id: 'custom', name: 'Custom exercise', group: 'Pecho', equipment: 'Bench' }],
    sessions: { '2026-10-10': { date: '2026-10-10', selected: ['custom'], completed: {},
      sets: { custom: [{ id: 'set', kg: '25,5', reps: '10', done: true }] } } } };
}

for (const [label, change] of [
  ['array of sessions', b => { b.sessions = []; }],
  ['impossible date', b => { b.sessions['2026-02-30'] = b.sessions['2026-10-10']; }],
  ['null exercise', b => { b.exercises.push(null); }],
  ['duplicate exercise ID', b => { b.exercises.push({ ...b.exercises[0] }); }],
  ['invalid muscle', b => { b.exercises[0].group = {}; }],
  ['non-array sets', b => { b.sessions['2026-10-10'].sets.custom = {}; }],
  ['duplicate set ID', b => { b.sessions['2026-10-10'].sets.custom.push({ id: 'set' }); }],
  ['non-boolean completion', b => { b.sessions['2026-10-10'].completed.custom = 'false'; }],
  ['object measurement', b => { b.sessions['2026-10-10'].sets.custom[0].kg = {}; }],
  ['prototype key', b => { b.exercises[0].id = '__proto__'; }],
]) test(`rejects ${label} before confirmation or writes`, async () => {
  const a = app(), b = backup(), before = a.run('JSON.stringify(state)'); change(b);
  await a.import(b);
  assert.equal(a.run('JSON.stringify(state)'), before);
  assert.equal(a.confirmations, 0);
  assert.equal(a.writes.length, 0);
  assert.deepEqual(a.messages, ['El archivo no es un respaldo válido']);
});

test('storage failure leaves the active workout intact and reports a save failure', async () => {
  const a = app(), before = a.run('JSON.stringify(state)'); a.fail();
  await a.import(backup());
  assert.equal(a.run('JSON.stringify(state)'), before);
  assert.match(a.messages.at(-1), /No se pudo guardar/);
});

test('replacement failure after saving the current workout keeps that workout active and stored', async () => {
  const a = app(), before = a.run('JSON.stringify(state)');
  a.run(`let attempts = 0; writeState = snapshot => ++attempts === 1 ? store(snapshot) : Promise.reject(new Error('AbortError'));`);
  await a.import(backup());
  assert.equal(a.run('JSON.stringify(state)'), before);
  assert.equal(JSON.stringify(a.writes.at(-1)), before);
});

test('a second import cannot overtake an in-flight file read', async () => {
  const a = app();
  let release;
  a.context.slowFile = { text: () => new Promise(resolve => { release = resolve; }) };
  const first = a.run('importBackup(slowFile)');
  await a.import(backup());
  assert.equal(a.confirmations, 0);
  release(JSON.stringify(backup()));
  await first;
  assert.equal(a.confirmations, 1);
  assert.equal(a.messages.at(-1), 'Respaldo importado');
});

test('version-1 drafts, numeric metrics, orphan history and optional routines remain importable', async () => {
  const a = app(), b = backup();
  b.sessions['2026-10-10'].sets.custom[0].kg = 0;
  b.sessions['2026-10-10'].sets.custom[0].reps = '';
  b.sessions['2026-10-10'].sets.missing = [{ id: 'orphan', minutes: '15', distanceKm: '', done: false }];
  await a.import(b);
  assert.equal(a.messages.at(-1), 'Respaldo importado');
  assert.deepEqual(a.writes.at(-1).sessions, b.sessions);
});

test('imported exercise and set IDs cannot break out of session input attributes', () => {
  const a = app();
  const html = a.run(`renderSetFields({id: 'x" onfocus="alert(1)', name:'Safe', group:'Pecho'}, {id:'s" autofocus onfocus="alert(1)',kg:'',reps:''}, 0)`);
  assert.ok(html.includes('data-ex="x&quot; onfocus=&quot;alert(1)"'));
  assert.ok(html.includes('data-set-id="s&quot; autofocus onfocus=&quot;alert(1)"'));
});
