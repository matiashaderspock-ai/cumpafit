const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

for (const withRoutines of [true, false]) {
  test(`imports a pre-rename version-1 backup ${withRoutines ? 'with' : 'without'} routines`, async () => {
    // Legacy exports contain no app name or database name in their JSON.
    const exercise = {
      id: 'custom-exercise', name: 'Mi ejercicio', group: 'Pecho',
      equipment: 'Mancuernas', photo: 'data:image/jpeg;base64,AA==',
      favorite: true, archived: true,
    };
    const backup = {
      version: 1, exercises: [exercise], exportedAt: '2026-10-10T22:00:00Z',
      sessions: {
        '2026-10-10': {
          date: '2026-10-10', selected: [exercise.id], completed: { [exercise.id]: true },
          sets: { [exercise.id]: [{ id: 'legacy-set', kg: '25', reps: '12', done: true }] },
          finishedAt: '2026-10-10T21:00:00Z',
        },
      },
      ...(withRoutines ? { routines: [{ id: 'routine-1', name: 'Mi rutina', group: 'Pecho', exerciseIds: [exercise.id] }] } : {}),
    };
    let stored, confirmations = 0, renders = 0, closed = 0;
    const toasts = [];
    const context = vm.createContext({
      Date, Intl, structuredClone, console, setTimeout, clearTimeout, setInterval: () => 0,
      document: { addEventListener() {} }, window: { addEventListener() {} },
      confirm() { confirmations++; return true; },
      testDB: {
        transaction(store, mode) {
          assert.equal(store, 'data'); assert.equal(mode, 'readwrite');
          const transaction = {
            objectStore() {
              return { put(snapshot, key) {
                assert.equal(key, 'main'); stored = structuredClone(snapshot);
                queueMicrotask(() => transaction.oncomplete());
              } };
            },
          };
          return transaction;
        },
      },
      recordToast: value => toasts.push(value),
      recordRender: () => renders++, recordClose: () => closed++,
      file: { name: 'legacy-backup.json', text: async () => JSON.stringify(backup) },
    });
    const source = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
    vm.runInContext(source.replace(/\ninit\(\);\s*$/, '\n'), context);
    vm.runInContext(`db = testDB; state = initialState();
      state.exercises.push({ id: 'to-be-replaced' });
      closeOverlay = recordClose; render = recordRender; showToast = recordToast;`, context);
    await vm.runInContext('importBackup(file)', context);
    assert.deepEqual(JSON.parse(JSON.stringify(stored)), {
      version: 1, exercises: backup.exercises, sessions: backup.sessions, routines: backup.routines || [],
    });
    assert.deepEqual(JSON.parse(vm.runInContext('JSON.stringify(state)', context)), JSON.parse(JSON.stringify(stored)));
    assert.equal(confirmations, 1); assert.equal(renders, 1); assert.equal(closed, 1);
    assert.deepEqual(toasts, ['Respaldo importado']);
  });
}
