---
title: 2026-04-07-windows-led-codex-refresh
type: source
created: 2026-04-07
updated: 2026-04-07
source_files:
  - raw/sources/2026-04-07-windows-led-codex-refresh-notes.md
related:
  - wiki/sources/2026-04-06-automated-codex-wiki-sync.md
  - wiki/sources/2026-04-06-codex-host-wake-timer.md
  - wiki/analyses/internal-wiki-operations-loop.md
  - wiki/overview.md
  - wiki/index.md
---

# Windows-led Codex refresh

## What this source is

An internal operating decision about making the 08:55 Windows task refresh Codex instead of only opening it.

## Short answer

Windows should restart Codex at 08:55 if it is already running, so the 09:00 automation window begins from a fresh app state.

## Why this matters

The host wake and launch tasks can succeed while the Codex automation still fails to fire if the app stays open in a stale state from the previous day.

## Related pages

- [automated-codex-wiki-sync](./2026-04-06-automated-codex-wiki-sync.md)
- [codex-host-wake-timer](./2026-04-06-codex-host-wake-timer.md)
- [internal-wiki-operations-loop](../analyses/internal-wiki-operations-loop.md)
- [overview](../overview.md)
- [index](../index.md)
