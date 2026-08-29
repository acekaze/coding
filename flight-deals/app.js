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

// ---------- 실제 가격 조회 ----------
// 로컬 서버(server.js)의 /api/price를 호출합니다.
// 서버가 RapidAPI(Sky Scrapper)를 대신 불러서 실제 최저가를 돌려줍니다.
//
// 무료 플랜은 월 100회 제한이라, 기간 전체가 아니라
// "기간 중 대표 날짜 한 개"만 조회합니다. (기본: 기간 시작일)
async function fetchPrice(watch) {
  // 왕복 조회: 가는 날 = 기간 시작, 오는 날 = 기간 끝
  const params = new URLSearchParams({
    origin: watch.origin,
    destination: watch.destination,
    date: watch.dateFrom,
    returnDate: watch.dateTo,
  });
  const res = await fetch(`/api/price?${params.toString()}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `가격 조회 실패 (${res.status})`);
  }
  return data; // { price, tripType, carrier, stops, ... } 또는 { price: null, message }
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
  els.formHint.textContent = "등록했습니다. 실제 가격을 확인하는 중...";

  // 등록 직후 한 번 확인
  checkOne(watch).then(() => {
    saveWatches();
    render();
    els.formHint.textContent = watch.error
      ? `등록됨. 다만 조회 문제: ${watch.error}`
      : "등록하고 실제 가격을 확인했습니다.";
  });
});

// ---------- 가격 확인 ----------
async function checkOne(watch) {
  watch.error = null;
  let result;
  try {
    result = await fetchPrice(watch);
  } catch (err) {
    watch.error = String(err.message || err);
    return false;
  }

  const price = result.price;
  if (price == null) {
    // 해당 날짜에 항공권이 없거나 가격 없음
    watch.error = result.message || "가격 정보 없음";
    return false;
  }

  watch.lastInfo = {
    carrier: result.carrier,
    stops: result.stops,
    returnStops: result.returnStops,
    tripType: result.tripType || "왕복",
    checkedAt: Date.now(),
  };
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

async function checkAll() {
  els.checkNow.disabled = true;
  els.checkNow.textContent = "확인 중...";
  // 순차 처리 (동시 호출로 무료 한도가 순식간에 소진되는 것 방지)
  for (const w of watches) {
    await checkOne(w);
    render();
  }
  saveWatches();
  render();
  els.lastCheck.textContent = new Date().toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  els.checkNow.disabled = false;
  els.checkNow.textContent = "지금 가격 확인";
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
    // 무료 플랜(월 100회) 보호를 위해 6시간마다만 자동 확인 (하루 약 4회)
    autoTimer = setInterval(() => {
      if (watches.length > 0) checkAll();
    }, 6 * 60 * 60 * 1000);
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

  function stopText(n) {
    if (n == null) return "";
    return n === 0 ? "직항" : n + "회 경유";
  }
  const info = w.lastInfo
    ? `<div class="card-info">${escapeHtml(w.lastInfo.tripType || "왕복")} · ${escapeHtml(w.lastInfo.carrier || "-")}${
        w.lastInfo.stops != null ? " · 가는편 " + stopText(w.lastInfo.stops) : ""
      }${
        w.lastInfo.returnStops != null ? " / 오는편 " + stopText(w.lastInfo.returnStops) : ""
      }</div>`
    : "";
  const errRow = w.error
    ? `<div class="card-error">⚠ ${escapeHtml(w.error)}</div>`
    : "";

  card.innerHTML = `
    <div class="card-top">
      <div>
        <div class="route">${escapeHtml(w.origin)}<span class="arrow">→</span>${escapeHtml(w.destination)}</div>
        <div class="card-meta">가는날 ${escapeHtml(w.dateFrom)} · 오는날 ${escapeHtml(w.dateTo)} (왕복)</div>
      </div>
      <button class="card-remove" title="삭제" data-id="${w.id}">×</button>
    </div>
    <div class="price-row">
      <span class="current-price">${cur != null ? formatWon(cur) : "-"}</span>
      <span class="target-price">목표 ${formatWon(w.targetPrice)}</span>
    </div>
    ${info}
    ${errRow}
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

// ---------- 자주 쓰는 도시 빠른 입력 ----------
const POPULAR_CITIES = [
  "도쿄", "오사카", "후쿠오카", "삿포로", "오키나와",
  "방콕", "다낭", "하노이", "싱가포르", "발리", "세부", "타이베이", "홍콩",
  "시드니", "괌", "사이판", "오클랜드",
  "두바이", "런던", "파리", "로마",
  "하와이", "뉴욕", "로스앤젤레스",
];

function setupCityChips() {
  const box = document.getElementById("city-chips");
  if (!box) return;
  POPULAR_CITIES.forEach((city) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "city-chip";
    b.textContent = city;
    b.addEventListener("click", () => {
      els.destination.value = city;
      els.destination.focus();
    });
    box.appendChild(b);
  });
}
setupCityChips();

// ---------- 초기 렌더 ----------
render();
