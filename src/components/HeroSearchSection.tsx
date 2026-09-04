import React from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { Sparkles } from 'lucide-react';

export const HeroSearchSection: React.FC = () => {
  const {
    courses,
    tournaments,
    matches
  } = useParkGolf();

  return (
    <section className="relative bg-gradient-to-b from-green-950 via-emerald-950 to-green-950 text-white pt-10 pb-14 px-4 sm:px-6 overflow-hidden">
      {/* Background Park Golf Imagery with Gradient Overlay (Unsplash Free License) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=2000&q=80"
          alt="푸른 잔디와 파크골프 페어웨이 전경"
          className="w-full h-full object-cover object-center opacity-30 filter blur-[1.5px] scale-105 transition-all duration-700"
          referrerPolicy="no-referrer"
        />
        {/* Soft Multi-layered Gradient Overlays for High Contrast & Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-950/85 via-emerald-950/70 to-green-950/95" />
        <div className="absolute inset-0 bg-radial-at-t from-emerald-900/30 via-transparent to-green-950/80" />
      </div>

      {/* Decorative Glow Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-500 blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-amber-400 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Main Headline */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-800/80 border border-green-600 text-amber-300 text-xs sm:text-sm font-bold mb-4 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>전국 파크골프 동호인들이 함께 만들어가는 커뮤니티</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3 leading-tight">
          함께 치고, 함께 나누는 <br className="hidden sm:inline" />
          <span className="text-amber-300">파크골프 동호인 커뮤니티</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-green-100 max-w-3xl mx-auto mb-6 font-medium leading-relaxed">
          전국 구장의 예약방법 · 이용상태 · 근처 맛집까지 동호인들이 직접 나누는 최신 정보,
          <br className="hidden sm:inline" />
          같이 라운딩할 동반자 매칭, 생생한 구장 후기까지 — 여기서 다 만나보세요!
        </p>

        {/* Live Key Metrics Bar for Trust */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto pt-6 border-t border-green-800/60">
          <div className="bg-green-800/40 backdrop-blur-sm rounded-xl p-3 border border-green-700/50">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">{courses.length}+</div>
            <div className="text-xs sm:text-sm text-green-100 font-medium">전국 지자체 직영 구장</div>
          </div>
          <div className="bg-green-800/40 backdrop-blur-sm rounded-xl p-3 border border-green-700/50">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">{tournaments.length}건</div>
            <div className="text-xs sm:text-sm text-green-100 font-medium">전국 대회 실시간 일정</div>
          </div>
          <div className="bg-green-800/40 backdrop-blur-sm rounded-xl p-3 border border-green-700/50">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">
              {matches.filter(m => m.status === '모집중').length}팀
            </div>
            <div className="text-xs sm:text-sm text-green-100 font-medium">동호회 라운딩 모집 중</div>
          </div>
        </div>
      </div>
    </section>
  );
};
