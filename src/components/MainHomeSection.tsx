import React, { useState } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { SocialChannelsSection } from './SocialChannelsSection';
import { SponsorCompactBanner } from './SponsorBannerSection';
import { NoticeStrip } from './NoticeStrip';
import { HomeHeroSearch } from './HomeHeroSearch';

// 파크골프장 실제 사진 — 예전에는 첫 화면 배경이었는데,
// 첫 화면을 '구장 찾기'로 바꾸면서 창립회원 안내의 배경으로 옮겼습니다.
const MAIN_BANNER_IMAGE_URL = '/images/hero-parkgolf-v7.jpg';

// 웰리타-Y 대표 사진 (가로형)
const WELITA_PRODUCT_IMAGE_URL = '/images/welita-y-hero.jpg';

// 마당P가 쌓여서 상품으로 바뀌는 흐름
const POINT_STEPS = [
  { no: 1, emoji: '✍️', title: '글 쓰기', short: '리뷰 · 맛집 · 동반자' },
  { no: 2, emoji: '💰', title: '마당P 적립', short: '글 하나에 +300P' },
  { no: 3, emoji: '🎁', title: '상품 교환', short: '마당P 장터에서' }
];

export const MainHomeSection: React.FC = () => {
  const { totalUsers, currentUser, setActiveTab, openModal, monthlyDrawInfo } = useParkGolf();

  // 경품 사진을 눌렀을 때 크게 보여주기 (어르신들이 작은 글씨를 읽으실 수 있게)
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  // 창립회원 모집 인원 — 이 숫자만 바꾸면 헤드라인이 따라갑니다.
  const FOUNDER_GOAL = 100;

  return (
    <div className="bg-white">
      {/* 1. 이번 주에 새로 올라온 소식 — 한 줄 띠 */}
      <NoticeStrip />

      {/* 2. 첫 화면 = 구장 찾기.
             찾아오신 분의 질문("어디 가서 칠까")에 먼저 답합니다. */}
      <HomeHeroSearch />

      {/* 3. 창립회원 모집 + 오픈이벤트.
             예전에는 첫 화면을 차지했는데, 구장 검색 아래로 내렸습니다.
             내용은 하나도 줄이지 않았습니다. */}
      <section
        className="relative bg-cover border-y-4 border-amber-300"
        style={{ backgroundImage: `url(${MAIN_BANNER_IMAGE_URL})`, backgroundPosition: 'center 62%' }}
      >
        <div className="absolute inset-0 bg-green-950/90" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-9 sm:py-12">
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] gap-7 xl:gap-10 items-stretch">
            {/* 왼쪽: 창립회원 모집 */}
            <div className="max-w-2xl mx-auto xl:mx-0 w-full flex flex-col justify-center">
              <div className="bg-green-950/70 border-2 border-amber-300/60 rounded-3xl p-5 sm:p-6 backdrop-blur-sm">
                <p className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-2">
                  🎉 창립회원 <span className="text-amber-300">{FOUNDER_GOAL.toLocaleString()}명</span> 한정 모집!
                </p>
                <p className="text-base sm:text-lg md:text-xl text-green-100 font-bold mb-5">
                  지금 가입하시면 진짜 <span className="text-amber-200 font-black">'창립멤버'</span>가 되십니다.
                </p>

                {currentUser ? (
                  <button
                    onClick={() => openModal('myPage')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-green-950 font-black text-lg sm:text-xl shadow-2xl transition-all cursor-pointer"
                  >
                    {currentUser.nickname}님, {currentUser.points.toLocaleString()}P 확인하기 →
                  </button>
                ) : (
                  <button
                    onClick={() => openModal('auth')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-green-950 font-black text-lg sm:text-xl shadow-2xl transition-all cursor-pointer"
                  >
                    무료로 창립회원 가입하기 →
                  </button>
                )}

                <p className="text-base sm:text-lg text-amber-200 font-black mt-4">
                  가입만 해도 1,000 마당P 즉시 지급 · 이미 {totalUsers}명 함께하고 있어요
                </p>
              </div>
            </div>

            {/* 오른쪽: 창립회원 오픈이벤트 */}
            <div className="w-full max-w-2xl mx-auto xl:mx-0 rounded-3xl bg-green-950/70 border-2 border-amber-300/40 backdrop-blur-sm p-4">
              <div className="text-center mb-2.5">
                <span className="text-amber-300 font-black text-xl sm:text-2xl">🎉 창립회원 오픈이벤트</span>
              </div>

              <div className="grid grid-cols-1 xl:auto-rows-fr gap-2.5">
                {/* 1번째 오픈이벤트 */}
                <div className="bg-white/10 rounded-2xl border border-white/20 p-4 flex flex-col">
                  <span className="self-start px-3 py-1 rounded-full bg-amber-400 text-green-950 text-sm sm:text-base font-black mb-2.5">
                    1번째 오픈이벤트
                  </span>

                  <p className="text-white font-black text-xl sm:text-2xl leading-tight mb-2.5">
                    가입 즉시 <span className="text-amber-300">1,000 마당P</span> 지급!
                  </p>

                  <div className="flex-1 flex flex-col justify-center bg-emerald-950/50 rounded-2xl px-3 py-2 sm:py-6 border border-amber-300/30">
                    <div className="flex flex-col min-[400px]:flex-row items-stretch min-[400px]:items-start justify-between gap-1.5 min-[400px]:gap-1">
                      {POINT_STEPS.map((step, i) => (
                        <React.Fragment key={step.no}>
                          <div className="flex-1 text-center min-w-0">
                            <div className="w-12 h-12 sm:w-20 sm:h-20 mx-auto rounded-xl sm:rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-2xl sm:text-4xl mb-1.5 sm:mb-2.5">
                              {step.emoji}
                            </div>
                            <p className="text-white font-black text-base sm:text-xl leading-tight">{step.title}</p>
                            <p className="text-amber-200 font-bold text-sm sm:text-lg leading-snug mt-0.5 sm:mt-1 break-keep">
                              {step.short}
                            </p>
                          </div>
                          {i < POINT_STEPS.length - 1 && (
                            <div className="text-center min-[400px]:pt-5 sm:min-[400px]:pt-9 text-amber-300 text-2xl sm:text-3xl font-black shrink-0">
                              <span className="min-[400px]:hidden">↓</span>
                              <span className="hidden min-[400px]:inline">→</span>
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('pointmarket');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="mt-auto pt-3 w-full cursor-pointer"
                  >
                    <span className="block w-full py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 border-2 border-amber-300/60 text-amber-200 font-black text-base sm:text-lg transition-colors">
                      🎁 마당P 장터 구경하기 →
                    </span>
                  </button>
                </div>

                {/* 2번째 오픈이벤트 */}
                {monthlyDrawInfo && (
                  <div className="bg-white/10 rounded-2xl border border-white/20 p-4 flex flex-col">
                    <span className="self-start px-3 py-1 rounded-full bg-violet-400 text-violet-950 text-sm sm:text-base font-black mb-2.5">
                      2번째 오픈이벤트
                    </span>

                    <p className="text-white font-black text-xl sm:text-2xl leading-tight mb-2">
                      가입만 하시면 경품 <span className="text-amber-300">자동응모!</span>
                    </p>

                    <button
                      type="button"
                      onClick={() => setZoomImage(WELITA_PRODUCT_IMAGE_URL)}
                      className="block w-full max-w-[320px] mx-auto mb-2 rounded-xl overflow-hidden border-2 border-amber-300/60 cursor-zoom-in"
                      title="크게 보기"
                    >
                      <img
                        src={WELITA_PRODUCT_IMAGE_URL}
                        alt="웰리타-Y 간건강 밀크씨슬 · 스트레스 완화 테아닌 영양제"
                        className="w-full h-auto"
                      />
                    </button>

                    <p className="text-amber-200 font-black text-base sm:text-lg leading-snug">
                      랜덤추첨 1분께 <span className="text-white">{monthlyDrawInfo.prize.value}</span> 웰리타 영양제 증정
                    </p>

                    <p className="text-green-100 font-bold text-sm sm:text-base mt-1">
                      👆 사진 누르면 크게 · 현재{' '}
                      <span className="text-amber-300 font-black">{monthlyDrawInfo.eligibleCount}명</span> 응모 중
                      {monthlyDrawInfo.alreadyDrawnThisMonth && ' · 이번 달 추첨 완료'}
                    </p>

                    <p className="text-green-100/90 font-bold text-sm sm:text-base mt-1 leading-relaxed">
                      한 번 가입하시면 <span className="text-amber-200">매달 자동으로 다시 응모</span>됩니다.
                      당첨되신 분은 다음 달부터 빠지니, 아직 못 받으신 분께 기회가 돌아갑니다.
                    </p>

                    {monthlyDrawInfo.recentWinners && monthlyDrawInfo.recentWinners.length > 0 && (
                      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                        {monthlyDrawInfo.recentWinners.map((w: any, i: number) => (
                          <span
                            key={i}
                            className="text-xs sm:text-sm font-black text-amber-200 bg-white/15 px-2.5 py-1 rounded-full"
                          >
                            🎉 {w.month} {w.nickname}님 당첨
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto pt-3">
                      <a
                        href={monthlyDrawInfo.prize.sellerProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 border-2 border-amber-300/60 text-amber-200 font-black text-base sm:text-lg text-center transition-colors"
                      >
                        제품보기 : {monthlyDrawInfo.prize.brand} →
                      </a>
                      <p className="text-green-200/80 font-medium text-xs mt-1.5 leading-snug">
                        * 본 경품은 {monthlyDrawInfo.prize.brand}에서 후원받은 제품입니다.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 유튜브·블로그 채널 + 얇은 후원사 광고 띠 */}
      <section className="bg-slate-50 border-y border-slate-200 py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-5">
          <SocialChannelsSection />
          <SponsorCompactBanner />
        </div>
      </section>

      {/* 사진 크게 보기 */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-[60] bg-black/85 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomImage(null)}
        >
          <div className="relative max-w-3xl w-full max-h-[92vh] overflow-y-auto">
            <img src={zoomImage} alt="웰리타 경품 안내" className="w-full h-auto rounded-2xl bg-white" />
            <button
              onClick={() => setZoomImage(null)}
              className="sticky bottom-3 left-1/2 -translate-x-1/2 mt-3 px-8 py-4 rounded-xl bg-white text-slate-900 font-black text-lg shadow-2xl cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 5. Closing Quote */}
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
