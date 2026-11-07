const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function harness(existing) {
  const listeners = {}, button = {}, photo = { files: [] };
  const context = vm.createContext({
    Date, Intl, structuredClone, setTimeout, clearTimeout, setInterval() {}, console,
    document: { addEventListener(type, handler) { (listeners[type] ||= []).push(handler); }, querySelector: () => photo },
    window: { addEventListener() {}, scrollTo() {} },
  });
  vm.runInContext(fs.readFileSync(__dirname + '/../app.js', 'utf8').replace(/\ninit\(\);\s*$/, '\n'), context);
  const run = code => vm.runInContext(code, context);
  run(`state = initialState(); persistNow = async () => {}; render = () => {}; closeOverlay = () => {}; showToast = () => {}; openOverlay = html => globalThis.formHtml = html;`);
  if (existing) run(`state.exercises.push(${JSON.stringify(existing)})`);
  const form = { id: 'exercise-form', dataset: { editId: existing?.id || '' }, querySelector: () => button,
    elements: { name: { value: 'Custom Press' }, group: { value: 'Pecho' }, equipment: { value: 'Panatta' } } };
  return { run, button, photo, save: () => listeners.submit[0]({ target: form, preventDefault() {} }) };
}

test('new exercise accepts no photo and renders safely everywhere with no broken image', async () => {
  const { run, save } = harness();
  run('openExerciseForm()');
  assert.match(run('formHtml'), /Imagen del ejercicio \(opcional\)/);
  assert.doesNotMatch(run('formHtml').match(/<input id="exercise-photo"[^>]*>/)[0], /required/);
  await save();
  assert.equal(run('state.exercises.at(-1).name'), 'Custom Press');
  assert.equal(run('state.exercises.at(-1).image'), undefined);
  assert.equal(run('state.exercises.at(-1).tile'), null);
  for (const cls of ['exercise-image', 'catalog-image', 'routine-thumbnail', 'exercise-image history-summary-image']) {
    const html = run(`imageMarkup(state.exercises.at(-1), ${JSON.stringify(cls)})`);
    assert.match(html, /image-pending/);
    assert.doesNotMatch(html, /<img|src=/);
  }
  assert.doesNotMatch(run('catalogImageButton(state.exercises.at(-1))'), /view-image/);
  run('state = JSON.parse(JSON.stringify(state))');
  assert.equal(run('state.exercises.at(-1).image'), undefined);
});

test('editing without selecting a file preserves an existing photo', async () => {
  const { run, save } = harness({ id: 'custom-photo', name: 'Old', group: 'Pecho', tile: null, image: 'data:image/jpeg;base64,test' });
  await save();
  assert.equal(run('getExercise("custom-photo").image'), 'data:image/jpeg;base64,test');
  assert.equal(run('getExercise("custom-photo").name'), 'Custom Press');
});

test('failed image-free save rolls back and can be retried without duplicates', async () => {
  const { run, save, button } = harness();
  const count = run('state.exercises.length');
  run('persistNow = async () => { throw new Error("QuotaExceededError"); }');
  await save();
  assert.equal(run('state.exercises.length'), count);
  assert.equal(button.disabled, false);
  run('persistNow = async () => {}');
  await save();
  assert.equal(run('state.exercises.length'), count + 1);
});
