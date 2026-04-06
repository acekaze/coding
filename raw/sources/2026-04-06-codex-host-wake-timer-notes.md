# Codex host wake timer notes

- source type: internal operating decision
- workspace path: C:/코딩/llm-wiki-workspace
- observed date: 2026-04-06
- related files:
  - C:/코딩/llm-wiki-workspace/scripts/setup-codex-wiki-automation.ps1
  - C:/코딩/llm-wiki-workspace/scripts/wake-for-codex.ps1

## Goal

Wake the primary Codex host before the wiki sync window.

## Chosen schedule

- 08:50: wake the PC from sleep
- 08:55: open Codex
- 09:00: run the Codex wiki automation

## Constraint

This pattern is for sleep or hibernate wake-up, not guaranteed full power-on from a complete shutdown.
Full shutdown auto power-on depends on BIOS RTC alarm settings.
