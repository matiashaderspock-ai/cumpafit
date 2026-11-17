const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
function harness() {
  const context = vm.createContext({ structuredClone, Date, Intl, console, setTimeout, clearTimeout, setInterval() {},
    document: { addEventListener() {} }, window: { addEventListener() {} } });
  vm.runInContext(source.replace(/\ninit\(\);\s*$/, '\n'), context);
  return code => vm.runInContext(code, context);
}
const ids = ['panatta-power-smith-flat-chest-press', 'panatta-power-smith-decline-chest-press'];
test('Power Smith flat and decline are distinct bilingual chest catalog entries with offline images', () => {
  const run = harness();
  for (const [index, id] of ids.entries()) {
    const ex = run(`STARTER_EXERCISES.filter(ex => ex.id === '${id}')`);
    assert.equal(ex.length, 1);
    assert.equal(ex[0].name, index ? 'Panatta Power Smith Dual System (Decline)' : 'Panatta Power Smith Dual System (Flat)');
    assert.match(ex[0].nameEs, index ? /declinado.*pecho bajo/ : /plano/);
    assert.equal(ex[0].group, 'Pecho');
    assert.equal(ex[0].equipment, 'Panatta Power Smith Dual System');
    const image = run(`STARTER_ILLUSTRATIONS['${id}']`);
    assert.equal(image, `./assets/${id}.png`);
    assert.ok(fs.readFileSync(path.join(root, image)).subarray(1, 4).equals(Buffer.from('PNG')));
    assert.ok(fs.readFileSync(path.join(root, 'sw.js'), 'utf8').includes(JSON.stringify(image)));
  }
});
test('catalog upgrade adds variants once without overwriting custom exercises, history, photos or deletions', () => {
  const run = harness();
  run(`state=initialState();state.exercises=state.exercises.filter(ex=>!${JSON.stringify(ids)}.includes(ex.id));
    state.exercises.push({id:'custom-panatta',name:'Super Declined Chest Press',equipment:'Panatta',group:'Pecho',image:'data:image/png;base64,user',favorite:true});
    state.sessions={old:{selected:['custom-panatta'],sets:{'custom-panatta':[{kg:'25',reps:'10'}]}}};
    state.routines=[{id:'r1',exerciseIds:['custom-panatta']}];`);
  const before = run('JSON.stringify([state.exercises,state.sessions,state.routines])');
  assert.equal(run('mergeStarterExercises(state)'), 2);
  assert.equal(run('mergeStarterExercises(state)'), 0);
  assert.equal(run(`JSON.stringify([state.exercises.filter(ex=>!${JSON.stringify(ids)}.includes(ex.id)),state.sessions,state.routines])`), before);
  run(`state.exercises.find(ex=>ex.id==='${ids[0]}').image='data:image/png;base64,custom';state.exercises.find(ex=>ex.id==='${ids[0]}').name='My press';`);
  run('mergeStarterExercises(state);migrateExerciseNames(state)');
  assert.equal(run(`state.exercises.find(ex=>ex.id==='${ids[0]}').name`), 'My press');
  assert.equal(run(`state.exercises.find(ex=>ex.id==='${ids[0]}').image`), 'data:image/png;base64,custom');
  run(`state.exercises=state.exercises.filter(ex=>ex.id!=='${ids[1]}');state.deletedExerciseIds=['${ids[1]}'];`);
  assert.equal(run('mergeStarterExercises(state)'), 0);
});

test('machine-title migration preserves IDs, user edits, and workout references', () => {
 const run=harness();
 run(`state=initialState();state.exercises.find(ex=>ex.id==='${ids[0]}').name='Flat Chest Press';state.exercises.find(ex=>ex.id==='${ids[1]}').name='My custom decline';
 state.sessions={old:{selected:['${ids[0]}'],sets:{'${ids[0]}':[{kg:'30',reps:'8'}]}}};state.routines=[{id:'r',exerciseIds:['${ids[0]}']}];`);
 const before=run('JSON.stringify([state.sessions,state.routines])');
 run('migrateExerciseNames(state)');
 assert.equal(run(`state.exercises.find(ex=>ex.id==='${ids[0]}').name`),'Panatta Power Smith Dual System (Flat)');
 assert.equal(run(`state.exercises.find(ex=>ex.id==='${ids[1]}').name`),'My custom decline');
 assert.equal(run('JSON.stringify([state.sessions,state.routines])'),before);
 assert.equal(run('migrateExerciseNames(state)'),0);
});

const upperIds = ['panatta-power-smith-upper-incline', 'panatta-power-smith-upper-shoulder-press'];
test('Upper machine has separate incline chest and shoulder entries and dedicated offline illustrations', () => {
 const run=harness();
 for (const [index,id] of upperIds.entries()) {
  const entries=run(`STARTER_EXERCISES.filter(ex=>ex.id==='${id}')`);
  assert.equal(entries.length,1);
  assert.equal(entries[0].name,`Panatta Power Smith Dual System Upper (${index ? 'Shoulder Press' : 'Incline'})`);
  assert.equal(entries[0].group,index ? 'Hombros' : 'Pecho');
  assert.equal(entries[0].equipment,'Panatta Power Smith Dual System Upper');
  assert.equal(entries[0].nameEs,index ? 'Press de hombros' : 'Press de pecho inclinado');
  const image=run(`STARTER_ILLUSTRATIONS['${id}']`);
  assert.equal(image,`./assets/${id}.png`);
  assert.ok(fs.readFileSync(path.join(root,image)).subarray(1,4).equals(Buffer.from('PNG')));
  assert.ok(fs.readFileSync(path.join(root,'sw.js'),'utf8').includes(JSON.stringify(image)));
 }
});
test('Upper catalog addition is idempotent and preserves existing variants, photos, history and deletions', () => {
 const run=harness();
 run(`state=initialState();state.exercises=state.exercises.filter(ex=>!${JSON.stringify(upperIds)}.includes(ex.id));
  state.exercises.find(ex=>ex.id==='${ids[0]}').image='data:image/png;base64,user';
  state.sessions={old:{selected:['${ids[0]}'],sets:{'${ids[0]}':[{kg:'30',reps:'8'}]}}};state.routines=[{id:'r',exerciseIds:['${ids[0]}']}];`);
 const before=run('JSON.stringify([state.exercises,state.sessions,state.routines])');
 assert.equal(run('mergeStarterExercises(state)'),2);
 assert.equal(run('mergeStarterExercises(state)'),0);
 assert.equal(run(`JSON.stringify([state.exercises.filter(ex=>!${JSON.stringify(upperIds)}.includes(ex.id)),state.sessions,state.routines])`),before);
 run(`state.exercises=state.exercises.filter(ex=>ex.id!=='${upperIds[1]}');state.deletedExerciseIds=['${upperIds[1]}'];`);
 assert.equal(run('mergeStarterExercises(state)'),0);
});
