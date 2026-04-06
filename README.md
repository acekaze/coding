# LLM Wiki Workspace

This workspace is a Karpathy-style LLM wiki scaffold.

The pattern is:

1. `raw/` holds immutable source material.
2. `wiki/` holds LLM-maintained markdown pages.
3. `AGENTS.md` is the schema and operating contract.

The goal is not to build a RAG stack first.
The goal is to build a compounding markdown knowledge base that gets better as you ingest more sources and ask better questions.

## Directory layout

```text
llm-wiki-workspace/
  AGENTS.md
  README.md
  prompts/
  raw/
    sources/
    assets/
  templates/
  wiki/
    index.md
    log.md
    overview.md
    sources/
    entities/
    concepts/
    analyses/
```

## Core rules

- Put source files into `raw/sources/`.
- Keep source files immutable.
- Let the LLM write and maintain the markdown in `wiki/`.
- Update `wiki/index.md` and `wiki/log.md` on every ingest.
- Save reusable answers back into `wiki/analyses/` instead of losing them in chat history.

## Recommended workflow

### 1. Add a source

Place one source at a time in `raw/sources/`.

Examples:

- clipped article markdown
- notes from a PDF
- transcript
- meeting notes
- copied chapter summary

If the source has images you want to preserve, store them under `raw/assets/`.

### 2. Ingest it with the LLM

Tell the LLM to ingest a specific file and update the wiki.

Example:

```text
Read AGENTS.md and ingest raw/sources/2026-04-06-karpathy-llm-wiki-gist-notes.md into the wiki.
Create or update the relevant source, entity, concept, and overview pages.
Then update wiki/index.md and append wiki/log.md.
```

You can also use the prompt starter in [prompts/ingest-source.md](/C:/코딩/llm-wiki-workspace/prompts/ingest-source.md).

### 3. Query the wiki

Ask questions against the wiki first, not the raw folder.

Example:

```text
Use wiki/index.md to find the relevant pages, answer this question from the wiki, and cite the pages you relied on:
What are the main differences between raw-document RAG and a persistent wiki workflow?
```

If the answer is useful beyond the moment, save it into `wiki/analyses/`.

### 4. Lint the wiki

Periodically ask the LLM to audit the wiki for:

- missing cross-links
- duplicate pages
- contradictions
- stale claims
- orphan pages
- important entities or concepts with no page yet

You can use [prompts/lint-wiki.md](/C:/코딩/llm-wiki-workspace/prompts/lint-wiki.md) as a starter.

## Operating rhythm

If you want this wiki to stay useful, run it as a loop instead of as an occasional archive.

- use [OPERATING_GUIDE.md](/C:/코딩/llm-wiki-workspace/OPERATING_GUIDE.md) as the main operating handbook
- use [prompts/daily-morning-loop.md](/C:/코딩/llm-wiki-workspace/prompts/daily-morning-loop.md) for the first-launch morning scan and update loop
- use [prompts/weekly-wiki-review.md](/C:/코딩/llm-wiki-workspace/prompts/weekly-wiki-review.md) for the deeper weekly cleanup

The default tracked project set is:

- `C:/코딩/공개과정`
- `C:/코딩/청소년을 위한 말처방`
- `C:/코딩/제안서`
- `C:/코딩/교육설계`
- `C:/코딩/전종목`

## Good first use cases

- research topic wiki
- book companion wiki
- course notes wiki
- competitive analysis wiki
- personal learning wiki

## Optional tools

- Obsidian for browsing and graph view
- Git for history and branching
- local markdown search later, if the wiki grows large

## Web viewer

This workspace also includes a lightweight static wiki viewer:

- `index.html`
- `styles.css`
- `app.js`
- `wiki-manifest.json`

The viewer reads the markdown in `wiki/` directly and uses `wiki-manifest.json` for navigation.

Current viewer features:

- section filters
- live search over title, heading, summary, and section
- related-page chips from page frontmatter
- on-page outline chips for quick jumps
- `/` keyboard shortcut to focus search

Refresh the manifest after adding or renaming wiki pages:

```text
python scripts/generate_wiki_manifest.py
```

Preview locally from the workspace root:

```text
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

For this internal private repo, local viewing and Vercel previews are the practical hosting paths.
GitHub Pages can be added back later if the repository becomes eligible for Pages hosting.

Start simple first.
You do not need special tooling before the markdown structure becomes useful.
