import React from 'react';
import { Sparkles } from 'lucide-react';
import { useParkGolf } from '../context/ParkGolfContext';

// 메인 배너 이미지 — 노을 지는 골프장 사진 (텍스트 없는 깨끗한 사진이라 겹침 문제 없음)
const MAIN_BANNER_IMAGE_URL = '/images/hero-sunset-v5.jpg';

// 웰리타-Y 밀크씨슬 테아닌 3병 세트(3개월분) 실제 제품 사진입니다.
const WELITA_PRODUCT_IMAGE_URL = '/images/welita-y-milkthistle.jpg';

export const MainHomeSection: React.FC = () => {
  const { totalUsers, currentUser, setActiveTab, openModal, monthlyDrawInfo } = useParkGolf();

  // 창립회원 모집 인원 — 이 숫자만 바꾸면 헤드라인·진행률바가 한꺼번에 따라갑니다.
  const FOUNDER_GOAL = 100;
  const founderProgress = Math.min(100, Math.round((totalUsers / FOUNDER_GOAL) * 100));

  const categoryCards = [
    { id: 'courses', title: '전국 구장 지도', desc: '내 주변 파크골프장 한눈에 보기', image: '/images/card-courses-v4.png' },
    { id: 'tournaments', title: '대회·행사 소식', desc: '전국 대회 일정과 참가 정보', image: '/images/card-tournaments-v4.png' },
    { id: 'news', title: '초보자 가이드', desc: '처음 시작하는 분들을 위한 친절한 안내', image: '/images/card-guide-v4.png' },
    { id: 'matching', title: '커뮤니티', desc: '함께하는 이야기, 더 즐거운 파크골프', image: '/images/card-community-v4.png' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Banner */}
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
                창립회원 <span className="text-amber-300">{FOUNDER_GOAL.toLocaleString()}명</span> 한정 모집!
              </h1>
              <p className="text-lg sm:text-xl text-green-50 font-bold mb-7 drop-shadow-sm">
                지금 가입하시면, 대한민국 파크골프 대표 정보마당의{' '}
                <br className="hidden sm:block" />
                <span className="text-amber-200 font-black">진짜 '창립멤버'</span>가 되십니다.
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
              <p className="text-base sm:text-lg text-amber-200 font-black mt-4 drop-shadow-sm">
                가입만 해도 1,000 마당P 즉시 지급 · 이미 {totalUsers}명 함께하고 있어요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 창립회원 오픈이벤트 — 한눈에 확 들어오게, 짧고 굵게 */}
      <section className="bg-gradient-to-r from-emerald-800 to-green-900 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-7">
            <span className="text-amber-300 font-black text-2xl sm:text-3xl">🎉 창립회원 오픈이벤트</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1번째 오픈이벤트 */}
            <div className="bg-white/10 rounded-2xl border border-white/20 p-6 sm:p-7">
              <span className="inline-block px-3.5 py-1.5 rounded-full bg-amber-400 text-green-950 text-base sm:text-lg font-black mb-4">
                1번째 오픈이벤트
              </span>

              <p className="text-white font-black text-2xl sm:text-3xl md:text-4xl leading-tight mb-4">
                창립회원 신규가입 즉시<br />
                <span className="text-amber-300">1,000 마당P</span> 지급!
              </p>

              {/* 활동 적립 안내 — 시니어분들이 한눈에 읽으실 수 있게 크게 표시합니다 */}
              <div className="bg-emerald-950/50 rounded-2xl px-5 py-4 mb-4 border border-amber-300/30">
                <p className="text-white font-black text-xl sm:text-2xl md:text-3xl leading-snug">
                  구장리뷰 · 맛집 · 동반자모집<br />
                  글만 써도 <span className="text-amber-300">+300 마당P</span>
                </p>
              </div>

              <p className="text-amber-200 font-black text-lg sm:text-xl md:text-2xl leading-snug mb-5">
                모은 마당P는 <span className="text-white">마당P 장터</span>에서{' '}
                제품으로 바꿔 가세요!
              </p>

              <div className="w-full h-4 bg-emerald-950/60 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(founderProgress, 2)}%` }}
                />
              </div>
              <p className="text-white font-black text-lg sm:text-xl">
                현재 <span className="text-amber-300 text-2xl sm:text-3xl">{totalUsers}</span> / {FOUNDER_GOAL.toLocaleString()}명
              </p>
            </div>

            {/* 2번째 오픈이벤트 */}
            {monthlyDrawInfo && (
              <div className="bg-white/10 rounded-2xl border border-white/20 p-6 sm:p-7">
                <span className="inline-block px-3.5 py-1.5 rounded-full bg-violet-400 text-violet-950 text-base sm:text-lg font-black mb-4">
                  2번째 오픈이벤트
                </span>

                <div className="flex items-center gap-4 mb-4">
                  {WELITA_PRODUCT_IMAGE_URL ? (
                    <img
                      src={WELITA_PRODUCT_IMAGE_URL}
                      alt="웰리타-Y 밀크씨슬 테아닌 영양제 3병 세트 (3개월분)"
                      className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover bg-white shrink-0 border-2 border-amber-300/60 shadow-lg"
                    />
                  ) : (
                    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-white/90 flex items-center justify-center text-5xl shrink-0">
                      💊
                    </div>
                  )}
                  <p className="text-white font-black text-2xl sm:text-3xl leading-tight">
                    신규 가입 시<br />경품 <span className="text-amber-300">자동응모!</span>
                  </p>
                </div>

                <p className="text-amber-200 font-black text-xl sm:text-2xl md:text-3xl leading-snug mb-4">
                  랜덤추첨 1분께<br />
                  <span className="text-white">{monthlyDrawInfo.prize.value}</span> 웰리타 영양제 증정
                </p>

                <p className="text-white font-black text-lg sm:text-xl mb-3">
                  현재 <span className="text-amber-300">{monthlyDrawInfo.eligibleCount}명</span> 응모 중
                  {monthlyDrawInfo.alreadyDrawnThisMonth && ' · 이번 달 추첨 완료!'}
                </p>

                {monthlyDrawInfo.recentWinners && monthlyDrawInfo.recentWinners.length > 0 && (
                  <div className="mb-4 flex items-center gap-2 flex-wrap">
                    {monthlyDrawInfo.recentWinners.map((w: any, i: number) => (
                      <span
                        key={i}
                        className="text-base sm:text-lg font-black text-amber-200 bg-white/15 px-3.5 py-1.5 rounded-full"
                      >
                        🎉 {w.month} {w.nickname}님 당첨
                      </span>
                    ))}
                  </div>
                )}

                <a
                  href={monthlyDrawInfo.prize.sellerProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-lg sm:text-xl font-black text-amber-200 underline hover:text-amber-100 mb-3"
                >
                  판매자정보 : {monthlyDrawInfo.prize.brand} →
                </a>

                <p className="text-base sm:text-lg font-bold text-green-100 leading-snug pt-3 border-t border-white/20">
                  * {monthlyDrawInfo.prize.brand}는 파크골프마당 공식 후원 업체이며,{' '}
                  <br className="hidden sm:block" />
                  본 경품은 후원받은 제품입니다.
                </p>
              </div>
            )}
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
