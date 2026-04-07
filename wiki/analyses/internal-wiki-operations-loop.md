---
title: internal-wiki-operations-loop
type: analysis
created: 2026-04-06
updated: 2026-04-06
source_files:
  - raw/sources/2026-04-06-wiki-operations-model-notes.md
  - raw/sources/2026-04-06-first-launch-wiki-routine-notes.md
related:
  - wiki/overview.md
  - wiki/index.md
  - wiki/log.md
  - wiki/analyses/current-workstream-map-2026-04.md
  - wiki/analyses/cross-device-source-basis-policy.md
  - wiki/analyses/cross-device-request-queue-pattern.md
  - wiki/analyses/requested-source-handoff-pattern.md
  - wiki/sources/2026-04-06-first-launch-wiki-routine.md
  - wiki/sources/2026-04-06-automated-codex-wiki-sync.md
  - wiki/sources/2026-04-06-codex-host-wake-timer.md
  - wiki/sources/2026-04-07-windows-led-codex-refresh.md
  - wiki/sources/2026-04-07-tracked-project-access-registry.md
  - wiki/sources/2026-04-07-file-based-request-queue.md
  - wiki/sources/2026-04-07-requested-source-handoff-workflow.md
---

# Internal wiki operations loop

## Question

How should this wiki actually be used as an internal tool, day to day?

## Short answer

Use it as an internal control tower, not as a second copy of every project.
Either run the loop when Codex is first opened each morning, or use one designated automation host to run the loop automatically and publish safe changes back to GitHub.

## Recommended loop

### First launch each morning

- read `wiki/index.md`
- skim `wiki/overview.md`
- check the latest entries in `wiki/log.md`
- scan the tracked projects for materially changed documents
- ingest only the changes that affect direction, current state, or reusable language

### Automatic host mode

- use one primary machine as the only automation host
- wake the host at 08:50, then refresh Codex automatically at 08:55 before the morning sync window
- keep the morning automation active so it can update and publish safe wiki changes
- let other devices consume the pushed state instead of competing to auto-publish

### During the day

- save major decisions before they disappear into chat or draft files
- turn reusable answers into `analysis` pages
- update existing pages when the baseline changes
- if a source path matters on another machine, check the tracked-project registry before assuming the original folder is portable
- if another device needs original text from a local-only folder, use a tracked source handoff instead of giving a disposable chat-only excerpt
- if another device has a durable ask, prefer a request file in `requests/open/` over hoping the chat trail will be enough

### Weekly

- lint for duplicates, drift, stale claims, and missing links
- create new concept pages only when a pattern truly appears across multiple projects

## Tracked projects

- 공개과정
- 청소년을 위한 말처방
- 제안서
- 교육설계
- 전종목

## Interpretation

The wiki becomes useful when it reduces restart cost.
Its job is not completeness for its own sake.
Its job is to help the next decision begin with orientation instead of re-discovery.

## Related pages

- [current-workstream-map-2026-04](./current-workstream-map-2026-04.md)
- [cross-device-source-basis-policy](./cross-device-source-basis-policy.md)
- [cross-device-request-queue-pattern](./cross-device-request-queue-pattern.md)
- [requested-source-handoff-pattern](./requested-source-handoff-pattern.md)
- [overview](../overview.md)
- [index](../index.md)
- [log](../log.md)
