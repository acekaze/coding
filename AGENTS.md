# AGENTS.md

This file is the operating schema for `C:/코딩/llm-wiki-workspace`.

The purpose of this workspace is to maintain a persistent markdown wiki with an LLM.
Treat the wiki as the compiled knowledge layer that sits between chat and raw documents.

## Mission

Build and maintain a structured, interlinked markdown wiki from source materials over time.

The human is responsible for:

- choosing sources
- guiding emphasis
- asking questions
- reviewing important changes

The LLM is responsible for:

- reading sources
- summarizing
- cross-linking
- updating existing pages
- keeping the wiki coherent
- maintaining the index and log

## Layer model

There are three layers in this workspace.

### 1. Raw sources

Location:

- `raw/sources/`
- `raw/assets/`

Rules:

- raw files are immutable
- do not overwrite raw files
- do not rewrite a source just to make it easier to summarize
- if a cleaned or derived version is needed, create a new file instead

### 2. Wiki

Location:

- `wiki/`

Rules:

- this is the LLM-owned layer
- the LLM may create, rename, split, merge, and update wiki pages when justified
- every meaningful ingest should update multiple relevant pages, not just add one isolated summary
- preserve internal consistency and cross-links

### 3. Schema

Location:

- this `AGENTS.md`
- optional templates in `templates/`

Rules:

- use this file as the source of truth for page conventions and workflows
- if the workflow needs improvement, update this schema deliberately

## Page taxonomy

Use these folders consistently.

- `wiki/sources/`: one page per ingested source
- `wiki/entities/`: people, organizations, products, places, named things
- `wiki/concepts/`: ideas, frameworks, themes, methods
- `wiki/analyses/`: reusable answers, comparisons, synthesis pages
- `wiki/overview.md`: top-level orientation page
- `wiki/index.md`: catalog of pages
- `wiki/log.md`: append-only timeline

## Naming conventions

- prefer lowercase kebab-case filenames
- keep names stable unless there is a clear reason to rename
- use descriptive names, not opaque IDs

Examples:

- `wiki/sources/2026-04-06-karpathy-llm-wiki.md`
- `wiki/entities/andrej-karpathy.md`
- `wiki/concepts/persistent-wiki-vs-rag.md`
- `wiki/analyses/why-this-pattern-works.md`

## Page structure

Every substantive wiki page should usually include:

1. title
2. short summary
3. main body
4. links to related pages
5. source basis

Use light YAML frontmatter when helpful.

Recommended fields:

```yaml
---
title: persistent-wiki-vs-rag
type: concept
created: 2026-04-06
updated: 2026-04-06
source_files:
  - raw/sources/2026-04-06-karpathy-llm-wiki.md
related:
  - wiki/entities/andrej-karpathy.md
  - wiki/concepts/wiki-ingest-loop.md
---
```

Do not add frontmatter just for decoration.
Add it when it improves traceability and navigation.

## Citation rule

Do not make unsupported claims in the wiki.

When adding or revising important claims:

- cite the relevant raw source file
- cite the relevant source summary page
- distinguish direct source claims from later synthesis

If a claim is uncertain or interpretive, mark it clearly instead of writing it as fact.

## Ingest workflow

When asked to ingest a new source:

1. read the target file in `raw/sources/`
2. identify what it is about
3. check whether related wiki pages already exist
4. create or update a source page in `wiki/sources/`
5. update relevant entity pages
6. update relevant concept pages
7. update `wiki/overview.md` if the source changes the big picture
8. update `wiki/index.md`
9. append a new entry to `wiki/log.md`

Do not create a disconnected source summary and stop there.
Ingest means integration into the existing wiki.

## Query workflow

When asked a question:

1. read `wiki/index.md` first
2. identify relevant wiki pages
3. answer from the wiki before falling back to raw files
4. cite the pages used
5. if the answer is broadly reusable, save it in `wiki/analyses/`
6. update `wiki/index.md` and `wiki/log.md` if a new analysis page is created

## Lint workflow

When asked to lint or health-check the wiki, look for:

- orphan pages
- duplicate pages with overlapping scope
- missing links
- contradictions
- stale claims
- large pages that should be split
- repeated ideas that deserve a canonical concept page
- important entities or concepts mentioned but not represented as pages

If you find issues, propose or apply small fixes safely.

## Update behavior

- prefer incremental edits over large rewrites
- preserve useful page history and structure
- when merging pages, keep the stronger page and absorb the weaker one
- when splitting pages, create clear links between parent and child topics

## Index contract

`wiki/index.md` is the navigation entrypoint.

It should contain:

- major categories
- links to pages
- one-line summaries

It does not need to contain every detail.
Its job is to help humans and LLMs find the right pages quickly.

## Log contract

`wiki/log.md` is append-only.

Each entry should start with a stable heading format:

```text
## [YYYY-MM-DD] ingest | short title
## [YYYY-MM-DD] query | short title
## [YYYY-MM-DD] lint | short title
```

Each entry should briefly record:

- what happened
- which files changed
- what the main outcome was

## Safety rules

- never modify files in `raw/`
- never invent citations
- never silently drop conflicting evidence
- do not claim completeness unless the source coverage justifies it
- if the wiki has gaps, say so and create follow-up pages or notes

## Completion rule

A task is not complete until you state:

1. what changed
2. what pages were added or updated
3. what you verified
4. what is still uncertain or missing
