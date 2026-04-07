---
title: 2026-04-07-requested-source-handoff-workflow
type: source
created: 2026-04-07
updated: 2026-04-07
source_files:
  - raw/sources/2026-04-07-requested-source-handoff-workflow-notes.md
related:
  - wiki/analyses/requested-source-handoff-pattern.md
  - wiki/analyses/cross-device-source-basis-policy.md
  - wiki/analyses/internal-wiki-operations-loop.md
---

# Requested source handoff workflow

## What this source is

A derived note describing how the host machine should respond when another device asks for original text from a tracked project that is not directly shared there.

## Why it matters

This source formalizes a bridge between the portable wiki and local-only project folders.
It turns a one-off "please show me the source" request into a reusable artifact in the shared repository.

## Key points

- another device can request original text from a tracked source project
- the host machine should answer by creating a new raw note in `raw/sources/`
- that raw note should preserve provenance such as the original path and handoff date
- the resulting handoff can then be linked from a source page or analysis page so future devices do not need to ask again

## Handoff formats

- full copy: for short original documents that are safe and useful to preserve as-is
- excerpt pack: for long documents where only selected passages are needed
- structured source notes: for cases where the goal is evidence capture rather than verbatim reuse

## Related pages

- [requested-source-handoff-pattern](../analyses/requested-source-handoff-pattern.md)
- [cross-device-source-basis-policy](../analyses/cross-device-source-basis-policy.md)
- [internal-wiki-operations-loop](../analyses/internal-wiki-operations-loop.md)

## Raw source path

- raw/sources/2026-04-07-requested-source-handoff-workflow-notes.md
