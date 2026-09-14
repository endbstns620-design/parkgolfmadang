import type { MouseEvent } from 'react';

/**
 * 구장 상세 페이지 주소를 만듭니다.
 *
 * 서버가 실제로 내려주는 주소 규칙과 똑같이 맞춰야 합니다.
 *   '가평파크골프장'       → /구장/가평파크골프장
 *   '고양 한별파크골프장'  → /구장/고양-한별파크골프장
 *   '계양경기장 파크골프장' → /구장/계양경기장-파크골프장
 *
 * 띄어쓰기는 하이픈(-)으로 바꾸고, 나머지는 주소 규칙에 맞게 인코딩합니다.
 */
export function buildCourseHref(name: string): string {
  const slug = String(name || '')
    .trim()
    .replace(/\s+/g, '-');
  return `/구장/${encodeURIComponent(slug)}`;
}

/**
 * 구장 카드를 <a> 링크로 감쌀 때 쓰는 클릭 처리입니다.
 *
 * - 그냥 클릭하면  → 지금까지처럼 팝업만 열립니다 (화면 동작 그대로)
 * - Ctrl/⌘ + 클릭 → 새 탭에서 구장 페이지가 열립니다
 * - 마우스 우클릭  → '링크 주소 복사'가 됩니다
 *
 * 검색엔진은 클릭을 못 하고 href만 따라가므로, 이 href가 있어야
 * 구글이 627개 구장 페이지를 발견할 수 있습니다.
 */
export function handleCourseLinkClick(
  e: MouseEvent<HTMLAnchorElement>,
  open: () => void
): void {
  if (e.defaultPrevented) return;
  // 새 탭으로 열려는 클릭은 브라우저에 그대로 맡깁니다.
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  e.preventDefault();
  open();
}
