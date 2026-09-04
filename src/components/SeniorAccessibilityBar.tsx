import React from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { PhoneCall } from 'lucide-react';
import { VisitorCounterBadge } from './VisitorCounterBadge';

export const SeniorAccessibilityBar: React.FC = () => {
  const {
    fontSize,
    setFontSize,
    setActiveTab
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

          {/* Senior Direct Call */}
          <a
            id="senior-call-link"
            href="tel:1588-7282"
            className="inline-flex items-center gap-1 text-xs sm:text-sm text-green-200 hover:text-white font-medium"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
            <span>상담 · 문의 : <strong className="text-white">1588-7282</strong></span>
          </a>
        </div>
      </div>
    </aside>
  );
};
