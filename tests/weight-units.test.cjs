const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
function app(){
 const listeners={};
 const context=vm.createContext({Date,Intl,structuredClone,console,setTimeout,clearTimeout,setInterval:()=>0,CSS:{escape:x=>x},document:{addEventListener:(type,fn,capture)=>{if(!capture)(listeners[type]??=[]).push(fn)},querySelector:()=>null},window:{addEventListener(){}}});
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../app.js'),'utf8').replace(/\ninit\(\);\s*$/,'\n'),context);
 const run=code=>vm.runInContext(code,context);
 run('state=initialState(); let saved; persist=()=>{saved=structuredClone(state)}; render=()=>{}; const ex=state.exercises[0]; addToSession(ex.id); const set=ensureSession().sets[ex.id][0];');
 return {run,click:()=>listeners.click[0]({target:{closest:selector=>selector==='[data-action]'?{dataset:{action:'toggle-weight-unit',id:run('ex.id')}}:null}})};
}
test('kg default and per-exercise preference persist with backup round trip',async()=>{
 const a=app();assert.equal(a.run('exerciseWeightUnit(ex)'),'kg');
 await a.click();assert.equal(a.run('exerciseWeightUnit(ex)'),'lb');
 assert.equal(a.run('exerciseWeightUnit(state.exercises[1])'),'kg');
 assert.equal(a.run('saved.exercises[0].weightUnit'),'lb');
 assert.equal(a.run('validateBackup(JSON.parse(JSON.stringify(saved))).exercises[0].weightUnit'),'lb');
 a.run('state=JSON.parse(JSON.stringify(saved))');assert.equal(a.run('exerciseWeightUnit(state.exercises[0])'),'lb');
});
test('lb conversion accepts comma decimals and leaves blank/invalid input invalid',()=>{
 const a=app();a.run('ex.weightUnit="lb"');
 assert.equal(a.run('canonicalWeight(ex,"100")'),'45.359237');
 assert.equal(a.run('canonicalWeight(ex,"22,5")'),'10.205828325');
 assert.equal(a.run('displayedWeight(ex,"45.359237")'),'100');
 for(const value of ['', 'abc','-2','0x10','Infinity','2e1'])assert.equal(a.run(`canonicalWeight(ex,${JSON.stringify(value)})`),value);
});
test('repeated unit toggles preserve existing history, PRs and prefilled loads exactly',async()=>{
 const a=app();a.run('set.kg="50"; set.reps="10"; set.done=true; const sessionsBefore=JSON.stringify(state.sessions); const historyBefore=JSON.stringify(recordedUses(ex.id));');
 for(let i=0;i<20;i++)await a.click();
 assert.equal(a.run('JSON.stringify(state.sessions)===sessionsBefore'),true);
 assert.equal(a.run('JSON.stringify(recordedUses(ex.id))===historyBefore'),true);
 assert.equal(a.run('newSetFor(ex,set).kg'),'50');
});
test('strength weight labels show selected unit without adding per-row controls; cardio untouched',()=>{
 const a=app();a.run('ex.weightUnit="lb";set.kg="45.359237"');
 assert.match(a.run('renderSetFields(ex,set,0)'),/value="100".*data-set-field="kg"/);
 assert.match(a.run('renderSetFields(ex,set,0)'),/Peso lb/);
 assert.match(a.run('renderSessionExercise(ex,ensureSession(),0)'),/toggle-weight-unit/);
 assert.doesNotMatch(a.run('renderSetFields(ex,set,0)'),/button/);
 a.run('const cardio=state.exercises.find(e=>e.group==="Cardio");addToSession(cardio.id)');
 assert.doesNotMatch(a.run('renderSessionExercise(cardio,ensureSession(),0)'),/toggle-weight-unit/);
});
test('last use, history summaries, graphs and PRs display the selected unit but compare canonical kg',()=>{
 const a=app();a.run('set.kg="45.359237";set.reps="10";set.done=true;ex.weightUnit="lb"');
 for(const code of ['lastUseContent(ex.id).body','weightHistoryContent(ex.id).body','maximumSummaryMarkup(ex.id)','summarySetText(ex,set)']){
  assert.match(a.run(code),/100 lb/);assert.doesNotMatch(a.run(code),/ kg/);
 }
 assert.equal(a.run('historicalMaximum(ex.id).kg'),45.359237);
 a.run('ex.weightUnit="kg"');assert.match(a.run('maximumSummaryMarkup(ex.id)'),/45,36 kg/);
});
