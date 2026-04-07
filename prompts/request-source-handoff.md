# Requested Source Handoff

Use this when another device needs original text or direct evidence from a tracked project that is not locally available there.

```text
Read AGENTS.md and the cross-device source-basis policy.
Then fulfill a requested source handoff for this target:

- tracked project:
- original local path or best-known path:
- request type: full copy / excerpt pack / structured source notes
- question to answer from the original source:

Rules:
- open the original local source if available on this machine
- create a new immutable raw note in raw/sources/ with the handoff content
- preserve provenance: original path, handoff date, and what was copied or excerpted
- update or create the relevant wiki/sources/ or wiki/analyses/ page
- update wiki/index.md if navigation changes
- append wiki/log.md
- regenerate wiki-manifest.json if pages changed
```
