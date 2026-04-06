---
title: 2026-04-06-karpathy-llm-wiki
type: source
created: 2026-04-06
updated: 2026-04-06
source_files:
  - raw/sources/2026-04-06-karpathy-llm-wiki-gist-notes.md
related:
  - wiki/entities/andrej-karpathy.md
  - wiki/concepts/persistent-wiki-vs-rag.md
  - wiki/concepts/wiki-ingest-query-lint-loop.md
---

# Karpathy LLM Wiki gist

## What this source is

A note derived from Andrej Karpathy's 2026 gist describing an LLM-maintained wiki as a persistent knowledge layer.

## Why it matters

This source defines the operating pattern that this workspace is based on.
It gives the conceptual model, the three-layer architecture, and the core ingest/query/lint loop.

## Key points

- a persistent wiki compounds knowledge over time
- raw sources should remain immutable
- the LLM should maintain the wiki, not just answer from raw documents
- the wiki should be updated during ingest, not only searched during query
- useful query outputs can be saved back into the wiki
- `index.md` and `log.md` are key control files

## Related entities

- [andrej-karpathy](../entities/andrej-karpathy.md)

## Related concepts

- [persistent-wiki-vs-rag](../concepts/persistent-wiki-vs-rag.md)
- [wiki-ingest-query-lint-loop](../concepts/wiki-ingest-query-lint-loop.md)

## Raw source path

- `raw/sources/2026-04-06-karpathy-llm-wiki-gist-notes.md`
