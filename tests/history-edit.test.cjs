const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function app() {
  const listeners = new Map();
  class Clock extends Date {
    constructor(...args) { super(...(args.length ? args : ['2026-10-10T12:00:00'])); }
  }
  const context = vm.createContext({
    Date: Clock, Intl, structuredClone, console, setTimeout, clearTimeout, setInterval: () => 0,
    document: { addEventListener(type, fn, capture = false) {
      const key = type + ':' + capture;
      listeners.set(key, [...(listeners.get(key) || []), fn]);
    } },
    window: { addEventListener() {}, scrollTo() {} },
  });
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8').replace(/\ninit\(\);\s*$/, '\n'), context);
  const run = code => vm.runInContext(code, context);
  run("state = initialState(); let saved, opened = '', renders = 0, closes = 0, latestUndo; persist = () => { saved = structuredClone(state); }; persistNow = async () => { persist(); }; openOverlay = html => { opened = html; }; closeOverlay = () => { closes++; }; render = () => { renders++; }; showToast = (_, undo) => { latestUndo = undo; }; refreshSetProgress = () => {}; const id = STARTER_EXERCISES[0].id; const otherId = STARTER_EXERCISES[1].id;");
  async function fire(type, target) {
    for (const fn of listeners.get(type + ':false') || []) await fn({ target });
  }
  return {
    run, fire,
    async click(action, date, exerciseId, setId) {
      const button = { dataset: { action, date, id: exerciseId, setId }, disabled: false };
      await fire('click', { closest: selector => selector === '[data-action]' ? button : null });
      return button;
    },
  };
}

test('history summary offers edit action; editor initially preserves the record', async () => {
  const a = app();
  a.run("const old = ensureSession('2026-10-05'); old.selected = [id]; old.sets[id] = [{ id: 'recorded', kg: '20', reps: '10', done: true }]; old.finishedAt = '2026-10-05T19:00:00Z'; tab = 'history'; const before = JSON.stringify(state);");
  await a.click('open-date', '2026-10-05');
  assert.match(a.run('opened'), /data-action="edit-session" data-date="2026-10-05"/);
  assert.doesNotMatch(a.run('opened'), /<input|class="session-card/);
  await a.click('edit-session', '2026-10-05');
  assert.equal(a.run('activeDate'), '2026-10-05');
  assert.equal(a.run('tab'), 'today');
  assert.equal(a.run('closes'), 1);
  assert.equal(a.run('JSON.stringify(state) === before'), true);
  assert.match(a.run('renderToday()'), /Editando sesión anterior/);
  assert.match(a.run('renderToday()'), /data-action="go-history"/);
  assert.match(a.run('renderToday()'), /data-action="go-today"/);
  assert.match(a.run('renderToday()'), /data-set-id="recorded"/);
});

test('changes save to historical date without changing the current workout or finish status', async () => {
  const a = app();
  a.run("addToSession(id); const today = JSON.stringify(state.sessions[activeDate]); const old = ensureSession('2026-10-05'); old.selected = [id]; old.sets[id] = [{ id: 'recorded', kg: '20', reps: '10', done: true }]; old.finishedAt = '2026-10-05T19:00:00Z';");
  await a.click('edit-session', '2026-10-05');
  await a.fire('input', { dataset: { setField: 'kg', ex: a.run('id'), setId: 'recorded' }, value: '27.5' });
  assert.equal(a.run("state.sessions['2026-10-05'].sets[id][0].kg"), '27.5');
  assert.equal(a.run("saved.sessions['2026-10-05'].sets[id][0].kg"), '27.5');
  assert.equal(a.run("saved.sessions['2026-10-05'].finishedAt"), '2026-10-05T19:00:00Z');
  assert.equal(a.run("JSON.stringify(state.sessions['2026-10-10']) === today"), true);
  await a.click('add-set', undefined, a.run('id'));
  assert.equal(a.run("saved.sessions['2026-10-05'].sets[id].length"), 2);
  await a.click('catalog-toggle', undefined, a.run('otherId'));
  assert.equal(a.run("saved.sessions['2026-10-05'].selected.includes(otherId)"), true);
  await a.click('go-history');
  assert.equal(a.run('tab'), 'history');
  assert.equal(a.run('historyMonth'), '2026-10');
  await a.click('edit-session', '2026-10-05');
  await a.click('go-today');
  assert.equal(a.run('activeDate'), '2026-10-10');
  assert.equal(a.run('tab'), 'today');
  assert.equal(a.run("JSON.stringify(state.sessions['2026-10-10']) === today"), true);
  a.run('state = structuredClone(saved);');
  assert.equal(a.run("state.sessions['2026-10-05'].sets[id][0].kg"), '27.5');
});

test('removing a historical exercise removes its records; undo restores everything', async () => {
  const a = app();
  a.run("const old = ensureSession('2026-10-05'); old.selected = [id, otherId]; old.sets[id] = [{ id: 'recorded', kg: '30', reps: '8', done: true, dropSet: true }]; old.completed[id] = true; old.sets[otherId] = [{ id: 'other', kg: '10', reps: '12', done: true }];");
  await a.click('edit-session', '2026-10-05');
  await a.click('remove-exercise', undefined, a.run('id'));
  assert.equal(a.run("saved.sessions['2026-10-05'].selected.includes(id)"), false);
  assert.equal(a.run("Object.hasOwn(saved.sessions['2026-10-05'].sets, id)"), false);
  assert.equal(a.run("Object.hasOwn(saved.sessions['2026-10-05'].completed, id)"), false);
  assert.equal(a.run("saved.sessions['2026-10-05'].sets[otherId][0].kg"), '10');
  assert.equal(a.run("sessionSummaryData('2026-10-05').exercises.length"), 1);
  a.run('latestUndo()');
  assert.equal(a.run("saved.sessions['2026-10-05'].selected[0]"), a.run('id'));
  assert.equal(a.run("saved.sessions['2026-10-05'].sets[id][0].dropSet"), true);
  assert.equal(a.run("saved.sessions['2026-10-05'].completed[id]"), true);
});

test('a nonexistent date never opens the editor or changes the active session', async () => {
  const a = app();
  a.run('const before = JSON.stringify(state);');
  await a.click('edit-session', '2026-10-04');
  assert.equal(a.run('JSON.stringify(state) === before'), true);
  assert.equal(a.run('activeDate'), '2026-10-10');
  assert.equal(a.run('closes'), 0);
});
