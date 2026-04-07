---
title: 2026-04-07-tracked-project-access-registry
type: source
created: 2026-04-07
updated: 2026-04-07
source_files:
  - raw/sources/2026-04-07-tracked-project-access-registry-notes.md
related:
  - wiki/analyses/cross-device-source-basis-policy.md
  - wiki/analyses/internal-wiki-operations-loop.md
  - wiki/overview.md
---

# Tracked project access registry

## What this source is

A derived note about how the currently tracked source projects are accessible across devices, based on a local survey of git state and remotes.

## Why it matters

This source explains why `Original workspace basis` lines sometimes act like strong source trails and sometimes act like local-only hints.
It also clarifies which parts of the broader system are actually portable today.

## Current registry

- `공개과정`: local folder only, not currently a git repository
- `청소년을 위한 말처방`: local folder only, not currently a git repository
- `제안서`: git repository with origin `https://github.com/acekaze/proposal.git`
- `교육설계`: local git repository with no origin remote currently configured
- `전종목`: local folder only, not currently a git repository

## Interpretation

- the wiki itself is the portable shared layer because it is already on GitHub
- `raw/sources/` inside the wiki are the most reliable cross-device evidence layer
- `Original workspace basis` remains useful for provenance, but it is not guaranteed to resolve outside the machine that holds those local folders

## Original workspace basis

- C:/코딩/공개과정
- C:/코딩/청소년을 위한 말처방
- C:/코딩/제안서
- C:/코딩/교육설계
- C:/코딩/전종목

## Related pages

- [cross-device-source-basis-policy](../analyses/cross-device-source-basis-policy.md)
- [internal-wiki-operations-loop](../analyses/internal-wiki-operations-loop.md)
- [overview](../overview.md)

## Raw source path

- raw/sources/2026-04-07-tracked-project-access-registry-notes.md
