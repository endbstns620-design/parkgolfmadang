import React, { useState } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { SocialChannelsSection } from './SocialChannelsSection';
import { SponsorCompactBanner } from './SponsorBannerSection';
import { HomeHeroSearch } from './HomeHeroSearch';
import { HomeTodayCards } from './HomeTodayCards';
import { HomeFavorites } from './HomeFavorites';
import { ChevronDown, ChevronUp } from 'lucide-react';

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

  // 오픈이벤트 자세히 — 처음에는 접어둡니다.
  // 내용을 없앤 것이 아니라, 구장을 찾으러 오신 분의 화면을 먼저 비워드리는 것입니다.
  const [showEventDetail, setShowEventDetail] = useState(false);

  // 창립회원 모집 인원 — 이 숫자만 바꾸면 문구가 따라갑니다.
  const FOUNDER_GOAL = 100;

  return (
    <div className="bg-white">
      {/* 1. 첫 화면 = 구장 찾기.
             찾아오신 분의 질문("어디 가서 칠까")에 먼저 답합니다. */}
      <HomeHeroSearch />

      {/* 2. 오늘 상태판 — 날씨 · 가장 가까운 대회 · 새 소식 3칸.
             예전 맨 위 공지 띠는 이 안의 '새 소식' 칸으로 합쳤습니다. */}
      <HomeTodayCards />

      {/* 3. 내 관심구장 · 관심대회 (로그인하신 분에게만 나옵니다) */}
      <HomeFavorites />

      {/* 4. 창립회원 모집 — 예전에는 화면 여러 칸을 차지했는데 한 줄 띠로 줄였습니다.
             오픈이벤트 내용은 아래 '자세히 보기'에 그대로 들어 있습니다. */}
      <section className="bg-amber-50 border-y-2 border-amber-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
            <div className="flex-1 min-w-0">
              {/* 글자 모양은 그대로, 제목 태그로만 바꿨습니다 */}
              <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 leading-tight break-keep">
                🎉 창립회원 {FOUNDER_GOAL.toLocaleString()}명 한정 모집 — 이미 {totalUsers}명이 함께하고 있어요
              </h2>
              <p className="text-base sm:text-lg font-bold text-amber-800 mt-1 break-keep">
                가입 1,000P · 관심구장·대회 찜하면 최대 1,200P · 친구 소개하면 두 분 다 500P
              </p>
            </div>

            {currentUser ? (
              <button
                onClick={() => openModal('myPage')}
                className="shrink-0 w-full sm:w-auto px-6 py-3.5 rounded-xl bg-green-700 hover:bg-green-800 text-white font-black text-lg sm:text-xl shadow transition-colors cursor-pointer"
              >
                {currentUser.nickname}님 · {currentUser.points.toLocaleString()}P →
              </button>
            ) : (
              <button
                onClick={() => openModal('auth')}
                className="shrink-0 w-full sm:w-auto px-6 py-3.5 rounded-xl bg-green-700 hover:bg-green-800 text-white font-black text-lg sm:text-xl shadow transition-colors cursor-pointer"
              >
                무료 가입하기 →
              </button>
            )}
          </div>

          <button
            onClick={() => setShowEventDetail(v => !v)}
            aria-expanded={showEventDetail}
            className="mt-3 inline-flex items-center gap-1 text-base sm:text-lg font-black text-amber-900 hover:text-amber-950 cursor-pointer"
          >
            오픈이벤트 자세히 보기
            {showEventDetail ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {showEventDetail && (
            <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
              {/* 1번째 오픈이벤트 */}
              <div className="bg-white rounded-2xl border-2 border-amber-300 p-4 flex flex-col">
                <span className="self-start px-3 py-1 rounded-full bg-amber-400 text-green-950 text-sm sm:text-base font-black mb-2.5">
                  1번째 오픈이벤트
                </span>

                <p className="text-slate-900 font-black text-xl sm:text-2xl leading-tight mb-3">
                  가입 즉시 <span className="text-amber-700">1,000 마당P</span> 지급!
                </p>

                <div className="flex-1 flex flex-col justify-center bg-emerald-50 rounded-2xl px-3 py-4 border border-emerald-200">
                  <div className="flex flex-col min-[400px]:flex-row items-stretch min-[400px]:items-start justify-between gap-1.5 min-[400px]:gap-1">
                    {POINT_STEPS.map((step, i) => (
                      <React.Fragment key={step.no}>
                        <div className="flex-1 text-center min-w-0">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-xl sm:rounded-2xl bg-white border border-emerald-200 flex items-center justify-center text-2xl sm:text-3xl mb-1.5 sm:mb-2">
                            {step.emoji}
                          </div>
                          <p className="text-slate-900 font-black text-base sm:text-lg leading-tight">{step.title}</p>
                          <p className="text-emerald-800 font-bold text-sm sm:text-base leading-snug mt-0.5 break-keep">
                            {step.short}
                          </p>
                        </div>
                        {i < POINT_STEPS.length - 1 && (
                          <div className="text-center min-[400px]:pt-5 sm:min-[400px]:pt-7 text-emerald-600 text-2xl sm:text-3xl font-black shrink-0">
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
                  <span className="block w-full py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-900 font-black text-base sm:text-lg transition-colors">
                    🎁 마당P 장터 구경하기 →
                  </span>
                </button>
              </div>

              {/* 2번째 오픈이벤트 */}
              {monthlyDrawInfo && (
                <div className="bg-white rounded-2xl border-2 border-violet-300 p-4 flex flex-col">
                  <span className="self-start px-3 py-1 rounded-full bg-violet-400 text-violet-950 text-sm sm:text-base font-black mb-2.5">
                    2번째 오픈이벤트
                  </span>

                  <p className="text-slate-900 font-black text-xl sm:text-2xl leading-tight mb-2">
                    가입만 하시면 경품 <span className="text-violet-700">자동응모!</span>
                  </p>

                  <button
                    type="button"
                    onClick={() => setZoomImage(WELITA_PRODUCT_IMAGE_URL)}
                    className="block w-full max-w-[320px] mx-auto mb-2 rounded-xl overflow-hidden border-2 border-violet-300 cursor-zoom-in"
                    title="크게 보기"
                  >
                    <img
                      src={WELITA_PRODUCT_IMAGE_URL}
                      alt="웰리타-Y 간건강 밀크씨슬 · 스트레스 완화 테아닌 영양제"
                      className="w-full h-auto"
                    />
                  </button>

                  <p className="text-slate-900 font-black text-base sm:text-lg leading-snug">
                    랜덤추첨 1분께 {monthlyDrawInfo.prize.value} 웰리타 영양제 증정
                  </p>

                  <p className="text-slate-600 font-bold text-sm sm:text-base mt-1">
                    👆 사진 누르면 크게 · 현재{' '}
                    <span className="text-violet-700 font-black">{monthlyDrawInfo.eligibleCount}명</span> 응모 중
                    {monthlyDrawInfo.alreadyDrawnThisMonth && ' · 이번 달 추첨 완료'}
                  </p>

                  <p className="text-slate-600 font-bold text-sm sm:text-base mt-1 leading-relaxed">
                    한 번 가입하시면 <span className="text-violet-700">매달 자동으로 다시 응모</span>됩니다.
                    당첨되신 분은 다음 달부터 빠지니, 아직 못 받으신 분께 기회가 돌아갑니다.
                  </p>

                  {monthlyDrawInfo.recentWinners && monthlyDrawInfo.recentWinners.length > 0 && (
                    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                      {monthlyDrawInfo.recentWinners.map((w: any, i: number) => (
                        <span
                          key={i}
                          className="text-xs sm:text-sm font-black text-violet-900 bg-violet-100 px-2.5 py-1 rounded-full"
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
                      className="block w-full py-2.5 rounded-2xl bg-violet-50 hover:bg-violet-100 border-2 border-violet-300 text-violet-900 font-black text-base sm:text-lg text-center transition-colors"
                    >
                      제품보기 : {monthlyDrawInfo.prize.brand} →
                    </a>
                    <p className="text-slate-500 font-medium text-xs mt-1.5 leading-snug">
                      * 본 경품은 {monthlyDrawInfo.prize.brand}에서 후원받은 제품입니다.
                    </p>
                  </div>
                </div>
              )}

              {/* 3번째 오픈이벤트 — 찜하기 */}
              <div className="bg-white rounded-2xl border-2 border-emerald-300 p-4 flex flex-col">
                <span className="self-start px-3 py-1 rounded-full bg-emerald-500 text-white text-sm sm:text-base font-black mb-2.5">
                  3번째 오픈이벤트
                </span>

                <p className="text-slate-900 font-black text-xl sm:text-2xl leading-tight mb-3">
                  찜 하나에 <span className="text-emerald-700">200 마당P</span> ·
                  다 채우면 <span className="text-emerald-700">1,200P</span>
                </p>

                <div className="flex-1 bg-emerald-50 rounded-2xl px-4 py-4 border border-emerald-200 space-y-2.5">
                  <p className="text-slate-900 font-black text-lg sm:text-xl leading-snug break-keep">
                    ⭐ 관심구장 3곳 + 관심대회 3개
                  </p>
                  <p className="text-slate-700 font-bold text-base sm:text-lg leading-relaxed break-keep">
                    자주 가시는 구장과 나가고 싶은 대회를 찜해 두세요.
                    다음에 오시면 <span className="text-emerald-800">첫 화면에 바로</span> 보여드립니다.
                  </p>
                  <p className="text-slate-700 font-bold text-base sm:text-lg leading-relaxed break-keep">
                    🗓️ <span className="text-emerald-800">매달 새로 받으실 수 있습니다.</span>{' '}
                    달이 바뀌면 첫 화면에 받기 버튼이 다시 나옵니다.
                  </p>
                  <p className="text-slate-500 font-medium text-sm leading-snug break-keep">
                    * 찜을 푸시면 그 달에 받으신 200P는 다시 빠집니다.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('courses');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="mt-auto pt-3 w-full cursor-pointer"
                >
                  <span className="block w-full py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-900 font-black text-base sm:text-lg transition-colors">
                    ⭐ 관심구장 찜하러 가기 →
                  </span>
                </button>
              </div>

              {/* 4번째 오픈이벤트 — 추천인 */}
              <div className="bg-white rounded-2xl border-2 border-sky-300 p-4 flex flex-col">
                <span className="self-start px-3 py-1 rounded-full bg-sky-500 text-white text-sm sm:text-base font-black mb-2.5">
                  4번째 오픈이벤트
                </span>

                <p className="text-slate-900 font-black text-xl sm:text-2xl leading-tight mb-3">
                  친구를 소개하면 <span className="text-sky-700">두 분 모두 500P</span>
                </p>

                <div className="flex-1 bg-sky-50 rounded-2xl px-4 py-4 border border-sky-200 space-y-2.5">
                  <p className="text-slate-700 font-bold text-base sm:text-lg leading-relaxed break-keep">
                    ① 가입하실 때 <span className="text-sky-800">추천인 닉네임</span> 칸에
                    소개해 주신 분의 닉네임을 적습니다.
                  </p>
                  <p className="text-slate-700 font-bold text-base sm:text-lg leading-relaxed break-keep">
                    ② 새로 오신 분이 <span className="text-sky-800">찜 3개</span>를 채우시면
                  </p>
                  <p className="text-slate-900 font-black text-lg sm:text-xl leading-snug break-keep">
                    ③ 소개하신 분 500P · 가입하신 분 500P 지급 🎁
                  </p>
                  <p className="text-slate-500 font-medium text-sm leading-snug break-keep">
                    * 동호회 단톡방에 알려주시면 좋습니다. 한 분이 한 달에 10명까지 받으실 수 있습니다.
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (currentUser) {
                      openModal('myPage');
                    } else {
                      openModal('auth');
                    }
                  }}
                  className="mt-auto pt-3 w-full cursor-pointer"
                >
                  <span className="block w-full py-2.5 rounded-2xl bg-sky-50 hover:bg-sky-100 border-2 border-sky-300 text-sky-900 font-black text-base sm:text-lg transition-colors">
                    {currentUser
                      ? `👥 내 닉네임(${currentUser.nickname})을 알려주세요 →`
                      : '👥 무료 가입하고 추천받기 →'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. 유튜브·블로그 채널 + 얇은 후원사 광고 띠 */}
      <section className="bg-slate-50 border-y border-slate-200 py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-5">
          <h2 className="sr-only">파크골프마당 채널 · 유튜브와 네이버 블로그</h2>
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

      {/* 6. Closing Quote */}
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
