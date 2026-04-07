# Tracked project access registry notes

- source type: local workspace survey
- workspace path: C:/코딩
- observed date: 2026-04-07
- survey scope:
  - C:/코딩/공개과정
  - C:/코딩/청소년을 위한 말처방
  - C:/코딩/제안서
  - C:/코딩/교육설계
  - C:/코딩/전종목

## Core idea

The wiki is cross-device because `llm-wiki-workspace` is on GitHub, but the projects cited in `Original workspace basis` are not equally portable.
Some are local-only folders, some are local git repos without a remote, and one currently has a GitHub origin.

## Main evidence

- `C:/코딩/제안서` is a git repository with origin `https://github.com/acekaze/proposal.git`
- `C:/코딩/교육설계` is a git repository but currently has no `origin` remote configured
- `C:/코딩/공개과정` is not currently a git repository
- `C:/코딩/청소년을 위한 말처방` is not currently a git repository
- `C:/코딩/전종목` is not currently a git repository

## Interpretation

- `raw/sources/` inside this wiki should be treated as the portable minimum evidence layer
- `Original workspace basis` lines are still useful as provenance hints, but they are not guaranteed to open on another device
- if cross-device verification of a source project matters, that project needs either a shared git remote or a synchronized local copy on the other machine

## Why this matters in the broader corpus

This note clarifies the boundary between the wiki as a shared interpretation layer and the underlying project folders as unevenly shared execution layers.
It also gives a stable reference for future decisions about which projects need their own remotes.
