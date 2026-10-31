/* Disposable contexts and synthetic workouts only. Run against a local checkout. */
const { chromium, devices } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.CUMPAFIT_URL || 'http://127.0.0.1:4173/';
const output = process.env.REVIEW_SCREENSHOTS || '/tmp/cumpafit-review';
fs.mkdirSync(output, { recursive: true });

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: ['--no-sandbox'] });
  try {
    const context = await browser.newContext({ ...devices['iPhone 13'], locale: 'es-BO', reducedMotion: 'reduce' });
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(new URL('?demo=1', base).href);
    await page.locator('.session-list').waitFor();
    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 844 });
      for (const tab of ['today', 'catalog', 'routines', 'history']) {
        await page.locator(`[data-tab="${tab}"]`).click();
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${tab} fits ${width}px`);
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('[data-tab="routines"]').click();
    await page.locator('[data-action="new-routine"]').click();
    assert.equal(await page.locator('#overlay').evaluate(e => e.open && e.matches(':modal')), true);
    await page.locator('#routine-name').press('Shift+Tab');
    const backwardsFocus = await page.evaluate(() => ({
      tag: document.activeElement.tagName, id: document.activeElement.id,
      documentFocused: document.hasFocus(),
      inDialog: document.querySelector('#overlay').contains(document.activeElement),
    }));
    console.log('Native dialog backward focus:', backwardsFocus);
    // Native dialogs may move focus to browser chrome, represented by BODY.
    // The regression is reaching a background app control, such as History.
    assert.ok(backwardsFocus.inDialog || backwardsFocus.tag === 'BODY', 'Shift+Tab must not focus background app controls');
    await page.keyboard.press('Shift+Tab');
    assert.ok(await page.evaluate(() => document.querySelector('#overlay').contains(document.activeElement) || document.activeElement === document.body), 'Backward focus stays outside background controls');
    await page.locator('#routine-name').fill('Review routine');
    await page.locator('[data-routine-ex]').first().check();
    await page.screenshot({ path: `${output}/routine-mobile.png` });
    await page.getByRole('button', { name: 'Save routine', exact: true }).click();
    await page.locator('#overlay').waitFor({ state: 'hidden' });
    assert.ok(await page.locator('[data-action="new-routine"]').evaluate(e => e === document.activeElement), 'Save restores the re-rendered trigger');
    await page.reload();
    await page.locator('[data-tab="routines"]').click();
    await page.getByRole('heading', { name: 'Review routine', exact: true }).waitFor();
    await page.locator('[data-action="new-routine"]').click();
    await page.locator('#routine-name').press('Escape');
    await page.locator('#overlay').waitFor({ state: 'hidden' });
    assert.ok(await page.locator('[data-action="new-routine"]').evaluate(e => e === document.activeElement));
    await page.locator('[data-tab="catalog"]').click();
    await page.locator('#catalog-search').fill('Hammer');
    await page.locator('[data-action="catalog-toggle"]').first().click();
    await page.locator('[data-action="return-session"]').click();
    const hammer = page.locator('.session-card').filter({ hasText: 'Dumbbell Hammer Curl' });
    if (await hammer.locator('[data-action="expand"]').getAttribute('aria-expanded') === 'false')
      await hammer.locator('[data-action="expand"]').click();
    await hammer.locator('[data-set-field="kg"]').first().fill('22,5');
    await hammer.locator('[data-set-field="reps"]').first().fill('10');
    assert.ok(await hammer.locator('[data-set-done]').first().isChecked());
    await hammer.locator('[data-action="add-drop-set"]').click();
    assert.equal(await hammer.locator('.drop-set-label').count(), 1);
    await page.screenshot({ path: `${output}/session-mobile.png` });
    await page.locator('[data-action="finish-session"]').click();
    await page.locator('.history-calendar').waitFor();
    await page.locator('.calendar-day.is-today').click();
    assert.equal(await page.locator('#sheet-content input').count(), 0, 'History remains read-only');
    await page.screenshot({ path: `${output}/history-mobile.png` });
    await context.close();

    const personal = await browser.newContext({ ...devices['iPhone 13'], locale: 'es-BO', reducedMotion: 'reduce' });
    const log = await personal.newPage();
    log.on('pageerror', error => errors.push(error.message));
    await log.goto(base);
    await log.locator('.summary-card').waitFor();
    const readState = () => log.evaluate(() => new Promise((resolve, reject) => {
      const request = indexedDB.open('cumpafit'); request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result, tx = db.transaction('data');
        tx.objectStore('data').get('main').onsuccess = e => resolve(e.target.result);
        tx.oncomplete = () => db.close();
      };
    }));
    await log.locator('[data-action="go-catalog"]').first().click();
    await log.locator('[data-action="catalog-toggle"]').first().click();
    await log.locator('[data-action="return-session"]').click();
    await log.locator('[data-set-field="kg"]').first().fill('25');
    await log.locator('[data-set-field="reps"]').first().fill('10');
    await log.waitForFunction(() => !document.querySelector('#toast')?.textContent.includes('No se pudo'));
    await log.locator('[data-action="finish-session"]').click();
    await log.locator('.history-calendar').waitFor();
    const before = await readState();
    await log.locator('#backup-open').click();
    const upload = async backup => {
      const choosing = log.waitForEvent('filechooser');
      await log.locator('[data-action="import"]').click();
      const chooser = await choosing;
      await chooser.setFiles({ name: 'review.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup)) });
    };
    await upload({ version: 1, exercises: [], sessions: [] });
    await log.getByText('El archivo no es un respaldo válido', { exact: true }).waitFor();
    assert.deepEqual(await readState(), before, 'Malformed backups cannot replace workouts');
    const id = 'custom" data-injected="true', date = Object.keys(before.sessions).at(-1);
    const replacement = { version: 1, exercises: [{ id, name: 'Imported replacement', group: 'Pecho', equipment: 'Bench' }],
      sessions: { [date]: { date, selected: [id], completed: {}, sets: { [id]: [{ id: 'set" autofocus', kg: '20', reps: '10', done: true }] } } } };
    // Abort only the replacement write, after the original workout is flushed.
    await log.evaluate(() => {
      const put = IDBObjectStore.prototype.put;
      IDBObjectStore.prototype.put = function(value, ...args) {
        const request = put.call(this, value, ...args);
        if (value?.exercises?.[0]?.name === 'Imported replacement') this.transaction.abort();
        return request;
      };
    });
    log.once('dialog', dialog => dialog.accept());
    await upload(replacement);
    await log.getByText('No se pudo guardar el respaldo. Tus datos actuales se conservan.', { exact: true }).waitFor();
    assert.deepEqual(await readState(), before, 'An aborted transaction preserves the previous workout');
    await log.reload();
    await log.locator('[data-tab="history"]').click();
    await log.locator('#backup-open').click();
    log.once('dialog', dialog => dialog.accept());
    await upload(replacement);
    await log.getByText('Respaldo importado', { exact: true }).waitFor();
    assert.equal(await log.locator('[data-injected]').count(), 0);
    assert.equal(await log.locator('[autofocus]').count(), 0);
    assert.equal(await log.locator('[data-set-field="kg"]').first().getAttribute('data-ex'), id);
    assert.deepEqual((await readState()).sessions, replacement.sessions);
    await log.reload();
    await log.locator('.session-card').waitFor();
    assert.deepEqual((await readState()).sessions, replacement.sessions, 'Reload preserves imported history and IDs');
    await log.evaluate(() => navigator.serviceWorker.ready);
    await log.waitForFunction(() => navigator.serviceWorker.controller);
    await personal.setOffline(true);
    await log.reload();
    await log.locator('.session-card').waitFor();
    assert.deepEqual(errors, []);
    console.log('PASS: responsive navigation, native modal containment and focus recovery, routine persistence, auto-completion, drop sets, history, safe imports, rollback, reload and offline shell.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
