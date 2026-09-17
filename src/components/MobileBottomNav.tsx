import React, { useState } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { getHiddenBoardIds } from '../utils/boardVisibility';
import {
  MapPin,
  Trophy,
  Users,
  UtensilsCrossed,
  Star,
  ShoppingBag,
  Coins,
  Megaphone,
  Building2,
  MoreHorizontal,
  X
} from 'lucide-react';

/**
 * 휴대폰 아래 탭 — 7개에서 5개로 줄였습니다.
 *
 * 7개를 한 줄에 담으면 글씨가 11px까지 작아져서, 시니어분들이 읽기도 누르기도 어려웠습니다.
 * 자주 쓰는 넷만 남기고 나머지는 '더보기'에 모았습니다. 없앤 메뉴는 하나도 없습니다.
 */

// 아래 탭에 그대로 두는 메뉴 — 정보를 찾으러 오신 분의 목적지들입니다.
const MAIN_TABS = [
  { id: 'courses', label: '구장', icon: MapPin, activeColor: 'text-blue-700' },
  { id: 'tournaments', label: '대회', icon: Trophy, activeColor: 'text-amber-600' },
  { id: 'matching', label: '동반자', icon: Users, activeColor: 'text-rose-600' },
  { id: 'restaurants', label: '맛집', icon: UtensilsCrossed, activeColor: 'text-orange-600' }
];

// '더보기' 안에 들어가는 메뉴 — 이미 쓰고 계신 분을 위한 기능들입니다.
const MORE_TABS = [
  { id: 'reviews', label: '구장 리뷰', desc: '다녀오신 구장 후기 쓰고 300P', icon: Star, tone: 'text-amber-600' },
  { id: 'pointmarket', label: '마당P 장터', desc: '모은 마당P로 상품 교환', icon: Coins, tone: 'text-emerald-700' },
  { id: 'shop', label: '쿠팡 추천상품', desc: '파크골프 용품 골라보기', icon: ShoppingBag, tone: 'text-red-600' },
  { id: 'notices', label: '공지사항', desc: '새 소식과 안내', icon: Megaphone, tone: 'text-slate-700' },
  { id: 'associations', label: '협회 · 연맹', desc: '공인 규정과 지부 안내', icon: Building2, tone: 'text-emerald-800' }
];

// 아래 탭 칸 수에 맞는 Tailwind 클래스입니다.
// (문자열을 이어붙여 만들면 빌드에서 빠져버려서, 이렇게 미리 적어둡니다)
const GRID_COLS: Record<number, string> = {
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5'
};

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, matches, reviews, isAdmin } = useParkGolf();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // 글이 아직 거의 없는 게시판은 아래 탭에서도 함께 감춥니다 — utils/boardVisibility.ts
  const hiddenBoardIds = getHiddenBoardIds({ matches, reviews, isAdmin });
  const mainTabs = MAIN_TABS.filter(t => !hiddenBoardIds.includes(t.id));
  const moreTabs = MORE_TABS.filter(t => !hiddenBoardIds.includes(t.id));

  const go = (tabId: string) => {
    setActiveTab(tabId);
    setIsMoreOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isMoreActive = moreTabs.some(t => t.id === activeTab);
  const openMatchCount = matches.filter(m => m.status === '모집중').length;

  return (
    <>
      {/* 더보기 시트 */}
      {isMoreOpen && (
        <div className="md:hidden fixed inset-0 z-[55]" role="dialog" aria-label="더보기 메뉴">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMoreOpen(false)} />

          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl pb-[72px] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-200">
              <span className="text-xl font-black text-slate-900">더보기</span>
              <button
                onClick={() => setIsMoreOpen(false)}
                aria-label="닫기"
                className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-6 h-6 text-slate-700" strokeWidth={2.4} />
              </button>
            </div>

            <div className="p-3 flex flex-col gap-2">
              {moreTabs.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`m-more-${item.id}`}
                    onClick={() => go(item.id)}
                    className={`w-full min-h-[68px] px-4 py-3 rounded-2xl border-2 flex items-center gap-4 text-left transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 border-blue-700 text-white'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-900'
                    }`}
                  >
                    <Icon
                      className={`w-7 h-7 shrink-0 ${isActive ? 'text-amber-300' : item.tone}`}
                      strokeWidth={2}
                    />
                    <span className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-lg font-black leading-tight">{item.label}</span>
                      <span className={`text-sm font-medium ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                        {item.desc}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 아래 탭 — 감춘 게시판이 있으면 칸 수가 줄어듭니다 */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[56] bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl py-1 px-1.5 safe-area-pb">
        <div className={`grid ${GRID_COLS[mainTabs.length + 1] || 'grid-cols-5'} gap-0.5 items-center`}>
          {mainTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`m-nav-${tab.id}`}
                onClick={() => go(tab.id)}
                className={`relative flex flex-col items-center justify-center py-2.5 rounded-xl transition-colors cursor-pointer ${
                  isActive ? 'text-blue-700 font-black bg-blue-50/80' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`w-[26px] h-[26px] ${isActive ? `${tab.activeColor} stroke-[2.5]` : 'stroke-[1.9]'}`}
                />
                <span className="text-[14px] mt-1 font-extrabold whitespace-nowrap leading-none">{tab.label}</span>
                {tab.id === 'matching' && openMatchCount > 0 && (
                  <span className="absolute top-1.5 right-3 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white"></span>
                )}
              </button>
            );
          })}

          <button
            id="m-nav-more"
            onClick={() => setIsMoreOpen(v => !v)}
            aria-expanded={isMoreOpen}
            className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition-colors cursor-pointer ${
              isMoreOpen || isMoreActive
                ? 'text-blue-700 font-black bg-blue-50/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MoreHorizontal
              className={`w-[26px] h-[26px] ${isMoreOpen || isMoreActive ? 'stroke-[2.5]' : 'stroke-[1.9]'}`}
            />
            <span className="text-[14px] mt-1 font-extrabold whitespace-nowrap leading-none">더보기</span>
          </button>
        </div>
      </div>
    </>
  );
};
