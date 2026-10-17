const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function app() {
  const listeners = {};
  const ctx = vm.createContext({ Date, Intl, structuredClone, console, setTimeout, clearTimeout, setInterval: () => 0,
    document: { addEventListener(type, fn, capture = false) { if (!capture) listeners[type] = fn; } }, window: { addEventListener() {} } });
  vm.runInContext(fs.readFileSync(require('node:path').join(__dirname, '../app.js'), 'utf8').replace(/\ninit\(\);\s*$/, '\n'), ctx);
  const run = code => vm.runInContext(code, ctx);
  run('state = initialState(); let saved; persist = () => { saved = structuredClone(state); }; render = () => {}; showToast = () => {};');
  return { run, listeners };
}
test('walking/running variants use km/h while other cardio retains distance', () => {
  const { run } = app();
  for (const id of ['caminata-cinta', 'skillmill-walking-running']) {
    assert.equal(run(`usesSpeed(getExercise('${id}'))`), true);
    assert.match(run(`renderSetFields(getExercise('${id}'), newSetFor(getExercise('${id}')), 0)`), /data-set-field="speedKmh".*Velocidad km\/h/);
  }
  for (const name of ['Trote', 'Corrida', 'Carrera al aire libre', 'Jogging', 'Running', 'Walking']) {
    assert.equal(run(`usesSpeed({group:'Cardio', name:${JSON.stringify(name)}})`), true);
  }
  assert.match(run(`renderSetFields(getExercise('remo-ergometro'), {}, 0)`), /data-set-field="distanceKm"/);
});
test('legacy distance is converted for display without modifying the saved record', () => {
  const { run } = app();
  run(`const ex = getExercise('caminata-cinta'); const legacy = {id:'old', minutes:'30', distanceKm:'2,5', done:true};
    state.sessions['2026-10-10'] = { sets:{[ex.id]:[legacy]} };`);
  assert.equal(run('cardioValue(ex, legacy)'), '5');
  assert.equal(run('legacy.distanceKm'), '2,5');
  assert.equal(run('Object.hasOwn(legacy, "speedKmh")'), false);
  assert.match(run('lastUseMarkup(ex.id)'), /5 km\/h/);
  assert.match(run('maximumSummaryMarkup(ex.id)'), /5 km\/h/);
  assert.equal(run('newSetFor(ex, legacy).speedKmh'), '5');
  run('legacy.speedKmh = ""');
  assert.equal(run('cardioValue(ex, legacy)'), '');
});
test('speed input and completion persist, reload and retain backup compatibility', () => {
  const { run, listeners } = app();
  run(`const ex = getExercise('caminata-cinta'); addToSession(ex.id); const set = ensureSession().sets[ex.id][0];`);
  const dataset = { ex:'caminata-cinta', setId:run('set.id') };
  for (const [field, value] of [['minutes', '10'], ['speedKmh', '8,5']]) {
    listeners.input({ target:{ dataset:{...dataset, setField:field}, value } });
  }
  listeners.change({ target:{ dataset, checked:true, matches:s => s === '[data-set-done]' } });
  run('state = JSON.parse(JSON.stringify(saved));');
  assert.equal(run('ensureSession().sets[ex.id][0].speedKmh'), '8,5');
  assert.equal(run('ensureSession().sets[ex.id][0].done'), true);
  assert.equal(run('validCardioSet(ex, { minutes:"10", speedKmh:"-1" })'), false);
  assert.equal(run('validCardioSet(ex, { minutes:"0", speedKmh:"8" })'), false);
  assert.match(run('renderSessionExercise(ex, ensureSession(), 0)'), /Vel\. km\/h/);
});
