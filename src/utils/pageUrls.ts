/**
 * 구장·대회·맛집마다 각자의 주소(URL)를 만들어 주는 규칙입니다.
 *
 * 왜 필요한가:
 *   검색엔진은 "주소 하나 = 페이지 하나"로 인식합니다. 예전에는 어느 탭을 눌러도
 *   주소가 parkgolf-madang.co.kr 하나뿐이어서, 구장 552곳이 검색에 전혀 잡히지 않았습니다.
 *   이제 구장마다 /구장/서재파크골프장 같은 주소를 갖게 해서 각각 검색될 수 있게 합니다.
 *
 * 서버(server.ts)와 화면(React) 양쪽에서 같은 규칙을 써야 하므로 이 파일 하나로 모았습니다.
 */

export const COURSE_PREFIX = '/구장/';
export const TOURNAMENT_PREFIX = '/대회/';
export const RESTAURANT_PREFIX = '/맛집/';

/** 주소에 쓸 수 있도록 이름을 다듬습니다. (한글은 그대로 두고 공백만 붙입니다) */
export function slugify(text: string): string {
  return String(text || '')
    .trim()
    .replace(/[\/\\?#&%+.]/g, '')  // 주소에서 특별한 뜻을 갖는 기호는 제거
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** '경기도 가평군' → '가평군' 처럼 짧은 지역명만 뽑습니다. (같은 이름 구장을 구분할 때 씁니다) */
function shortRegion(subRegion?: string): string {
  const parts = String(subRegion || '').trim().split(/\s+/);
  return parts.length > 1 ? parts[parts.length - 1] : parts[0] || '';
}

export interface SlugTarget {
  id: string;
  name: string;
  subRegion?: string;
}

/**
 * 목록 전체를 훑어 slug ↔ 항목을 짝지어 줍니다.
 * 이름이 겹치는 구장(예: 진천파크골프장 2곳)은 뒤에 지역명을 붙여 구분합니다.
 */
export function buildSlugMaps<T extends SlugTarget>(items: T[]) {
  const nameCount = new Map<string, number>();
  items.forEach(i => {
    const base = slugify(i.name);
    nameCount.set(base, (nameCount.get(base) || 0) + 1);
  });

  const bySlug = new Map<string, T>();
  const slugById = new Map<string, string>();

  items.forEach(i => {
    const base = slugify(i.name);
    let slug = base;
    if ((nameCount.get(base) || 0) > 1) {
      const suffix = slugify(shortRegion(i.subRegion));
      slug = suffix ? `${base}-${suffix}` : base;
    }
    // 그래도 겹치면 뒤에 번호를 붙여 반드시 하나만 남게 합니다.
    let unique = slug;
    let n = 2;
    while (bySlug.has(unique)) unique = `${slug}-${n++}`;
    bySlug.set(unique, i);
    slugById.set(i.id, unique);
  });

  return { bySlug, slugById };
}

function encodePath(prefix: string, slug: string): string {
  // 사이트맵과 canonical 주소는 표준 형식(퍼센트 인코딩)이어야 검색엔진이 제대로 읽습니다.
  return prefix.split('/').map(encodeURIComponent).join('/') + encodeURIComponent(slug);
}

export function coursePath(slug: string): string {
  return encodePath(COURSE_PREFIX, slug);
}
export function tournamentPath(slug: string): string {
  return encodePath(TOURNAMENT_PREFIX, slug);
}
export function restaurantPath(slug: string): string {
  return encodePath(RESTAURANT_PREFIX, slug);
}

/** 지금 열려 있는 주소가 어떤 상세페이지인지 알려줍니다. */
export function parseDetailPath(pathname: string): { kind: 'course' | 'tournament' | 'restaurant'; slug: string } | null {
  const decoded = (() => {
    try {
      return decodeURIComponent(pathname);
    } catch {
      return pathname;
    }
  })();
  if (decoded.startsWith(COURSE_PREFIX)) {
    return { kind: 'course', slug: decoded.slice(COURSE_PREFIX.length) };
  }
  if (decoded.startsWith(TOURNAMENT_PREFIX)) {
    return { kind: 'tournament', slug: decoded.slice(TOURNAMENT_PREFIX.length) };
  }
  if (decoded.startsWith(RESTAURANT_PREFIX)) {
    return { kind: 'restaurant', slug: decoded.slice(RESTAURANT_PREFIX.length) };
  }
  return null;
}
