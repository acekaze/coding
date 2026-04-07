---
title: cross-device-request-queue-pattern
type: analysis
created: 2026-04-07
updated: 2026-04-07
source_files:
  - raw/sources/2026-04-07-file-based-request-queue-notes.md
related:
  - wiki/sources/2026-04-07-file-based-request-queue.md
  - wiki/analyses/requested-source-handoff-pattern.md
  - wiki/analyses/internal-wiki-operations-loop.md
---

# Cross-device request queue pattern

## Question

How should multiple PCs or Macs coordinate requests around this wiki without relying only on chat?

## Short answer

Use chat for the interface, but use repo files for the queue.
Requests should be markdown files committed into `requests/`.

## Recommended pattern

1. a device creates a request file in `requests/open/`
2. the host or another capable device moves it to `requests/in-progress/`
3. the work is completed through source handoff, wiki update, analysis, or ops change
4. the request file is updated with result paths and moved to `requests/done/`
5. the result is committed and pushed so every device can see the same state

## Why this works

- requests are durable
- status is visible without searching old chat
- results stay linked to the original ask
- the queue can handle both wiki edits and local-only source retrieval

## Best-fit requests

- source handoff
- update this page
- ingest this new document
- produce a reusable analysis
- perform a small operating change

## Avoid

- giant ambiguous requests
- unrelated bundles of work
- using `open/` as a random scratchpad

## Related pages

- [2026-04-07-file-based-request-queue](../sources/2026-04-07-file-based-request-queue.md)
- [requested-source-handoff-pattern](./requested-source-handoff-pattern.md)
- [internal-wiki-operations-loop](./internal-wiki-operations-loop.md)
