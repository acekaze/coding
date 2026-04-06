# Lint Wiki Prompt

Read `AGENTS.md` and inspect the current wiki.

Perform a health check for:

- orphan pages
- duplicate pages
- contradictions
- stale claims
- missing cross-links
- concepts or entities that should exist but do not

Requirements:

1. make safe, incremental fixes where appropriate
2. update `wiki/index.md` if navigation changed
3. append a `lint` entry to `wiki/log.md`
4. report what you fixed and what still needs human judgment
