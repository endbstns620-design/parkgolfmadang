/**
 * 글이 거의 없는 게시판을 첫 화면 메뉴에서 잠시 감춥니다.
 *
 * 왜 감추나:
 *   방문하신 분이 '동반자 모집'을 눌렀는데 글이 0건이면
 *   "아무도 안 쓰는 곳이구나" 하고 그냥 나가십니다.
 *   그러면 가입도 안 하시고, 글도 안 올라오고, 계속 0건으로 남습니다.
 *   비어 있는 칸은 아무것도 아닌 게 아니라 사이트를 깎아먹습니다.
 *
 * 없애는 게 아닙니다:
 *   - 기능도 주소도 그대로 살아 있습니다 (/동반자모집 로 직접 들어갈 수 있습니다)
 *   - 구장 상세 화면 안의 '동반자 모집하기' · '방문 후기 작성하기' 버튼은 그대로입니다.
 *     원래 그 자리가 제자리입니다 — 그 구장을 보고 있는 분에게만 보이니까요.
 *   - 관리자로 로그인하면 언제나 메뉴에 보입니다.
 *   - 글이 아래 기준만큼 쌓이면 모두에게 자동으로 다시 보입니다. 손댈 필요 없습니다.
 */

/** 이 숫자만큼 글이 있어야 첫 화면 메뉴에 내놓습니다. */
export const BOARD_MIN_POSTS = {
  /** 동반자 모집 — '모집중'인 글 기준. 지난 모집만 남아 있으면 보여드릴 이유가 없습니다. */
  matching: 1,
  /** 구장 리뷰 — 한두 건만 있으면 오히려 허전해 보여서 3건으로 둡니다. */
  reviews: 3
} as const;

export interface BoardVisibilityInput {
  matches: { status?: string }[];
  reviews: unknown[];
  isAdmin: boolean;
}

/** 지금 첫 화면 메뉴에서 감출 게시판 id 목록입니다. */
export function getHiddenBoardIds({ matches, reviews, isAdmin }: BoardVisibilityInput): string[] {
  // 관리자는 언제나 다 보입니다 — 글을 쓰러 들어가셔야 하니까요.
  if (isAdmin) return [];

  const hidden: string[] = [];
  const openMatchCount = matches.filter(m => m.status === '모집중').length;
  if (openMatchCount < BOARD_MIN_POSTS.matching) hidden.push('matching');
  if (reviews.length < BOARD_MIN_POSTS.reviews) hidden.push('reviews');
  return hidden;
}
