import React, { useMemo, useState } from 'react';
import { Search, ChevronDown, MapPin } from 'lucide-react';
import { useParkGolf } from '../context/ParkGolfContext';
import { RegionCategory } from '../types';

// 구장 목록 화면과 똑같은 권역 구분을 씁니다.
// (여기서 고른 지역이 그대로 '전국 구장' 화면의 필터로 넘어갑니다)
const REGION_OPTIONS: { label: string; value: RegionCategory }[] = [
  // 글씨 '아주 크게'에서도 칸 밖으로 넘치지 않도록 짧게 씁니다.
  { label: '지역 선택', value: '전체' },
  { label: '서울/경기/인천', value: '서울/경기/인천' },
  { label: '강원', value: '강원' },
  { label: '충청/대전/세종', value: '충청/대전/세종' },
  { label: '전라/광주', value: '전라/광주' },
  { label: '경상/대구/부산/울산', value: '경상/대구/부산/울산' },
  { label: '제주', value: '제주' }
];

/**
 * 첫 화면 맨 위 — 구장 찾기.
 *
 * 이 사이트에 오시는 분의 머릿속 질문은 "어디 가서 칠까" 하나입니다.
 * 그래서 첫 화면은 소개말이나 가입 안내가 아니라 검색부터 나옵니다.
 * (창립회원 모집은 이 아래로 내렸습니다 — 없앤 것이 아닙니다)
 */
export const HomeHeroSearch: React.FC = () => {
  const { courses, setActiveTab, setSelectedRegion, setSearchQuery } = useParkGolf();

  const [region, setRegion] = useState<RegionCategory>('전체');
  const [keyword, setKeyword] = useState('');

  // 권역별 구장 수 — 지어낸 숫자가 아니라 실제 데이터에서 셉니다.
  const regionCounts = useMemo(() => {
    const counts = new Map<string, number>();
    courses.forEach(c => {
      counts.set(c.region, (counts.get(c.region) || 0) + 1);
    });
    return REGION_OPTIONS.filter(o => o.value !== '전체')
      .map(o => ({ ...o, count: counts.get(o.value) || 0 }))
      .filter(o => o.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [courses]);

  const goToCourses = (nextRegion: RegionCategory, nextKeyword: string) => {
    setSelectedRegion(nextRegion);
    setSearchQuery(nextKeyword.trim());
    setActiveTab('courses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#14532D]">
      {/* 배경 사진 — 카카오톡 공유 썸네일과 같은 사진입니다.
          휴대폰에는 세로로 자른 가벼운 사진(97KB), PC에는 가로형(169KB)을 내려줍니다.
          사진이 늦게 떠도 글씨가 사라지지 않도록 뒤에 진한 초록색을 깔아둡니다. */}
      <img
        src="/images/hero-bg.jpg"
        srcSet="/images/hero-bg-mobile.jpg 900w, /images/hero-bg.jpg 1800w"
        sizes="100vw"
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-10 w-full h-full object-cover"
      />
      {/* 사진 위에 덮는 초록 막.
          처음에는 80~94%로 덮었는데, 그러면 사진이 거의 안 보여서 넣은 의미가 없었습니다.
          지금은 위쪽(하늘)을 많이 열어두고 아래로 갈수록 진하게 덮습니다 —
          위는 사진이 보이고, 지역 버튼이 놓인 아래쪽은 글씨가 또렷합니다. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0B3D22]/55 via-[#0B3D22]/68 to-[#0B3D22]/86"
      />

      {/* 지역 버튼 6개가 넓은 화면에서 한 줄에 들어가도록 폭을 6xl로 넓혔습니다.
          5xl(1024px)에서는 마지막 '제주'만 다음 줄로 넘어가 보기 안 좋았습니다.
          검색 상자는 아래에서 따로 5xl로 묶어 예전 크기를 그대로 지킵니다. */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-9 sm:py-14 flex flex-col items-center gap-6 sm:gap-8">
        {/* 제목 — 운영자가 하고 싶은 말 대신, 찾아오신 분이 듣고 싶은 말 */}
        <div className="flex flex-col items-center gap-2 sm:gap-3 text-center">
          {/* 사진이 더 잘 보이게 막을 걷어낸 만큼, 글씨 그림자는 진하게 넣습니다.
              밝은 하늘 위에 흰 글씨가 올라가도 또렷하게 읽히도록 하기 위함입니다. */}
          <h1 className="text-[28px] sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.28] text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.55),0_4px_18px_rgba(0,0,0,0.5)]">
            전국 <span className="text-amber-300">{courses.length.toLocaleString()}곳</span> 파크골프장을
            <br className="sm:hidden" /> 한 곳에서
          </h1>
          {/* 글씨 '아주 크게'에서 세 줄로 늘어나 첫 화면을 다 먹지 않도록 짧게 씁니다 */}
          <p className="text-base sm:text-lg md:text-xl text-green-50 font-bold leading-relaxed [text-shadow:0_1px_3px_rgba(0,0,0,0.6),0_2px_10px_rgba(0,0,0,0.5)]">
            지역만 고르면 바로 나옵니다
          </p>
        </div>

        {/* 검색 상자 — 어르신들이 누르기 쉽도록 한 칸 높이를 60px 넘게 잡았습니다 */}
        <form
          className="w-full max-w-5xl bg-white rounded-2xl p-3 sm:p-3.5 shadow-2xl flex flex-col sm:flex-row gap-2.5 sm:gap-3"
          onSubmit={e => {
            e.preventDefault();
            goToCourses(region, keyword);
          }}
        >
          <div className="relative sm:w-[250px] shrink-0">
            <label htmlFor="home-hero-region" className="sr-only">
              지역 선택
            </label>
            <select
              id="home-hero-region"
              value={region}
              onChange={e => setRegion(e.target.value as RegionCategory)}
              className="w-full appearance-none h-[60px] rounded-xl border-2 border-slate-300 hover:border-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 bg-white px-4 pr-11 text-lg sm:text-xl font-bold text-slate-800 cursor-pointer transition-colors"
            >
              {REGION_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
          </div>

          <div className="flex-1 min-w-0">
            <label htmlFor="home-hero-keyword" className="sr-only">
              구장 이름으로 찾기
            </label>
            <input
              id="home-hero-keyword"
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="구장 이름으로 찾기"
              className="w-full h-[60px] rounded-xl border-2 border-slate-300 hover:border-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 px-4 text-lg sm:text-xl font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-medium transition-colors"
            />
          </div>

          <button
            type="submit"
            className="h-[60px] sm:w-[140px] shrink-0 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-black text-xl inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Search className="w-6 h-6" strokeWidth={2.6} />
            <span>찾기</span>
          </button>
        </form>

        {/* 권역 바로가기 — 누르면 그 지역 구장 목록으로 바로 넘어갑니다 */}
        {regionCounts.length > 0 && (
          <div className="w-full flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            <span className="inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-green-100 [text-shadow:0_1px_6px_rgba(0,0,0,0.5)]">
              <MapPin className="w-4 h-4" />
              지역별로 보기
            </span>
            {regionCounts.map(r => (
              <button
                key={r.value}
                type="button"
                onClick={() => goToCourses(r.value, '')}
                className="px-3.5 py-2.5 rounded-full bg-black/35 hover:bg-black/50 backdrop-blur-[3px] border border-white/40 text-white text-base sm:text-lg font-bold whitespace-nowrap transition-colors cursor-pointer"
              >
                {r.label} <span className="text-amber-300 font-black">{r.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
