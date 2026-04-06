---
title: persistent-wiki-vs-rag
type: concept
created: 2026-04-06
updated: 2026-04-06
source_files:
  - raw/sources/2026-04-06-karpathy-llm-wiki-gist-notes.md
related:
  - wiki/sources/2026-04-06-karpathy-llm-wiki.md
  - wiki/concepts/wiki-ingest-query-lint-loop.md
---

# Persistent wiki vs RAG

## Summary

The key distinction is whether knowledge is repeatedly reconstructed from raw documents at query time or incrementally compiled into a maintained wiki over time.

## Definition

A persistent wiki workflow uses an LLM to continuously update markdown pages as new material arrives.
RAG-style workflows often retrieve raw chunks on demand and synthesize an answer again for each query.

## Why it matters

This difference changes the unit of work:

- in RAG-heavy workflows, the answer is often the artifact
- in persistent-wiki workflows, the maintained wiki is the artifact

## Supporting ideas

- repeated synthesis effort should be amortized into pages that persist
- cross-links and contradictions should already be captured in the wiki
- useful answers should become new reusable pages

## Tensions or caveats

- the wiki still depends on disciplined maintenance
- unsupported claims can spread if citation discipline is weak
- search tooling may still be needed as the wiki grows

## Related pages

- [2026-04-06-karpathy-llm-wiki](../sources/2026-04-06-karpathy-llm-wiki.md)
- [wiki-ingest-query-lint-loop](./wiki-ingest-query-lint-loop.md)

## Source basis

- `raw/sources/2026-04-06-karpathy-llm-wiki-gist-notes.md`
