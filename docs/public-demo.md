# Public demo

Open `https://matiashaderspock-ai.github.io/cumpafit/?demo=1` after this release
has been manually merged to `main` and GitHub Pages has deployed it. Normal
visits to `/cumpafit/` keep the existing app behavior.

The demo uses the separate IndexedDB database `cumpafit-demo`, version 1.
It never opens the normal `cumpafit` database. The URL flag is not stored in
cookies or local storage, so opening the normal URL always selects normal data.
Demo edits stay in that browser until reset or browser storage is cleared.

The first visit seeds five routines organized through the week, twelve finished
workouts over the preceding 28 days, and a partially completed session for today.
The sample covers increasing strength loads, bodyweight exercises, Drop Sets,
walking speed, cycling distance, favorites, calendar summaries, weight history,
and personal bests. The current session shows two of four planned exercises
completed; the app does not have a separate goal system.

Every demo screen, including dialogs, retains the English/Spanish banner and
the page title includes `DEMO`. **Reset demo / Reiniciar demo** clears all records
in the demo's sole object store and writes a fresh seed in one transaction.
Pending writes are drained and pending autosaves are canceled before reset.
A failed transaction keeps the previous data and allows retry.

Backup export/import and photo input are hidden and guarded at their entry
points. Demo startup does not register a service worker or request background
image downloads. A demo-only Content Security Policy blocks connections
(`connect-src 'none'`) and form submissions (`form-action 'none'`). Loading the
page, scripts, stylesheet, icons, and visible exercise illustrations still uses
ordinary static asset GET requests. The app currently has no account sync API.
The normal manifest is removed in demo mode so its installation start URL cannot
send visitors to the normal app. If the early demo safety script cannot load,
the app refuses to open storage for a demo URL.

Validation:

```sh
node --check app.js
node --check demo-mode.js
node --check sw.js
node --test tests/*.test.cjs
node scripts/update-image-manifest.cjs --check
```

`tests/demo-mode.test.cjs` covers database isolation, first-open seeding and
reload, normal startup, missing safety script, month/year/leap-year boundaries,
zero network/transfer calls, reset persistence, and aborted-reset recovery.
Browser validation with actual IndexedDB also checked existing normal data
before/after demo reset, edit persistence, all four tabs and dialogs, a blocked
POST probe, and banner layout at 320, 390, and 1440 CSS pixels. This does not
replace an on-device iPhone check.

This release bumps the app-shell cache and asset URLs to version 44, including
the new safety script. The exercise image cache stays `cumpafit-images-v1`.
