# First-Launch Morning Loop Prompt

Read `AGENTS.md` and `OPERATING_GUIDE.md` first.

Then run the first-launch morning loop for this workspace.

Use this when Codex is first opened for the day.
Do not treat it as a strict 09:00 scheduled job.

Tracked projects:

- `C:/코딩/공개과정`
- `C:/코딩/청소년을 위한 말처방`
- `C:/코딩/제안서`
- `C:/코딩/교육설계`
- `C:/코딩/전종목`

Requirements:

1. review `wiki/index.md`, `wiki/overview.md`, and the recent entries in `wiki/log.md`
2. scan the tracked project folders for materially new or changed documents
3. ingest only meaningful changes into the wiki
4. update the relevant `source`, `entity`, `concept`, and `analysis` pages as needed
5. surface contradictions or open questions instead of hiding them
6. update `wiki/index.md` if navigation changed
7. append a new entry to `wiki/log.md`
8. run `python scripts/generate_wiki_manifest.py` if wiki pages changed
9. report:
   - what changed
   - what was intentionally skipped
   - what remains uncertain
   - what should be watched next
