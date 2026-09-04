import React, { useState } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import {
  MapPin,
  Trophy,
  Users,
  Star,
  Megaphone,
  BookOpen,
  Menu,
  X,
  Building2,
  ShieldCheck,
  UserCheck,
  UtensilsCrossed,
  ShoppingBag
} from 'lucide-react';

export const HeaderNavbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    openModal,
    courses,
    tournaments,
    matches,
    reviews,
    coupangProducts,
    isAdmin
  } = useParkGolf();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      id: 'courses',
      title: '전국 구장 정보',
      label: '전국 구장',
      shortLabel: '구장정보',
      icon: MapPin,
      badge: `${courses.length}`,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'tournaments',
      title: '대회 소식',
      label: '대회 소식',
      shortLabel: '대회소식',
      icon: Trophy,
      badge: `${tournaments.length}`,
      badgeColor: 'bg-amber-100 text-amber-900'
    },
    {
      id: 'news',
      title: '초보 가이드',
      label: '초보 가이드',
      shortLabel: '초보가이드',
      icon: BookOpen,
      badge: '필독',
      badgeColor: 'bg-blue-100 text-blue-900'
    },
    {
      id: 'matching',
      title: '동반자 모집',
      label: '동반자 모집',
      shortLabel: '동반자',
      icon: Users,
      badge: matches.filter(m => m.status === '모집중').length > 0 ? `${matches.filter(m => m.status === '모집중').length}` : '모집',
      badgeColor: 'bg-rose-100 text-rose-800'
    },
    {
      id: 'reviews',
      title: '구장 리뷰',
      label: '구장 리뷰',
      shortLabel: '구장리뷰',
      icon: Star,
      badge: reviews.length > 0 ? `${reviews.length}` : '★후기',
      badgeColor: 'bg-amber-100 text-amber-900'
    },
    {
      id: 'ads',
      title: '용품 · 광고',
      label: '용품 · 광고',
      shortLabel: '용품광고',
      icon: Megaphone,
      badge: '특가',
      badgeColor: 'bg-purple-100 text-purple-800',
      hidden: true // 사용자 요청으로 임시 숨김 처리 (추후 언제든 false로 재사용 가능)
    },
    {
      id: 'shop',
      title: '추천 상품',
      label: '추천 상품',
      shortLabel: '추천상품',
      icon: ShoppingBag,
      badge: coupangProducts.length > 0 ? `${coupangProducts.length}` : 'NEW',
      badgeColor: 'bg-red-100 text-red-800'
    },
    {
      id: 'restaurants',
      title: '구장 근처 맛집',
      label: '구장 근처 맛집',
      shortLabel: '맛집',
      icon: UtensilsCrossed,
      badge: '추천',
      badgeColor: 'bg-orange-100 text-orange-900'
    },
    {
      id: 'associations',
      title: '협회 · 연맹 안내',
      label: '협회 · 연맹',
      shortLabel: '협회·연맹',
      icon: Building2,
      badge: '공식',
      badgeColor: 'bg-emerald-100 text-emerald-900',
      hidden: true // 상단 탭에서는 제외 (푸터·협회 공인 규정 버튼 등 다른 경로로는 계속 접근 가능)
    }
  ];

  // 활성화된(숨김 처리되지 않은) 탭 목록
  const visibleNavItems = navItems.filter(item => !item.hidden);

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="bg-white border-b border-green-200 shadow-md transition-all w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
        {/* Top Branding Row - Slim & Compact with Center Visitor Counter */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 py-2 sm:py-2.5">
          {/* Left: Logo & Brand Name */}
          <div
            id="brand-logo"
            onClick={() => {
              setActiveTab('courses');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-green-700 via-emerald-600 to-green-800 flex items-center justify-center text-white shadow group-hover:scale-105 transition-transform shrink-0">
              <span className="text-lg sm:text-xl">⛳</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-xl font-black tracking-tight text-green-950 font-serif whitespace-nowrap">
                  파크골프마당
                </span>
                <span className="bg-emerald-700 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded shadow-xs shrink-0">
                  전국포털
                </span>
              </div>
              <p className="hidden 2xl:block text-[11px] text-green-800 font-medium tracking-tight whitespace-nowrap">
                대한파크골프협회 & 지자체 직영 구장 · 실시간 대회 정보
              </p>
            </div>
          </div>

          {/* Right Quick Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              id="header-admin-login-btn"
              onClick={() => openModal('admin')}
              className={`flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl font-black text-xs sm:text-sm shadow transition-all cursor-pointer whitespace-nowrap border ${
                isAdmin
                  ? 'bg-amber-400 text-green-950 border-amber-300'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-800'
              }`}
            >
              {isAdmin ? <UserCheck className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />}
              <span className="hidden sm:inline">{isAdmin ? '관리자 모드 실행 중' : '관리자 로그인'}</span>
              <span className="inline sm:hidden">{isAdmin ? '관리자 모드' : '관리자 로그인'}</span>
            </button>

            {/* Mobile Menu Toggle (Removed on mobile as requested, bottom nav is primary) */}
          </div>
        </div>

        {/* Category Navigation Bar — 항상 한 줄로 유지됩니다. 탭이 늘어나면 폭이 줄어들거나
            (넓은 화면) 가로 스크롤(좁은 화면)로 대응하며, 절대 두 줄로 줄바꿈되지 않습니다. */}
        <nav className="hidden md:block border-t border-green-100/90 py-1 sm:py-1.5 w-full">
          <div className="flex flex-nowrap gap-0.5 sm:gap-1 md:gap-1.5 w-full items-center overflow-x-auto">
            {visibleNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  title={item.title}
                  className={`flex-1 min-w-[64px] shrink-0 flex items-center justify-center gap-0.5 sm:gap-1 px-0.5 sm:px-1 md:px-1.5 py-1.5 sm:py-2 rounded-lg font-extrabold transition-all text-[9.5px] sm:text-xs md:text-xs lg:text-sm border text-center cursor-pointer whitespace-nowrap overflow-hidden ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-1 ring-blue-400/50'
                      : 'bg-stone-50/90 text-slate-800 border-slate-200/90 hover:bg-blue-50 hover:text-blue-950 hover:border-blue-300'
                  }`}
                >
                  <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${isActive ? 'text-amber-300' : 'text-blue-700'}`} />
                  <span className="truncate hidden md:inline">{item.label}</span>
                  <span className="truncate inline md:hidden">{item.shortLabel}</span>
                  <span
                    className={`hidden 2xl:inline-block text-[10px] px-1 py-0.2 rounded-full font-bold ml-0.5 ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Mobile Dropdown Menu for Detailed View */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-green-100 bg-white px-3 py-3 space-y-2 shadow-xl animate-in slide-in-from-top-2 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 pb-2">
            {visibleNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-700 shadow ring-1 ring-blue-400/40'
                      : 'bg-blue-50/40 border-blue-100 text-slate-800 hover:bg-blue-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-blue-700'}`} />
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                        isActive ? 'bg-white/20 text-white' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <span className="font-extrabold text-xs sm:text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openModal('newMatch');
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-700 text-white font-extrabold text-xs sm:text-sm text-center shadow cursor-pointer"
            >
              👥 라운딩 동반자 모집글 쓰기
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
