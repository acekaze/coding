---
title: 2026-04-06-codex-host-wake-timer
type: source
created: 2026-04-06
updated: 2026-04-06
source_files:
  - raw/sources/2026-04-06-codex-host-wake-timer-notes.md
related:
  - wiki/sources/2026-04-06-automated-codex-wiki-sync.md
  - wiki/analyses/internal-wiki-operations-loop.md
  - wiki/overview.md
  - wiki/index.md
---

# Codex host wake timer

## What this source is

An internal operating decision for waking the primary Codex host before the morning wiki sync.

## Short answer

The host should wake at 08:50, open Codex at 08:55, and let the wiki automation run at 09:00.

## Scope

This is a sleep-or-hibernate wake pattern.
It is not the same as guaranteed power-on from a complete shutdown.

## Related pages

- [automated-codex-wiki-sync](./2026-04-06-automated-codex-wiki-sync.md)
- [internal-wiki-operations-loop](../analyses/internal-wiki-operations-loop.md)
- [overview](../overview.md)
- [index](../index.md)
