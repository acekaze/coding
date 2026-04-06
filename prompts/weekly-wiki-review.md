# Weekly Wiki Review Prompt

Read `AGENTS.md` and `OPERATING_GUIDE.md` first.

Then perform a deeper weekly review of the wiki.

Requirements:

1. inspect `wiki/index.md`, `wiki/overview.md`, `wiki/log.md`, and the main project pages
2. look for duplicates, stale claims, missing cross-links, contradictions, and pages that should be split or merged
3. make safe incremental fixes where they are clear
4. create a new `concept` or `analysis` page if the same pattern now appears across multiple projects
5. update `wiki/index.md` if navigation changed
6. append a `lint` or `review` entry to `wiki/log.md`
7. run `python scripts/generate_wiki_manifest.py` if wiki pages changed
8. report:
   - what was cleaned up
   - what still needs human judgment
   - which project areas are under-documented
