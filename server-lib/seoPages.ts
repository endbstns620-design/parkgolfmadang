/**
 * 검색엔진이 읽을 수 있는 "구장별 · 대회별 · 맛집별" 페이지를 만들어 주는 곳입니다.
 *
 * 문제:
 *   우리 사이트는 화면을 브라우저가 그리는 방식(SPA)이라, 검색로봇이 주소를 열어보면
 *   내용이 텅 빈 껍데기만 받아갑니다. 그래서 구장 552곳이 검색에 하나도 안 잡혔습니다.
 *
 * 해결:
 *   서버가 응답할 때 제목·설명·본문을 미리 채워서 보냅니다.
 *   방문자 화면은 그대로입니다 — 잠깐 이 내용이 보이다가 평소 화면으로 바뀝니다.
 *   (오히려 화면이 더 빨리 뜨는 효과도 있습니다)
 */

const SITE_NAME = "파크골프마당";
const BASE_URL = "https://parkgolf-madang.co.kr";

function esc(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 값이 "확인 필요" 같은 빈 내용이면 표에서 빼기 위해 걸러냅니다. */
function has(v: unknown): boolean {
  const s = String(v ?? "").trim();
  if (!s) return false;
  // 아직 조사되지 않은 항목은 표에 넣지 않습니다. (내용 없는 페이지로 보이면 검색에 불리합니다)
  return !/(확인\s*필요|확인필요|문의\s*필요|문의\s*요망|직접\s*문의|정보\s*없음|미정|^-$)/.test(s);
}

function rows(pairs: [string, unknown][]): string {
  return pairs
    .filter(([, v]) => has(v))
    .map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`)
    .join("\n");
}

export interface SeoPage {
  title: string;
  description: string;
  canonical: string;
  bodyHtml: string;
  jsonLd?: string;
}

export interface CourseContext {
  /** 같은 지역의 다른 구장 (이름, 주소경로) */
  nearbyCourses: { name: string; path: string; scale?: string }[];
  /** 이 구장 근처 맛집 */
  nearbyRestaurants: { name: string; path: string; menu?: string }[];
  /** 위 목록이 전부 같은 시·군인지 (제목 문구를 정확히 쓰기 위함) */
  allSameCity?: boolean;
}

/** 구장 한 곳의 검색용 페이지 내용 */
export function coursePage(c: any, path: string, ctx?: CourseContext): SeoPage {
  const scale = c.courseScale || (c.holes ? `${c.holes}홀` : "");
  const title = `${c.name} - 위치·요금·휴무일·예약 안내 | ${SITE_NAME}`;
  const descParts = [
    `${c.name}(${c.subRegion || c.region})`,
    scale && `${scale} 규모`,
    has(c.address) && `주소 ${c.address}`,
    has(c.operatingHours) && `운영시간 ${c.operatingHours}`,
    has(c.closedDays) && `휴무 ${c.closedDays}`
  ].filter(Boolean);
  const description = `${descParts.join(", ")}. 전국 파크골프장 552곳 정보를 제공하는 ${SITE_NAME}에서 확인하세요.`.slice(0, 155);

  const bodyHtml = `
    <article class="seo-detail">
      <nav class="seo-crumb"><a href="/">${SITE_NAME}</a> › <a href="/구장">전국 구장</a> › <span>${esc(c.name)}</span></nav>
      <h1>${esc(c.name)}</h1>
      <p class="seo-lead">${esc(c.subRegion || c.region)}${scale ? ` · ${esc(scale)}` : ""}</p>
      <table class="seo-table"><tbody>
${rows([
    ["주소", c.address],
    ["규모", scale],
    ["운영시간", c.operatingHours],
    ["휴무일", c.closedDays],
    ["이용료(지역민)", c.feeLocal],
    ["이용료(외지인)", c.feeVisitor],
    ["예약방법", c.reservationDetails || c.reservationType],
    ["주차", c.parkingDetails],
    ["전화", c.phoneNumber],
    ["운영기관", c.operatedBy]
  ])}
      </tbody></table>
      <p class="seo-note">이 페이지의 정보는 전국 파크골프장 전수조사 자료를 바탕으로 정리했습니다. 방문 전 전화로 최종 확인해주세요.</p>
${
  ctx && ctx.nearbyRestaurants.length
    ? `      <section class="seo-links">
        <h2>${esc(c.name)} 근처 맛집</h2>
        <ul>${ctx.nearbyRestaurants
            .map(r => `<li><a href="${esc(r.path)}">${esc(r.name)}</a>${r.menu ? ` — ${esc(r.menu)}` : ""}</li>`)
            .join("")}</ul>
      </section>`
    : ""
}
${
  ctx && ctx.nearbyCourses.length
    ? `      <section class="seo-links">
        <h2>${ctx.allSameCity ? `${esc(c.subRegion || c.region)}의 다른 파크골프장` : "가까운 지역의 다른 파크골프장"}</h2>
        <ul>${ctx.nearbyCourses
            .map(n => `<li><a href="${esc(n.path)}">${esc(n.name)}</a>${n.scale ? ` — ${esc(n.scale)}` : ""}</li>`)
            .join("")}</ul>
      </section>`
    : ""
}
      <p class="seo-note"><a href="/">전국 파크골프장 552곳 · 2026년 대회일정 · 구장 근처 맛집 보러가기</a></p>
    </article>`;

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: c.name,
    address: { "@type": "PostalAddress", streetAddress: c.address, addressCountry: "KR" },
    telephone: has(c.phoneNumber) ? c.phoneNumber : undefined,
    openingHours: has(c.operatingHours) ? c.operatingHours : undefined,
    url: BASE_URL + path
  });

  return { title, description, canonical: BASE_URL + path, bodyHtml, jsonLd };
}

/** 대회 하나의 검색용 페이지 내용 */
export function tournamentPage(t: any, path: string): SeoPage {
  const title = `${t.title} - 일정·장소·접수 안내 | ${SITE_NAME}`;
  const description = `${t.title}. ${has(t.dateRange) ? `일정 ${t.dateRange}. ` : ""}${has(t.location) ? `장소 ${t.location}. ` : ""}${has(t.registrationPeriod) ? `접수 ${t.registrationPeriod}.` : ""}`.slice(0, 155);

  const bodyHtml = `
    <article class="seo-detail">
      <nav class="seo-crumb"><a href="/">${SITE_NAME}</a> › <a href="/대회">대회 소식</a> › <span>${esc(t.title)}</span></nav>
      <h1>${esc(t.title)}</h1>
      <p class="seo-lead">${esc(t.location || "")}</p>
      <table class="seo-table"><tbody>
${rows([
    ["대회 일정", t.dateRange || t.eventDate],
    ["장소", t.location],
    ["접수 기간", t.registrationPeriod],
    ["참가 자격", t.eligibility],
    ["접수 방법", t.registrationMethod],
    ["참가비", t.participationFee],
    ["시상", t.prizePool],
    ["유의사항", t.rulesDetail]
  ])}
      </tbody></table>
      <p class="seo-note">일정과 접수 내용은 변경될 수 있습니다. 신청 전 주최측 공식 요강을 반드시 확인해주세요.</p>
    </article>`;

  return { title, description, canonical: BASE_URL + path, bodyHtml };
}

/** 맛집 하나의 검색용 페이지 내용 */
export function restaurantPage(r: any, path: string): SeoPage {
  const title = `${r.restaurantName} - ${r.courseName} 근처 맛집 | ${SITE_NAME}`;
  const description = `${r.restaurantName}(${r.region}). ${has(r.menu) ? `${r.menu}. ` : ""}${has(r.address) ? `${r.address}. ` : ""}${r.courseName} 파크골프장 근처 맛집 정보.`.slice(0, 155);

  const bodyHtml = `
    <article class="seo-detail">
      <nav class="seo-crumb"><a href="/">${SITE_NAME}</a> › <a href="/맛집">근처 맛집</a> › <span>${esc(r.restaurantName)}</span></nav>
      <h1>${esc(r.restaurantName)}</h1>
      <p class="seo-lead">${esc(r.courseName)} 근처 · ${esc(r.region)}</p>
      <table class="seo-table"><tbody>
${rows([
    ["대표 메뉴", r.menu],
    ["주소", r.address],
    ["전화", r.phoneNumber],
    ["영업시간", r.businessHours],
    ["가까운 구장", r.courseName]
  ])}
      </tbody></table>
    </article>`;

  return { title, description, canonical: BASE_URL + path, bodyHtml };
}

/**
 * 기본 index.html에 위 내용을 끼워 넣습니다.
 * 본문은 <div id="root"> 안에 넣어서, 화면이 뜨면 평소 내용으로 자연스럽게 바뀝니다.
 */
export function injectSeo(baseHtml: string, page: SeoPage): string {
  let html = baseHtml;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(page.title)}</title>`);
  html = html.replace(
    /<meta name="description"[^>]*>/,
    `<meta name="description" content="${esc(page.description)}" />`
  );
  html = html.replace(
    /<meta property="og:title"[^>]*>/,
    `<meta property="og:title" content="${esc(page.title)}" />`
  );
  html = html.replace(
    /<meta property="og:description"[^>]*>/,
    `<meta property="og:description" content="${esc(page.description)}" />`
  );

  const extraHead =
    `<link rel="canonical" href="${esc(page.canonical)}" />\n` +
    `<meta property="og:url" content="${esc(page.canonical)}" />\n` +
    (page.jsonLd ? `<script type="application/ld+json">${page.jsonLd}</script>\n` : "") +
    `<style>
      .seo-detail{max-width:820px;margin:0 auto;padding:28px 20px 60px;font-family:system-ui,'Malgun Gothic',sans-serif;color:#0f172a;line-height:1.7}
      .seo-crumb{font-size:15px;color:#475569;margin-bottom:14px}
      .seo-crumb a{color:#047857;text-decoration:none;font-weight:700}
      .seo-detail h1{font-size:30px;font-weight:900;margin:0 0 6px;letter-spacing:-.02em}
      .seo-lead{font-size:18px;font-weight:700;color:#047857;margin:0 0 20px}
      .seo-table{width:100%;border-collapse:collapse;font-size:17px}
      .seo-table th{width:34%;text-align:left;padding:12px 10px;background:#f0fdf4;border:1px solid #d1fae5;font-weight:800;color:#065f46;vertical-align:top}
      .seo-table td{padding:12px 10px;border:1px solid #e2e8f0;vertical-align:top}
      .seo-note{margin-top:18px;font-size:15px;color:#64748b}
      .seo-note a{color:#047857;font-weight:700}
      .seo-links{margin-top:30px}
      .seo-links h2{font-size:21px;font-weight:900;margin:0 0 10px;color:#065f46}
      .seo-links ul{margin:0;padding-left:20px}
      .seo-links li{margin:6px 0;font-size:17px}
      .seo-links a{color:#047857;font-weight:700;text-decoration:none}
    </style>\n`;

  html = html.replace("</head>", `${extraHead}</head>`);
  html = html.replace('<div id="root"></div>', `<div id="root">${page.bodyHtml}</div>`);

  return html;
}
