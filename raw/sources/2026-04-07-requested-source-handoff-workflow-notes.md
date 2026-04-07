# Requested source handoff workflow notes

- source type: operating decision
- workspace path: C:/코딩/llm-wiki-workspace
- observed date: 2026-04-07
- trigger context:
  - cross-device use of the wiki
  - some tracked projects remain local-only
  - users may need the original text from a source project while working on another device

## Core idea

When another device needs source text that does not travel with the original local project folder, the host machine should provide a source handoff.
The handoff should be captured as a new immutable raw note in this wiki instead of being served as an untracked chat-only answer.

## Main rule

- if the requested source text is important enough to quote or re-check, create a new file in `raw/sources/`
- include the original local path, request date, and whether the handoff is a full copy, excerpt set, or structured notes
- then create or update a linked source or analysis page in `wiki/`

## Practical implication

- other devices can ask for original text even when the underlying project folder is not directly available there
- the answer becomes portable after the first handoff because it now lives inside the shared wiki repository
- the wiki remains the shared memory layer, while the host machine acts as the bridge to local-only source folders

## Safety rule

- do not silently rewrite the source during handoff
- if the source is large, prefer excerpt plus summary over copying a huge document into chat only
- preserve enough provenance that future readers know where the handoff came from
