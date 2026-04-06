const MANIFEST_URL = "./wiki-manifest.json";
const DEFAULT_PAGE = "wiki/overview.md";

const state = {
  manifest: null,
  entries: [],
  filteredEntries: [],
  currentPath: "",
};

const pageCountEl = document.getElementById("page-count");
const sectionCountEl = document.getElementById("section-count");
const manifestDateEl = document.getElementById("manifest-date");
const sidebarNavEl = document.getElementById("sidebar-nav");
const documentBodyEl = document.getElementById("document-body");
const readerMetaEl = document.getElementById("reader-meta");
const searchInputEl = document.getElementById("search-input");
const sourceLinkEl = document.getElementById("source-link");

function parseFrontmatter(markdown) {
  if (!markdown.startsWith("---")) {
    return { data: {}, body: markdown };
  }

  const closeIndex = markdown.indexOf("\n---", 3);
  if (closeIndex === -1) {
    return { data: {}, body: markdown };
  }

  const rawFrontmatter = markdown.slice(3, closeIndex).trim();
  const body = markdown.slice(closeIndex + 4).trimStart();
  const data = {};
  let currentKey = null;

  for (const line of rawFrontmatter.split(/\r?\n/)) {
    if (!line.trim()) {
      continue;
    }

    const listMatch = line.match(/^\s*-\s+(.*)$/);
    if (listMatch && currentKey) {
      if (!Array.isArray(data[currentKey])) {
        data[currentKey] = [];
      }
      data[currentKey].push(listMatch[1].trim());
      continue;
    }

    const pairMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!pairMatch) {
      continue;
    }

    const [, key, rawValue] = pairMatch;
    currentKey = key;
    if (!rawValue) {
      data[key] = [];
      continue;
    }
    data[key] = rawValue.trim();
  }

  return { data, body };
}

function resolveInternalPath(currentPath, href) {
  const currentParts = currentPath.split("/");
  currentParts.pop();
  const targetParts = href.split("/");
  for (const part of targetParts) {
    if (!part || part === ".") {
      continue;
    }
    if (part === "..") {
      currentParts.pop();
      continue;
    }
    currentParts.push(part);
  }
  return currentParts.join("/");
}

function renderFrontmatter(data) {
  const keys = Object.keys(data).filter((key) => !["title"].includes(key));
  if (!keys.length) {
    return "";
  }

  const rows = keys
    .map((key) => {
      const value = Array.isArray(data[key]) ? data[key].join(", ") : data[key];
      return `
        <div class="frontmatter-row">
          <dt>${key}</dt>
          <dd>${value}</dd>
        </div>
      `;
    })
    .join("");

  return `
    <section class="frontmatter">
      <p class="frontmatter-title">Metadata</p>
      <dl class="frontmatter-grid">${rows}</dl>
    </section>
  `;
}

function configureMarkdownRenderer(currentPath) {
  const renderer = new marked.Renderer();

  renderer.link = ({ href, title, tokens }) => {
    const text = tokens ? marked.Parser.parseInline(tokens) : href;
    const safeTitle = title ? ` title="${title}"` : "";

    if (href && href.endsWith(".md")) {
      const resolved = resolveInternalPath(currentPath, href);
      return `<a href="#${encodeURIComponent(resolved)}"${safeTitle}>${text}</a>`;
    }

    if (href && (href.startsWith("http://") || href.startsWith("https://"))) {
      return `<a href="${href}" target="_blank" rel="noreferrer"${safeTitle}>${text}</a>`;
    }

    return `<a href="${href}"${safeTitle}>${text}</a>`;
  };

  marked.setOptions({
    gfm: true,
    breaks: false,
    renderer,
  });
}

function renderNav() {
  const sections = new Map();
  for (const entry of state.filteredEntries) {
    if (!sections.has(entry.section)) {
      sections.set(entry.section, []);
    }
    sections.get(entry.section).push(entry);
  }

  sidebarNavEl.innerHTML = "";

  for (const [section, entries] of sections) {
    const group = document.createElement("section");
    group.className = "section-group";

    const title = document.createElement("h2");
    title.className = "section-title";
    title.textContent = section;
    group.appendChild(title);

    const list = document.createElement("div");
    list.className = "nav-list";

    for (const entry of entries) {
      const link = document.createElement("a");
      link.className = "nav-link";
      if (entry.path === state.currentPath) {
        link.classList.add("is-active");
      }
      link.href = `#${encodeURIComponent(entry.path)}`;

      const label = document.createElement("span");
      label.className = "nav-title";
      label.textContent = entry.heading || entry.title;
      link.appendChild(label);

      if (entry.summary) {
        const summary = document.createElement("span");
        summary.className = "nav-summary";
        summary.textContent = entry.summary;
        link.appendChild(summary);
      }

      list.appendChild(link);
    }

    group.appendChild(list);
    sidebarNavEl.appendChild(group);
  }

  if (!state.filteredEntries.length) {
    sidebarNavEl.innerHTML = `<p class="empty-state">검색 결과가 없습니다.</p>`;
  }
}

function renderReaderMeta(entry, data) {
  const chips = [];
  chips.push(`<span class="meta-chip">${entry.section}</span>`);

  if (data.type) {
    chips.push(`<span class="meta-chip">${data.type}</span>`);
  }

  if (data.updated) {
    chips.push(`<span class="meta-chip">updated ${data.updated}</span>`);
  }

  readerMetaEl.innerHTML = chips.join("");
}

async function loadPage(path) {
  state.currentPath = path;
  renderNav();

  sourceLinkEl.href = `./${path}`;

  const response = await fetch(`./${path}`);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }

  const markdown = await response.text();
  const { data, body } = parseFrontmatter(markdown);
  const entry = state.entries.find((candidate) => candidate.path === path) || {
    path,
    section: "page",
    title: data.title || path,
    heading: data.title || path,
    summary: "",
  };

  configureMarkdownRenderer(path);
  renderReaderMeta(entry, data);

  const frontmatterHtml = renderFrontmatter(data);
  const contentHtml = marked.parse(body);
  documentBodyEl.innerHTML = `${frontmatterHtml}${contentHtml}`;
  renderNav();
}

function applyFilter() {
  const query = searchInputEl.value.trim().toLowerCase();
  if (!query) {
    state.filteredEntries = [...state.entries];
  } else {
    state.filteredEntries = state.entries.filter((entry) => {
      const haystack = [entry.section, entry.title, entry.heading, entry.summary]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }

  renderNav();
}

function currentHashPath() {
  const raw = window.location.hash.replace(/^#/, "");
  return raw ? decodeURIComponent(raw) : DEFAULT_PAGE;
}

async function handleRouteChange() {
  const path = currentHashPath();
  const exists = state.entries.some((entry) => entry.path === path) || path === DEFAULT_PAGE;
  const target = exists ? path : DEFAULT_PAGE;

  try {
    await loadPage(target);
  } catch (error) {
    documentBodyEl.innerHTML = `<p class="empty-state">문서를 불러오지 못했습니다: ${target}</p>`;
    console.error(error);
  }
}

async function init() {
  const response = await fetch(MANIFEST_URL);
  if (!response.ok) {
    throw new Error("Failed to load wiki manifest.");
  }

  state.manifest = await response.json();
  state.entries = state.manifest.entries;
  state.filteredEntries = [...state.entries];

  pageCountEl.textContent = String(state.entries.length);
  sectionCountEl.textContent = String(
    new Set(state.entries.map((entry) => entry.section)).size,
  );
  manifestDateEl.textContent = state.manifest.generated_at || "-";

  renderNav();
  await handleRouteChange();
}

searchInputEl.addEventListener("input", applyFilter);
window.addEventListener("hashchange", handleRouteChange);

init().catch((error) => {
  documentBodyEl.innerHTML = `<p class="empty-state">초기화에 실패했습니다.</p>`;
  console.error(error);
});
