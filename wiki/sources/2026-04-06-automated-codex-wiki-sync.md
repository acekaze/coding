---
title: 2026-04-06-automated-codex-wiki-sync
type: source
created: 2026-04-06
updated: 2026-04-06
source_files:
  - raw/sources/2026-04-06-automated-codex-wiki-sync-notes.md
related:
  - wiki/analyses/internal-wiki-operations-loop.md
  - wiki/sources/2026-04-06-first-launch-wiki-routine.md
  - wiki/overview.md
  - wiki/index.md
---

# Automated Codex wiki sync

## What this source is

An internal operating decision for turning the wiki loop into a mostly automatic daily sync.

## Short answer

The primary machine should open Codex automatically and keep the morning wiki automation active, while GitHub remains the canonical sync point for every device.

## Automation pattern

- Windows opens Codex at logon
- Windows opens Codex again shortly before the morning wiki sync window
- Codex runs the morning wiki automation
- the automation updates the wiki, refreshes the manifest, and pushes safe wiki-only changes to `origin/main`

## Shared-use rule

Only one device should run the automatic sync.
Other devices should use GitHub and the shared viewer as consumers or manual editing clients.

## Related pages

- [first-launch-wiki-routine](./2026-04-06-first-launch-wiki-routine.md)
- [internal-wiki-operations-loop](../analyses/internal-wiki-operations-loop.md)
- [overview](../overview.md)
- [index](../index.md)
