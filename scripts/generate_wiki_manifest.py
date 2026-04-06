from __future__ import annotations

import json
import re
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
WIKI_ROOT = ROOT / "wiki"
OUTPUT = ROOT / "wiki-manifest.json"


def parse_frontmatter(text: str) -> tuple[dict[str, object], str]:
    if not text.startswith("---"):
      return {}, text

    parts = text.split("---", 2)
    if len(parts) < 3:
      return {}, text

    raw = parts[1].strip()
    body = parts[2].lstrip("\r\n")
    data: dict[str, object] = {}
    current_key: str | None = None

    for line in raw.splitlines():
      if not line.strip():
        continue

      list_match = re.match(r"^\s*-\s+(.*)$", line)
      if list_match and current_key:
        data.setdefault(current_key, [])
        assert isinstance(data[current_key], list)
        data[current_key].append(list_match.group(1).strip())
        continue

      pair_match = re.match(r"^([A-Za-z0-9_-]+):\s*(.*)$", line)
      if not pair_match:
        continue

      key, value = pair_match.groups()
      current_key = key
      if value:
        data[key] = value.strip()
      else:
        data[key] = []

    return data, body


def find_heading(body: str, fallback: str) -> str:
    for line in body.splitlines():
      if line.startswith("# "):
        return line[2:].strip()
    return fallback


def find_summary(body: str) -> str:
    lines = body.splitlines()
    capture = False
    summary_lines: list[str] = []

    for line in lines:
      if line.startswith("## Summary"):
        capture = True
        continue
      if capture and line.startswith("## "):
        break
      if capture and line.strip():
        summary_lines.append(line.strip())
      elif capture and summary_lines:
        break

    if summary_lines:
      return " ".join(summary_lines)

    capture = False
    source_lines: list[str] = []
    for line in lines:
      if line.startswith("## What this source is"):
        capture = True
        continue
      if capture and line.startswith("## "):
        break
      if capture and line.strip():
        source_lines.append(line.strip())
      elif capture and source_lines:
        break

    if source_lines:
      return " ".join(source_lines)

    seen_h1 = False
    fallback_lines: list[str] = []
    for line in lines:
      if line.startswith("# "):
        seen_h1 = True
        continue
      if not seen_h1:
        continue
      if line.startswith("## "):
        break
      if line.strip():
        fallback_lines.append(line.strip())
      elif fallback_lines:
        break

    return " ".join(fallback_lines)


def section_for(path: Path) -> str:
    relative = path.relative_to(WIKI_ROOT)
    return relative.parts[0] if len(relative.parts) > 1 else "core"


def build_manifest() -> dict[str, object]:
    entries = []
    for path in sorted(WIKI_ROOT.rglob("*.md")):
      relative = path.relative_to(ROOT).as_posix()
      raw = path.read_text(encoding="utf-8")
      frontmatter, body = parse_frontmatter(raw)
      title = str(frontmatter.get("title") or path.stem)
      heading = find_heading(body, title)
      summary = find_summary(body)
      entries.append(
        {
          "path": relative,
          "section": section_for(path),
          "title": title,
          "heading": heading,
          "summary": summary,
        }
      )

    return {
      "generated_at": datetime.now().astimezone().strftime("%Y-%m-%d %H:%M %Z"),
      "entries": entries,
    }


if __name__ == "__main__":
    manifest = build_manifest()
    OUTPUT.write_text(
      json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
      encoding="utf-8",
    )
    print(f"Wrote {OUTPUT}")
