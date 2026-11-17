const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function harness(name = "Super Declined Chest Press") {
  const listeners = {}, button = {}, photo = { files: [] };
  const context = vm.createContext({Date, Intl, structuredClone, setTimeout, clearTimeout, setInterval() {}, console,
    document: { addEventListener(type, handler) { (listeners[type] ||= []).push(handler); }, querySelector: () => photo },
    window: { addEventListener() {}, scrollTo() {} }});
  vm.runInContext(fs.readFileSync(__dirname + '/../app.js', 'utf8').replace(/\ninit\(\);\s*$/, '\n'), context);
  const run = code => vm.runInContext(code, context);
  run(`state = initialState(); state.exercises.push({id:'custom-panatta',name:${JSON.stringify(name)},group:'Pecho',equipment:'Panatta',image:'data:image/jpeg;base64,old',favorite:true});
    state.sessions={'2026-11-06':{selected:['custom-panatta'],sets:{'custom-panatta':[{id:'set-1',kg:'15',reps:'8',done:true}]},completed:{'custom-panatta':true}}}; state.routines=[{id:'routine',exerciseIds:['custom-panatta']}];
    persistNow=async()=>{}; render=()=>{};closeOverlay=()=>{};showToast=()=>{};openOverlay=html=>globalThis.formHtml=html;resizePhoto=async()=> 'data:image/jpeg;base64,new';`);
  const form = {id:'exercise-form',dataset:{editId:'custom-panatta'},querySelector:()=>button,
    elements:{name:{value:name},group:{value:'Pecho'},equipment:{value:'Panatta'},panattaIllustration:{checked:false}}};
  return {run,form,photo,button,save:()=>listeners.submit[0]({target:form,preventDefault(){}})};
}
test('Panatta explicit choice is unchecked and available on a selected duplicate',()=>{
  const {run}=harness();run('openExerciseForm("custom-panatta")');
  assert.match(run('formHtml'),/Usar ilustración Panatta/);
  assert.doesNotMatch(run('formHtml').match(/<input type="checkbox" name="panattaIllustration"[^>]*>/)[0],/checked/);
  run('state.exercises.push({...getExercise("custom-panatta"),id:"duplicate"})');
  assert.equal(run('canUsePanattaIllustration(getExercise("custom-panatta"))'),true);
  run('state.exercises.pop();getExercise("custom-panatta").equipment="Other"');
  assert.equal(run('canUsePanattaIllustration(getExercise("custom-panatta"))'),false);
  assert.equal(run('canUsePanattaIllustration(getExercise("press-pecho-maquina"))'),false);
});
test('opt-in replacement keeps identity, all history and routine references',async()=>{
 const {run,form,save}=harness(); const history=run('JSON.stringify([state.sessions,state.routines])'); const count=run('state.exercises.length');
 form.elements.panattaIllustration.checked=true; await save();
 assert.equal(run('getExercise("custom-panatta").image'),'./assets/panatta-super-declined-chest-press-v2.png');
 assert.equal(run('getExercise("custom-panatta").favorite'),true);
 assert.equal(run('state.exercises.length'),count);
 assert.equal(run('JSON.stringify([state.sessions,state.routines])'),history);
 assert.equal(run('canUsePanattaIllustration(getExercise("custom-panatta"))'),false);
 run('state=JSON.parse(JSON.stringify(state))');
 assert.equal(run('canUsePanattaIllustration(getExercise("custom-panatta"))'),false);
});
test('unchecked option preserves photo; uploaded and later photos take precedence',async()=>{
 const {run,form,save,photo}=harness();await save();assert.equal(run('getExercise("custom-panatta").image'),'data:image/jpeg;base64,old');
 form.elements.panattaIllustration.checked=true;await save();photo.files=[{}];await save();
 assert.equal(run('getExercise("custom-panatta").image'),'data:image/jpeg;base64,new');photo.files=[];form.elements.panattaIllustration.checked=false;await save();
 assert.equal(run('getExercise("custom-panatta").image'),'data:image/jpeg;base64,new');
});
test('failed save rolls back image and marker and allows retry',async()=>{
 const {run,form,save,button}=harness();form.elements.panattaIllustration.checked=true;
 run('persistNow=async()=>{throw new Error("quota")};');await save();
 assert.equal(run('getExercise("custom-panatta").image'),'data:image/jpeg;base64,old');
 assert.equal(run('getExercise("custom-panatta").panattaIllustrationApplied'),undefined);assert.equal(button.disabled,false);
 run('persistNow=async()=>{}');await save();assert.equal(run('getExercise("custom-panatta").panattaIllustrationApplied'),'./assets/panatta-super-declined-chest-press-v2.png');
});

for (const name of ['Super Declined Chest Press', 'Vertical Chest Press']) {
 test(`${name}: explicit replacement keeps identity/history and does not automatically overwrite photos`,async()=>{
  const {run,form,save,photo}=harness(name);
  const expected=name==='Vertical Chest Press'?'./assets/panatta-vertical-chest-press.png':'./assets/panatta-super-declined-chest-press-v2.png';
  const before=run('JSON.stringify([state.sessions,state.routines])');
  run('openExerciseForm("custom-panatta")');
  assert.ok(run('formHtml').includes(expected));
  assert.doesNotMatch(run('formHtml').match(/<input type="checkbox" name="panattaIllustration"[^>]*>/)[0],/checked/);
  await save();assert.equal(run('getExercise("custom-panatta").image'),'data:image/jpeg;base64,old');
  form.elements.panattaIllustration.checked=true;await save();
  assert.equal(run('getExercise("custom-panatta").image'),expected);
  assert.equal(run('getExercise("custom-panatta").name'),name);
  assert.equal(run('getExercise("custom-panatta").id'),'custom-panatta');
  assert.equal(run('JSON.stringify([state.sessions,state.routines])'),before);
  assert.equal(run('canUsePanattaIllustration(getExercise("custom-panatta"))'),false);
  photo.files=[{}];await save();assert.equal(run('getExercise("custom-panatta").image'),'data:image/jpeg;base64,new');
 });
}
test('Vertical explicit choice supports duplicate and starter-derived cards but rejects other equipment and muscle groups',()=>{
 const {run}=harness('Vertical Chest Press');
 run('state.exercises.push({...getExercise("custom-panatta"),id:"duplicate"})');
 assert.equal(run('canUsePanattaIllustration(getExercise("custom-panatta"))'),true);
 run('state.exercises.pop();getExercise("custom-panatta").equipment="Other"');
 assert.equal(run('canUsePanattaIllustration(getExercise("custom-panatta"))'),false);
 run('getExercise("custom-panatta").equipment="Panatta";getExercise("custom-panatta").group="Hombros"');
 assert.equal(run('canUsePanattaIllustration(getExercise("custom-panatta"))'),false);
 run('getExercise("custom-panatta").group="Pecho";getExercise("custom-panatta").id="press-pecho-maquina"');
 assert.equal(run('canUsePanattaIllustration(state.exercises.at(-1))'),true);
});

test('revised Super options are version-aware without overwriting custom photos automatically', async()=>{
 for (const [name,image] of [['Super Declined Chest Press','./assets/panatta-super-declined-chest-press-v2.png'],['Super Inclined Chest Press','./assets/panatta-super-inclined-chest-press.png']]) {
  const {run,form,save}=harness(name);
  run('getExercise("custom-panatta").panattaIllustrationApplied=true');
  assert.equal(run('canUsePanattaIllustration(getExercise("custom-panatta"))'),true);
  const before=run('JSON.stringify([state.sessions,state.routines])');
  assert.equal(run('migrateKnownPanattaIllustrations(state)'),0);
  assert.equal(run('getExercise("custom-panatta").image'),'data:image/jpeg;base64,old');
  form.elements.panattaIllustration.checked=true;await save();
  assert.equal(run('getExercise("custom-panatta").image'),image);
  assert.equal(run('getExercise("custom-panatta").panattaIllustrationApplied'),image);
  assert.equal(run('canUsePanattaIllustration(getExercise("custom-panatta"))'),false);
  assert.equal(run('getExercise("custom-panatta").name'),name);
  assert.equal(run('JSON.stringify([state.sessions,state.routines])'),before);
 }
});
test('only a unique known old Super Declined asset migrates, preserving identity and history',()=>{
 const {run}=harness();
 run('getExercise("custom-panatta").image="./assets/panatta-super-declined-chest-press.jpg";getExercise("custom-panatta").panattaIllustrationApplied=true');
 const before=run('JSON.stringify([state.sessions,state.routines])');
 run('state.exercises.push({...getExercise("custom-panatta"),id:"duplicate"})');
 assert.equal(run('migrateKnownPanattaIllustrations(state)'),0);
 run('state.exercises.pop();getExercise("custom-panatta").equipment="Other"');
 assert.equal(run('migrateKnownPanattaIllustrations(state)'),0);
 run('getExercise("custom-panatta").equipment="Panatta"');
 assert.equal(run('migrateKnownPanattaIllustrations(state)'),1);
 assert.equal(run('migrateKnownPanattaIllustrations(state)'),0);
 assert.equal(run('getExercise("custom-panatta").image'),'./assets/panatta-super-declined-chest-press-v2.png');
 assert.equal(run('getExercise("custom-panatta").name'),'Super Declined Chest Press');
 assert.equal(run('JSON.stringify([state.sessions,state.routines])'),before);
});
test('new Alternate Arm Curl is a unique bilingual biceps starter; Super presses remain custom-only',()=>{
 const {run}=harness();
 const entries=run('STARTER_EXERCISES.filter(ex=>ex.id==="panatta-alternate-arm-curl-45")');
 assert.equal(entries.length,1);assert.equal(entries[0].name,'Panatta Alternate Arm Curl -45');
 assert.equal(entries[0].group,'Bíceps');assert.match(entries[0].nameEs,/Curl alterno/);
 assert.equal(run('STARTER_ILLUSTRATIONS["panatta-alternate-arm-curl-45"]'),'./assets/panatta-alternate-arm-curl-45.png');
 assert.equal(run('STARTER_EXERCISES.filter(ex=>/Super (Inclined|Declined) Chest Press/.test(ex.name)).length'),0);
 run('state.exercises=state.exercises.filter(ex=>ex.id!=="panatta-alternate-arm-curl-45")');
 assert.equal(run('mergeStarterExercises(state)'),1);assert.equal(run('mergeStarterExercises(state)'),0);
});

test('Vertical and Super Inclined choices survive formatting differences and stale markers',async()=>{
 for(const name of ['Vertical Chest Press','Super Inclined Chest Press']) {
  const {run,form,save}=harness(name);
  run('getExercise("custom-panatta").name="  '+name.toUpperCase()+'  ";getExercise("custom-panatta").equipment=" panatta ";getExercise("custom-panatta").panattaIllustrationApplied=true');
  assert.equal(run('canUsePanattaIllustration(getExercise("custom-panatta"))'),true);
  form.elements.panattaIllustration.checked=true;await save();
  assert.equal(run('canUsePanattaIllustration(getExercise("custom-panatta"))'),false);
  run('getExercise("custom-panatta").image="data:image/png;base64,later"');
  assert.equal(run('canUsePanattaIllustration(getExercise("custom-panatta"))'),true);
 }
});
