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

// ---- API 키 로드 (.env 파일에서, 없으면 환경변수에서) ----
import { readFileSync } from "node:fs";
function readApiKey() {
  if (process.env.RAPIDAPI_KEY) return process.env.RAPIDAPI_KEY.trim();
  const envPath = path.join(__dirname, ".env");
  if (existsSync(envPath)) {
    const raw = readFileSync(envPath, "utf8");
    const line = raw.split(/\r?\n/).find((l) => l.trim().startsWith("RAPIDAPI_KEY="));
    if (line) return line.slice(line.indexOf("=") + 1).trim();
  }
  return null;
}

const API_KEY = readApiKey();

const HEADERS = () => ({
  "X-RapidAPI-Key": API_KEY,
  "X-RapidAPI-Host": RAPIDAPI_HOST,
});

// ---- 공항 검색 캐시 (도시명 -> {skyId, entityId}) ----
// 같은 도시를 반복 검색하지 않도록 메모리에 저장 (서버 켜있는 동안 유지)
const airportCache = new Map();

async function searchAirport(query) {
  const key = query.trim().toLowerCase();
  if (airportCache.has(key)) return airportCache.get(key);

  const url = new URL(`https://${RAPIDAPI_HOST}/api/v1/flights/searchAirport`);
  url.searchParams.set("query", query);
  url.searchParams.set("locale", "en-US");

  const res = await fetch(url, { headers: HEADERS() });
  if (!res.ok) throw new Error(`searchAirport 실패 (${res.status})`);
  const json = await res.json();
  const first = json?.data?.[0];
  if (!first) throw new Error(`'${query}' 공항/도시를 찾지 못했습니다.`);

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
  return resolved;
}

async function searchCheapestFlight({ origin, destination, date }) {
  const from = await searchAirport(origin);
  const to = await searchAirport(destination);

  const url = new URL(`https://${RAPIDAPI_HOST}/api/v1/flights/searchFlights`);
  url.searchParams.set("originSkyId", from.skyId);
  url.searchParams.set("destinationSkyId", to.skyId);
  url.searchParams.set("originEntityId", from.entityId);
  url.searchParams.set("destinationEntityId", to.entityId);
  url.searchParams.set("date", date);
  url.searchParams.set("adults", "1");
  url.searchParams.set("currency", "KRW");
  url.searchParams.set("market", "ko-KR");
  url.searchParams.set("countryCode", "KR");

  const res = await fetch(url, { headers: HEADERS() });
  if (!res.ok) throw new Error(`searchFlights 실패 (${res.status})`);
  const json = await res.json();
  const itineraries = json?.data?.itineraries || [];

  if (itineraries.length === 0) {
    return { price: null, message: "해당 날짜에 검색된 항공권이 없습니다." };
  }

  // 최저가 하나만 반환
  let cheapest = null;
  for (const it of itineraries) {
    const raw = it?.price?.raw;
    if (raw != null && (cheapest == null || raw < cheapest.price)) {
      const leg = it.legs?.[0] || {};
      cheapest = {
        price: Math.round(raw),
        carrier: leg?.carriers?.marketing?.[0]?.name || "-",
        stops: leg?.stopCount ?? null,
        departure: leg?.departure || null,
        from: from.name,
        to: to.name,
      };
    }
  }
  return cheapest || { price: null, message: "가격 정보를 찾지 못했습니다." };
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

    if (!origin || !destination || !date) {
      res.writeHead(400).end(JSON.stringify({ error: "origin, destination, date가 모두 필요합니다." }));
      return;
    }

    try {
      const result = await searchCheapestFlight({ origin, destination, date });
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
