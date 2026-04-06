---
title: wiki-ingest-query-lint-loop
type: concept
created: 2026-04-06
updated: 2026-04-06
source_files:
  - raw/sources/2026-04-06-karpathy-llm-wiki-gist-notes.md
related:
  - wiki/sources/2026-04-06-karpathy-llm-wiki.md
  - wiki/concepts/persistent-wiki-vs-rag.md
---

# Wiki ingest query lint loop

## Summary

The workspace should revolve around three recurring operations: ingest new sources, query the wiki, and lint the structure for quality.

## Definition

This loop turns the wiki into a maintained system instead of a pile of notes.

## Why it matters

Without the loop:

- sources accumulate without integration
- queries produce disposable answers
- the wiki drifts and loses coherence

## Supporting ideas

- ingest integrates new material into existing pages
- query uses the wiki as the primary knowledge layer
- lint repairs missing links, contradictions, and stale claims

## Tensions or caveats

- ingest should be selective enough to preserve quality
- query outputs should only be filed when reusable
- lint should prefer small fixes over destructive rewrites

## Related pages

- [2026-04-06-karpathy-llm-wiki](../sources/2026-04-06-karpathy-llm-wiki.md)
- [persistent-wiki-vs-rag](./persistent-wiki-vs-rag.md)

## Source basis

- `raw/sources/2026-04-06-karpathy-llm-wiki-gist-notes.md`
