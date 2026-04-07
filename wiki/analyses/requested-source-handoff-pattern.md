---
title: requested-source-handoff-pattern
type: analysis
created: 2026-04-07
updated: 2026-04-07
source_files:
  - raw/sources/2026-04-07-requested-source-handoff-workflow-notes.md
related:
  - wiki/sources/2026-04-07-requested-source-handoff-workflow.md
  - wiki/analyses/cross-device-source-basis-policy.md
  - wiki/analyses/internal-wiki-operations-loop.md
---

# Requested source handoff pattern

## Question

Can another device ask for the original text of a tracked project even when that project is not locally available there?

## Short answer

Yes.
The host machine should provide the source through a tracked handoff, not a disposable chat answer.

## Recommended pattern

1. the other device asks for a specific original file, section, or evidence question
2. the host machine opens the underlying local project folder
3. the host machine creates a new raw note in `raw/sources/` containing the requested text, excerpts, or structured evidence capture
4. the wiki adds or updates a source or analysis page that links to that raw note
5. the updated wiki is committed and pushed so every device can use the same handoff afterward

## Why this is better than ad hoc chat replies

- the handoff becomes reusable
- provenance is preserved
- future devices do not need the same request repeated
- the wiki gets stronger instead of leaking important evidence into chat history

## Good requests

- "show me the exact pricing section from the latest 공개과정 landing copy"
- "pull the Samsung proposal section that compares the 500-person and 100-person versions"
- "extract the key evidence from the local 교육설계 guide that supports this claim"

## Default rule

- for short documents: full copy is acceptable
- for long documents: prefer excerpt pack plus summary
- for ambiguous requests: capture the smallest useful source slice rather than dumping everything

## Related pages

- [2026-04-07-requested-source-handoff-workflow](../sources/2026-04-07-requested-source-handoff-workflow.md)
- [cross-device-source-basis-policy](./cross-device-source-basis-policy.md)
- [internal-wiki-operations-loop](./internal-wiki-operations-loop.md)
