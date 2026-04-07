# Request Queue

Use this folder as the shared request queue between devices.

The goal is simple:

- another PC or Mac can leave a request in the repo
- the host or another capable machine can pick it up
- the response becomes a tracked artifact instead of disappearing in chat

## Folder layout

```text
requests/
  README.md
  templates/
    request-template.md
  open/
  in-progress/
  done/
```

## Lifecycle

1. create a request file in `requests/open/`
2. when someone starts working on it, move it to `requests/in-progress/`
3. when finished, move it to `requests/done/`
4. add the result link inside the request file before closing it

## File naming

Use this pattern:

```text
YYYY-MM-DD-short-slug.md
```

Examples:

- `2026-04-07-public-course-pricing-handoff.md`
- `2026-04-07-samsung-proposal-500-vs-100.md`
- `2026-04-07-update-public-course-entity.md`

## Request types

Use one of these values:

- `source-handoff`
- `wiki-update`
- `analysis`
- `question`
- `ops`

## Minimum rule

Every request file should say:

- what is needed
- which project it belongs to
- who requested it
- what success looks like

## Result rule

When closing a request:

- move the file to `requests/done/`
- set `status: done`
- add the result paths or commit hash
- note anything still unresolved

## Good uses

- ask for original text from a local-only project
- ask the host machine to ingest a meaningful new document
- ask for a reusable analysis page
- ask for an update to a specific entity or source page

## Bad uses

- vague brainstorming with no clear result
- giant multi-project requests with no boundary
- disposable chat notes that do not need to survive
