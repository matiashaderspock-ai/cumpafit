const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

for (const editing of [false, true]) test(`a failed routine ${editing ? 'edit' : 'creation'} can be retried without losing or duplicating routines`, async () => {
  const button = { disabled: false }, error = {}, toasts = [];
  let reject = true;
  const nodes = { '#routine-name': { value: 'Updated routine' }, '#routine-error': error, '#routine-form [type=submit]': button };
  const context = vm.createContext({
    Date, Intl, structuredClone, setTimeout, clearTimeout, setInterval() {}, console,
    document: { addEventListener() {}, querySelector: selector => nodes[selector] },
    window: { addEventListener() {}, scrollTo() {} },
    save: () => reject ? Promise.reject(new Error('QuotaExceededError')) : Promise.resolve(),
    toast: text => toasts.push(text),
  });
  vm.runInContext(fs.readFileSync(__dirname + '/../app.js', 'utf8').replace(/\ninit\(\);\s*$/, '\n'), context);
  const run = code => vm.runInContext(code, context);
  run(`state = initialState(); persistNow = save; showToast = toast; render = () => {}; closeOverlay = () => {};
    state.routines = [{ id: 'existing', name: 'Original', group: 'Bíceps', exerciseIds: [STARTER_EXERCISES[0].id] }];
    routineDraft = { ${editing ? "id: 'existing'," : ''} group: 'Bíceps', exerciseIds: new Set([STARTER_EXERCISES[0].id]) };
    const before = JSON.stringify(state.routines);`);
  await run('saveRoutine()');
  assert.equal(run('JSON.stringify(state.routines) === before'), true);
  assert.equal(button.disabled, false);
  reject = false;
  await run('saveRoutine()');
  assert.equal(run('state.routines.length'), editing ? 1 : 2);
  assert.equal(run(`state.routines.filter(item => item.name === 'Updated routine').length`), 1);
});
