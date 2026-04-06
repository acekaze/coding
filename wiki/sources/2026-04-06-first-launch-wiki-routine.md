---
title: 2026-04-06-first-launch-wiki-routine
type: source
created: 2026-04-06
updated: 2026-04-06
source_files:
  - raw/sources/2026-04-06-first-launch-wiki-routine-notes.md
related:
  - wiki/analyses/internal-wiki-operations-loop.md
  - wiki/overview.md
  - wiki/index.md
---

# First-launch wiki routine

## What this source is

An internal operating decision about how to run the wiki each morning.

## Short answer

The morning loop should happen when Codex is first opened for the day, not on a strict 09:00 timer.

## Why that changed

The current automation model is local to the Codex desktop environment, so a strict scheduled run depends on the app or machine being available at that exact time.

## Implication

The wiki should be treated like a morning startup ritual:

- re-orient on `wiki/index.md`, `wiki/overview.md`, and recent `wiki/log.md` entries
- scan the tracked projects for materially changed documents
- ingest only the changes that affect decisions, baselines, or reusable language

## Related pages

- [internal-wiki-operations-loop](../analyses/internal-wiki-operations-loop.md)
- [overview](../overview.md)
- [index](../index.md)
