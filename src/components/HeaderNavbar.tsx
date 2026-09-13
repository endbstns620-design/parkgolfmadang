import React from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import {
  MapPin,
  Trophy,
  Users,
  Star,
  Building2,
  UtensilsCrossed,
  ShoppingBag,
  Coins
} from 'lucide-react';

/**
 * 화면 위 로고 · 카테고리 줄입니다.
 *
 * 넓은 화면(xl 이상)에서는 로고와 카테고리를 한 줄에 나란히 둡니다 —
 * 예전에는 두 줄이라 첫 화면이 그만큼 아래로 밀렸습니다.
 * 중간 화면(md~lg)에서는 자리가 모자라서 지금처럼 두 줄로 내려갑니다.
 * 휴대폰에서는 아래쪽 탭(MobileBottomNav)이 같은 일을 하므로 카테고리를 감춥니다.
 */

interface NavItem {
  id: string;
  title: string;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  hidden?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'courses', title: '전국 구장 정보', label: '전국 구장', shortLabel: '구장', icon: MapPin },
  { id: 'tournaments', title: '대회 소식', label: '대회 소식', shortLabel: '대회', icon: Trophy },
  { id: 'matching', title: '동반자 모집', label: '동반자 모집', shortLabel: '동반자', icon: Users },
  { id: 'reviews', title: '구장 리뷰', label: '구장 리뷰', shortLabel: '리뷰', icon: Star },
  { id: 'shop', title: '쿠팡추천상품', label: '쿠팡추천', shortLabel: '쿠팡', icon: ShoppingBag },
  { id: 'pointmarket', title: '마당P 장터', label: '마당P 장터', shortLabel: '마당P', icon: Coins },
  { id: 'restaurants', title: '구장 근처 맛집', label: '근처 맛집', shortLabel: '맛집', icon: UtensilsCrossed },
  {
    id: 'associations',
    title: '협회 · 연맹 안내',
    label: '협회 · 연맹',
    shortLabel: '협회·연맹',
    icon: Building2,
    // 상단 탭에서는 제외 (푸터·협회 공인 규정 버튼 등 다른 경로로는 계속 들어갈 수 있습니다)
    hidden: true
  }
];

export const HeaderNavbar: React.FC = () => {
  const { activeTab, setActiveTab } = useParkGolf();

  const visibleNavItems = NAV_ITEMS.filter(item => !item.hidden);

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 한 줄짜리 카테고리 버튼들 — 넓은 화면과 중간 화면에서 같은 모양을 씁니다.
  const renderNavButtons = (idPrefix: string) =>
    visibleNavItems.map(item => {
      const Icon = item.icon;
      const isActive = activeTab === item.id;
      return (
        <button
          key={item.id}
          id={`${idPrefix}-${item.id}`}
          onClick={() => handleNavClick(item.id)}
          title={item.title}
          className={`flex-1 min-w-0 flex items-center justify-center gap-1 lg:gap-1.5 px-1 lg:px-2 py-2 lg:py-2.5 rounded-lg font-extrabold transition-all text-[14px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px] border text-center cursor-pointer whitespace-nowrap overflow-hidden ${
            isActive
              ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-1 ring-blue-400/50'
              : 'bg-stone-50/90 text-slate-800 border-slate-200/90 hover:bg-blue-50 hover:text-blue-950 hover:border-blue-300'
          }`}
        >
          <Icon
            className={`w-4 h-4 lg:w-5 lg:h-5 xl:w-[22px] xl:h-[22px] shrink-0 ${
              isActive ? 'text-amber-300' : 'text-blue-700'
            }`}
          />
          {/* 화면이 넉넉하면 긴 이름, 좁으면 짧은 이름 — 어느 쪽이든 한 줄을 지킵니다 */}
          <span className="truncate hidden 2xl:inline">{item.label}</span>
          <span className="truncate inline 2xl:hidden">{item.shortLabel}</span>
        </button>
      );
    });

  return (
    <header className="bg-white border-b border-green-200 shadow-md transition-all w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
        {/* 로고 줄 — 넓은 화면에서는 이 줄 오른쪽에 카테고리가 같이 들어갑니다 */}
        <div className="flex items-center gap-3 xl:gap-6 py-2 sm:py-2.5">
          <div
            id="brand-logo"
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group min-w-0 shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-green-700 via-emerald-600 to-green-800 flex items-center justify-center text-white shadow group-hover:scale-105 transition-transform shrink-0">
              <span className="text-lg sm:text-xl">⛳</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-xl font-black tracking-tight text-green-950 font-serif whitespace-nowrap">
                  파크골프마당
                </span>
                {/* 아주 좁은 화면에서는 자리가 모자라 이 배지를 숨깁니다 */}
                <span className="hidden min-[400px]:inline bg-emerald-700 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded shadow-xs shrink-0">
                  전국포털
                </span>
              </div>
              <p className="hidden xl:block text-[11px] text-green-800 font-medium tracking-tight whitespace-nowrap">
                전국 구장 · 대회 · 동반자
              </p>
            </div>
          </div>

          {/* 넓은 화면: 카테고리를 로고와 같은 줄 오른쪽에 붙입니다 */}
          <nav className="hidden xl:flex flex-nowrap gap-1.5 flex-1 min-w-0 items-center">
            {renderNavButtons('nav-tab')}
          </nav>
        </div>

        {/* 중간 화면(md~lg): 한 줄에 다 들어가지 않으므로 아래 줄로 내립니다 */}
        <nav className="hidden md:block xl:hidden border-t border-green-100/90 py-1.5 w-full">
          <div className="flex flex-nowrap gap-1 lg:gap-1.5 w-full items-center">{renderNavButtons('nav-tab-md')}</div>
        </nav>
      </div>
    </header>
  );
};
