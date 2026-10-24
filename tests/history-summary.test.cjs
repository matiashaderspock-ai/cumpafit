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
      const key = `${type}:${capture}`;
      listeners.set(key, [...(listeners.get(key) || []), fn]);
    } },
    window: { addEventListener() {}, scrollTo() {} },
  });
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8').replace(/\ninit\(\);\s*$/, '\n'), context);
  const run = code => vm.runInContext(code, context);
  run(`state = initialState(); let saved, opened = '', renders = 0, closes = 0;
    persist = () => { saved = structuredClone(state); };
    persistNow = async () => { persist(); };
    openOverlay = html => { opened = html; };
    closeOverlay = () => { closes++; };
    render = () => { renders++; }; showToast = () => {}; refreshSetProgress = () => {};
    const id = STARTER_EXERCISES[0].id;`);
  async function fire(type, target) {
    for (const fn of listeners.get(`${type}:false`) || []) await fn({ target });
  }
  return { run, fire, async click(action, date) {
    const button = { dataset: { action, date }, disabled: false };
    await fire('click', { closest: selector => selector === '[data-action]' ? button : null });
    return button;
  } };
}

test('opening a calendar date shows a read-only summary without changing the active session', async () => {
  const a = app();
  a.run(`const old = ensureSession('2026-10-05'); old.selected = [id];
    old.sets[id] = [{ id: 'recorded', kg: '20', reps: '10', done: true }];
    tab = 'history'; const before = JSON.stringify(state); const active = activeDate;`);
  await a.click('open-date', '2026-10-05');
  assert.equal(a.run('activeDate === active && tab === "history"'), true);
  assert.equal(a.run('JSON.stringify(state) === before'), true);
  assert.match(a.run('opened'), /Resumen del entrenamiento/);
  assert.match(a.run('opened'), /20 kg × 10 reps/);
  assert.match(a.run('opened'), /Eliminar registro/);
  assert.doesNotMatch(a.run('opened'), /<input|class="session-card/);
});

test('untouched copied values stay out of activity and summaries after a save/reload', () => {
  const a = app();
  a.run(`activeDate = '2026-10-01'; addToSession(id);
    Object.assign(ensureSession().sets[id][0], { kg: '20', reps: '10', done: true });
    activeDate = '2026-10-10'; addToSession(id); state = structuredClone(saved);`);
  assert.equal(a.run('hasSessionActivity(ensureSession())'), false);
  assert.equal(a.run('sessionSummaryData(activeDate).exercises.length'), 0);
  assert.match(a.run('renderHistorySummary(activeDate)'), /Sin actividad registrada/);
  assert.equal(a.run('ensureSession().sets[id].every(set => set.kg === "20" && set.reps === "10" && !set.done)'), true);
});

test('editing or checking a copied row makes it recorded activity', async () => {
  for (const method of ['input', 'change']) {
    const a = app();
    a.run(`addToSession(id); ensureSession().sets[id] = [newSetFor(getExercise(id), { kg: '20', reps: '10' })];`);
    const target = {
      dataset: { ex: a.run('id'), setId: a.run('ensureSession().sets[id][0].id'), setField: 'kg' },
      value: '22,5', checked: true,
      matches: selector => selector === '[data-set-done]',
    };
    await a.fire(method, target);
    assert.equal(a.run('hasSessionActivity(ensureSession())'), true);
    assert.equal(a.run('ensureSession().sets[id][0].prefilled'), undefined);
    assert.equal(a.run('sessionSummaryData(activeDate).completedSets'), 1);
    assert.equal(a.run('saved.sessions[activeDate].sets[id][0].done'), true);
  }
});

test('summary preserves partial legacy entries but omits untouched planned exercises', () => {
  const a = app();
  a.run(`addToSession(id); const otherId = STARTER_EXERCISES[1].id; addToSession(otherId);
    Object.assign(ensureSession().sets[id][0], { kg: '15', reps: '8', done: false });`);
  assert.equal(a.run('sessionSummaryData(activeDate).exercises.length'), 1);
  assert.equal(a.run('sessionSummaryData(activeDate).completedSets'), 0);
  assert.match(a.run('renderHistorySummary(activeDate)'), /15 kg × 8 reps/);
  assert.match(a.run('renderHistorySummary(activeDate)'), /Sin marcar/);
});

test('calendar distinguishes opened-only dates and allows reviewing them for deletion', async () => {
  const a = app();
  a.run(`ensureSession('2026-10-05'); historyMonth = '2026-10'; tab = 'history';`);
  const calendar = a.run('renderHistory()');
  const day = calendar.match(/<button[^>]*data-date="2026-10-05"[^>]*>/)[0];
  assert.match(day, /has-draft/);
  assert.doesNotMatch(day, /disabled/);
  assert.match(day, /sin actividad, revisar o eliminar registro/);
  assert.match(calendar, /0 días este mes/);
  await a.click('open-date', '2026-10-05');
  assert.match(a.run('opened'), /Sin actividad registrada/);
  await a.click('delete-session', '2026-10-05');
  assert.match(a.run('opened'), /confirm-delete-session/);
  assert.equal(a.run('Object.hasOwn(state.sessions, "2026-10-05")'), true, 'showing confirmation must not delete');
});

test('confirmed deletion removes only the requested date and persists without recreating it', async () => {
  for (const hasActivity of [false, true]) {
    const a = app();
    a.run(`addToSession(id); ensureSession('2026-10-05');
      ${hasActivity ? `state.sessions['2026-10-05'].sets[id] = [{id:'old',kg:'25',reps:'8',done:true}];` : ''}
      const active = activeDate; const current = JSON.stringify(state.sessions[active]);
      const catalog = JSON.stringify(state.exercises); const routines = JSON.stringify(state.routines); tab = 'history';`);
    await a.click('confirm-delete-session', '2026-10-05');
    assert.equal(a.run('Object.hasOwn(state.sessions, "2026-10-05")'), false);
    assert.equal(a.run('Object.hasOwn(saved.sessions, "2026-10-05")'), false);
    assert.equal(a.run('activeDate === active && JSON.stringify(state.sessions[active]) === current'), true);
    assert.equal(a.run('JSON.stringify(state.exercises) === catalog && JSON.stringify(state.routines) === routines'), true);
    assert.equal(a.run('tab'), 'history');
    a.run('state = structuredClone(saved); renderHistory();');
    assert.equal(a.run('Object.hasOwn(state.sessions, "2026-10-05")'), false);
  }
});

test('failed deletion restores the exact record and enables retry', async () => {
  const a = app();
  a.run(`const old = ensureSession('2026-10-05'); old.sets[id] = [{ id:'old', kg:'25', reps:'8', done:true }];
    const before = JSON.stringify(state); persistNow = async () => { throw Error('Simulated storage failure'); };`);
  const button = await a.click('confirm-delete-session', '2026-10-05');
  assert.equal(a.run('JSON.stringify(state) === before'), true);
  assert.equal(button.disabled, false);
  assert.equal(a.run('closes'), 0);
});

test('summary retains archived exercises, bodyweight, legacy cardio units and manual-only completion', () => {
  const a = app();
  a.run(`getExercise(id).archived = true; const session = ensureSession('2026-10-05');
    session.sets[id] = [{ id:'bodyweight',kg:'',reps:'12',done:true }];
    const cardioId = STARTER_EXERCISES.find(ex => ex.group === 'Cardio').id;
    session.sets[cardioId] = [{ id:'cardio',minutes:'30',distanceKm:'3',done:true }];
    session.completed[STARTER_EXERCISES[1].id] = true;`);
  const summary = a.run('renderHistorySummary("2026-10-05")');
  assert.match(summary, /Peso corporal × 12 reps/);
  assert.match(summary, /30 min · 6 km\/h/);
  assert.match(summary, /Marcado como realizado, sin series detalladas/);
  assert.equal(a.run('sessionSummaryData("2026-10-05").exercises.length'), 3);
  assert.equal(a.run('sessionSummaryData("2026-10-05").completedSets'), 2);
});
