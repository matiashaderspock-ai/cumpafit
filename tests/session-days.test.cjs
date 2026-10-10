const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function app() {
  let now = '2026-10-10T12:00:00';
  const listeners = new Map();
  const listen = (surface, type, handler, capture = false) => {
    listeners.set(`${surface}:${type}:${capture}`, handler);
  };
  class Clock extends Date {
    constructor(...args) { super(...(args.length ? args : [now])); }
    static now() { return new Date(now).getTime(); }
  }
  const context = vm.createContext({
    Date: Clock, Intl, structuredClone, console,
    setTimeout, clearTimeout, setInterval: () => 0,
    document: { addEventListener: (...args) => listen('document', ...args), visibilityState: 'visible' },
    window: { addEventListener: (...args) => listen('window', ...args) },
  });
  const source = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
  vm.runInContext(source.replace(/\ninit\(\);\s*$/, '\n'), context);
  const run = code => vm.runInContext(code, context);
  run(`state = initialState(); let renders = 0; let closed = 0;
    persist = () => {}; render = () => { renders++; }; closeOverlay = () => { closed++; };`);
  return { run, day: value => { now = value; },
    fire: (surface, type, event = {}, capture = false) => listeners.get(`${surface}:${type}:${capture}`)(event) };
}

test('first session starts empty', () => {
  const { run } = app();
  assert.equal(run('ensureSession().selected.length'), 0);
  assert.equal(run('Object.keys(ensureSession().sets).length'), 0);
});

for (const finished of [false, true]) {
  test(`new date stays empty after an ${finished ? 'ended' : 'unfinished'} session`, () => {
    const { run } = app();
    run(`addToSession(STARTER_EXERCISES[0].id);
      ensureSession().sets[STARTER_EXERCISES[0].id][0].reps = '12';
      ${finished ? "ensureSession().finishedAt = '2026-10-10T18:00:00Z';" : ''}
      const previous = JSON.stringify(state.sessions['2026-10-10']);`);
    assert.equal(run("ensureSession('2026-10-11').selected.length"), 0);
    assert.equal(run("JSON.stringify(state.sessions['2026-10-10']) === previous"), true);
  });
}

test('same-day reopening keeps selected exercises and entered sets', () => {
  const { run } = app();
  run("addToSession(STARTER_EXERCISES[0].id); ensureSession().sets[STARTER_EXERCISES[0].id][0].kg = '25';");
  assert.equal(run('ensureSession().selected.length'), 1);
  assert.equal(run('ensureSession().sets[STARTER_EXERCISES[0].id][0].kg'), '25');
  assert.equal(run('syncSessionDay()'), false);
  assert.equal(run('renders'), 0);
});

for (const [surface, event] of [['document', 'visibilitychange'], ['window', 'pageshow'], ['window', 'focus']]) {
  test(`${event} advances the active session to the device's new day`, () => {
    const a = app();
    a.run('addToSession(STARTER_EXERCISES[0].id);');
    a.day('2026-10-11T00:00:01');
    a.fire(surface, event);
    assert.equal(a.run('activeDate'), '2026-10-11');
    assert.equal(a.run('ensureSession().selected.length'), 0);
    assert.equal(a.run("state.sessions['2026-10-10'].selected.length"), 1);
    assert.equal(a.run('closed'), 1);
  });
}

test('historical session explicitly opened remains available across midnight', () => {
  const a = app();
  a.run("activeDate = '2026-10-09'; addToSession(STARTER_EXERCISES[0].id);");
  a.day('2026-10-11T00:00:01');
  a.run('syncSessionDay()');
  assert.equal(a.run('activeDate'), '2026-10-09');
  assert.equal(a.run('ensureSession().selected.length'), 1);
});

test('uses local midnight, not UTC midnight', () => {
  const a = app();
  a.day('2026-10-10T23:59:59');
  assert.equal(a.run('syncSessionDay()'), false);
  a.day('2026-10-11T00:00:00');
  assert.equal(a.run('syncSessionDay()'), true);
});

test('first interaction after midnight cannot change a stale session', () => {
  const a = app();
  a.run('addToSession(STARTER_EXERCISES[0].id);');
  a.day('2026-10-11T00:00:01');
  let prevented = false, stopped = false;
  a.fire('document', 'input', {
    preventDefault: () => { prevented = true; },
    stopImmediatePropagation: () => { stopped = true; },
  }, true);
  assert.ok(prevented && stopped);
  assert.equal(a.run('activeDate'), '2026-10-11');
  assert.equal(a.run('ensureSession().selected.length'), 0);
});

test('existing session on the next date is preserved', () => {
  const a = app();
  a.run("activeDate = '2026-10-11'; addToSession(STARTER_EXERCISES[1].id); activeDate = observedToday;");
  a.day('2026-10-11T00:00:01');
  a.run('syncSessionDay()');
  assert.equal(a.run('ensureSession().selected[0] === STARTER_EXERCISES[1].id'), true);
});
