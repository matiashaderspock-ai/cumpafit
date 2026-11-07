const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function app() {
  const handlers = {};
  const context = vm.createContext({ Date, Intl, structuredClone, console, setTimeout, clearTimeout, setInterval() {}, document: { addEventListener(type, handler, capture) { if (!capture) handlers[type] = handler; }, querySelector() { return { files: [] }; } }, window: { addEventListener() {} } });
  vm.runInContext(fs.readFileSync(__dirname + '/../app.js', 'utf8').replace(/\ninit\(\);\s*$/, '\n'), context);
  const run = code => vm.runInContext(code, context);
  run(`state = initialState(); let confirmed = true, message, saved, opened, closed = 0, notices = []; const button = { disabled: false }; const id = STARTER_EXERCISES[0].id;
    confirm = text => { message = text; return confirmed; }; persist = () => {}; persistNow = async () => { saved = structuredClone(state); }; closeOverlay = () => { closed++; }; render = () => {}; showToast = text => notices.push(text); openOverlay = html => { opened = html; };
    state.exercises[0].photo = 'data:image/png;base64,private'; state.exercises[0].weightUnit = 'lb';
    state.routines = [{ id: 'routine', name: 'Routine', group: 'Bíceps', exerciseIds: [id, STARTER_EXERCISES[1].id] }];`);
  return { run, handlers };
}
test('delete forever is explicit and cancel leaves every byte intact', async () => {
  const a = app();
  a.run('openExerciseForm(id); const before = JSON.stringify(state); confirmed = false;');
  assert.match(a.run('opened'), /Eliminar para siempre/);
  assert.equal(await a.run('deleteExerciseForever(id, button)'), false);
  assert.equal(a.run('JSON.stringify(state) === before'), true);
  assert.match(a.run('message'), /sesiones existentes/);
  assert.equal(a.run('closed'), 0);
});
test('deleting a used exercise removes definition and routines, preserves readable history and all sessions', async () => {
  const a = app();
  a.run(`const old = ensureSession('2026-10-01'); old.selected = [id]; old.sets[id] = [{id:'set', kg:'45.359237', reps:'10', done:true}]; old.completed[id] = true; old.finishedAt = '2026-10-01T15:00:00Z'; const before = JSON.stringify(state.sessions);`);
  assert.equal(await a.run('deleteExerciseForever(id, button)'), true);
  assert.equal(a.run('state.exercises.some(ex => ex.id === id)'), false);
  assert.equal(a.run('state.routines[0].exerciseIds.includes(id)'), false);
  assert.equal(a.run('JSON.stringify(state.sessions) === before'), true);
  assert.equal(a.run('getExercise(id).weightUnit'), 'lb');
  assert.match(a.run("renderHistorySummary('2026-10-01')"), /Incline Dumbbell Curl/);
  assert.match(a.run("renderHistorySummary('2026-10-01')"), /100 lb/);
  assert.equal(a.run('JSON.stringify(state).includes("private")'), false);
  a.run('state = structuredClone(saved); mergeStarterExercises(state);');
  assert.equal(a.run('state.exercises.some(ex => ex.id === id)'), false);
  a.run('state = validateBackup(JSON.parse(JSON.stringify(state))); mergeStarterExercises(state);');
  assert.equal(a.run('state.exercises.some(ex => ex.id === id)'), false);
  assert.equal(a.run('getExercise(id).name'), 'Incline Dumbbell Curl');
  a.run('const oldSelected = JSON.stringify(ensureSession().selected); addToSession(id);');
  assert.equal(a.run('JSON.stringify(ensureSession().selected) === oldSelected'), true);
  assert.equal(a.run('availableRoutineExercises({exerciseIds:[id]}).length'), 0);
});
test('unused and archived custom exercises have no history metadata or restore path', async () => {
  const a = app();
  a.run("state.exercises.push({id:'custom',name:'Custom',group:'Pecho',archived:true});");
  assert.equal(await a.run("deleteExerciseForever('custom', button)"), true);
  assert.equal(a.run("getExercise('custom')"), undefined);
  assert.equal(a.run('state.exerciseHistory.length'), 0);
  a.run("opened = ''; openExerciseForm('custom');");
  assert.equal(a.run('opened'), '');
  assert.equal(await a.run("deleteExerciseForever('custom', {disabled:false})"), false);
});
test('failed persistence restores full state and allows retry', async () => {
  const a = app();
  a.run("const before = JSON.stringify(state); persistNow = async () => { throw Error('QuotaExceededError'); };");
  assert.equal(await a.run('deleteExerciseForever(id, button)'), false);
  assert.equal(a.run('JSON.stringify(state) === before'), true);
  assert.equal(a.run('button.disabled'), false);
  assert.equal(a.run('closed'), 0);
  a.run('persistNow = async () => { saved = structuredClone(state); };');
  assert.equal(await a.run('deleteExerciseForever(id, button)'), true);
});
test('cardio history retains minutes and speed after deleting its definition', async () => {
  const a = app();
  a.run("const cardio = 'caminata-cinta'; const old = ensureSession('2026-10-01'); old.selected = [cardio]; old.sets[cardio] = [{id:'cardio-set',minutes:'20',speedKmh:'6',done:true}];");
  await a.run("deleteExerciseForever('caminata-cinta', button)");
  assert.match(a.run("renderHistorySummary('2026-10-01')"), /20 min/);
  assert.match(a.run("renderHistorySummary('2026-10-01')"), /6 km\/h/);
});
test('backup validates deletion markers and historical metadata; old v1 remains compatible', () => {
  const a = app();
  assert.equal(a.run('validateBackup(initialState()).version'), 1);
  for (const mutation of ["data.deletedExerciseIds = ['__proto__']", "data.deletedExerciseIds = [id]", "data.exerciseHistory = [{id:'missing',name:'Bad',group:'Pecho'}]", "data.deletedExerciseIds = ['gone']; data.exerciseHistory = [{id:'gone',name:'Bad',group:'Bad'}]"]) {
    assert.throws(() => a.run(`{ const data = initialState(); ${mutation}; validateBackup(data); }`));
  }
});

test('custom cardio retains measurement semantics inferred from translated names', async () => {
  const a = app();
  a.run("state.exercises.push({id:'custom-treadmill', name:'Treadmill', nameEs:'Caminata', group:'Cardio'}); const old = ensureSession('2026-10-01'); old.selected = ['custom-treadmill']; old.sets['custom-treadmill'] = [{id:'set',minutes:'20',speedKmh:'6',done:true}];");
  await a.run("deleteExerciseForever('custom-treadmill', button)");
  assert.match(a.run("renderHistorySummary('2026-10-01')"), /6 km\/h/);
  a.run('state = validateBackup(JSON.parse(JSON.stringify(state)));');
  assert.match(a.run("renderHistorySummary('2026-10-01')"), /6 km\/h/);
});

test('pending deletion blocks concurrent deletion and failed save can be retried', async () => {
  const a = app();
  a.run("const before = JSON.stringify(state); let rejectSave; persistNow = () => new Promise((_, reject) => { rejectSave = reject; }); const first = deleteExerciseForever(id, button);");
  assert.equal(a.run('exerciseMutationPending'), true);
  assert.equal(await a.run('deleteExerciseForever(STARTER_EXERCISES[1].id, {disabled:false})'), false);
  a.run("rejectSave(Error('QuotaExceededError'));");
  assert.equal(await a.run('first'), false);
  assert.equal(a.run('JSON.stringify(state) === before'), true);
  assert.equal(a.run('exerciseMutationPending'), false);
  a.run('persistNow = async () => { saved = structuredClone(state); };');
  assert.equal(await a.run('deleteExerciseForever(STARTER_EXERCISES[1].id, {disabled:false})'), true);
});

test('a pending exercise edit cannot overlap deletion, even if its save fails', async () => {
  const a = app();
  a.run("let rejectSave; persistNow = () => new Promise((_, reject) => { rejectSave = reject; }); const before = JSON.stringify(state);");
  const saveButton = { disabled: false };
  const saving = a.handlers.submit({ preventDefault() {}, target: { id: 'exercise-form', dataset: { editId: a.run('id') }, querySelector: () => saveButton, elements: { name: {value:'Edited'}, group:{value:'Bíceps'}, equipment:{value:'Dumbbells'} } } });
  assert.equal(a.run('exerciseMutationPending'), true);
  assert.equal(await a.run('deleteExerciseForever(id, button)'), false);
  a.run("rejectSave(Error('QuotaExceededError')); console.error = () => {};");
  await saving;
  assert.equal(a.run('JSON.stringify(state) === before'), true);
  assert.equal(a.run('exerciseMutationPending'), false);
  a.run('persistNow = async () => { saved = structuredClone(state); };');
  assert.equal(await a.run('deleteExerciseForever(id, button)'), true);
  assert.equal(a.run('state.exercises.some(ex => ex.id === id)'), false);
});
