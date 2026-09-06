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
  UserCheck,
  UserCircle2,
  LogIn,
  UtensilsCrossed,
  ShoppingBag,
  Coins
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
    pointShopItems,
    isAdmin,
    currentUser
  } = useParkGolf();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      id: 'courses',
      title: '전국 구장 정보',
      label: '전국 구장',
      shortLabel: '구장',
      icon: MapPin,
      badge: `${courses.length}`,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'tournaments',
      title: '대회 소식',
      label: '대회 소식',
      shortLabel: '대회',
      icon: Trophy,
      badge: `${tournaments.length}`,
      badgeColor: 'bg-amber-100 text-amber-900'
    },
    {
      id: 'news',
      title: '초보 가이드',
      label: '초보 가이드',
      shortLabel: '가이드',
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
      shortLabel: '리뷰',
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
      title: '쿠팡추천상품',
      label: '쿠팡추천',
      shortLabel: '쿠팡',
      icon: ShoppingBag,
      badge: coupangProducts.length > 0 ? `${coupangProducts.length}` : 'NEW',
      badgeColor: 'bg-red-100 text-red-800'
    },
    {
      id: 'pointmarket',
      title: '마당P 장터',
      label: '마당P 장터',
      shortLabel: '마당P',
      icon: Coins,
      badge: pointShopItems.length > 0 ? `${pointShopItems.length}` : '교환',
      badgeColor: 'bg-emerald-100 text-emerald-900'
    },
    {
      id: 'restaurants',
      title: '구장 근처 맛집',
      label: '근처 맛집',
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
              setActiveTab('home');
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
            {currentUser ? (
              <button
                id="header-user-menu-btn"
                onClick={() => openModal('myPage')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl font-bold text-xs sm:text-sm shadow transition-all cursor-pointer whitespace-nowrap border bg-white hover:bg-slate-50 text-slate-700 border-slate-300"
              >
                <UserCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>{currentUser.nickname}님</span>
                <span className="hidden sm:inline text-amber-600 font-extrabold">· {currentUser.points.toLocaleString()}P</span>
              </button>
            ) : (
              <button
                id="header-user-login-btn"
                onClick={() => openModal('auth')}
                className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl font-bold text-xs sm:text-sm shadow transition-all cursor-pointer whitespace-nowrap border bg-white hover:bg-slate-50 text-slate-700 border-slate-300"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline">로그인 / 회원가입</span>
                <span className="inline sm:hidden">로그인</span>
              </button>
            )}

            {/* 관리자 로그인 버튼은 삭제했습니다 — 로그인/회원가입 창 안의 "관리자로 로그인" 링크로
                들어갑니다. 아래 버튼은 이미 관리자 모드일 때만 보이는 '관리자 화면 열기' 버튼입니다. */}
            {isAdmin && (
              <button
                id="header-admin-panel-btn"
                onClick={() => openModal('admin')}
                className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl font-black text-xs sm:text-sm shadow transition-all cursor-pointer whitespace-nowrap border bg-amber-400 text-green-950 border-amber-300"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">관리자 모드</span>
                <span className="inline sm:hidden">관리</span>
              </button>
            )}

            {/* Mobile Menu Toggle (Removed on mobile as requested, bottom nav is primary) */}
          </div>
        </div>

        {/* 상단 카테고리 탭 — 시니어분들이 읽기 편하도록 글씨를 최대한 키웠습니다.
            화면이 좁아지면 글씨와 여백이 단계적으로 줄어들 뿐, 절대 두 줄로 넘어가지 않습니다.
            (화면 폭별: md 14px → lg 16px → xl 17px → 2xl 18px) */}
        <nav className="hidden md:block border-t border-green-100/90 py-1.5 w-full">
          <div className="flex flex-nowrap gap-1 lg:gap-1.5 w-full items-center">
            {visibleNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
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
                  <span className="truncate hidden xl:inline">{item.label}</span>
                  <span className="truncate inline xl:hidden">{item.shortLabel}</span>
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
