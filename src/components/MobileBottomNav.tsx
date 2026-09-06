import React from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { MapPin, Trophy, BookOpen, Users, Star, UtensilsCrossed, ShoppingBag, Coins } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, matches, reviews } = useParkGolf();

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl py-1 px-1 safe-area-pb">
      <div className="grid grid-cols-8 gap-0 items-center">
        {/* Tab 1: 구장찾기 */}
        <button
          id="m-nav-courses"
          onClick={() => handleTabClick('courses')}
          className={`flex flex-col items-center justify-center py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'courses' ? 'text-blue-700 font-black bg-blue-50/80' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MapPin className={`w-[22px] h-[22px] ${activeTab === 'courses' ? 'text-blue-700 stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[11px] mt-0.5 font-extrabold whitespace-nowrap">구장</span>
        </button>

        {/* Tab 2: 대회일정 */}
        <button
          id="m-nav-tournaments"
          onClick={() => handleTabClick('tournaments')}
          className={`flex flex-col items-center justify-center py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'tournaments' ? 'text-blue-700 font-black bg-blue-50/80' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Trophy className={`w-[22px] h-[22px] ${activeTab === 'tournaments' ? 'text-amber-600 stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[11px] mt-0.5 font-extrabold whitespace-nowrap">대회</span>
        </button>

        {/* Tab 3: 초보가이드 */}
        <button
          id="m-nav-news"
          onClick={() => handleTabClick('news')}
          className={`flex flex-col items-center justify-center py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'news' ? 'text-blue-700 font-black bg-blue-50/80' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className={`w-[22px] h-[22px] ${activeTab === 'news' ? 'text-emerald-600 stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[11px] mt-0.5 font-extrabold whitespace-nowrap">가이드</span>
        </button>

        {/* Tab 4: 동반자모집 */}
        <button
          id="m-nav-matching"
          onClick={() => handleTabClick('matching')}
          className={`relative flex flex-col items-center justify-center py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'matching' ? 'text-blue-700 font-black bg-blue-50/80' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className={`w-[22px] h-[22px] ${activeTab === 'matching' ? 'text-rose-600 stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[11px] mt-0.5 font-extrabold whitespace-nowrap">동반자</span>
          {matches.filter(m => m.status === '모집중').length > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          )}
        </button>

        {/* Tab 5: 구장리뷰 */}
        <button
          id="m-nav-reviews"
          onClick={() => handleTabClick('reviews')}
          className={`relative flex flex-col items-center justify-center py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'reviews' ? 'text-blue-700 font-black bg-blue-50/80' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Star className={`w-[22px] h-[22px] ${activeTab === 'reviews' ? 'text-amber-500 stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[11px] mt-0.5 font-extrabold whitespace-nowrap">리뷰</span>
          {reviews.length > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
          )}
        </button>

        {/* Tab 6: 추천 상품(쿠팡파트너스) */}
        <button
          id="m-nav-shop"
          onClick={() => handleTabClick('shop')}
          className={`flex flex-col items-center justify-center py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'shop' ? 'text-blue-700 font-black bg-blue-50/80' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className={`w-[22px] h-[22px] ${activeTab === 'shop' ? 'text-red-600 stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[11px] mt-0.5 font-extrabold whitespace-nowrap">쿠팡</span>
        </button>

        {/* Tab 7: 마당P 장터 */}
        <button
          id="m-nav-pointmarket"
          onClick={() => handleTabClick('pointmarket')}
          className={`flex flex-col items-center justify-center py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'pointmarket' ? 'text-blue-700 font-black bg-blue-50/80' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Coins className={`w-[22px] h-[22px] ${activeTab === 'pointmarket' ? 'text-emerald-600 stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[11px] mt-0.5 font-extrabold whitespace-nowrap">마당P</span>
        </button>

        {/* Tab 8: 구장 근처 맛집 */}
        <button
          id="m-nav-restaurants"
          onClick={() => handleTabClick('restaurants')}
          className={`flex flex-col items-center justify-center py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'restaurants' ? 'text-blue-700 font-black bg-blue-50/80' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UtensilsCrossed className={`w-[22px] h-[22px] ${activeTab === 'restaurants' ? 'text-orange-600 stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[11px] mt-0.5 font-extrabold whitespace-nowrap">맛집</span>
        </button>
      </div>
    </div>
  );
};
