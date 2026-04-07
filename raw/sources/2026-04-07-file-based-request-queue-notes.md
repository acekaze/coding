# File-based request queue notes

- source type: operating decision
- workspace path: C:/코딩/llm-wiki-workspace
- observed date: 2026-04-07
- trigger context:
  - multiple PCs or Macs may need to ask for updates or source handoffs
  - chat alone is too easy to lose
  - the wiki already uses GitHub as the shared source of truth

## Core idea

The repository should contain a lightweight request queue so cross-device collaboration does not depend only on chat memory.
Requests should live as markdown files inside the repo and move through `open`, `in-progress`, and `done`.

## Main rule

- requests belong in `requests/open/`
- active work belongs in `requests/in-progress/`
- completed work belongs in `requests/done/`
- each request should point to the result files or commit before closing

## Why this matters

- different devices can leave requests asynchronously
- the host machine can process local-only source requests without losing the trail
- the queue becomes a durable collaboration layer on top of chat
- Git history preserves the request lifecycle
