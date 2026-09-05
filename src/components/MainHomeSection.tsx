import React, { useState } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import {
  Search,
  Sparkles,
  HeartPulse,
  Users2,
  Trees,
  Trophy,
  MapPin,
  UsersRound,
  CheckCircle2
} from 'lucide-react';

// 메인 배너 이미지 — 대표님이 벤치마킹용으로 보내주신 사진들로 교체했습니다.
// 전부 텍스트가 따로 박혀있지 않은 순수 사진이라, 겹쳐 보이는 문제 자체가 생기지 않습니다.
const MAIN_BANNER_IMAGE_URL = '/images/hero-couple-v4.jpg';

const HASHTAGS = ['#내주변구장', '#무료구장', '#야간운영', '#오늘개방', '#주차가능', '#대회정보'];

const VALUE_BADGES = [
  { label: '건강한\n100세 생활', icon: HeartPulse, bg: 'bg-blue-500' },
  { label: '새로운\n사람과의 만남', icon: Users2, bg: 'bg-emerald-600' },
  { label: '아름다운\n자연 속 힐링', icon: Trees, bg: 'bg-orange-500' },
  { label: '다양한 대회와\n즐거운 도전', icon: Trophy, bg: 'bg-pink-500' }
];

export const MainHomeSection: React.FC = () => {
  const { courses, tournaments, matches, setActiveTab } = useParkGolf();
  const [searchInput, setSearchInput] = useState('');

  const goToCourseSearch = () => {
    setActiveTab('courses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categoryCards = [
    { id: 'courses', title: '전국 구장 지도', desc: '내 주변 파크골프장 한눈에 보기', image: '/images/card-courses-v4.png' },
    { id: 'tournaments', title: '대회·행사 소식', desc: '전국 대회 일정과 참가 정보', image: '/images/card-tournaments-v4.png' },
    { id: 'news', title: '초보자 가이드', desc: '처음 시작하는 분들을 위한 친절한 안내', image: '/images/card-guide-v4.png' },
    { id: 'matching', title: '커뮤니티', desc: '함께하는 이야기, 더 즐거운 파크골프', image: '/images/card-community-v4.png' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Banner — 이번 사진은 원래 글자가 안 박혀있어서, 전체 배경으로 크게 쓰고
          왼쪽에 어두운 그라데이션만 깔아서 그 위에 실제 텍스트를 올렸습니다. */}
      <section className="relative overflow-hidden">
        <img
          src={MAIN_BANNER_IMAGE_URL}
          alt="파크골프를 즐기는 시니어 부부와 파크골프장 표지판"
          className="w-full h-[420px] sm:h-[480px] md:h-[560px] object-cover object-[30%_center]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/85 via-green-950/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-green-950/60 via-transparent to-transparent" />

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
            <div className="max-w-lg">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/90 text-green-950 text-xs sm:text-sm font-extrabold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>전국 파크골프 동호인과 함께하는 커뮤니티</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-3 text-white drop-shadow-md">
                오늘도, <span className="text-amber-300">파크골프가</span><br />
                좋다! <span className="text-rose-300">♡</span>
              </h1>
              <p className="text-base sm:text-lg text-green-50 font-bold mb-6 drop-shadow-sm">
                건강한 오늘, 더 행복한 내일 — 파크골프와 함께하세요!
              </p>

              {/* Search Bar */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-2 flex items-center gap-2 mb-4">
                <Search className="w-5 h-5 text-slate-400 ml-2 shrink-0" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && goToCourseSearch()}
                  placeholder="지금, 가까운 파크골프장을 찾아보세요"
                  className="flex-1 min-w-0 text-sm sm:text-base font-medium outline-none bg-transparent"
                />
                <button
                  onClick={goToCourseSearch}
                  className="shrink-0 px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm sm:text-base transition-colors cursor-pointer"
                >
                  구장 검색하기 →
                </button>
              </div>

              {/* Hashtags */}
              <div className="flex items-center gap-2 flex-wrap">
                {HASHTAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={goToCourseSearch}
                    className="px-3 py-1 rounded-full bg-white/90 border border-white text-xs sm:text-sm font-bold text-slate-700 hover:bg-white cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Value Badges — 사진 아래, 별도의 깨끗한 영역 */}
      <section className="bg-white py-6 px-4 border-b border-slate-100">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
          {VALUE_BADGES.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="flex flex-col items-center gap-1.5 w-20 sm:w-24">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${b.bg} flex items-center justify-center shadow-md`}>
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-slate-800 text-center leading-tight whitespace-pre-line">
                  {b.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Live Stats Bar */}
      <section className="bg-green-950 py-5 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 sm:gap-6 text-center">
          <div>
            <div className="flex items-center justify-center gap-1.5 text-amber-300 text-2xl sm:text-3xl font-extrabold">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
              {courses.length}+
            </div>
            <div className="text-xs sm:text-sm text-green-100 font-medium mt-0.5">전국 파크골프장 구장</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1.5 text-amber-300 text-2xl sm:text-3xl font-extrabold">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
              {tournaments.length}건
            </div>
            <div className="text-xs sm:text-sm text-green-100 font-medium mt-0.5">전국 대회 실시간 진행</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1.5 text-amber-300 text-2xl sm:text-3xl font-extrabold">
              <UsersRound className="w-5 h-5 sm:w-6 sm:h-6" />
              {matches.filter(m => m.status === '모집중').length}팀
            </div>
            <div className="text-xs sm:text-sm text-green-100 font-medium mt-0.5">동호회·모임이 있는 곳</div>
          </div>
        </div>
      </section>

      {/* Sticky Note + Swing Image */}
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

          {/* Right Photo — 이번 사진엔 문구가 안 박혀있어서, 직접 문구를 깔끔하게 얹습니다 */}
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
          {categoryCards.map(card => {
            return (
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
            );
          })}
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
