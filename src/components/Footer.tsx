import React from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { ShieldCheck, PhoneCall, Heart, MapPin, Trophy, Users, Megaphone, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { openModal, isAdmin, setActiveTab } = useParkGolf();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-16 px-4 sm:px-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

          {/* Col 4: Helpline & Association Notice */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white tracking-wider uppercase">
              고객 지원 & 제휴 문의
            </h4>
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-xs text-slate-400">포털 및 제휴 입점 문의 이메일</div>
              <a href="mailto:pjm0620@naver.com" className="text-lg sm:text-xl font-extrabold text-amber-300 hover:text-amber-200 break-all">
                pjm0620@naver.com
              </a>
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
