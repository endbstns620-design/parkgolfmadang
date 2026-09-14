import type { MouseEvent } from 'react';
import { buildSlugMaps, coursePath, SlugTarget } from './pageUrls';

/**
 * 구장 상세 주소를 만듭니다.
 *
 * 주소 규칙은 새로 만들지 않고, 서버(server.ts)가 쓰는 pageUrls.ts 규칙을
 * 그대로 씁니다. 서버와 화면이 다른 규칙을 쓰면 이름이 겹치는 구장
 * (예: 대부도파크골프장 2곳)에서 주소가 어긋나 첫 화면으로 튕깁니다.
 *
 * buildSlugMaps는 목록 전체를 훑어야 이름 중복을 찾아낼 수 있으므로,
 * 반드시 '거른 목록'이 아니라 '구장 전체 목록(courses)'을 넣어야 합니다.
 *
 * 쓰는 법:
 *   const courseHrefs = useMemo(() => buildCourseHrefMap(courses), [courses]);
 *   <a href={courseHrefs.get(course.id)}>
 */
export function buildCourseHrefMap(courses: SlugTarget[]): Map<string, string> {
  const { slugById } = buildSlugMaps(courses);
  const hrefById = new Map<string, string>();
  slugById.forEach((slug, id) => hrefById.set(id, coursePath(slug)));
  return hrefById;
}

/**
 * 구장 카드를 <a> 링크로 감쌀 때 쓰는 클릭 처리입니다.
 *
 * - 그냥 클릭하면  → 지금까지처럼 팝업만 열립니다 (화면 동작 그대로)
 * - Ctrl/Cmd + 클릭 → 새 탭에서 구장 페이지가 열립니다
 * - 마우스 우클릭  → '링크 주소 복사'가 됩니다
 *
 * 검색엔진은 클릭을 못 하고 href만 따라가므로, 이 href가 있어야
 * 구글이 구장 페이지를 발견할 수 있습니다.
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
