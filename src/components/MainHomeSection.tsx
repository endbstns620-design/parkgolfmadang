import React from 'react';
import { Sparkles, CheckCircle2, MessageCircle, Users2, UtensilsCrossed, UserPlus } from 'lucide-react';
import { useParkGolf } from '../context/ParkGolfContext';
import { InstallAppBanner } from './InstallAppBanner';

// 메인 배너 이미지 — 대표님이 벤치마킹용으로 보내주신 사진들로 교체했습니다.
// 전부 텍스트가 따로 박혀있지 않은 순수 사진이라, 겹쳐 보이는 문제 자체가 생기지 않습니다.
// 메인 배너 이미지 — 노을 지는 골프장 사진으로 교체했습니다.
// 사진 자체에 글자가 전혀 없어서, 겹쳐 보이는 문제가 생길 수가 없습니다.
const MAIN_BANNER_IMAGE_URL = '/images/hero-sunset-v5.jpg';

export const MainHomeSection: React.FC = () => {
  const { courses, totalUsers, currentUser, setActiveTab, openModal, reviews, matches, restaurants, monthlyDrawInfo } = useParkGolf();

  const today = new Date().toISOString().slice(0, 10);
  const todayReviews = reviews.filter(r => r.createdAt === today).length;
  const todayMatches = matches.filter(m => m.createdAt === today).length;
  const todayRestaurants = restaurants.filter(r => r.createdAt === today).length;

  const FOUNDER_GOAL = 1000;
  const founderProgress = Math.min(100, Math.round((totalUsers / FOUNDER_GOAL) * 100));

  const categoryCards = [
    { id: 'courses', title: '전국 구장 지도', desc: '내 주변 파크골프장 한눈에 보기', image: '/images/card-courses-v4.png' },
    { id: 'tournaments', title: '대회·행사 소식', desc: '전국 대회 일정과 참가 정보', image: '/images/card-tournaments-v4.png' },
    { id: 'news', title: '초보자 가이드', desc: '처음 시작하는 분들을 위한 친절한 안내', image: '/images/card-guide-v4.png' },
    { id: 'matching', title: '커뮤니티', desc: '함께하는 이야기, 더 즐거운 파크골프', image: '/images/card-community-v4.png' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Banner — 검색창 대신 가입 후킹에 집중합니다 (구장검색은 상단 '전국 구장' 탭에서 가능) */}
      <section className="relative overflow-hidden">
        <img
          src={MAIN_BANNER_IMAGE_URL}
          alt="파크골프를 즐기는 시니어 부부와 파크골프장 표지판"
          className="w-full h-[440px] sm:h-[500px] md:h-[580px] object-cover object-[30%_center]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/90 via-green-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-green-950/70 via-transparent to-transparent" />

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 text-green-950 text-xs sm:text-sm font-black mb-4 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>파크골프마당 GRAND OPEN · 창립회원 모집중</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-4 text-white drop-shadow-lg">
                대한민국 파크골퍼<br />
                <span className="text-amber-300">{FOUNDER_GOAL.toLocaleString()}명</span>을 찾습니다!
              </h1>
              <p className="text-lg sm:text-xl text-green-50 font-bold mb-7 drop-shadow-sm">
                전국의 파크골퍼들이 함께 만드는 대한민국 파크골프 정보마당,<br className="hidden sm:block" />
                파크골프마당의 첫 번째 주인공이 되어주세요.
              </p>

              {currentUser ? (
                <button
                  onClick={() => openModal('myPage')}
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-green-950 font-black text-lg sm:text-xl shadow-2xl transition-all cursor-pointer"
                >
                  {currentUser.nickname}님, {currentUser.points.toLocaleString()}P 확인하기 →
                </button>
              ) : (
                <button
                  onClick={() => openModal('auth')}
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-green-950 font-black text-lg sm:text-xl shadow-2xl transition-all cursor-pointer"
                >
                  무료로 창립회원 가입하기 →
                </button>
              )}
              <p className="text-xs sm:text-sm text-green-100 font-bold mt-3">
                가입만 해도 1,000 마당P 즉시 지급 · 이미 {totalUsers}명의 창립회원과 함께하고 있습니다
              </p>
            </div>
          </div>
        </div>
      </section>

      <InstallAppBanner />

      {/* 이달의 신규회원 추첨 이벤트 — 실제 상품·실제 참여인원 기준, 자동응모(신규가입만 하면 자동 참여) */}
      {monthlyDrawInfo && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-6">
          <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 border-2 border-violet-300 rounded-2xl p-5 sm:p-6 shadow-md">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border-2 border-violet-200 flex items-center justify-center text-4xl sm:text-5xl shrink-0 shadow-sm">
                💊
              </div>
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-600 text-white text-[11px] sm:text-xs font-black mb-1.5">
                  이달의 신규회원 추첨 이벤트
                </div>
                <p className="font-black text-slate-900 text-base sm:text-lg leading-snug">
                  이번 달 신규가입자 중 1명께{' '}
                  <span className="text-violet-700">{monthlyDrawInfo.prize.name}</span>을 보내드려요!
                </p>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  이번 달({monthlyDrawInfo.currentMonth}) 신규가입만 하시면 자동으로 응모됩니다 · 별도 신청 불필요
                </p>
                <p className="text-xs sm:text-sm font-bold text-violet-700 mt-1.5">
                  현재 {monthlyDrawInfo.eligibleCount}명 응모 중
                  {monthlyDrawInfo.alreadyDrawnThisMonth && ' · 이번 달 추첨 완료!'}
                </p>
              </div>
              {!currentUser && (
                <button
                  onClick={() => openModal('auth')}
                  className="shrink-0 px-5 py-3 rounded-xl bg-violet-700 hover:bg-violet-800 text-white font-black text-sm sm:text-base shadow cursor-pointer whitespace-nowrap"
                >
                  지금 가입하고 응모하기
                </button>
              )}
            </div>

            {monthlyDrawInfo.recentWinners && monthlyDrawInfo.recentWinners.length > 0 && (
              <div className="mt-4 pt-3 border-t border-violet-200 flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                <span className="text-xs font-bold text-slate-500">지난 당첨자:</span>
                {monthlyDrawInfo.recentWinners.map((w: any, i: number) => (
                  <span key={i} className="text-xs font-bold text-violet-700 bg-white px-2 py-0.5 rounded-full border border-violet-200">
                    {w.month} {w.nickname}님
                  </span>
                ))}
              </div>
            )}

            <p className="text-[10px] text-slate-400 mt-3 text-center sm:text-left">
              * 본 이벤트 상품은 파크골프마당 운영자가 직접 구매하여 당첨자께 발송합니다. 제품 문의: 웰리타스토어
            </p>
          </div>
        </section>
      )}

      {/* 창립회원 진행 현황 — 실제 가입자 수 기준, 가짜 숫자 없음 */}
      <section className="bg-gradient-to-r from-emerald-800 to-green-900 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-amber-300 font-black text-sm sm:text-base">🎉 창립회원 오픈 이벤트</span>
            <span className="text-white font-black text-sm sm:text-base">
              현재 <span className="text-amber-300 text-lg sm:text-xl">{totalUsers}</span> / {FOUNDER_GOAL.toLocaleString()}명
            </span>
          </div>
          <div className="w-full h-3 sm:h-4 bg-emerald-950/60 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-700"
              style={{ width: `${Math.max(founderProgress, 2)}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/10 rounded-xl p-3 text-center border border-white/10">
              <div className="flex items-center justify-center gap-1 text-amber-300 font-black text-xl sm:text-2xl">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                {todayReviews}건
              </div>
              <div className="text-[11px] sm:text-xs text-green-100 font-bold mt-0.5">오늘 등록된 리뷰</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center border border-white/10">
              <div className="flex items-center justify-center gap-1 text-amber-300 font-black text-xl sm:text-2xl">
                <Users2 className="w-4 h-4 sm:w-5 sm:h-5" />
                {todayMatches}건
              </div>
              <div className="text-[11px] sm:text-xs text-green-100 font-bold mt-0.5">오늘 동반자 모집</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center border border-white/10">
              <div className="flex items-center justify-center gap-1 text-amber-300 font-black text-xl sm:text-2xl">
                <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5" />
                {todayRestaurants}건
              </div>
              <div className="text-[11px] sm:text-xs text-green-100 font-bold mt-0.5">오늘 맛집 제보</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center border border-white/10">
              <div className="flex items-center justify-center gap-1 text-amber-300 font-black text-xl sm:text-2xl">
                <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                {totalUsers}명
              </div>
              <div className="text-[11px] sm:text-xs text-green-100 font-bold mt-0.5">누적 창립회원</div>
            </div>
          </div>

          <p className="text-center text-green-100 text-xs sm:text-sm font-bold mt-5">
            구장 리뷰 작성 +200P · 동반자 모집글 작성 +300P · 맛집 등록 +150P — 활동할수록 쌓이는 마당P, 실제 상품으로 교환하세요!
          </p>
          <div className="text-center mt-4">
            <button
              onClick={() => (currentUser ? openModal('myPage') : openModal('auth'))}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-amber-50 text-emerald-800 font-black text-base sm:text-lg shadow-xl transition-all cursor-pointer"
            >
              {currentUser ? '마당P 교환소 가기 →' : '지금 창립회원 가입하기 →'}
            </button>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {categoryCards.map(card => (
            <button
              key={card.id}
              onClick={() => {
                setActiveTab(card.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left bg-white rounded-2xl border border-slate-200 hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
            >
              <div className="aspect-video overflow-hidden bg-slate-100">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm sm:text-base text-slate-900">{card.title}</span>
                  <span className="w-7 h-7 rounded-full bg-green-900 text-white flex items-center justify-center text-xs group-hover:bg-emerald-600 transition-colors">
                    →
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">{card.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Closing Quote */}
      <section className="bg-green-50 py-8 px-4 text-center">
        <p className="text-lg sm:text-xl font-extrabold text-emerald-900">
          "파크골프는, 사람을 더 건강하고 행복하게 만듭니다."
        </p>
        <p className="text-sm sm:text-base text-slate-600 mt-1 font-medium">
          파크골프마당이 언제나 함께합니다.
        </p>
      </section>
    </div>
  );
};
