# Engineering and UI/UX review, 31 October 2026

Baseline: `d541317` on `main`. Scope: application initialization, IndexedDB writes, backup import/export, session creation and set completion, drop sets, routines, catalog/search, history summaries, dialogs, responsive styling, demo isolation, and service-worker updates. This is a focused code and interaction review, not a security certification or physical-iPhone performance benchmark.

## Findings and changes

| Priority | Finding | Outcome |
| --- | --- | --- |
| High | The importer accepted arrays as session dictionaries, malformed exercises/sets and duplicate IDs. A confirmed import could replace usable records with data that broke rendering. | Validate the complete version-1 structure before confirmation or writes. Preserve unfinished measurements, optional routines, photos, archived/favorite flags, and unavailable exercise history. |
| High | Import replaced the active in-memory workout before its IndexedDB transaction committed. A failed replacement could then be saved by a later edit. | Flush the existing workout first; stage the replacement and switch active state only after successful commit. Block concurrent UI edits during replacement. Distinguish invalid-file errors from storage failures. |
| High | Imported exercise/set IDs were interpolated into HTML attributes without escaping. | Escape those IDs at each rendering boundary, including catalog/session buttons, input attributes and exercise forms. Reject prototype keys that cannot safely participate in object-backed dictionaries. |
| Medium | Shift+Tab from the routine-name field reached background navigation even though the sheet claimed modal semantics. Reproduced in the production English demo. | Use native modal dialog containment and recover the invoking control after saves re-render it. Escape and backdrop dismissal share cleanup. |
| Low | Long error notifications could extend beyond a phone viewport. | Bound toast width and allow wrapping. |

The native dialog uses browser-provided focus containment instead of adding a custom focus-trap implementation. No database version or backup schema change is introduced. App-shell assets advance to v46; the separate illustration cache remains unchanged.

## Verification

- Baseline: 95/95 Node tests.
- Regression reproduction before fixes: 13 failures out of 14 new backup-safety checks, including active-state loss on failed import and unescaped IDs.
- After fixes: 109/109 Node tests; `node --check app.js`, `node --check sw.js`, and `node scripts/update-image-manifest.cjs --check` pass.
- `tests/browser-engineering-review.cjs` covers 320/390/768/1280 px navigation, native modal focus, routine save/reload, session auto-completion, drop sets, read-only history, malformed imports, transaction-abort recovery, escaped IDs, persistence and an offline reload. The required `test` CI job runs it and retains representative screenshots.
- Local browser execution was attempted but this executor denies Chromium's required socket operation. Automated browser outcomes must therefore be read from the linked PR's CI, not inferred from the Node results.
- Production demo was inspected with the available interactive cloud browser before changes. Final CI and release status are recorded in the PR and delivery message.

## Remaining risks and follow-up

- Concurrent normal tabs can still write stale whole-state snapshots. Unlike gástalo, CumpaFit has no revision conflict check. A separate change should add atomic revision checks with two-tab regression coverage before advertising multi-tab editing.
- Exercise and routine forms mutate active state before deferred/awaited saves complete. Failed saves are reported, but these forms do not provide a complete rollback transaction model. The import replacement path is now protected explicitly.
- Photo-heavy datasets still serialize the whole state. Measure real datasets before changing persistence architecture; no speedup is claimed here.
- Some secondary text is small, and exercise names deliberately remain on one horizontally scrollable line. Reassess with the installed iPhone app and VoiceOver rather than changing that established layout speculatively.
- Physical iPhone keyboard, safe-area, suspension, VoiceOver and offline-update verification remains a device check. Browser emulation cannot establish those results.
