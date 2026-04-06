# First-launch wiki routine notes

- source type: internal operating decision
- workspace path: C:/코딩/llm-wiki-workspace
- observed date: 2026-04-06
- related files:
  - C:/코딩/llm-wiki-workspace/OPERATING_GUIDE.md
  - C:/코딩/llm-wiki-workspace/prompts/daily-morning-loop.md

## Reason for change

The preferred cadence is not a strict 09:00 scheduled run.
The preferred cadence is to run the morning loop when Codex is first opened for the day.

## Constraint

Current automation state is stored in the local Codex desktop environment.
That makes a fixed-time morning run depend on the local app or machine being available at that time.

## Decision

- treat the morning loop as a first-launch ritual
- keep weekly review as a separate deeper pass
- avoid a noisy fixed-time schedule for now
