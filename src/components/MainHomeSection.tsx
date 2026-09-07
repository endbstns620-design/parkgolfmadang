import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useParkGolf } from '../context/ParkGolfContext';
import { SocialChannelsSection } from './SocialChannelsSection';

// 메인 배너 이미지 — 대표님이 직접 주신 실제 파크골프장 사진입니다.
// 원본이 4032×3024로 넉넉해서, 큰 화면에서도 또렷하게 보이도록 2400px로 넣었습니다.
const MAIN_BANNER_IMAGE_URL = '/images/hero-parkgolf-v7.jpg';

// 웰리타-Y 밀크씨슬 테아닌 3병 세트(3개월분) 실제 제품 사진입니다.
const WELITA_PRODUCT_IMAGE_URL = '/images/welita-y-milkthistle.jpg';
// 제품 성분 안내 이미지 (밀크씨슬·L-테아닌·비타민D·마그네슘)
const WELITA_INGREDIENT_IMAGE_URL = '/images/welita-y-ingredients.jpg';

// 마당P가 쌓여서 상품으로 바뀌는 흐름 (1번째 오픈이벤트 아래에 표시)
const POINT_STEPS = [
  { no: 1, emoji: '✍️', title: '글 쓰기', desc: '구장리뷰 · 맛집\n동반자모집' },
  { no: 2, emoji: '🪙', title: '마당P 적립', desc: '글 하나에\n+300 마당P' },
  { no: 3, emoji: '🎁', title: '상품 교환', desc: '마당P 장터에서\n제품으로' }
];

export const MainHomeSection: React.FC = () => {
  const { totalUsers, currentUser, setActiveTab, openModal, monthlyDrawInfo } = useParkGolf();

  // 경품 사진을 눌렀을 때 크게 보여주기 (어르신들이 작은 글씨를 읽으실 수 있게)
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  // 창립회원 모집 인원 — 이 숫자만 바꾸면 헤드라인·진행률바가 한꺼번에 따라갑니다.
  const FOUNDER_GOAL = 100;
  const founderProgress = Math.min(100, Math.round((totalUsers / FOUNDER_GOAL) * 100));

  const categoryCards = [
    { id: 'courses', title: '전국 구장 지도', desc: '내 주변 파크골프장 한눈에 보기', image: '/images/course-wide.jpg' },
    { id: 'tournaments', title: '대회·행사 소식', desc: '전국 대회 일정과 참가 정보', image: '/images/tournament-sunset.jpg' },
    { id: 'news', title: '초보자 가이드', desc: '처음 시작하는 분들을 위한 친절한 안내', image: '/images/card-guide-v4.png' },
    { id: 'matching', title: '커뮤니티', desc: '함께하는 이야기, 더 즐거운 파크골프', image: '/images/card-community-v4.png' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Banner — 사진을 배경으로 깔고 글은 흐름대로 쌓습니다.
          (예전처럼 사진 위에 겹쳐두면 "글씨 아주 크게"를 고르셨을 때 글이 잘립니다) */}
      <section
        className="relative bg-cover"
        style={{ backgroundImage: `url(${MAIN_BANNER_IMAGE_URL})`, backgroundPosition: 'center 62%' }}
      >
        {/* 사진 위에 글씨가 잘 읽히도록 어둡게 덮습니다 */}
        {/* 왼쪽은 글씨가 잘 읽히게 진하게, 오른쪽은 구장 사진이 살아나도록 옅게 덮습니다 */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/95 via-green-950/70 to-green-950/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-green-950/55 via-transparent to-green-950/25" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-400 text-green-950 text-sm sm:text-base font-black mb-5">
              <Sparkles className="w-4 h-4" />
              <span>📢 전국 파크골프 동호인 여러분께</span>
            </div>

            {/* ① 사이트 소개 */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.2] mb-4 text-white drop-shadow-lg">
              ⛳ <span className="text-amber-300">파크골프마당</span>이<br />
              문을 열었습니다
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-green-50 font-bold leading-relaxed mb-7 drop-shadow-sm">
              파크골프를 사랑하는 동호인들이 모여<br />
              정보를 나누는 곳입니다.<br />
              구장정보 · 대회소식은 물론<br />
              구장 근처 맛집 · 동반자 모집까지{' '}
              <span className="text-amber-200 font-black whitespace-nowrap">여기 다 있습니다.</span>
            </p>

            {/* ② 창립회원 모집 */}
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

              <p className="text-white font-black text-2xl sm:text-3xl leading-tight mb-4">
                창립회원 신규가입 즉시<br />
                <span className="text-amber-300">1,000 마당P</span> 지급!
              </p>

              {/* 활동 적립 안내 — 시니어분들이 한눈에 읽으실 수 있게 크게 표시합니다.
                  실제 지급은 운영자 확인 후이므로 그 점도 함께 적어둡니다. */}
              <div className="bg-emerald-950/50 rounded-2xl px-5 py-4 mb-4 border border-amber-300/30">
                <p className="text-white font-black text-xl sm:text-2xl leading-snug">
                  구장리뷰 · 맛집 · 동반자모집<br />
                  글 하나에 <span className="text-amber-300">+300 마당P</span>
                </p>
                <p className="text-green-100 font-bold text-base sm:text-lg mt-2">
                  운영자 확인 후 24시간 안에 넣어드립니다
                </p>
              </div>

              <p className="text-amber-200 font-black text-lg sm:text-xl leading-snug mb-5">
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

              {/* 마당P가 어떻게 쌓이고 어디에 쓰이는지 —
                  처음 오신 어르신도 흐름을 한눈에 아시도록 3단계로 보여드립니다. */}
              <div className="mt-6 pt-5 border-t border-white/20">
                <p className="text-center text-amber-200 font-black text-lg sm:text-xl mb-4">
                  마당P, 이렇게 쓰입니다
                </p>

                <div className="flex items-start justify-between gap-1">
                  {POINT_STEPS.map((step, i) => (
                    <React.Fragment key={step.no}>
                      <div className="flex-1 text-center min-w-0">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-3xl sm:text-4xl mb-2">
                          {step.emoji}
                        </div>
                        <p className="text-white font-black text-base sm:text-lg leading-tight">
                          {step.title}
                        </p>
                        <p className="text-green-100 font-bold text-sm sm:text-base leading-snug mt-0.5 whitespace-pre-line break-keep">
                          {step.desc}
                        </p>
                      </div>
                      {i < POINT_STEPS.length - 1 && (
                        <div className="pt-4 sm:pt-5 text-amber-300 text-2xl sm:text-3xl font-black shrink-0">
                          →
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setActiveTab('pointmarket');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="mt-5 w-full py-4 rounded-2xl bg-white/15 hover:bg-white/25 border-2 border-amber-300/60 text-amber-200 font-black text-lg sm:text-xl transition-colors cursor-pointer"
                >
                  🎁 마당P 장터 구경하기 →
                </button>
              </div>
            </div>

            {/* 2번째 오픈이벤트 */}
            {monthlyDrawInfo && (
              <div className="bg-white/10 rounded-2xl border border-white/20 p-6 sm:p-7">
                <span className="inline-block px-3.5 py-1.5 rounded-full bg-violet-400 text-violet-950 text-base sm:text-lg font-black mb-4">
                  2번째 오픈이벤트
                </span>

                {/* 제품 사진과 성분 안내를 나란히 — 누르시면 크게 볼 수 있습니다 */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setZoomImage(WELITA_PRODUCT_IMAGE_URL)}
                    className="rounded-2xl overflow-hidden bg-white border-2 border-amber-300/60 shadow-lg cursor-zoom-in"
                    title="크게 보기"
                  >
                    <img
                      src={WELITA_PRODUCT_IMAGE_URL}
                      alt="웰리타-Y 밀크씨슬 테아닌 영양제 3병 세트 (3개월분)"
                      className="w-full h-auto object-cover"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomImage(WELITA_INGREDIENT_IMAGE_URL)}
                    className="rounded-2xl overflow-hidden bg-white border-2 border-amber-300/60 shadow-lg cursor-zoom-in"
                    title="크게 보기"
                  >
                    <img
                      src={WELITA_INGREDIENT_IMAGE_URL}
                      alt="웰리타-Y 주요 성분 안내 — 밀크씨슬, L-테아닌, 비타민D, 마그네슘"
                      className="w-full h-auto object-cover"
                    />
                  </button>
                </div>
                <p className="text-center text-sm sm:text-base font-bold text-green-100 mb-4">
                  👆 사진을 누르시면 크게 보실 수 있습니다
                </p>

                <p className="text-white font-black text-2xl sm:text-3xl leading-tight mb-4">
                  신규 가입 시 경품 <span className="text-amber-300">자동응모!</span>
                </p>

                <p className="text-amber-200 font-black text-xl sm:text-2xl leading-snug mb-4">
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
                  제품보기 : {monthlyDrawInfo.prize.brand} →
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

      {/* 유튜브 · 네이버 밴드 안내 — 카테고리 카드 바로 아래에 둡니다 */}
      <SocialChannelsSection />

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
