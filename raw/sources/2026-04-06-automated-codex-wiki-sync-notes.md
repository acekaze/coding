# Automated Codex wiki sync notes

- source type: internal operating decision
- workspace path: C:/코딩/llm-wiki-workspace
- observed date: 2026-04-06
- related files:
  - C:/코딩/llm-wiki-workspace/scripts/setup-codex-wiki-automation.ps1
  - C:/코딩/llm-wiki-workspace/scripts/open-codex-app.ps1
  - C:/Users/aceka/.codex/automations/wiki-morning-loop/automation.toml

## Goal

Automate the daily wiki update flow as much as possible.

## Chosen pattern

- use a Windows scheduled task to open the Codex desktop app at logon
- use a second scheduled task to open Codex shortly before the morning wiki automation time
- keep the Codex automation active so it can run the wiki sync
- let the automation commit and push straightforward wiki-only updates when safe

## Shared-use rule

Only one machine should be the automatic sync host for this repository.
Other devices should pull from GitHub and use the shared viewer or make manual edits.

## Publishing rule

GitHub remains the canonical history.
A static host such as Vercel should point at the repository so pushes to `main` refresh the shared viewer.
