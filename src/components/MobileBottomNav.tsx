import React from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { MapPin, Trophy, BookOpen, Users, Star, UtensilsCrossed, ShoppingBag } from 'lucide-react';

const TABS = [
  { id: 'courses', label: '구장찾기', icon: MapPin, color: 'text-blue-700', bg: 'bg-blue-50', dot: 'bg-blue-600' },
  { id: 'tournaments', label: '대회일정', icon: Trophy, color: 'text-amber-700', bg: 'bg-amber-50', dot: 'bg-amber-600' },
  { id: 'news', label: '초보가이드', icon: BookOpen, color: 'text-emerald-700', bg: 'bg-emerald-50', dot: 'bg-emerald-600' },
  { id: 'matching', label: '동반자', icon: Users, color: 'text-rose-700', bg: 'bg-rose-50', dot: 'bg-rose-600' },
  { id: 'reviews', label: '구장리뷰', icon: Star, color: 'text-yellow-700', bg: 'bg-yellow-50', dot: 'bg-yellow-600' },
  { id: 'shop', label: '추천상품', icon: ShoppingBag, color: 'text-red-700', bg: 'bg-red-50', dot: 'bg-red-600' },
  { id: 'restaurants', label: '맛집', icon: UtensilsCrossed, color: 'text-orange-700', bg: 'bg-orange-50', dot: 'bg-orange-600' }
] as const;

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, matches, reviews } = useParkGolf();

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasBadge = (id: string) => {
    if (id === 'matching') return matches.filter(m => m.status === '모집중').length > 0;
    if (id === 'reviews') return reviews.length > 0;
    return false;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-slate-200 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] safe-area-pb">
      <div className="grid grid-cols-7">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`m-nav-${tab.id}`}
              onClick={() => handleTabClick(tab.id)}
              className={`relative flex flex-col items-center justify-center gap-0.5 py-2.5 min-h-[58px] transition-all cursor-pointer active:scale-90 active:bg-slate-100 ${
                isActive ? tab.bg : ''
              }`}
            >
              {/* 활성 탭 상단 강조 바 — 지금 어디 있는지 한눈에 보이게 */}
              {isActive && (
                <span className={`absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full ${tab.dot}`} />
              )}

              <div className="relative">
                <Icon
                  className={`w-6 h-6 ${isActive ? `${tab.color} stroke-[2.5]` : 'text-slate-500 stroke-[1.75]'}`}
                />
                {hasBadge(tab.id) && (
                  <span className="absolute -top-0.5 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </div>

              <span
                className={`text-[11px] leading-tight whitespace-nowrap ${
                  isActive ? `${tab.color} font-black` : 'text-slate-600 font-bold'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
