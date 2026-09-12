import React from 'react';
import { Megaphone, Trophy, MapPin, Info, ChevronLeft } from 'lucide-react';
import { useParkGolf } from '../context/ParkGolfContext';
import { SITE_NOTICES } from '../data/siteNoticesData';
import { SiteNoticeKind } from '../types';

// 'YYYY-MM-DD' → '2026년 9월 12일'
const toKoreanDate = (iso: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${m[1]}년 ${Number(m[2])}월 ${Number(m[3])}일`;
};

const KIND_STYLE: Record<SiteNoticeKind, { chip: string; icon: React.ReactNode }> = {
  대회: {
    chip: 'bg-amber-100 text-amber-900 border-amber-300',
    icon: <Trophy className="w-4 h-4" />
  },
  구장: {
    chip: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    icon: <MapPin className="w-4 h-4" />
  },
  안내: {
    chip: 'bg-slate-100 text-slate-700 border-slate-300',
    icon: <Info className="w-4 h-4" />
  }
};

export const NoticeSection: React.FC = () => {
  const { setActiveTab } = useParkGolf();

  return (
    <section
      id="section-notices"
      className="scroll-mt-28 py-8 sm:py-10 px-3 sm:px-6 max-w-5xl mx-auto bg-gradient-to-b from-amber-50/50 via-white to-stone-50/60 rounded-3xl my-8 border border-amber-200/80 shadow-sm"
    >
      {/* Section Header */}
      <div className="mb-6 pb-4 border-b border-amber-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/80 text-amber-950 text-xs sm:text-sm font-extrabold mb-2 border border-amber-300">
          <Megaphone className="w-4 h-4 text-amber-700" />
          <span>📢 파크골프마당 업데이트 소식</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2 flex-wrap">
          <span>공지사항</span>
          <span className="text-sm sm:text-base font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
            총 {SITE_NOTICES.length}건
          </span>
        </h2>
        <p className="text-base sm:text-lg text-slate-600 mt-1.5 font-medium leading-relaxed">
          새로 올라온 대회와 구장 정보를 여기에 알려드립니다
        </p>
      </div>

      {/* 공지 목록 */}
      {SITE_NOTICES.length === 0 ? (
        <p className="py-12 text-center text-lg font-bold text-slate-500">
          아직 올라온 공지가 없습니다.
        </p>
      ) : (
        <div className="space-y-4">
          {SITE_NOTICES.map(n => {
            const style = KIND_STYLE[n.kind] ?? KIND_STYLE['안내'];
            return (
              <article
                key={n.id}
                className="bg-white rounded-2xl p-4 sm:p-6 border border-amber-200/90 shadow-sm"
              >
                <div className="flex items-center gap-2.5 flex-wrap mb-2.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-sm sm:text-base font-black ${style.chip}`}
                  >
                    {style.icon}
                    <span>{n.kind}</span>
                  </span>
                  <span className="text-sm sm:text-base font-bold text-slate-500">
                    {toKoreanDate(n.date)}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug mb-3">
                  {n.title}
                </h3>

                <div className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
                  {n.lines.map((line, i) =>
                    line === '' ? (
                      <div key={i} className="h-3" />
                    ) : (
                      <p key={i} className="mb-1">
                        {line}
                      </p>
                    )
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* 돌아가기 */}
      <div className="mt-8 flex justify-center">
        <button
          id="notice-back-home"
          onClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-green-800 hover:bg-green-900 text-white font-black text-base sm:text-lg shadow-[0_3px_0_#14532d] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>첫 화면으로</span>
        </button>
      </div>
    </section>
  );
};
