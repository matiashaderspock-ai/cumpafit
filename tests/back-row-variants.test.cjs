const test = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const root = join(__dirname, "..");
const app = readFileSync(join(root, "app.js"), "utf8");
const sw = readFileSync(join(root, "sw.js"), "utf8");
const html = readFileSync(join(root, "index.html"), "utf8");

const variants = [
  {
    id: "incline-chest-supported-dumbbell-row",
    english: "Incline Chest-Supported Dumbbell Row",
    spanish: "Remo con mancuernas y pecho apoyado en banco inclinado",
    image: "incline-chest-supported-dumbbell-row.jpg",
  },
  {
    id: "single-arm-seated-cable-row",
    english: "Single-Arm Seated Cable Row",
    spanish: "Remo unilateral sentado en polea baja",
    image: "single-arm-seated-cable-row.jpg",
  },
  {
    id: "panatta-rowing-machine-circular",
    english: "Rowing Machine Circular",
    spanish: "Remo circular en máquina",
    image: "panatta-rowing-machine-circular.jpg",
  },
];

test("new back exercises have unique stable catalog IDs, names and dedicated illustrations", () => {
  for (const exercise of variants) {
    assert.equal(app.split(`"id":"${exercise.id}"`).length - 1, 1, exercise.id);
    assert.ok(app.includes(`"name":"${exercise.english}"`), exercise.english);
    assert.ok(app.includes(`"nameEs":"${exercise.spanish}"`), exercise.spanish);
    assert.ok(app.includes(`"${exercise.id}": "./assets/${exercise.image}"`), exercise.image);
    assert.ok(app.includes('"group":"Espalda"'), "back muscle category remains available");
  }
});

test("illustrations are included in the offline cache and are dedicated JPEG files", () => {
  const version = sw.match(/cumpafit-v(\d+)/)[1];
  assert.ok(html.includes(`app.js?v=${version}`));
  for (const { image } of variants) {
    assert.ok(sw.includes(`"./assets/${image}"`), image);
    const jpeg = readFileSync(join(root, "assets", image));
    assert.deepEqual([...jpeg.subarray(0, 3)], [0xff, 0xd8, 0xff], image);
    assert.deepEqual([...jpeg.subarray(-2)], [0xff, 0xd9], image);
  }
});

test("Panatta Circular is a strength exercise separate from other rows", () => {
  const entry = app.split("\n").find(line => line.includes('"id":"panatta-rowing-machine-circular"'));
  const row = JSON.parse(entry.trim().slice(0, -1));
  assert.equal(row.group, "Espalda");
  assert.match(row.equipment, /Panatta/);
  assert.ok(app.includes('"id":"remo-maquina-pecho-apoyado"'));
  assert.ok(app.includes('"id":"remo-ergometro"'));
});
