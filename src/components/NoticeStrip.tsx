import React from 'react';
import { Megaphone, ChevronRight } from 'lucide-react';
import { useParkGolf } from '../context/ParkGolfContext';
import { SITE_NOTICES } from '../data/siteNoticesData';

// 'YYYY-MM-DD' → '9월 12일'
const toKoreanDate = (iso: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${Number(m[2])}월 ${Number(m[3])}일`;
};

// 메인 화면 맨 위의 한 줄 공지 띠입니다.
// 새로 올라온 소식이 있다는 것만 알려주고, 자세한 내용은 공지사항 화면에서 봅니다.
export const NoticeStrip: React.FC = () => {
  const { setActiveTab } = useParkGolf();
  const latest = SITE_NOTICES[0];
  if (!latest) return null;

  const goToNotices = () => {
    setActiveTab('notices');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      id="home-notice-strip"
      onClick={goToNotices}
      className="w-full bg-amber-50 hover:bg-amber-100 border-b-2 border-amber-300 transition-colors cursor-pointer text-left"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2.5 sm:gap-3">
        <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-800 text-white text-sm sm:text-base font-black">
          <Megaphone className="w-4 h-4" />
          <span>공지</span>
        </span>
        <span className="shrink-0 hidden sm:inline text-base font-bold text-amber-800">
          {toKoreanDate(latest.date)}
        </span>
        <span className="flex-1 min-w-0 text-base sm:text-lg font-black text-slate-900 truncate">
          {latest.title}
        </span>
        <span className="shrink-0 inline-flex items-center gap-0.5 text-sm sm:text-base font-bold text-green-800">
          <span className="hidden sm:inline">전체 보기</span>
          <ChevronRight className="w-5 h-5" />
        </span>
      </div>
    </button>
  );
};
