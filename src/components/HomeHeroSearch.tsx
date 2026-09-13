import React, { useMemo, useState } from 'react';
import { Search, ChevronDown, MapPin } from 'lucide-react';
import { useParkGolf } from '../context/ParkGolfContext';
import { RegionCategory } from '../types';

// 구장 목록 화면과 똑같은 권역 구분을 씁니다.
// (여기서 고른 지역이 그대로 '전국 구장' 화면의 필터로 넘어갑니다)
const REGION_OPTIONS: { label: string; value: RegionCategory }[] = [
  { label: '지역을 골라주세요', value: '전체' },
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
    <section className="bg-gradient-to-b from-[#166534] to-[#14532D]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-9 sm:py-14 flex flex-col items-center gap-6 sm:gap-8">
        {/* 제목 — 운영자가 하고 싶은 말 대신, 찾아오신 분이 듣고 싶은 말 */}
        <div className="flex flex-col items-center gap-2 sm:gap-3 text-center">
          <h1 className="text-[28px] sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.28] text-white">
            전국 <span className="text-amber-300">{courses.length.toLocaleString()}곳</span> 파크골프장을
            <br className="sm:hidden" /> 한 곳에서
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-green-100 font-bold leading-relaxed">
            지역만 고르면 가까운 구장과 이용요금이 바로 나옵니다
          </p>
        </div>

        {/* 검색 상자 — 어르신들이 누르기 쉽도록 한 칸 높이를 60px 넘게 잡았습니다 */}
        <form
          className="w-full bg-white rounded-2xl p-3 sm:p-3.5 shadow-2xl flex flex-col sm:flex-row gap-2.5 sm:gap-3"
          onSubmit={e => {
            e.preventDefault();
            goToCourses(region, keyword);
          }}
        >
          <div className="relative sm:w-[230px] shrink-0">
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
            <span className="inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-green-200">
              <MapPin className="w-4 h-4" />
              지역별로 보기
            </span>
            {regionCounts.map(r => (
              <button
                key={r.value}
                type="button"
                onClick={() => goToCourses(r.value, '')}
                className="px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white text-base sm:text-lg font-bold transition-colors cursor-pointer"
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
