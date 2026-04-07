---
title: 2026-04-07-file-based-request-queue
type: source
created: 2026-04-07
updated: 2026-04-07
source_files:
  - raw/sources/2026-04-07-file-based-request-queue-notes.md
related:
  - wiki/analyses/cross-device-request-queue-pattern.md
  - wiki/analyses/internal-wiki-operations-loop.md
  - wiki/analyses/requested-source-handoff-pattern.md
---

# File-based request queue

## What this source is

A derived note describing the decision to use markdown request files inside the repository as the main cross-device coordination layer.

## Why it matters

This source gives the wiki a durable request inbox that survives across devices, restarts, and chat sessions.

## Key points

- requests live in `requests/open/`
- active work moves to `requests/in-progress/`
- completed work moves to `requests/done/`
- request files should link to result files or commits before closure
- the queue works especially well for source handoffs, wiki updates, and reusable analyses

## Related pages

- [cross-device-request-queue-pattern](../analyses/cross-device-request-queue-pattern.md)
- [internal-wiki-operations-loop](../analyses/internal-wiki-operations-loop.md)
- [requested-source-handoff-pattern](../analyses/requested-source-handoff-pattern.md)

## Raw source path

- raw/sources/2026-04-07-file-based-request-queue-notes.md
