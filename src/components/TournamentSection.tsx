import React, { useState, useMemo } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { Tournament, RegionCategory, TournamentCategory } from '../types';
import {
  Trophy,
  Calendar,
  MapPin,
  Gift,
  PhoneCall,
  PlusCircle,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  AlertCircle,
  Search,
  Users,
  ShieldCheck,
  Eye,
  CheckCircle2
} from 'lucide-react';

const REGION_OPTIONS: RegionCategory[] = [
  '전체',
  '서울/경기/인천',
  '강원',
  '충청/대전/세종',
  '전라/광주',
  '경상/대구/부산/울산',
  '제주'
];

const CATEGORY_OPTIONS: TournamentCategory[] = [
  '전체',
  '전국 메이저',
  '지자체장기·시장기',
  '시·도협회장기',
  '시니어·실버',
  '부부·혼성 페스티벌'
];

export const TournamentSection: React.FC = () => {
  const { tournaments, openModal, isAdmin } = useParkGolf();
  const [selectedRegion, setSelectedRegion] = useState<RegionCategory>('전체');
  const [selectedCategory, setSelectedCategory] = useState<TournamentCategory>('전체');
  const [statusFilter, setStatusFilter] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Calculate D-day
  const getDDay = (eventDateStr: string) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const target = new Date(eventDateStr);
      target.setHours(0, 0, 0, 0);
      const diffTime = target.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return { label: 'D-Day 오늘', color: 'bg-red-500 text-white animate-bounce' };
      if (diffDays > 0) return { label: `D-${diffDays}`, color: 'bg-amber-100 text-amber-900 border border-amber-300' };
      return { label: '대회종료', color: 'bg-slate-200 text-slate-700' };
    } catch {
      return { label: '', color: '' };
    }
  };

  const filteredTournaments = useMemo(() => {
    return tournaments.filter(t => {
      // Region filter
      if (selectedRegion !== '전체') {
        if (t.region && t.region !== selectedRegion) return false;
        if (!t.region && !t.location.includes(selectedRegion.split('/')[0])) return false;
      }
      // Category filter
      if (selectedCategory !== '전체') {
        if (t.category !== selectedCategory) return false;
      }
      // Status filter
      if (statusFilter !== '전체' && t.status !== statusFilter) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchLoc = t.location.toLowerCase().includes(q);
        const matchOrg = t.organizer.toLowerCase().includes(q);
        const matchDesc = t.description.toLowerCase().includes(q);
        if (!matchTitle && !matchLoc && !matchOrg && !matchDesc) return false;
      }
      return true;
    });
  }, [tournaments, selectedRegion, selectedCategory, statusFilter, searchQuery]);

  return (
    <section id="section-tournaments" className="scroll-mt-28 py-8 sm:py-10 px-3 sm:px-6 max-w-7xl mx-auto bg-gradient-to-b from-amber-50/50 via-white to-stone-50/60 rounded-3xl my-8 border border-amber-200/80 shadow-sm">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-4 border-b border-amber-200 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/80 text-amber-950 text-xs sm:text-sm font-extrabold mb-2 border border-amber-300">
            <Trophy className="w-4 h-4 text-amber-700" />
            <span>🏆 대한파크골프협회 및 전국 지자체 대회 정보</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>전국 대회 소식</span>
            <span className="text-sm sm:text-base font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
              총 {tournaments.length}개 대회
            </span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 mt-1 font-medium leading-relaxed">
            전국 메이저 챔피언십, 도지사배, 시장기, 협회장기, 시니어·부부 페스티벌 일정 및 접수 요강
          </p>
        </div>

        {/* Action & Admin */}
        <div className="flex items-center gap-2 flex-wrap">
          {isAdmin && (
            <button
              id="admin-add-tournament-btn"
              onClick={() => openModal('admin')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>새 대회 등록 (관리자)</span>
            </button>
          )}

          {/* Quick Status Filter Pills */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-amber-200 shadow-xs overflow-x-auto">
            {[
              { id: '전체', label: '전체 상태' },
              { id: '접수중', label: '접수중' },
              { id: '마감임박', label: '마감임박' },
              { id: '접수예정', label: '접수예정' }
            ].map(st => (
              <button
                key={st.id}
                id={`tour-filter-${st.id}`}
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === st.id
                    ? 'bg-amber-500 text-green-950 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Control Box (Region, Category & Search) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/90 shadow-sm space-y-4 mb-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-700" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="대회명, 개최지(시·군·구), 구장명, 주최 협회명을 검색하세요..."
            className="w-full pl-11 pr-24 py-3 rounded-xl bg-stone-50 border border-amber-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 text-xs sm:text-sm font-semibold transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded text-xs bg-slate-200 text-slate-700 hover:bg-slate-300 font-bold"
            >
              초기화
            </button>
          )}
        </div>

        {/* Region Tabs */}
        <div>
          <div className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-amber-700" />
            <span>개최 지역 선택</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {REGION_OPTIONS.map(reg => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  selectedRegion === reg
                    ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-600'
                    : 'bg-stone-100 text-slate-700 hover:bg-stone-200 border border-slate-200'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-700" />
            <span>대회 유형 분류</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORY_OPTIONS.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-green-950 font-black shadow-sm ring-1 ring-amber-400'
                    : 'bg-amber-50/70 text-slate-700 hover:bg-amber-100/80 border border-amber-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Notice Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-amber-100/70 border border-amber-300 flex items-start gap-3 shadow-xs">
        <AlertCircle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm leading-relaxed text-slate-700">
          <span className="font-extrabold text-slate-900">전국 대회 안내 및 접수 주의사항 : </span>
          대회 참가 신청 시 대한파크골프협회 공인 클럽·공인구 지참이 필수이며, 현장 규격 검사가 진행됩니다.{' '}
          <strong className="text-red-700 font-bold">
            선착순 접수 조기 마감 및 기상 이변에 따른 일정 변경이 발생할 수 있으므로, 반드시 주최측 공식 요강 및 유선 문의로 확인하시기 바랍니다.
          </strong>
        </div>
      </div>

      {/* Tournaments Grid */}
      {filteredTournaments.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-amber-200 p-8 space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 flex items-center justify-center text-3xl text-amber-700">
            🏆
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            선택하신 조건에 맞는 대회가 없습니다.
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            지역 또는 대회 유형 필터를 변경하거나 검색어를 초기화해 보세요.
          </p>
          <button
            onClick={() => {
              setSelectedRegion('전체');
              setSelectedCategory('전체');
              setStatusFilter('전체');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-green-950 font-bold text-xs sm:text-sm shadow transition-colors cursor-pointer"
          >
            모든 필터 초기화
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map(tour => {
            const dday = getDDay(tour.eventDate);
            return (
              <div
                key={tour.id}
                id={`tour-card-${tour.id}`}
                className="bg-white rounded-3xl border border-amber-200/90 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between hover-lift overflow-hidden group"
              >
                {/* Top Image & Ribbons */}
                <div className="relative h-44 sm:h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={
                      tour.posterUrl ||
                      'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Badges on Top */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-black shadow-md ${
                        tour.status === '접수중'
                          ? 'bg-emerald-600 text-white'
                          : tour.status === '마감임박'
                          ? 'bg-rose-600 text-white animate-pulse'
                          : tour.status === '접수예정'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-600 text-white'
                      }`}
                    >
                      {tour.status}
                    </span>

                    {dday.label && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold shadow-sm ${dday.color}`}>
                        {dday.label}
                      </span>
                    )}

                    {tour.region && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-black/60 text-emerald-300 backdrop-blur-xs">
                        {tour.region}
                      </span>
                    )}
                  </div>

                  {tour.isFeatured && (
                    <div className="absolute top-3 right-3 bg-gradient-to-l from-amber-400 to-amber-300 text-green-950 text-[11px] font-black px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> 메이저
                    </div>
                  )}

                  {/* Title overlay at bottom of image */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    {tour.category && (
                      <span className="text-[11px] font-bold text-amber-300 block mb-0.5">
                        {tour.category}
                      </span>
                    )}
                    <h3 className="text-base sm:text-lg font-black leading-snug line-clamp-2 text-white drop-shadow-md">
                      {tour.title}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Organizer */}
                    <div className="text-xs text-slate-500 font-semibold mb-3 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="truncate">{tour.organizer}</span>
                    </div>

                    {/* Spec Summary Box */}
                    <div className="bg-amber-50/70 rounded-2xl p-3 border border-amber-200/70 space-y-1.5 text-xs text-slate-700 mb-3">
                      <div className="flex items-start gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-600">대회일: </span>
                          <strong className="text-slate-900">{tour.dateRange}</strong>
                        </div>
                      </div>

                      <div className="flex items-start gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-600">접수기간: </span>
                          <span className="text-slate-800 font-medium">{tour.registrationPeriod}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-600">개최지: </span>
                          <span className="text-slate-900 font-semibold">{tour.location}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-1.5">
                        <Gift className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-600">총상금: </span>
                          <strong className="text-rose-700 font-extrabold">{tour.prizePool}</strong>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 mb-3 font-medium leading-relaxed">
                      {tour.description}
                    </p>
                  </div>

                  {/* Actions — 참가신청 바로가기는 없애고, 전화문의만 남겼습니다 */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`tel:${tour.contact.split('/')[0].trim()}`}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-green-700" />
                        <span>전화문의</span>
                      </a>

                      <button
                        onClick={() => openModal('tournamentDetail', tour)}
                        className="py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-green-950 font-black text-xs cursor-pointer"
                      >
                        요강확인
                      </button>
                    </div>

                    <button
                      id={`tour-detail-btn-${tour.id}`}
                      onClick={() => openModal('tournamentDetail', tour)}
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer"
                    >
                      <span>대회요강 및 상세 정보</span>
                      <ChevronRight className="w-4 h-4 text-amber-400" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
