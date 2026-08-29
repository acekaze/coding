// 항공권 알리미 로컬 서버
// 역할:
//  1) 정적 파일(index.html, app.js, styles.css) 서빙
//  2) /api/price 로 브라우저 요청을 받아 RapidAPI(Sky Scrapper)를 대신 호출
//     - API 키를 브라우저에 노출하지 않음 (서버에만 보관)
//     - CORS 우회 (브라우저가 RapidAPI를 직접 못 부르는 문제 해결)
//  3) 공항 검색 결과를 캐싱해 무료 호출 횟수를 아낌
//
// 실행: node server.js  (그다음 브라우저에서 http://localhost:8787)
// 의존성 없음 (Node 18+ 내장 fetch/http 사용)

import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { existsSync } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 8787;
const RAPIDAPI_HOST = "sky-scrapper.p.rapidapi.com";

// ---- API 키 로드 ----
// 우선순위: 환경변수 > .env 파일 > 아래 코드 기본값
// 개인용이라 .env 없이 그냥 실행되게 코드에 키를 넣어둠.
const DEFAULT_API_KEY = "79802b3a84mshde507b15d9ba75bp1f235ajsn3284a18162f4";

import { readFileSync } from "node:fs";
function readApiKey() {
  if (process.env.RAPIDAPI_KEY) return process.env.RAPIDAPI_KEY.trim();
  const envPath = path.join(__dirname, ".env");
  if (existsSync(envPath)) {
    const raw = readFileSync(envPath, "utf8");
    const line = raw.split(/\r?\n/).find((l) => l.trim().startsWith("RAPIDAPI_KEY="));
    if (line) {
      const val = line.slice(line.indexOf("=") + 1).trim();
      if (val) return val;
    }
  }
  return DEFAULT_API_KEY;
}

const API_KEY = readApiKey();

const HEADERS = () => ({
  "X-RapidAPI-Key": API_KEY,
  "X-RapidAPI-Host": RAPIDAPI_HOST,
});

// ---- 한글 도시명 -> 영어 매핑 ----
// Sky Scrapper는 영어 도시명만 인식하므로, 자주 쓰는 도시는 한글로 넣어도 되게 변환.
// 여기 없는 한글은 그대로 전달됨(영어로 넣으면 항상 동작).
const CITY_ALIAS = {
  // 한국
  "서울": "Seoul", "인천": "Seoul", "부산": "Busan", "제주": "Jeju",
  // 일본
  "도쿄": "Tokyo", "동경": "Tokyo", "오사카": "Osaka", "후쿠오카": "Fukuoka",
  "삿포로": "Sapporo", "나고야": "Nagoya", "오키나와": "Okinawa", "교토": "Kyoto",
  // 동남아
  "방콕": "Bangkok", "다낭": "Da Nang", "하노이": "Hanoi", "호치민": "Ho Chi Minh City",
  "싱가포르": "Singapore", "쿠알라룸푸르": "Kuala Lumpur", "발리": "Bali", "덴파사르": "Denpasar",
  "자카르타": "Jakarta", "마닐라": "Manila", "세부": "Cebu", "푸켓": "Phuket",
  "타이베이": "Taipei", "타이페이": "Taipei", "홍콩": "Hong Kong", "마카오": "Macau",
  "프놈펜": "Phnom Penh", "비엔티안": "Vientiane", "양곤": "Yangon",
  // 중국
  "베이징": "Beijing", "북경": "Beijing", "상하이": "Shanghai", "상해": "Shanghai",
  "광저우": "Guangzhou", "칭다오": "Qingdao",
  // 오세아니아
  "시드니": "Sydney", "멜버른": "Melbourne", "브리즈번": "Brisbane", "골드코스트": "Gold Coast",
  "케언즈": "Cairns", "퍼스": "Perth", "오클랜드": "Auckland", "괌": "Guam", "사이판": "Saipan",
  // 중동
  "두바이": "Dubai", "아부다비": "Abu Dhabi", "도하": "Doha", "이스탄불": "Istanbul",
  // 유럽
  "런던": "London", "파리": "Paris", "로마": "Rome", "바르셀로나": "Barcelona",
  "마드리드": "Madrid", "프랑크푸르트": "Frankfurt", "뮌헨": "Munich", "암스테르담": "Amsterdam",
  "취리히": "Zurich", "프라하": "Prague", "빈": "Vienna", "헬싱키": "Helsinki",
  // 미주
  "뉴욕": "New York", "로스앤젤레스": "Los Angeles", "엘에이": "Los Angeles", "la": "Los Angeles",
  "샌프란시스코": "San Francisco", "시애틀": "Seattle", "라스베이거스": "Las Vegas",
  "하와이": "Honolulu", "호놀룰루": "Honolulu", "밴쿠버": "Vancouver", "토론토": "Toronto",
};

function normalizeCity(raw) {
  const q = String(raw || "").trim();
  // 괄호 안 코드 제거: "서울(ICN)" -> "서울"
  const stripped = q.replace(/\s*\(.*?\)\s*/g, "").trim();
  const hit = CITY_ALIAS[stripped] || CITY_ALIAS[stripped.toLowerCase()];
  return hit || stripped || q;
}

// ---- 공항 검색 캐시 (도시명 -> {skyId, entityId}) ----
// 파일에 저장해 서버를 껐다 켜도 유지됨.
// 한 번 찾은 도시는 다시 API를 쓰지 않아 무료 호출을 크게 아낌.
import { writeFileSync } from "node:fs";
const CACHE_FILE = path.join(__dirname, "airport-cache.json");

function loadAirportCache() {
  try {
    if (existsSync(CACHE_FILE)) {
      const obj = JSON.parse(readFileSync(CACHE_FILE, "utf8"));
      return new Map(Object.entries(obj));
    }
  } catch {}
  return new Map();
}

const airportCache = loadAirportCache();

function saveAirportCache() {
  try {
    writeFileSync(CACHE_FILE, JSON.stringify(Object.fromEntries(airportCache), null, 2));
  } catch {}
}

async function searchAirport(rawQuery) {
  const query = normalizeCity(rawQuery);
  const key = query.trim().toLowerCase();
  if (airportCache.has(key)) return airportCache.get(key);

  const url = new URL(`https://${RAPIDAPI_HOST}/api/v1/flights/searchAirport`);
  url.searchParams.set("query", query);
  url.searchParams.set("locale", "en-US");

  const res = await fetch(url, { headers: HEADERS() });
  if (res.status === 429) {
    throw new Error("무료 호출 한도(월 100회)를 다 썼습니다. 다음 달에 리셋되거나 RapidAPI 유료 플랜이 필요합니다.");
  }
  if (!res.ok) throw new Error(`공항 검색 실패 (${res.status})`);
  const json = await res.json();
  const first = json?.data?.[0];
  if (!first) throw new Error(`'${rawQuery}'(${query}) 공항/도시를 찾지 못했습니다. 영어 도시명으로 넣어보세요.`);

  // 응답 구조상 skyId/entityId 위치가 조금씩 다를 수 있어 방어적으로 추출
  const resolved = {
    skyId: first.skyId || first?.navigation?.relevantFlightParams?.skyId,
    entityId: first.entityId || first?.navigation?.entityId,
    name: first?.presentation?.title || query,
  };
  if (!resolved.skyId || !resolved.entityId) {
    throw new Error(`'${query}'의 공항 코드를 해석하지 못했습니다.`);
  }
  airportCache.set(key, resolved);
  saveAirportCache(); // 파일에 저장 -> 다음부터 이 도시는 API 안 씀
  return resolved;
}

// 가격 결과 단기 캐시 (같은 조건 반복 조회 시 API를 다시 쓰지 않음)
// 실수로 "지금 확인"을 연타해도 호출이 안 나가게 막아줌.
const PRICE_CACHE_TTL_MS = 10 * 60 * 1000; // 10분
const priceCache = new Map();

async function searchCheapestFlight({ origin, destination, date, returnDate }) {
  const cacheKey = `${normalizeCity(origin)}|${normalizeCity(destination)}|${date}|${returnDate || ""}`;
  const cached = priceCache.get(cacheKey);
  if (cached && Date.now() - cached.at < PRICE_CACHE_TTL_MS) {
    return { ...cached.value, cached: true };
  }

  const from = await searchAirport(origin);
  const to = await searchAirport(destination);

  const url = new URL(`https://${RAPIDAPI_HOST}/api/v1/flights/searchFlights`);
  url.searchParams.set("originSkyId", from.skyId);
  url.searchParams.set("destinationSkyId", to.skyId);
  url.searchParams.set("originEntityId", from.entityId);
  url.searchParams.set("destinationEntityId", to.entityId);
  url.searchParams.set("date", date); // 가는 날
  if (returnDate) {
    url.searchParams.set("returnDate", returnDate); // 오는 날 (있으면 왕복)
  }
  url.searchParams.set("adults", "1");
  url.searchParams.set("currency", "KRW");
  url.searchParams.set("market", "ko-KR");
  url.searchParams.set("countryCode", "KR");

  const res = await fetch(url, { headers: HEADERS() });
  if (res.status === 429) {
    throw new Error("무료 호출 한도(월 100회)를 다 썼습니다. 다음 달에 리셋되거나 RapidAPI 유료 플랜이 필요합니다.");
  }
  if (!res.ok) throw new Error(`항공권 검색 실패 (${res.status})`);
  const json = await res.json();
  const itineraries = json?.data?.itineraries || [];

  if (itineraries.length === 0) {
    return { price: null, message: "해당 날짜에 검색된 항공권이 없습니다." };
  }

  const roundTrip = Boolean(returnDate);

  // 최저가 하나만 반환 (왕복이면 왕복 총액)
  let cheapest = null;
  for (const it of itineraries) {
    const raw = it?.price?.raw;
    if (raw != null && (cheapest == null || raw < cheapest.priceRaw)) {
      const outLeg = it.legs?.[0] || {};
      const inLeg = it.legs?.[1] || null; // 왕복이면 오는 편
      cheapest = {
        priceRaw: raw,
        price: Math.round(raw),
        tripType: roundTrip ? "왕복" : "편도",
        carrier: outLeg?.carriers?.marketing?.[0]?.name || "-",
        stops: outLeg?.stopCount ?? null,
        returnStops: inLeg ? (inLeg?.stopCount ?? null) : null,
        departure: outLeg?.departure || null,
        returnDeparture: inLeg?.departure || null,
        from: from.name,
        to: to.name,
      };
    }
  }
  if (cheapest) delete cheapest.priceRaw;
  const result = cheapest || { price: null, message: "가격 정보를 찾지 못했습니다." };

  // 결과가 있으면 단기 캐시에 저장 (10분간 재사용)
  if (result.price != null) {
    priceCache.set(cacheKey, { at: Date.now(), value: result });
  }
  return result;
}

// ---- 정적 파일 서빙 ----
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

async function serveStatic(req, res) {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";
  const filePath = path.join(__dirname, urlPath);

  // 디렉터리 탈출 방지
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403).end("Forbidden");
    return;
  }
  try {
    const data = await readFile(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404).end("Not found");
  }
}

// ---- 요청 라우팅 ----
const server = http.createServer(async (req, res) => {
  // /api/price?origin=...&destination=...&date=YYYY-MM-DD
  if (req.url.startsWith("/api/price")) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");

    if (!API_KEY) {
      res.writeHead(500).end(
        JSON.stringify({ error: "RAPIDAPI_KEY가 설정되지 않았습니다. flight-deals/.env 파일을 확인하세요." })
      );
      return;
    }

    const q = new URL(req.url, `http://localhost:${PORT}`).searchParams;
    const origin = q.get("origin");
    const destination = q.get("destination");
    const date = q.get("date");
    const returnDate = q.get("returnDate"); // 있으면 왕복

    if (!origin || !destination || !date) {
      res.writeHead(400).end(JSON.stringify({ error: "origin, destination, date가 모두 필요합니다." }));
      return;
    }

    try {
      const result = await searchCheapestFlight({ origin, destination, date, returnDate });
      res.writeHead(200).end(JSON.stringify(result));
    } catch (err) {
      res.writeHead(502).end(JSON.stringify({ error: String(err.message || err) }));
    }
    return;
  }

  // 그 외에는 정적 파일
  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`\n항공권 알리미 서버 실행 중`);
  console.log(`  브라우저에서 열기:  http://localhost:${PORT}`);
  if (!API_KEY) {
    console.log(`\n  [주의] RAPIDAPI_KEY가 없습니다. flight-deals/.env 에 키를 넣어주세요.`);
    console.log(`         예: RAPIDAPI_KEY=여기에_키`);
  } else {
    console.log(`  API 키: 로드됨 (무료 플랜은 월 100회 제한이니 아껴 쓰세요)\n`);
  }
});
