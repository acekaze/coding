---
title: cross-device-source-basis-policy
type: analysis
created: 2026-04-07
updated: 2026-04-07
source_files:
  - raw/sources/2026-04-07-tracked-project-access-registry-notes.md
related:
  - wiki/sources/2026-04-07-tracked-project-access-registry.md
  - wiki/overview.md
  - wiki/analyses/internal-wiki-operations-loop.md
---

# Cross-device source-basis policy

## Question

How should `Original workspace basis` be interpreted when the wiki is opened on another device?

## Short answer

Treat `raw/sources/` and the wiki pages themselves as the portable minimum evidence layer.
Treat `Original workspace basis` as a provenance pointer that may or may not be directly openable on the current machine.

## Current policy

- if a claim is already captured in `raw/sources/` and summarized in `wiki/`, the page is still usable even when the original project path is unavailable
- if deeper source re-checking matters, use the tracked-project registry to see whether the underlying project is on GitHub, local-only, or a local repo without a remote
- when a project becomes operationally important across devices, give it its own shared remote or replicate that project folder on the other machine

## What this means in practice

- `Original workspace basis` not opening on another device is inconvenient, but not fatal to the wiki
- the fatal case would be relying on uncaptured source material that exists only in a local project folder and never made it into `raw/sources/`
- the wiki is therefore healthiest when important claims are copied into raw notes early, instead of depending on local paths later

## Current registry takeaway

- `제안서` is the strongest current candidate for cross-device deep verification because it already has a GitHub origin
- `공개과정`, `청소년을 위한 말처방`, and `전종목` are currently local-only from the standpoint of repository access
- `교육설계` is versioned locally but is not yet portable by remote

## Recommendation

- keep using `Original workspace basis` because it preserves provenance
- strengthen important pages by citing the relevant raw note first
- migrate the most important tracked projects to shared remotes over time if cross-device source checking becomes frequent

## Related pages

- [2026-04-07-tracked-project-access-registry](../sources/2026-04-07-tracked-project-access-registry.md)
- [internal-wiki-operations-loop](./internal-wiki-operations-loop.md)
- [overview](../overview.md)
