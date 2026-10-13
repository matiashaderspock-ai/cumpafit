# Cumpafit shared development instructions

These instructions apply to Codex, ChatGPT Work, Grok Bot, and other contributors working on this repository.

## Source of truth and delivery

- The canonical application repository is https://github.com/matiashaderspock-ai/cumpafit.
- Production is https://matiashaderspock-ai.github.io/cumpafit/. The existing GitHub Pages build and deployment publishes the root files from `main`.
- The user installs this PWA on their iPhone Home Screen. Keep the Cumpafit production address and relative manifest start URL/scope (`./`) stable for future updates. The rename requires a new installation and JSON backup import; IndexedDB is `cumpafit`, version 1. Preserve compatibility with all version-1 JSON backups.
- Every completed application change must be committed and pushed to this repository. Integrate release changes into `main` through the permitted repository workflow, then verify the Pages deployment and live files. A local edit or an unmerged branch is not a delivered iPhone update.
- Report the commit, validation results, deployment status, and any remaining device check. Do not claim an iPhone check was performed from a desktop browser.

## Collaboration

- Read these instructions and fetch the latest remote state before starting work. Check for existing local edits, recent commits, and open pull requests that overlap the task.
- Use the current repository code. Older local folders, exports, and conversation attachments are historical references; do not copy them over newer changes.
- Preserve other contributors' work. Make focused commits; do not force-push, reset away changes, or overwrite concurrent commits.
- Use `codex/` for branches created by Codex unless the user supplies another name.
- Before pushing or integrating a release, fetch again and reconcile concurrent changes. Re-run relevant checks if reconciliation changes the code.
- If access or repository rules prevent publishing, retain the completed work and explain the exact blocker. Do not describe it as deployed.

## Application and data

- This is a static app with maintained runtime files at the repository root: `app.js`, `styles.css`, `index.html`, `sw.js`, `manifest.webmanifest`, and `assets/`. There is currently no package/build step.
- Workout data is stored in browser-local IndexedDB. Repository deployment updates application code; it does not synchronize workout records across devices.
- Preserve exercise IDs, user edits/photos, archived exercises, routines, sessions, and historical records. Never clear or recreate the database as an update mechanism.
- Keep data migrations backward compatible, including existing JSON backups. Validate persistence and migration when changing stored data.
- Reuse existing exercise IDs and illustration paths. Distinguish meaningful apparatus/position variants before adding exercises. If a maintained catalog/checker is added to this repository, use it before catalog changes.

## Release validation

- Run `node --check app.js`, `node --check sw.js`, and `node --test tests/*.test.cjs` for application changes, plus checks appropriate to the changed behavior.
- Review the affected UI and persistence behavior for functional changes.
- For changed cached resources, bump the service-worker `CACHE` version. Update the relevant asset query versions in both `index.html` and the `FILES` list in `sw.js`; keep them consistent and include new offline resources.
- Retain `.nojekyll` and relative paths for the GitHub Pages subdirectory.
- Verify that the Pages workflow succeeds for the released commit and that the production files contain the change.
- The app checks its service worker on startup and uses network-first requests. A running screen may retain old code until reopened; offline devices cannot receive a new release. Ask for an on-device close/reopen check when needed, and preserve any active workout.
