import { MatchingPost } from '../types';

/**
 * Extracts and parses a Date object from user-provided date text
 * Supports:
 * - YYYY-MM-DD (e.g. 2026-03-12)
 * - YYYY.MM.DD / YYYY/MM/DD / YYYY년 M월 D일
 * - M월 D일 / MM-DD (e.g. 3월 12일, 03/12)
 */
export function parseMeetDate(text?: string): Date | null {
  if (!text) return null;

  const currentYear = new Date().getFullYear();

  // 1. Full date pattern: YYYY-MM-DD or YYYY.MM.DD or YYYY/MM/DD or YYYY년 M월 D일
  const fullDateMatch = text.match(/(\d{4})[-./년\s]+(\d{1,2})[-./월\s]+(\d{1,2})/);
  if (fullDateMatch) {
    const year = parseInt(fullDateMatch[1], 10);
    const month = parseInt(fullDateMatch[2], 10) - 1;
    const day = parseInt(fullDateMatch[3], 10);
    if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
      return new Date(year, month, day);
    }
  }

  // 2. Month-Day pattern: M월 D일 or MM/DD or MM-DD (assumes current year)
  const monthDayMatch = text.match(/(\d{1,2})[월/.-]\s*(\d{1,2})(?:일)?/);
  if (monthDayMatch) {
    const month = parseInt(monthDayMatch[1], 10) - 1;
    const day = parseInt(monthDayMatch[2], 10);
    if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
      return new Date(currentYear, month, day);
    }
  }

  // 3. Fallback standard Date parsing
  const standardDate = new Date(text);
  if (!isNaN(standardDate.getTime()) && standardDate.getFullYear() > 2000) {
    return standardDate;
  }

  return null;
}

/**
 * Determines whether a matching post is expired and should be automatically deleted:
 * 1. Meet date passed condition: 1 full day (24h) after the end of the meeting date (23:59:59).
 * 2. Closed status condition: 1 full day (24h) after the post was marked as '마감' (closedAt).
 */
export function isMatchingPostExpired(post: MatchingPost, now: Date = new Date()): boolean {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const currentTimestamp = now.getTime();

  // Condition 1: If post is marked as closed ('마감') and 1 day has passed
  if (post.status === '마감') {
    if (post.closedAt) {
      const closedTime = new Date(post.closedAt).getTime();
      if (!isNaN(closedTime) && currentTimestamp - closedTime >= ONE_DAY_MS) {
        return true;
      }
    }
  }

  // Condition 2: Check meeting date in meetDate field, or fallback to text in title/description
  const parsedDate =
    parseMeetDate(post.meetDate) ||
    parseMeetDate(post.title) ||
    parseMeetDate(post.description);

  if (parsedDate) {
    // End of the meeting day (23:59:59.999)
    const endOfMeetingDay = new Date(
      parsedDate.getFullYear(),
      parsedDate.getMonth(),
      parsedDate.getDate(),
      23,
      59,
      59,
      999
    ).getTime();

    // 1 full day after the meeting day ends
    if (currentTimestamp - endOfMeetingDay >= ONE_DAY_MS) {
      return true;
    }
  }

  return false;
}

/**
 * Filter out expired matching posts
 */
export function cleanExpiredMatches(posts: MatchingPost[], now: Date = new Date()): {
  activePosts: MatchingPost[];
  removedCount: number;
} {
  const activePosts = posts.filter(post => !isMatchingPostExpired(post, now));
  const removedCount = posts.length - activePosts.length;
  return { activePosts, removedCount };
}

/**
 * Formats D-Day and remaining time badge for UI display
 */
export function getMeetDateBadgeInfo(post: MatchingPost, now: Date = new Date()): {
  dDayText: string;
  badgeClass: string;
  isPassed: boolean;
  autoDeleteNotice?: string;
} {
  if (post.status === '마감') {
    return {
      dDayText: '🔴 마감',
      badgeClass: 'bg-slate-700 text-white',
      isPassed: false,
      autoDeleteNotice: '마감 처리됨 (1일 후 자동삭제)'
    };
  }

  const parsedDate = parseMeetDate(post.meetDate);
  if (!parsedDate) {
    return {
      dDayText: '모집중',
      badgeClass: 'bg-emerald-600 text-white',
      isPassed: false
    };
  }

  const todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const meetZero = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()).getTime();
  const diffDays = Math.round((meetZero - todayZero) / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return {
      dDayText: `D-${diffDays}`,
      badgeClass: diffDays <= 2 ? 'bg-amber-500 text-green-950 font-black animate-bounce' : 'bg-emerald-600 text-white',
      isPassed: false
    };
  } else if (diffDays === 0) {
    return {
      dDayText: '⚡ 오늘 라운딩',
      badgeClass: 'bg-rose-600 text-white font-black animate-pulse',
      isPassed: false
    };
  } else if (diffDays === -1) {
    return {
      dDayText: '어제 종료',
      badgeClass: 'bg-slate-500 text-white',
      isPassed: true,
      autoDeleteNotice: '날짜 경과 (오늘 자정 자동삭제 예정)'
    };
  } else {
    return {
      dDayText: '종료됨',
      badgeClass: 'bg-slate-400 text-white',
      isPassed: true,
      autoDeleteNotice: '1일 경과로 곧 자동삭제됩니다'
    };
  }
}
