const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function app() {
  const listeners = new Map();
  const classes = () => ({ toggle(name, value) { this[name] = value; } });
  const badge = { classList: classes(), setAttribute(name, value) { this[name] = value; } };
  const count = {};
  const checkbox = {};
  const card = { classList: classes(), querySelector(selector) {
    return selector === '.complete-button' ? badge : count;
  } };
  const row = { querySelector: () => checkbox };
  const summary = { replaceWith(value) { this.html = value; } };
  const context = vm.createContext({
    Date, Intl, structuredClone, console, setTimeout, clearTimeout, setInterval: () => 0,
    document: {
      addEventListener(type, fn, capture = false) { listeners.set(`${type}:${capture}`, fn); },
      querySelector: () => summary,
      createElement() { return { set innerHTML(html) { this.content = { querySelector: () => html }; } }; },
    },
    window: { addEventListener() {} },
  });
  const source = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
  vm.runInContext(source.replace(/\ninit\(\);\s*$/, '\n'), context);
  const run = code => vm.runInContext(code, context);
  run(`state = initialState(); let saved; let renders = 0;
    persist = () => { saved = structuredClone(state); };
    render = () => { renders++; }; showToast = () => {};
    const exId = STARTER_EXERCISES[0].id; addToSession(exId);
    const sets = ensureSession().sets[exId];`);
  function target(index = 0) {
    return {
      dataset: { ex: run('exId'), setId: run(`sets[${index}].id`) },
      closest: selector => selector === '.session-card' ? card : row,
      matches: selector => selector === '[data-set-done]',
    };
  }
  return { run, badge, count, checkbox, card, summary,
    input(field, value, index = 0) {
      const input = target(index);
      input.dataset.setField = field; input.value = value;
      listeners.get('input:false')({ target: input });
    },
    check(checked, index = 0) { listeners.get('change:false')({ target: { ...target(index), checked } }); },
  };
}

for (const weight of ['22,5', '22.5']) {
  test(`valid weight ${weight} and reps auto-check and persist the set`, () => {
    const a = app();
    a.input('kg', weight);
    assert.equal(a.run('sets[0].done'), false);
    a.input('reps', '12');
    assert.equal(a.run('sets[0].done && sets[0].autoDone'), true);
    assert.equal(a.run('saved.sessions[activeDate].sets[exId][0].autoDone'), true);
    assert.equal(a.checkbox.checked, true);
    assert.equal(a.count.textContent, '1 de 3 series hechas');
    assert.match(a.summary.html, /aria-valuenow="0"/);
    assert.equal(a.run('renders'), 0, 'typing must not replace the active input');
  });
}

for (const [field, invalid] of [['kg', ''], ['reps', ''], ['kg', '0'], ['kg', '-2'], ['kg', 'Infinity'], ['kg', 'abc'], ['kg', '0x10'], ['reps', '0'], ['reps', '2.5'], ['reps', '2e1']]) {
  test(`clearing or invalidating ${field} (${JSON.stringify(invalid)}) unchecks only an automatic tick`, () => {
    const a = app();
    a.input('kg', '22,5'); a.input('reps', '12');
    a.input(field, invalid);
    assert.equal(a.run('sets[0].done'), false);
    assert.equal(a.run('sets[0].autoDone'), false);
    assert.equal(a.run('saved.sessions[activeDate].sets[exId][0].done'), false);
    assert.equal(a.checkbox.checked, false);
    assert.equal(a.count.textContent, '0 de 3 series hechas');
  });
}

test('all automatic ticks synchronize the exercise badge and clear a stale exercise override', () => {
  const a = app();
  a.run('ensureSession().completed[exId] = false;');
  for (let i = 0; i < 3; i++) { a.input('kg', '25', i); a.input('reps', '10', i); }
  assert.equal(a.badge['aria-pressed'], 'true');
  assert.equal(a.card.classList.done, true);
  assert.equal(a.count.textContent, '3 de 3 series hechas');
  assert.match(a.summary.html, /aria-valuenow="1"/);
  assert.match(a.summary.html, /width:100%/);
  assert.match(a.run('renderSessionExercise(getExercise(exId), ensureSession(), 0)'), /complete-button done/);
  a.input('reps', '', 2);
  assert.equal(a.badge['aria-pressed'], 'false');
  assert.match(a.summary.html, /aria-valuenow="0"/);
  assert.match(a.summary.html, /width:0%/);
  assert.equal(a.run('isExerciseComplete(ensureSession(), exId)'), false);
});

test('manual uncheck overrides auto-check through edits and persistence', () => {
  const a = app();
  a.input('kg', '25'); a.input('reps', '10');
  a.check(false);
  assert.equal(a.run('sets[0].autoDone'), false);
  a.run('state = structuredClone(saved);');
  a.input('reps', '11'); a.input('kg', ''); a.input('kg', '30');
  assert.equal(a.run('ensureSession().sets[exId][0].done'), false);
  assert.equal(a.run('ensureSession().sets[exId][0].manualDone'), true);
  a.check(true);
  a.input('reps', '');
  assert.equal(a.run('ensureSession().sets[exId][0].done'), true);
});

test('manual check remains checked when weight or reps are cleared', () => {
  const a = app();
  a.input('reps', '10'); a.check(true);
  a.input('kg', '25'); a.input('kg', ''); a.input('reps', '');
  assert.equal(a.run('sets[0].done'), true);
  assert.equal(a.run('sets[0].autoDone'), false);
});

test('legacy saved rows without autoDone load and retain manual completion', () => {
  const a = app();
  a.run(`delete sets[0].autoDone; sets[0].done = true; sets[0].reps = '10';
    persist(); state = structuredClone(saved);`);
  assert.doesNotThrow(() => a.run('renderToday()'));
  a.input('reps', '');
  assert.equal(a.run('ensureSession().sets[exId][0].done'), true);
});

test('new exercises start with three distinct empty, unchecked rows', () => {
  const a = app();
  assert.equal(a.run('sets.length'), 3);
  assert.equal(a.run('new Set(sets.map(set => set.id)).size'), 3);
  assert.equal(a.run('sets.every(set => set.kg === "" && set.reps === "" && !set.done && !set.autoDone)'), true);
  assert.equal(a.run('saved.sessions[activeDate].sets[exId].length'), 3);
  a.run('addToSession(exId)');
  assert.equal(a.run('sets.length'), 3);
});

test('re-adding a saved exercise preserves its rows and values', () => {
  const a = app();
  a.run(`sets.splice(1); sets[0].kg = '40'; sets[0].reps = '8';
    removeFromSession(exId); addToSession(exId);`);
  assert.equal(a.run('sets.length'), 1);
  assert.equal(a.run('sets[0].kg'), '40');
});

test('new session repeats the last completed set in three independent unchecked rows', () => {
  const a = app();
  a.run(`activeDate = '2026-10-01'; addToSession(exId);
    const historical = ensureSession().sets[exId];
    Object.assign(historical[0], { kg: '60', reps: '8', done: true });
    Object.assign(historical[1], { kg: '22,5', reps: '12', done: true, autoDone: true, manualDone: true });
    Object.assign(historical[2], { kg: '70', reps: '6', done: false });
    ensureSession().completed[exId] = true;
    const before = JSON.stringify(ensureSession());
    activeDate = '2026-10-02'; addToSession(exId);
    const copied = ensureSession().sets[exId];`);
  assert.equal(a.run('copied.length'), 3);
  assert.equal(a.run('new Set(copied.map(set => set.id)).size'), 3);
  assert.equal(a.run('copied.every(set => set.kg === "22,5" && set.reps === "12" && !set.done && !set.autoDone && !set.manualDone)'), true);
  assert.equal(a.run('copied.every(set => historical.every(old => old.id !== set.id))'), true);
  assert.equal(a.run('isExerciseComplete(ensureSession(), exId)'), false);
  assert.match(a.run('renderSessionExercise(getExercise(exId), ensureSession(), 0)'), /0 de 3 series hechas/);
  assert.doesNotMatch(a.run('renderSessionExercise(getExercise(exId), ensureSession(), 0)'), /type="checkbox" checked/);
  a.run('state = structuredClone(saved); renderToday();');
  assert.equal(a.run('ensureSession().sets[exId].every(set => !set.done && !set.autoDone)'), true);
  a.run('ensureSession().sets[exId][0].kg = "30";');
  assert.equal(a.run('ensureSession().sets[exId][1].kg'), '22,5');
  assert.equal(a.run('JSON.stringify(state.sessions["2026-10-01"]) === before'), true);
});

test('prefill uses the latest earlier completed use of the same exercise', () => {
  const a = app();
  a.run(`for (const [date, kg, done] of [
      ['2026-10-04', '90', true], ['2026-10-01', '20', true],
      ['2026-10-02', '25', true], ['2026-10-03', '30', false]]) {
      activeDate = date; addToSession(exId);
      Object.assign(ensureSession().sets[exId][0], { kg, reps: '10', done });
    }
    const otherId = STARTER_EXERCISES[1].id; addToSession(otherId);
    Object.assign(ensureSession().sets[otherId][0], { kg: '99', reps: '5', done: true });
    activeDate = '2026-10-03'; delete state.sessions[activeDate]; addToSession(exId);`);
  assert.equal(a.run('ensureSession().sets[exId].every(set => set.kg === "25" && set.reps === "10" && !set.done)'), true);
});

for (const kg of ['', '0']) {
  test(`bodyweight history (${JSON.stringify(kg)}) prefills reps without marking done`, () => {
    const a = app();
    a.run(`activeDate = '2026-10-01'; addToSession(exId);
      Object.assign(ensureSession().sets[exId][0], { kg: ${JSON.stringify(kg)}, reps: '15', done: true });
      activeDate = '2026-10-02'; addToSession(exId);`);
    assert.equal(a.run(`ensureSession().sets[exId].every(set => set.kg === ${JSON.stringify(kg)} && set.reps === '15' && !set.done)`), true);
  });
}

test('uncompleted history does not prefill a new exercise', () => {
  const a = app();
  a.run(`activeDate = '2026-10-01'; addToSession(exId);
    Object.assign(ensureSession().sets[exId][0], { kg: '40', reps: '8', done: false });
    activeDate = '2026-10-02'; addToSession(exId);`);
  assert.equal(a.run('ensureSession().sets[exId].every(set => set.kg === "" && set.reps === "" && !set.done)'), true);
});

test('adding a routine prefills new exercises and preserves existing session rows', async () => {
  const a = app();
  a.run(`activeDate = '2026-10-01'; addToSession(exId);
    Object.assign(ensureSession().sets[exId][0], { kg: '40', reps: '8', done: true });
    activeDate = '2026-10-02';
    const otherId = STARTER_EXERCISES[1].id; addToSession(otherId);
    Object.assign(ensureSession().sets[otherId][0], { kg: '15', reps: '10', done: true });
    state.routines.push({ id: 'prefill-routine', name: 'Example', exerciseIds: [exId, otherId] });
    persistNow = async () => { persist(); };`);
  await a.run('addRoutineToSession("prefill-routine")');
  assert.equal(a.run('ensureSession().sets[exId].every(set => set.kg === "40" && set.reps === "8" && !set.done)'), true);
  assert.equal(a.run('ensureSession().sets[otherId][0].done'), true);
  assert.equal(a.run('ensureSession().selected.length'), 2);
});

test('cardio gets three empty rows and keeps manual completion behavior', () => {
  const a = app();
  a.run(`const cardioId = STARTER_EXERCISES.find(ex => ex.group === 'Cardio').id;
    addToSession(cardioId);`);
  assert.equal(a.run('ensureSession().sets[cardioId].length'), 3);
  // Strength-only auto completion must not interpret cardio fields as weight/reps.
  assert.equal(a.run('ensureSession().sets[cardioId].every(set => !set.done && set.minutes === "" && set.speedKmh === "")'), true);
});
