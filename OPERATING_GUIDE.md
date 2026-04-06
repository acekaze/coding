# Operating Guide

This file explains how to use `C:/코딩/llm-wiki-workspace` as an internal operating wiki.

## Purpose

This wiki is not the place where projects get executed.
It is the place where the current state of the work becomes legible.

Use it as:

- internal memory
- portfolio map
- decision tracker
- contradiction detector
- reuse layer for language, structure, and concepts

Do not use it as:

- the primary drafting space for every project
- a dump of every file in every folder
- a replacement for the source project folders

## Tracked projects

The current default tracked set is:

- `C:/코딩/공개과정`
- `C:/코딩/청소년을 위한 말처방`
- `C:/코딩/제안서`
- `C:/코딩/교육설계`
- `C:/코딩/전종목`

These should be treated as the default first-launch scan set unless a more urgent project is added.

## Layer rule

Keep the layers distinct.

- source project folders: actual execution and original artifacts
- `raw/sources/`: immutable notes or captured source material for the wiki
- `wiki/`: maintained interpretation, structure, synthesis, and navigation

If a source project changes, do not rewrite the project from inside this wiki.
Instead, ingest the meaningful change and update the wiki pages that depend on it.

## What counts as a meaningful update

Not every file change deserves an ingest.

Usually ingest when one of these is true:

- a new document changes positioning, scope, pricing, timeline, or audience
- a draft becomes effectively the new working baseline
- a contradiction appears between project documents
- a reusable explanation, framework, or pattern emerges
- a project gains a new public-facing page, proposal, guide, or structure
- a major decision is made or reversed

Usually skip or defer when:

- the change is cosmetic
- the file is a transient scratchpad
- the file duplicates an already ingested idea without changing the state
- the source is too noisy to summarize safely yet

## Minimum tracking rule

For each active project, try to maintain at least:

1. one `source` page describing the current evidence
2. one `entity` page describing what that project is in the overall map

Add a `concept` page when the same idea appears in multiple projects.
Add an `analysis` page when the answer will be reused later.

## First-launch morning loop

Run this once when you first open Codex for the day, before deep work.
Target length: 10-20 minutes on normal days.

This is a startup routine, not a fixed-time automation.

### Step 1. Re-orient

- open `wiki/index.md`
- open `wiki/overview.md`
- open `wiki/log.md`
- skim the last 1-3 log entries

Goal:

- remember the current map
- remember what changed recently
- identify open contradictions or stale areas

### Step 2. Scan tracked projects

Look through the tracked project folders for:

- new files
- recently modified key documents
- documents that look like new baselines
- anything that changes decisions, direction, or language

You do not need to read everything.
Read only the files likely to change the wiki.

### Step 3. Ingest only material changes

For each meaningful change:

1. create a new raw note if needed
2. update the relevant `wiki/sources/` page
3. update linked `entity`, `concept`, or `analysis` pages
4. update `wiki/index.md` if navigation changed
5. append `wiki/log.md`

### Step 4. Leave the map cleaner than you found it

Before finishing the first-launch loop:

- fix obvious stale claims
- add missing links if they are clear
- surface unresolved contradictions instead of hiding them

### Step 5. Refresh the viewer

If pages were added, renamed, or substantially updated:

```text
python scripts/generate_wiki_manifest.py
```

## During-work loop

Use the wiki during the day in small increments.

When a project changes materially:

- ingest the change the same day if possible
- do not wait for the whole week if the change affects current decisions

When a reusable answer appears in chat:

- save it under `wiki/analyses/`
- do not lose it in conversation history

When wording becomes canonical:

- store that explanation where future you can find it again

## End-of-day loop

This can be very short.

- add a log entry if something major changed
- update any page that would be misleading tomorrow morning
- leave open questions visible instead of relying on memory

## Weekly review

Run a deeper pass once a week.
Target length: 20-40 minutes.

Use it to:

- lint for duplicates, drift, and missing links
- collapse overlapping pages
- split overloaded pages
- mark stale assumptions
- decide whether a new concept page is now justified

## Good operating habits

- prefer current working baselines over speculative early drafts
- preserve uncertainty explicitly
- treat contradictions as useful signals
- keep project pages short enough to scan
- keep the wiki useful for tomorrow, not perfect for all time

## Bad operating habits

- ingesting every minor scratch file
- rewriting history so uncertainty disappears
- copying whole projects into the wiki
- letting source pages pile up without updating entities and concepts
- using the wiki as a decorative archive instead of a working tool

## Recommended command habit

After wiki changes:

```text
python scripts/generate_wiki_manifest.py
```

For local viewing:

```text
python -m http.server 8000
```

## Practical success test

This wiki is working if, before starting a new proposal, course, or writing task, you can answer:

- what is the current state
- what changed recently
- what is still unresolved
- what language or structure can be reused

without re-reading every project folder from scratch.
