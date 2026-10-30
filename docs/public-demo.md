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

Demo mode displays English navigation, labels, notes, dialogs, dates, numbers,
exercise equipment, and sample routine names. Every screen retains the
English-only warning and the page title includes `DEMO`. The language override
is limited to `?demo=1`; normal visits keep their existing Spanish interface.
Canonical exercise IDs and muscle-group storage keys are unchanged. Existing
demo samples receive English display labels without reseeding or rewriting
visitor edits.

**Reset demo** clears all records
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
zero network/transfer calls, reset persistence, aborted-reset recovery, English
seed content and UI, old-demo display compatibility, and unchanged normal UI.
Browser validation with actual IndexedDB checked unchanged normal records
before/after demo edits and reset, edit persistence after reload, English text
and accessible labels in all four tabs and dialogs, English search and muscle
group selection, zero demo transfer calls, normal Spanish UI after leaving the
demo, and banner layout at 320, 390, and 1440 CSS pixels. Normal-mode rendering
was also compared against the previous version across fourteen outputs. These
checks do not replace an on-device iPhone check.

This release bumps the app-shell cache and asset URLs to version 45, including
the demo safety script. The exercise image cache stays `cumpafit-images-v1`.
