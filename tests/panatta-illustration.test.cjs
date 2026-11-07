const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function harness() {
  const listeners = {}, button = {}, photo = { files: [] };
  const context = vm.createContext({Date, Intl, structuredClone, setTimeout, clearTimeout, setInterval() {}, console,
    document: { addEventListener(type, handler) { (listeners[type] ||= []).push(handler); }, querySelector: () => photo },
    window: { addEventListener() {}, scrollTo() {} }});
  vm.runInContext(fs.readFileSync(__dirname + '/../app.js', 'utf8').replace(/\ninit\(\);\s*$/, '\n'), context);
  const run = code => vm.runInContext(code, context);
  run(`state = initialState(); state.exercises.push({id:'custom-panatta',name:'Super Declined Chest Press',group:'Pecho',equipment:'Panatta',image:'data:image/jpeg;base64,old',favorite:true});
    state.sessions={'2026-11-06':{selected:['custom-panatta'],sets:{'custom-panatta':[{id:'set-1',kg:'15',reps:'8',done:true}]},completed:{'custom-panatta':true}}}; state.routines=[{id:'routine',exerciseIds:['custom-panatta']}];
    persistNow=async()=>{}; render=()=>{};closeOverlay=()=>{};showToast=()=>{};openOverlay=html=>globalThis.formHtml=html;resizePhoto=async()=> 'data:image/jpeg;base64,new';`);
  const form = {id:'exercise-form',dataset:{editId:'custom-panatta'},querySelector:()=>button,
    elements:{name:{value:'Super Declined Chest Press'},group:{value:'Pecho'},equipment:{value:'Panatta'},panattaIllustration:{checked:false}}};
  return {run,form,photo,button,save:()=>listeners.submit[0]({target:form,preventDefault(){}})};
}
test('Panatta choice is unchecked and limited to one exact custom match',()=>{
  const {run}=harness();run('openExerciseForm("custom-panatta")');
  assert.match(run('formHtml'),/Usar ilustración Panatta/);
  assert.doesNotMatch(run('formHtml').match(/<input type="checkbox" name="panattaIllustration"[^>]*>/)[0],/checked/);
  run('state.exercises.push({...getExercise("custom-panatta"),id:"duplicate"})');
  assert.equal(run('canUsePanattaIllustration(getExercise("custom-panatta"))'),false);
  run('state.exercises.pop();getExercise("custom-panatta").equipment="Other"');
  assert.equal(run('canUsePanattaIllustration(getExercise("custom-panatta"))'),false);
  assert.equal(run('canUsePanattaIllustration(getExercise("press-pecho-maquina"))'),false);
});
test('opt-in replacement keeps identity, all history and routine references',async()=>{
 const {run,form,save}=harness(); const history=run('JSON.stringify([state.sessions,state.routines])'); const count=run('state.exercises.length');
 form.elements.panattaIllustration.checked=true; await save();
 assert.equal(run('getExercise("custom-panatta").image'),'./assets/panatta-super-declined-chest-press.jpg');
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
 assert.equal(run('getExercise("custom-panatta").image'),'data:image/jpeg;base64,new');photo.files=[];await save();
 assert.equal(run('getExercise("custom-panatta").image'),'data:image/jpeg;base64,new');
});
test('failed save rolls back image and marker and allows retry',async()=>{
 const {run,form,save,button}=harness();form.elements.panattaIllustration.checked=true;
 run('persistNow=async()=>{throw new Error("quota")};');await save();
 assert.equal(run('getExercise("custom-panatta").image'),'data:image/jpeg;base64,old');
 assert.equal(run('getExercise("custom-panatta").panattaIllustrationApplied'),undefined);assert.equal(button.disabled,false);
 run('persistNow=async()=>{}');await save();assert.equal(run('getExercise("custom-panatta").panattaIllustrationApplied'),true);
});
