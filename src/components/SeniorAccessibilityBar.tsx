import React from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { VisitorCounterBadge } from './VisitorCounterBadge';
import { LogIn, UserCircle2, UserCheck } from 'lucide-react';

export const SeniorAccessibilityBar: React.FC = () => {
  const {
    fontSize,
    setFontSize,
    setActiveTab,
    openModal,
    currentUser,
    isAdmin
  } = useParkGolf();

  return (
    <aside aria-label="시니어 맞춤 도구" className="bg-[#14532D] text-white border-b border-green-800 text-sm md:text-base select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Font Size Switcher for Seniors */}
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-semibold text-green-100 flex items-center gap-1">
            <span className="hidden sm:inline">👓</span> 글씨 크기 :
          </span>
          <div className="inline-flex items-center rounded-lg bg-green-900/80 p-0.5 border border-green-700">
            <button
              id="font-size-normal-btn"
              onClick={() => setFontSize('normal')}
              className={`px-2.5 py-1 rounded text-xs sm:text-sm font-medium transition-all ${
                fontSize === 'normal'
                  ? 'bg-white text-green-900 font-bold shadow-sm'
                  : 'text-green-100 hover:text-white'
              }`}
              title="보통 글자 크기 (100%)"
            >
              보통
            </button>
            <button
              id="font-size-large-btn"
              onClick={() => setFontSize('large')}
              className={`px-2.5 py-1 rounded text-xs sm:text-sm font-medium transition-all ${
                fontSize === 'large'
                  ? 'bg-amber-400 text-green-950 font-bold shadow-sm'
                  : 'text-green-100 hover:text-white'
              }`}
              title="크게 글자 크기 (115%)"
            >
              크게
            </button>
            <button
              id="font-size-xlarge-btn"
              onClick={() => setFontSize('xlarge')}
              className={`px-2.5 py-1 rounded text-xs sm:text-sm font-medium transition-all ${
                fontSize === 'xlarge'
                  ? 'bg-amber-300 text-green-950 font-extrabold shadow-sm'
                  : 'text-green-100 hover:text-white'
              }`}
              title="아주 크게 글자 크기 (130%)"
            >
              아주 크게
            </button>
          </div>
          <div className="ml-1">
            <VisitorCounterBadge />
          </div>
        </div>

        {/* Center/Right: Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          {/* KPGA Rules Category Direct Page Switch */}
          <button
            id="top-kpga-rules-btn"
            onClick={() => {
              setActiveTab('associations');
              window.dispatchEvent(new CustomEvent('open-rules-subtab', { detail: 'kpgaRules' }));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold text-amber-300 hover:text-amber-200 bg-green-900/60 hover:bg-green-900 border border-amber-400/40 transition-all cursor-pointer"
          >
            <span>📜 협회 공인 규정 · 제보</span>
          </button>

          {/* 로그인 · 내 정보 — 아래 로고 줄에 있던 것을 이 자리로 옮겼습니다.
              로고 줄은 '오늘의 파크골프' 띠가 넓게 쓰도록 비워둡니다. */}
          {currentUser ? (
            <button
              id="header-user-menu-btn"
              onClick={() => openModal('myPage')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs sm:text-sm font-bold text-white bg-green-800 hover:bg-green-700 border border-green-500/60 transition-all cursor-pointer whitespace-nowrap"
            >
              <UserCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{currentUser.nickname}님</span>
              <span className="text-amber-300 font-extrabold">· {currentUser.points.toLocaleString()}P</span>
            </button>
          ) : (
            <button
              id="header-user-login-btn"
              onClick={() => openModal('auth')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs sm:text-sm font-bold text-white bg-green-800 hover:bg-green-700 border border-green-500/60 transition-all cursor-pointer whitespace-nowrap"
            >
              <LogIn className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>로그인 / 회원가입</span>
            </button>
          )}

          {isAdmin && (
            <button
              id="header-admin-panel-btn"
              onClick={() => openModal('admin')}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs sm:text-sm font-black text-green-950 bg-amber-400 hover:bg-amber-300 border border-amber-300 transition-all cursor-pointer whitespace-nowrap"
            >
              <UserCheck className="w-4 h-4 shrink-0" />
              <span>관리자 모드</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
