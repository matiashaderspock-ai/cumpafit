const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const asset = "./assets/v-bar-triceps-pushdown.jpg";
const app = fs.readFileSync(path.join(__dirname, "../app.js"), "utf8").replace(/\ninit\(\);\s*$/, "\n");
const original = { id: "existing-custom-v-bar", name: "V - Bar Triceps Pushdown", group: "Tríceps", equipment: "Polea", tile: null };

function harness(exercise = original) {
  const context = vm.createContext({
    exercise: structuredClone(exercise), structuredClone,
    setInterval() {},
    window: { addEventListener() {} },
    document: { addEventListener() {} },
  });
  const run = code => vm.runInContext(code, context);
  run(app);
  run("state = initialState(); state.exercises.push(exercise)");
  return run;
}

test("the existing V-bar session card, catalog thumbnail, and image preview use the illustration without changing the exercise", () => {
  const run = harness();
  const card = run(`renderSessionExercise(exercise, {sets: {[exercise.id]: [{id: "set-1", kg: "30", reps: "10", done: true}]}, completed: {}}, 1)`);
  assert.match(card, /<img class="exercise-image starter-illustration"/);
  assert.ok(card.includes(`src="${asset}"`));
  assert.ok(card.includes('data-id="existing-custom-v-bar"'));
  assert.match(card, /1 de 1 series hechas/);
  const catalog = run("catalogImageButton(exercise)");
  assert.ok(catalog.includes('data-action="view-image"'));
  assert.ok(catalog.includes(`src="${asset}"`));
  run("openOverlay = html => globalThis.previewMarkup = html; openImagePreview(exercise.id)");
  assert.ok(run("previewMarkup").includes(`class="preview-illustration" src="${asset}"`));
  assert.equal(run("JSON.stringify(exercise)"), JSON.stringify(original));
  assert.equal(run('state.exercises.filter(ex => /v\\s*[-–]?\\s*bar triceps pushdown/i.test(ex.name)).length'), 1);
});

test("V-bar fallback normalizes spacing, dash and case without catching other exercises or overriding personal images", () => {
  const run = harness();
  for (const name of ["V-Bar Triceps Pushdown", "v bar triceps pushdown", "  V–BAR  TRICEPS  PUSHDOWN  "]) {
    assert.equal(run(`exerciseIllustration({...exercise, name: ${JSON.stringify(name)}})`), asset);
  }
  for (const name of ["Straight-Bar Triceps Pushdown", "Rope Triceps Pushdown", "V-Bar Triceps Pushdown Single Arm", "V-Bar Lat Pulldown"]) {
    assert.equal(run(`exerciseIllustration({...exercise, name: ${JSON.stringify(name)}})`), undefined);
  }
  assert.equal(run('exerciseIllustration({...exercise, group: "Espalda"})'), undefined);
  assert.equal(run('exerciseIllustration({...exercise, tile: 3})'), undefined);
  assert.equal(run('exerciseIllustration({...exercise, image: "data:image/jpeg;base64,test"})'), "data:image/jpeg;base64,test");
});

test("Panatta Triceps Machine uses its own overhead illustration without overriding the existing card or other brands", () => {
  const panatta = { id: "existing-panatta", name: "Triceps Machine", group: "Tríceps", equipment: "Panatta" };
  const run = harness(panatta);
  const image = "./assets/panatta-triceps-machine.jpg";
  assert.equal(run("exerciseIllustration(exercise)"), image);
  assert.match(run("catalogImageButton(exercise)"), /panatta-triceps-machine\.jpg/);
  assert.equal(run("JSON.stringify(exercise)"), JSON.stringify(panatta));
  assert.equal(run('exerciseIllustration({...exercise, equipment: "Technogym"})'), undefined);
  assert.equal(run('exerciseIllustration({...exercise, image: "my-photo.jpg"})'), "my-photo.jpg");
  assert.equal(run('state.exercises.filter(ex => ex.name === "Triceps Machine").length'), 1);
});

test("updating a backup keeps existing Panatta Dips Press and Circular Row cards without adding duplicates", () => {
  const run = harness();
  run(`state = {exercises: [
    {id:"custom-dips",name:"Dips Press",group:"Pecho",equipment:"Panatta",archived:true},
    {id:"custom-row",name:"Rowing Machine Circular",group:"Espalda",equipment:"Equipo no indicado"},
    {id:"generic-row",name:"Chest-Supported Machine Row",group:"Espalda",equipment:"Maquina"},
  ], sessions:{old:{selected:['custom-dips','custom-row']}},routines:[{exerciseIds:['custom-row']}]};
  mergeStarterExercises(state);`);
  assert.equal(run('state.exercises.filter(ex => ex.name === "Dips Press" || ex.name === "Rowing Machine Circular").length'), 2);
  assert.equal(run('exerciseIllustration(getExercise("custom-dips"))'), "./assets/panatta-dips-press.jpg");
  assert.equal(run('exerciseIllustration(getExercise("custom-row"))'), "./assets/panatta-rowing-machine-circular.jpg");
  assert.equal(run('exerciseIllustration({...getExercise("custom-dips"), image:"my-photo.jpg"})'), "my-photo.jpg");
  assert.equal(run('exerciseIllustration(getExercise("generic-row"))'), undefined);
  assert.equal(run('getExercise("custom-dips").archived'), true);
  assert.equal(run('JSON.stringify(state.sessions.old.selected)'), '["custom-dips","custom-row"]');
  assert.equal(run('state.routines[0].exerciseIds[0]'), "custom-row");
  assert.equal(run('initialState().exercises.find(ex => ex.id === "panatta-dips-press").equipment'), "Panatta · Dips Press");
});


test("declined barbell exercise recognizes the existing rack note, not another apparatus", () => {
  const press = {id:"custom-decline",name:"Declined Barbell Bench Press",group:"Pecho",equipment:"Banco olímpico inclinado · Barra (5 huecos afuera)"};
  const run = harness(press);
  assert.equal(run("exerciseIllustration(exercise)"), "./assets/declined-barbell-bench-press.png");
  assert.equal(run('exerciseIllustration({...exercise, equipment:"Banco olímpico inclinado • Barra"})'), "./assets/declined-barbell-bench-press.png");
  assert.equal(run('exerciseIllustration({...exercise, equipment:"Máquina Smith · Barra"})'), undefined);
  assert.equal(run('exerciseIllustration({...exercise, image:"my-photo.jpg"})'), "my-photo.jpg");
});
