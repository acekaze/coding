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

## Morning operating modes

There are two supported ways to run the morning loop.

### Automatic host mode

Use one primary machine as the automation host.

Recommended pattern:

- Windows wakes the PC at 08:50
- Windows opens Codex at logon
- Windows refreshes Codex at 08:55, restarting it first if it is already open
- the Codex `wiki-morning-loop` automation runs at 09:00
- the automation updates the wiki, regenerates the manifest, and pushes safe wiki-only changes to `origin/main`

Use [scripts/setup-codex-wiki-automation.ps1](/C:/코딩/llm-wiki-workspace/scripts/setup-codex-wiki-automation.ps1) on the host machine to configure this.

Important:

- only one machine should run this automation against the repository
- other devices should pull from GitHub and use the shared viewer or make manual edits
- this wake pattern targets sleep or hibernate, not guaranteed full power-on from complete shutdown
- the 08:55 refresh exists because a stale already-open Codex app may not reliably fire the 09:00 automation

### Manual fallback mode

Run this once when you first open Codex for the day, before deep work.
Target length: 10-20 minutes on normal days.

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

## Shared-use model

Use this split:

- GitHub private repo: source of truth and cross-device sync
- one automation host machine: daily automatic sync
- other devices: pull, inspect, query, and manually improve
- static host such as Vercel: shared browser view of the latest pushed state
- `requests/`: shared request queue for cross-device asks that should survive beyond chat

## Other-device quick start

Use this when setting up another laptop or PC for the same wiki.

Clone:

```text
git clone https://github.com/acekaze/llm-wiki-workspace.git
cd llm-wiki-workspace
```

Before working:

```text
git pull origin main
```

For local browser viewing:

```text
python -m http.server 8000
```

Then open `http://localhost:8000`.

Use this rule:

- host machine: automatic morning sync
- other devices: pull first, then read or make manual edits
- if a non-host device edits the wiki, keep the change small and push it back promptly so the shared state stays coherent
- if a non-host device needs original text from a local-only tracked project, ask the host machine for a source handoff and capture it in `raw/sources/` instead of leaving it in chat only
- if a request should be durable and visible across devices, write it as a markdown file in `requests/open/`

## Requested source handoff

Use this when another device needs the original text behind a wiki claim but cannot open the underlying local project folder.

Recommended flow:

1. identify the exact source question or file path needed
2. on the host machine, open the original local file
3. create a new immutable raw note in `raw/sources/`
4. include provenance such as the original path, handoff date, and whether the content is a full copy, excerpt pack, or structured notes
5. update the linked source or analysis page in `wiki/`
6. commit and push so the handoff becomes reusable on every device

Use [prompts/request-source-handoff.md](/C:/코딩/llm-wiki-workspace/prompts/request-source-handoff.md) as the standard starter.
For a short copy-paste message from another device, use [prompts/source-handoff-request-template.md](/C:/코딩/llm-wiki-workspace/prompts/source-handoff-request-template.md).

## File-based request queue

Use this when a request should survive beyond one chat window.

Structure:

- `requests/open/`: new requests waiting for pickup
- `requests/in-progress/`: currently being handled
- `requests/done/`: completed requests with result links
- `requests/templates/request-template.md`: starter format

Recommended flow:

1. create a request file in `requests/open/`
2. when work starts, move it to `requests/in-progress/`
3. complete the work and record result paths or commit hash
4. move it to `requests/done/`

Use [prompts/process-request-queue.md](/C:/코딩/llm-wiki-workspace/prompts/process-request-queue.md) when the host machine should process queued requests systematically.

## Practical success test

This wiki is working if, before starting a new proposal, course, or writing task, you can answer:

- what is the current state
- what changed recently
- what is still unresolved
- what language or structure can be reused

without re-reading every project folder from scratch.
