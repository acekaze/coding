# Automated Wiki Sync Prompt

Read `AGENTS.md` and `OPERATING_GUIDE.md` first.

Then run the automated wiki sync for this workspace.

Requirements:

1. review `wiki/index.md`, `wiki/overview.md`, and the latest entries in `wiki/log.md`
2. scan the tracked project folders for materially new or changed documents
3. ingest only meaningful changes into the wiki
4. update the relevant `source`, `entity`, `concept`, and `analysis` pages as needed
5. surface contradictions or open questions instead of hiding them
6. update `wiki/index.md` if navigation changed
7. append a new entry to `wiki/log.md`
8. run `python scripts/generate_wiki_manifest.py` if wiki pages changed
9. if the repository contains only expected wiki-workspace changes, commit them with a concise message and push to `origin/main`
10. if commit or push is unsafe or blocked, explain why in the result instead of forcing it
