# Process Request Queue

Use this when the host machine or another capable device should process pending request files from `requests/open/`.

```text
Read AGENTS.md, OPERATING_GUIDE.md, and requests/README.md.
Then process the oldest or highest-priority request in requests/open/.

Rules:
- move the selected request to requests/in-progress/
- fulfill the request with the smallest useful change
- if the request needs original text from a local-only project, use the source handoff workflow
- update any affected wiki pages
- regenerate wiki-manifest.json if needed
- add result paths and outcome notes to the request file
- move the request file to requests/done/ when complete
- append wiki/log.md if the work materially changes the shared knowledge base
- commit and push if the result is ready to share
```
