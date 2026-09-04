import React from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { ShieldCheck, PhoneCall, Heart, MapPin, Trophy, Users, Megaphone, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { openModal, isAdmin, setActiveTab } = useParkGolf();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-16 px-4 sm:px-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-green-600 to-emerald-400 text-white flex items-center justify-center font-extrabold text-xl shadow-md">
                ⛳
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                파크골프마당
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              전국 지자체 직영 파크골프장 정보, 실시간 대회 일정, 구장 리뷰 및 동호회 라운딩 동반자 매칭을 지원하는 대한민국 대표 시니어 파크골프 포털입니다.
            </p>

            <div className="pt-2">
              <button
                onClick={() => openModal('admin')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-800 text-xs font-bold transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isAdmin ? '관리자 모드 열기 (접속 중)' : '관리자 로그인'}</span>
              </button>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white tracking-wider uppercase">
              주요 카테고리
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('courses');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  🏌️ 전국 파크골프 구장 (지자체 직영)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('tournaments');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  🏆 전국 대회 소식 (실시간 접수 일정)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('news');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  📰 파크골프 뉴스 · 레슨
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('reviews');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  ⭐ 생생 구장 리뷰 (솔직 후기)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('matching');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  👥 라운딩 동반자 모집 (조편성 매칭)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('associations');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 font-bold transition-colors text-emerald-400 text-left cursor-pointer"
                >
                  🏛️ 파크골프 관련 협회 및 주요 연맹 (본회·연맹·시도협회)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('associations');
                    window.dispatchEvent(new CustomEvent('open-rules-subtab', { detail: 'dataForm' }));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer text-left"
                >
                  📜 협회 규정 · 제보 및 데이터 접수처
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Regional Direct Centers */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white tracking-wider uppercase">
              지자체 직영 주요 거점
            </h4>
            <div className="text-xs sm:text-sm space-y-1.5 text-slate-400">
              <div>• <strong>화천 산천어</strong> (36홀 / 033-440-2715)</div>
              <div>• <strong>양평 강상</strong> (36홀 / 031-770-2468)</div>
              <div>• <strong>대구 수성 패밀리</strong> (36홀 / 053-666-3240)</div>
              <div>• <strong>충주 호암</strong> (36홀 / 043-850-6720)</div>
              <div>• <strong>경남 밀양 가곡</strong> (36홀 / 055-359-5788)</div>
              <div>• <strong>목포 부주산</strong> (18홀 / 061-270-8335)</div>
            </div>
          </div>

          {/* Col 4: Helpline & Association Notice */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white tracking-wider uppercase">
              고객 지원 & 제휴 문의
            </h4>
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-xs text-slate-400">포털 및 제휴 입점 문의 전화</div>
              <div className="text-xl font-extrabold text-amber-300">1588-7282</div>
              <div className="text-xs text-slate-400">평일 09:00 ~ 18:00 (점심시간 12:00 ~ 13:00)</div>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              * 본 사이트의 구장 및 대회 정보는 각 지자체 및 대한파크골프협회 공지 데이터를 기반으로 실시간 최신화됩니다.
            </p>
          </div>
        </div>

        {/* Bottom copyright & Policy Links */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © 2026 파크골프마당 (ParkGolfMadang). All rights reserved. 대한민국 시니어 파크골프 포털
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-medium">
            <button
              id="footer-link-terms"
              onClick={() => {
                setActiveTab('associations');
                window.dispatchEvent(new CustomEvent('open-rules-subtab', { detail: 'terms' }));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-slate-400 hover:text-amber-300 transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
              이용약관
            </button>
            <button
              id="footer-link-privacy"
              onClick={() => {
                setActiveTab('associations');
                window.dispatchEvent(new CustomEvent('open-rules-subtab', { detail: 'privacy' }));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-slate-400 hover:text-amber-300 transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
              개인정보처리방침
            </button>
            <button
              id="footer-link-rules"
              onClick={() => {
                setActiveTab('associations');
                window.dispatchEvent(new CustomEvent('open-rules-subtab', { detail: 'dataForm' }));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-amber-400 hover:text-amber-300 font-bold transition-colors underline-offset-4 hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>대한파크골프협회 규정 및 제보센터 (실시간 수집)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">공식</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
