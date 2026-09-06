import React from 'react';
import { Sparkles, CheckCircle2, MessageCircle, Users2, UtensilsCrossed, UserPlus } from 'lucide-react';
import { useParkGolf } from '../context/ParkGolfContext';

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

      {/* 창립회원 오픈이벤트 — 크게 2가지로 나눠서 보여줍니다 (실제 데이터 기준, 가짜 숫자 없음) */}
      <section className="bg-gradient-to-r from-emerald-800 to-green-900 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <span className="text-amber-300 font-black text-lg sm:text-xl">🎉 창립회원 오픈이벤트</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1번째 오픈이벤트 — 가입축하 포인트 */}
            <div className="bg-white/10 rounded-2xl border border-white/20 p-5">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-400 text-green-950 text-xs font-black mb-2">
                1번째 오픈이벤트
              </span>
              <p className="text-white font-black text-lg sm:text-xl leading-snug mb-1">
                가입 즉시 <span className="text-amber-300">1,000 마당P</span> 지급!
              </p>
              <p className="text-green-100 text-xs sm:text-sm font-medium">
                지금 창립회원으로 가입만 하셔도 바로 1,000P가 쌓입니다. 활동할수록 더 쌓이고(리뷰 +200P, 동반자모집 +300P, 맛집제보 +150P), 실제 상품으로 교환할 수 있어요.
              </p>
              <div className="w-full h-2.5 bg-emerald-950/60 rounded-full overflow-hidden my-3">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(founderProgress, 2)}%` }}
                />
              </div>
              <p className="text-white font-bold text-sm">
                현재 <span className="text-amber-300 text-lg">{totalUsers}</span> / {FOUNDER_GOAL.toLocaleString()}명 창립회원 모집 중
              </p>
            </div>

            {/* 2번째 오픈이벤트 — 웰리타 영양제 추첨 */}
            {monthlyDrawInfo && (
              <div className="bg-white/10 rounded-2xl border border-white/20 p-5">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-violet-400 text-violet-950 text-xs font-black mb-2">
                  2번째 오픈이벤트
                </span>
                <p className="text-white font-black text-lg sm:text-xl leading-snug mb-1">
                  창립회원 중 매달 추첨 1분께<br className="hidden sm:block" />
                  <span className="text-amber-300">{monthlyDrawInfo.prize.value}</span> 영양제 증정!
                </p>
                <p className="text-green-100 text-xs sm:text-sm font-medium mb-2">
                  {monthlyDrawInfo.prize.name}
                </p>
                <a
                  href={monthlyDrawInfo.prize.sellerProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-[11px] sm:text-xs text-amber-200 underline hover:text-amber-100 mb-2"
                >
                  판매자정보 : {monthlyDrawInfo.prize.brand} →
                </a>
                <p className="text-white font-bold text-sm mt-1">
                  이번 달({monthlyDrawInfo.currentMonth}) 신규가입만 하시면 자동 응모 · 현재 {monthlyDrawInfo.eligibleCount}명 응모 중
                  {monthlyDrawInfo.alreadyDrawnThisMonth && ' · 이번 달 추첨 완료!'}
                </p>
                {monthlyDrawInfo.recentWinners && monthlyDrawInfo.recentWinners.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-green-200 font-bold">지난 당첨자:</span>
                    {monthlyDrawInfo.recentWinners.map((w: any, i: number) => (
                      <span key={i} className="text-[11px] font-bold text-amber-200 bg-white/10 px-2 py-0.5 rounded-full">
                        {w.month} {w.nickname}님
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="text-center text-green-100 text-[11px] sm:text-xs font-medium mt-4">
            * {monthlyDrawInfo?.prize.brand || '웰리타스토어'}는 파크골프마당 공식 후원 업체로, 2번째 이벤트로 증정되는 제품은 해당 업체로부터 후원받았습니다.
          </p>

          <div className="text-center mt-5">
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
