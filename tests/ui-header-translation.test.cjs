const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function app() {
  const listeners = new Map();
  const context = vm.createContext({ Date, Intl, structuredClone, console, setTimeout, clearTimeout, setInterval: () => 0,
    document: { addEventListener(type, fn, capture = false) { const key = `${type}:${capture}`; listeners.set(key, [...(listeners.get(key) || []), fn]); },
      querySelector(selector) { return selector === '#exercise-photo' ? { files: [] } : null; } },
    window: { addEventListener() {}, scrollTo() {} },
  });
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8').replace(/\ninit\(\);\s*$/, '\n'), context);
  const run = code => vm.runInContext(code, context);
  run(`state = initialState(); persist = () => {}; render = () => {}; closeOverlay = () => {}; showToast = () => {};
    let opened = ''; openOverlay = html => { opened = html; }; const id = STARTER_EXERCISES[0].id;`);
  return { run, async fire(type, event) { for (const fn of listeners.get(`${type}:false`) || []) await fn(event); } };
}

test('exercise names are English in catalog, image preview and routines while translations remain saved', () => {
  const a = app();
  a.run(`catalogSearch = getExercise(id).name; const before = getExercise(id).nameEs;
    state.routines.push({id:'r',name:'Ejemplo',group:'Bíceps',exerciseIds:[id]});`);
  for (const html of [a.run('renderCatalogCards()'), a.run('renderRoutines()')]) {
    assert.match(html, /Incline Dumbbell Curl/);
    assert.doesNotMatch(html, /Curl inclinado con mancuernas/);
  }
  a.run('openImagePreview(id)');
  assert.doesNotMatch(a.run('opened'), /Curl inclinado con mancuernas/);
  a.run('openExerciseForm(id)');
  assert.doesNotMatch(a.run('opened'), /Traducción al español/);
  assert.equal(a.run('getExercise(id).nameEs === before'), true);
});

test('editing an exercise without a translation field preserves its saved translation', async () => {
  const a = app();
  a.run('const before = getExercise(id).nameEs;');
  const form = { id:'exercise-form', dataset:{ editId:a.run('id') }, querySelector:()=>({disabled:false}),
    elements:{ name:{value:'Incline Dumbbell Curl'}, group:{value:'Bíceps'}, equipment:{value:'Banco'} } };
  await a.fire('submit', { target:form, preventDefault() {} });
  assert.equal(a.run('getExercise(id).nameEs === before'), true);
  assert.equal(a.run('getExercise(id).equipment'), 'Banco');
});

test('backup remains reachable at the bottom of history without a top bar', async () => {
  const a = app();
  const html = a.run('renderHistory()');
  assert.match(html, /id="backup-open"/);
  const index = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  assert.doesNotMatch(index, /class="topbar"/);
  await a.fire('click', { target:{ closest: selector => selector === '#backup-open' ? {} : null } });
  assert.match(a.run('opened'), /Exportar respaldo/);
  assert.match(a.run('opened'), /Importar respaldo/);
});
