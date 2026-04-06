# Andrej Karpathy - LLM Wiki notes

- source type: gist notes
- author: Andrej Karpathy
- source url: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- observed date: 2026-04-06

## Core idea

The pattern is to put a persistent markdown wiki between the human and the raw source documents.

Instead of re-deriving an answer from uploaded documents every time, the LLM incrementally builds and maintains the wiki over time.
The wiki becomes a compounding artifact.

## Contrast with standard RAG-style workflows

- standard document upload and retrieval systems often rediscover the same information on every query
- cross-document synthesis has to be recreated repeatedly
- knowledge does not naturally accumulate into a maintained artifact

## Proposed architecture

There are three layers:

1. raw sources that remain immutable
2. a wiki of LLM-maintained markdown files
3. a schema or operating document that tells the LLM how to maintain the wiki

## Main operations

### Ingest

When a new source arrives, the LLM should do more than index it.
It should read it, summarize it, update relevant pages, and integrate new evidence into the existing wiki.

### Query

Questions should primarily be answered from the wiki.
Useful answers can themselves become reusable wiki pages.

### Lint

The LLM should periodically inspect the wiki for contradictions, stale claims, orphan pages, missing links, and important gaps.

## Index and log

Two files are especially important:

- `index.md` as the navigation catalog
- `log.md` as the chronological record of ingest, query, and maintenance activity

## Tooling posture

The idea starts simple.
Markdown files plus a disciplined operating schema are enough at small to moderate scale.

Search tooling can be added later if the wiki grows.

## Practical notes

- Obsidian is useful for browsing the wiki and graph view
- the wiki can simply be a git repository of markdown files
- humans focus on source selection, direction, and interpretation
- the LLM focuses on maintenance, summarization, updating, and cross-linking
