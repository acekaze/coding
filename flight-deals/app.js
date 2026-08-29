// 항공권 땡처리 알리미 - 1차 프로토타입
// 개인용 / 브라우저 저장(localStorage) / mock 가격
// 실제 항공권 API는 2차 단계에서 fetchPrice() 자리만 교체하면 됩니다.

const STORAGE_KEY = "flight-deals.watches.v1";
const AUTO_KEY = "flight-deals.auto.v1";
const MAX_HISTORY = 14; // 가격 추이로 보관할 최근 확인 횟수

const els = {
  form: document.getElementById("watch-form"),
  origin: document.getElementById("origin"),
  destination: document.getElementById("destination"),
  dateFrom: document.getElementById("date-from"),
  dateTo: document.getElementById("date-to"),
  targetPrice: document.getElementById("target-price"),
  notify: document.getElementById("notify"),
  formHint: document.getElementById("form-hint"),
  list: document.getElementById("watch-list"),
  checkNow: document.getElementById("check-now"),
  autoCheck: document.getElementById("auto-check"),
  clearAll: document.getElementById("clear-all"),
  watchCount: document.getElementById("watch-count"),
  dealCount: document.getElementById("deal-count"),
  lastCheck: document.getElementById("last-check"),
  toast: document.getElementById("toast"),
};

let watches = loadWatches();
let autoTimer = null;

// ---------- 저장/불러오기 ----------
function loadWatches() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveWatches() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(watches));
}

// ---------- mock 가격 로직 ----------
// 조건마다 고정된 "기준가"를 만들어두고, 확인할 때마다 그 주변에서 흔들리게 합니다.
// 그래야 같은 조건은 대체로 비슷한 가격대에서 오르내려 실제처럼 보입니다.
function seededBase(watch) {
  const str = `${watch.origin}|${watch.destination}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  // 18만 ~ 78만 원 사이 기준가
  return 180000 + (hash % 60) * 10000;
}

function fetchPrice(watch) {
  // 2차 단계: 이 함수만 실제 API 호출로 교체하면 됩니다.
  const base = seededBase(watch);
  const swing = base * 0.35; // ±35% 변동
  const noise = (Math.random() - 0.5) * 2 * swing;
  const price = Math.max(50000, Math.round((base + noise) / 1000) * 1000);
  return price;
}

// ---------- 조건 등록 ----------
els.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const dateFrom = els.dateFrom.value;
  const dateTo = els.dateTo.value;
  if (dateFrom && dateTo && dateFrom > dateTo) {
    els.formHint.style.color = "var(--danger)";
    els.formHint.textContent = "기간 시작이 끝보다 늦습니다. 날짜를 확인해주세요.";
    return;
  }

  const watch = {
    id: `w_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    origin: els.origin.value.trim(),
    destination: els.destination.value.trim(),
    dateFrom,
    dateTo,
    targetPrice: Number(els.targetPrice.value),
    notify: els.notify.value,
    history: [],
    lastNotifiedPrice: null,
  };

  watches.unshift(watch);
  saveWatches();
  render();
  els.form.reset();
  els.formHint.style.color = "var(--good)";
  els.formHint.textContent = "등록했습니다. '지금 가격 확인'을 눌러 시작해보세요.";

  // 등록 직후 한 번 확인
  checkOne(watch);
  saveWatches();
  render();
});

// ---------- 가격 확인 ----------
function checkOne(watch) {
  const price = fetchPrice(watch);
  watch.history.push(price);
  if (watch.history.length > MAX_HISTORY) {
    watch.history = watch.history.slice(-MAX_HISTORY);
  }
  const isDeal = price <= watch.targetPrice;

  // 같은 딜 가격으로 반복 알림하지 않도록 처리
  if (isDeal && watch.lastNotifiedPrice !== price) {
    watch.lastNotifiedPrice = price;
    notifyDeal(watch, price);
  }
  if (!isDeal) {
    watch.lastNotifiedPrice = null;
  }
  return isDeal;
}

function checkAll() {
  watches.forEach(checkOne);
  saveWatches();
  render();
  els.lastCheck.textContent = new Date().toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

els.checkNow.addEventListener("click", () => {
  if (watches.length === 0) {
    showToast("먼저 조건을 등록해주세요.");
    return;
  }
  checkAll();
});

// ---------- 자동 확인 ----------
els.autoCheck.checked = localStorage.getItem(AUTO_KEY) === "1";
setupAuto();

els.autoCheck.addEventListener("change", () => {
  localStorage.setItem(AUTO_KEY, els.autoCheck.checked ? "1" : "0");
  setupAuto();
});

function setupAuto() {
  if (autoTimer) {
    clearInterval(autoTimer);
    autoTimer = null;
  }
  if (els.autoCheck.checked) {
    autoTimer = setInterval(() => {
      if (watches.length > 0) checkAll();
    }, 30000);
  }
}

// ---------- 알림 ----------
function notifyDeal(watch, price) {
  const msg = `딜! ${watch.origin} → ${watch.destination} ${formatWon(price)} (목표 ${formatWon(watch.targetPrice)})`;
  showToast(msg);

  if (watch.notify === "browser") {
    sendBrowserNotification(watch, price);
  }
}

function sendBrowserNotification(watch, price) {
  if (!("Notification" in window)) return;
  const title = "항공권 딜 발견!";
  const body = `${watch.origin} → ${watch.destination}\n${formatWon(price)} (목표 ${formatWon(watch.targetPrice)})`;

  if (Notification.permission === "granted") {
    new Notification(title, { body });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((perm) => {
      if (perm === "granted") new Notification(title, { body });
    });
  }
}

let toastTimer = null;
function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 4000);
}

// ---------- 삭제 ----------
els.clearAll.addEventListener("click", () => {
  if (watches.length === 0) return;
  if (!confirm("등록한 조건을 모두 삭제할까요?")) return;
  watches = [];
  saveWatches();
  render();
});

function removeWatch(id) {
  watches = watches.filter((w) => w.id !== id);
  saveWatches();
  render();
}

// ---------- 렌더링 ----------
function render() {
  els.watchCount.textContent = String(watches.length);
  const dealCount = watches.filter(isDeal).length;
  els.dealCount.textContent = String(dealCount);

  if (watches.length === 0) {
    els.list.innerHTML =
      '<p class="empty-state">아직 등록한 조건이 없습니다. 왼쪽에서 첫 조건을 등록해보세요.</p>';
    return;
  }

  els.list.innerHTML = "";
  watches.forEach((w) => els.list.appendChild(renderCard(w)));
}

function isDeal(w) {
  const cur = currentPrice(w);
  return cur != null && cur <= w.targetPrice;
}

function currentPrice(w) {
  return w.history.length ? w.history[w.history.length - 1] : null;
}

function renderCard(w) {
  const card = document.createElement("div");
  card.className = "watch-card" + (isDeal(w) ? " is-deal" : "");

  const cur = currentPrice(w);
  const dealNow = cur != null && cur <= w.targetPrice;

  card.innerHTML = `
    <div class="card-top">
      <div>
        <div class="route">${escapeHtml(w.origin)}<span class="arrow">→</span>${escapeHtml(w.destination)}</div>
        <div class="card-meta">${escapeHtml(w.dateFrom)} ~ ${escapeHtml(w.dateTo)}</div>
      </div>
      <button class="card-remove" title="삭제" data-id="${w.id}">×</button>
    </div>
    <div class="price-row">
      <span class="current-price">${cur != null ? formatWon(cur) : "-"}</span>
      <span class="target-price">목표 ${formatWon(w.targetPrice)}</span>
    </div>
    <span class="deal-badge ${dealNow ? "deal" : "watching"}">
      ${dealNow ? "지금 딜입니다" : "가격 지켜보는 중"}
    </span>
    ${renderSparkline(w)}
    ${dealNow ? `<a class="book-link" href="${bookingUrl(w)}" target="_blank" rel="noreferrer">예약 페이지 열기 →</a>` : ""}
  `;

  card.querySelector(".card-remove").addEventListener("click", () => removeWatch(w.id));
  return card;
}

function renderSparkline(w) {
  if (!w.history.length) return "";
  const max = Math.max(...w.history, w.targetPrice);
  const bars = w.history
    .map((p, i) => {
      const h = Math.max(6, Math.round((p / max) * 100));
      const isLatest = i === w.history.length - 1;
      const below = p <= w.targetPrice;
      const cls = ["spark-bar", isLatest ? "latest" : "", below ? "below" : ""]
        .filter(Boolean)
        .join(" ");
      return `<span class="${cls}" style="height:${h}%" title="${formatWon(p)}"></span>`;
    })
    .join("");
  return `<div class="sparkline">${bars}</div>`;
}

// 실제 예약 페이지 대신 지금은 구글 항공 검색으로 연결 (2차에서 교체 가능)
function bookingUrl(w) {
  const q = encodeURIComponent(`${w.origin} to ${w.destination} flights`);
  return `https://www.google.com/travel/flights?q=${q}`;
}

// ---------- 유틸 ----------
function formatWon(n) {
  return Number(n).toLocaleString("ko-KR") + "원";
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---------- 초기 렌더 ----------
render();
