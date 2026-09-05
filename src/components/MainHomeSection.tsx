import React, { useState } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import {
  Search,
  HeartPulse,
  Users2,
  Trees,
  Trophy,
  MapPin,
  UsersRound,
  CheckCircle2
} from 'lucide-react';

// 메인 배너 이미지 — 대표님이 ChatGPT로 직접 생성하신 이미지에서 인물 부분만 잘라 사용합니다.
// (AI 생성 이미지라 실존 인물의 초상권 문제가 없습니다)
const MAIN_BANNER_IMAGE_URL = '/images/main-hero-couple.png';
const SWING_SILHOUETTE_IMAGE_URL =
  'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=800&q=80';

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
    { id: 'courses', title: '전국 구장 지도', desc: '내 주변 파크골프장 한눈에 보기', image: '/images/card-courses.png' },
    { id: 'tournaments', title: '대회·행사 소식', desc: '전국 대회 일정과 참가 정보', image: '/images/card-tournaments.png' },
    { id: 'news', title: '초보자 가이드', desc: '처음 시작하는 분들을 위한 친절한 안내', image: '/images/card-guide.png' },
    { id: 'matching', title: '커뮤니티', desc: '함께하는 이야기, 더 즐거운 파크골프', image: '/images/card-community.png' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={MAIN_BANNER_IMAGE_URL}
            alt="파크골프마당 메인 배너"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/75 to-white/90" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-2">
            <span className="text-slate-900">오늘도,</span><br />
            <span className="text-emerald-700">파크골프가</span>{' '}
            <span className="text-rose-500">좋다! ♡</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-700 font-bold mb-6">
            건강한 오늘, 더 행복한 내일 — 파크골프와 함께하세요!
          </p>

          {/* 4 Value Badges */}
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-7 flex-wrap">
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

          {/* Search Bar */}
          <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-lg p-2 flex items-center gap-2">
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
          <div className="flex items-center justify-center gap-2 flex-wrap mt-4">
            {HASHTAGS.map(tag => (
              <button
                key={tag}
                onClick={goToCourseSearch}
                className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs sm:text-sm font-bold text-slate-600 hover:border-emerald-400 hover:text-emerald-700 shadow-2xs cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
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

          {/* Swing Image */}
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-green-100">
            <img
              src={SWING_SILHOUETTE_IMAGE_URL}
              alt="파크골프 스윙"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md">
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
