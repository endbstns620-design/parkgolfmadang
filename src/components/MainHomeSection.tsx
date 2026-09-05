import React from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { Sparkles, CheckCircle2 } from 'lucide-react';

// 메인 배너 이미지 — 대표님이 벤치마킹용으로 보내주신 사진들로 교체했습니다.
// 전부 텍스트가 따로 박혀있지 않은 순수 사진이라, 겹쳐 보이는 문제 자체가 생기지 않습니다.
const MAIN_BANNER_IMAGE_URL = '/images/hero-couple-v4.jpg';

export const MainHomeSection: React.FC = () => {
  const { courses, totalUsers, currentUser, setActiveTab, openModal } = useParkGolf();

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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-green-950 text-xs sm:text-sm font-extrabold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>지금 가입하면 창립회원 혜택!</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-4 text-white drop-shadow-lg">
                다치지 않고,<br />
                <span className="text-amber-300">평생 즐기는 골프</span><br />
                파크골프
              </h1>
              <p className="text-lg sm:text-xl text-green-50 font-bold mb-7 drop-shadow-sm">
                전국 {courses.length}곳 구장 정보 · 대회일정 · 동반자 매칭까지<br className="hidden sm:block" />
                파크골프의 모든 것을 한곳에서, 무료로.
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

      {/* 가입 유도 이벤트 배너 — 실제 포인트 제도를 그대로 후킹으로 씁니다 (가짜 숫자 없음) */}
      <section className="bg-gradient-to-r from-emerald-800 to-green-900 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-amber-300 font-black text-sm sm:text-base mb-1">🎉 창립회원 오픈 이벤트</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-snug">
              활동할수록 쌓이는 <span className="text-amber-300">마당P</span>,<br className="sm:hidden" />
              실제 상품으로 교환하세요!
            </h2>
            <p className="text-green-100 text-sm sm:text-base font-bold mt-2">
              구장 리뷰 +200P · 동반자 모집 +300P · 맛집 등록 +150P
            </p>
          </div>
          <button
            onClick={() => (currentUser ? openModal('myPage') : openModal('auth'))}
            className="shrink-0 px-6 py-3.5 rounded-xl bg-white hover:bg-amber-50 text-emerald-800 font-black text-base sm:text-lg shadow-xl transition-all cursor-pointer whitespace-nowrap"
          >
            {currentUser ? '마당P 교환소 가기 →' : '지금 시작하기 →'}
          </button>
        </div>
      </section>

      {/* Sticky Note + Photo */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Sticky Note */}
          <div className="relative bg-amber-50 border border-amber-200 rounded-2xl p-6 sm:p-7 shadow-md">
            <div className="absolute -top-3 left-6 w-6 h-6 rounded-full bg-rose-500 shadow" />
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug mb-1">
              "파크골프, <br />
              <span className="text-emerald-700">지금 시작해도</span><br />
              <span className="text-rose-500">늦지 않습니다!</span>"
            </p>

            <ul className="mt-5 space-y-2.5">
              {[
                '특별한 장비 없어도 OK!',
                '가까운 곳에서 누구나 즐길 수 있어요',
                '걸으면서 건강도, 마음도 UP!',
                '집 근처 구장부터 지금 바로 시작하세요!'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm sm:text-base font-bold text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Photo */}
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-green-50">
            <img
              src="/images/highfive-v4.png"
              alt="파크골프를 즐기는 시니어들의 하이파이브"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md">
              <p className="text-sm sm:text-base font-extrabold text-emerald-800 text-right leading-snug">
                작은 공이<br />만드는<br /><span className="text-rose-500">큰 행복!</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
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
