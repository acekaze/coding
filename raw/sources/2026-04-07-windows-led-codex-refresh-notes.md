# Windows-led Codex refresh notes

- source type: internal operating decision
- workspace path: C:/코딩/llm-wiki-workspace
- observed date: 2026-04-07
- related files:
  - C:/코딩/llm-wiki-workspace/scripts/open-codex-app.ps1
  - C:/코딩/llm-wiki-workspace/scripts/setup-codex-wiki-automation.ps1

## Observed issue

The PC woke at 08:50 and the 08:55 Codex task ran successfully, but the Codex `wiki-morning-loop` automation still did not fire.

## Likely cause

The previous 08:55 task only opened Codex if it was not already running.
That means the app could remain in a stale state overnight and never get a fresh start before the 09:00 automation window.

## Decision

- keep Windows as the host-side scheduler
- change the 08:55 task to refresh Codex by restarting it if it is already open
- keep the 09:00 wiki automation active after the fresh app start
