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
    image: "remo-mancuernas-pecho-apoyado.svg",
  },
  {
    id: "single-arm-seated-cable-row",
    english: "Single-Arm Seated Cable Row",
    spanish: "Remo unilateral sentado en polea baja",
    image: "remo-unilateral-polea.svg",
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

test("illustrations are included in the offline cache and are valid-looking SVG files", () => {
  assert.match(sw, /const CACHE = "cumpafit-v33"/);
  assert.match(html, /app\.js\?v=33/);
  for (const { image } of variants) {
    assert.ok(sw.includes(`"./assets/${image}"`), image);
    const svg = readFileSync(join(root, "assets", image), "utf8");
    assert.match(svg, /^<svg\s/);
    assert.match(svg, /<title\s/);
    assert.match(svg, /<desc\s/);
    assert.match(svg, /Inicio/);
    assert.match(svg, /Final/);
    assert.match(svg, /<\/svg>\s*$/);
  }
});
