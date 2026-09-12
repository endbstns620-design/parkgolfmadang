import React, { useState, useMemo } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { Tournament, RegionCategory } from '../types';
import {
  Trophy,
  Calendar,
  MapPin,
  Gift,
  PhoneCall,
  ExternalLink,
  PlusCircle,
  Clock,
  Sparkles,
  ClipboardCheck,
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

// 장애인 대회인지 가려냅니다.
// 전국장애인파크골프대회는 대회명에 반드시 '장애인'이 들어가고 주최도 장애인 단체라,
// 따로 표시를 달지 않아도 알아볼 수 있습니다. 혹시 예외가 있으면 자료에 isPara: true 를
// 적어 두면 그 값이 우선합니다.
const isParaTournament = (t: { title?: string; organizer?: string; isPara?: boolean }) => {
  if (typeof t.isPara === 'boolean') return t.isPara;
  return /장애인/.test(`${t.title || ''} ${t.organizer || ''}`);
};

export const TournamentSection: React.FC = () => {
  const { tournaments, openModal, isAdmin } = useParkGolf();
  const [selectedRegion, setSelectedRegion] = useState<RegionCategory>('전체');
  const [statusFilter, setStatusFilter] = useState<string>('전체');
  // 대회 구분 — '전체' · '일반' · '장애인'
  const [kindFilter, setKindFilter] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 일정 글자가 '2026-09-\n01'처럼 날짜 중간에서 잘리지 않도록
  // 띄어쓰기 단위로만 줄이 바뀌게 합니다.
  const ScheduleText = ({ text }: { text: string }) => (
    <>
      {text.split(' ').map((word, i) => (
        <span key={i} className="inline-block whitespace-nowrap">
          {word}
          {i < text.split(' ').length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </>
  );

  // 대회의 남은 일수를 계산합니다.
  // rank : 목록 정렬에 쓰는 순서 (0=진행중, 1=시작 전, 2=종료)
  // days : 시작까지 남은 일수 (정렬 보조값)
  const DAY_MS = 1000 * 60 * 60 * 24;

  const getDDayInfo = (startStr: string, endStr?: string) => {
    const fallback = { label: '', color: '', rank: 3, days: Number.MAX_SAFE_INTEGER };
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const start = new Date(startStr);
      if (isNaN(start.getTime())) return fallback;
      start.setHours(0, 0, 0, 0);

      const endRaw = endStr ? new Date(endStr) : start;
      const end = isNaN(endRaw.getTime()) ? start : endRaw;
      end.setHours(0, 0, 0, 0);

      const toStart = Math.round((start.getTime() - today.getTime()) / DAY_MS);
      const toEnd = Math.round((end.getTime() - today.getTime()) / DAY_MS);

      // 아직 시작 전
      if (toStart > 0) {
        return {
          label: `D-${toStart}`,
          color: 'bg-amber-100 text-amber-900 border border-amber-300',
          rank: 1,
          days: toStart
        };
      }
      // 오늘 시작
      if (toStart === 0) {
        return { label: 'D-Day 오늘', color: 'bg-red-500 text-white animate-bounce', rank: 0, days: 0 };
      }
      // 시작했지만 아직 끝나지 않음
      if (toEnd >= 0) {
        return { label: '대회 진행중', color: 'bg-red-500 text-white', rank: 0, days: toStart };
      }
      // 이미 끝난 대회
      return { label: '대회종료', color: 'bg-slate-200 text-slate-700', rank: 2, days: -toEnd };
    } catch {
      return fallback;
    }
  };

  // 버튼에 건수를 같이 보여드립니다. 몇 건인지 미리 보이면 헛걸음이 줄어듭니다.
  const kindCounts = useMemo(() => {
    const para = tournaments.filter(isParaTournament).length;
    return { 전체: tournaments.length, 일반: tournaments.length - para, 장애인: para };
  }, [tournaments]);

  const filteredTournaments = useMemo(() => {
    // 정렬 기준: 진행중인 대회 → 날짜가 가까운 대회 → 끝난 대회(최근 순)
    const filtered = tournaments.filter(t => {
      // Region filter
      if (selectedRegion !== '전체') {
        if (t.region && t.region !== selectedRegion) return false;
        if (!t.region && !t.location.includes(selectedRegion.split('/')[0])) return false;
      }
      // Status filter
      if (statusFilter !== '전체' && t.status !== statusFilter) return false;
      // 대회 구분 (일반 / 장애인)
      if (kindFilter === '장애인' && !isParaTournament(t)) return false;
      if (kindFilter === '일반' && isParaTournament(t)) return false;
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

    return filtered.sort((a, b) => {
      const ka = getDDayInfo(a.eventDate, a.endDate);
      const kb = getDDayInfo(b.eventDate, b.endDate);
      if (ka.rank !== kb.rank) return ka.rank - kb.rank;
      if (ka.days !== kb.days) return ka.days - kb.days;
      return a.title.localeCompare(b.title, 'ko');
    });
  }, [tournaments, selectedRegion, statusFilter, kindFilter, searchQuery]);

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
          <p className="text-base sm:text-lg text-slate-600 mt-1.5 font-medium leading-relaxed">
            전국에서 열리는 파크골프 대회일정 및 접수요강
          </p>
        </div>

        {/* 관리자 전용 버튼 — 일반 이용자에게는 빈 여백이 생기지 않도록 아예 그리지 않습니다 */}
        {isAdmin && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="admin-add-tournament-btn"
              onClick={() => openModal('admin')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>새 대회 등록 (관리자)</span>
            </button>
          </div>
        )}
      </div>

      {/* 검색 · 개최 지역 · 접수 상태 */}
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

        {/* 대회 구분 — 장애인 대회를 검색어 없이 버튼 한 번으로 찾으실 수 있게 합니다 */}
        <div>
          <div className="text-base sm:text-lg font-black text-slate-700 mb-2.5 flex items-center gap-1.5">
            <Users className="w-5 h-5 text-amber-700 shrink-0" />
            <span>대회 구분</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: '전체', label: '전체 대회' },
              { id: '일반', label: '일반 대회' },
              { id: '장애인', label: '장애인 대회' }
            ].map(k => (
              <button
                key={k.id}
                id={`tour-kind-${k.id}`}
                onClick={() => setKindFilter(k.id)}
                className={`px-3.5 py-2 rounded-xl text-sm sm:text-base font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                  kindFilter === k.id
                    ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-600'
                    : 'bg-stone-100 text-slate-700 hover:bg-stone-200 border border-slate-200'
                }`}
              >
                {k.label}
                <span className={`ml-1.5 text-xs sm:text-sm font-bold ${kindFilter === k.id ? 'text-emerald-100' : 'text-slate-500'}`}>
                  {kindCounts[k.id as '전체' | '일반' | '장애인']}
                </span>
              </button>
            ))}
          </div>
          {kindFilter === '장애인' && (
            <p className="mt-2.5 text-sm sm:text-base font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5 leading-relaxed">
              장애인 파크골프대회입니다. 대한장애인골프협회 · 한국지체장애인협회 · 시·도 장애인체육회 등
              주최 단체가 저마다 달라서 접수 방법도 대회마다 다릅니다. 시·도 대표 선수만 나가는 대회도 있습니다.
              접수 기간과 참가 자격은 대회를 눌러 공식 요강에서 꼭 확인해 주세요.
            </p>
          )}
        </div>

        {/* 개최 지역 + 접수 상태 — 한 줄에 나란히 놓아 화면을 짧게 씁니다 */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 lg:gap-5">
          {/* 개최 지역 */}
          <div className="min-w-0">
            <div className="text-base sm:text-lg font-black text-slate-700 mb-2.5 flex items-center gap-1.5">
              <MapPin className="w-5 h-5 text-amber-700 shrink-0" />
              <span>개최 지역 선택</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {REGION_OPTIONS.map(reg => (
                <button
                  key={reg}
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-3.5 py-2 rounded-xl text-sm sm:text-base font-extrabold transition-all cursor-pointer ${
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

          {/* 접수 상태 */}
          <div className="lg:shrink-0">
            <div className="text-base sm:text-lg font-black text-slate-700 mb-2.5 flex items-center gap-1.5">
              <ClipboardCheck className="w-5 h-5 text-amber-700 shrink-0" />
              <span>접수 상태</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: '전체', label: '전체 상태' },
                { id: '접수중', label: '접수중' },
                { id: '접수예정', label: '접수예정' },
                { id: '접수마감', label: '접수마감' }
              ].map(st => (
                <button
                  key={st.id}
                  id={`tour-filter-${st.id}`}
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-3.5 py-2 rounded-xl text-sm sm:text-base font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === st.id
                      ? 'bg-amber-500 text-green-950 font-black shadow-sm ring-1 ring-amber-400'
                      : 'bg-stone-100 text-slate-700 hover:bg-stone-200 border border-slate-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 접수 주의사항 — 시니어분들이 읽기 편하도록 글씨를 크게 씁니다 */}
      <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-amber-100/70 border border-amber-300 flex items-start gap-3 shadow-xs">
        <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 text-amber-800 shrink-0 mt-0.5" />
        <div className="text-base sm:text-lg leading-relaxed text-slate-800 font-medium">
          <span className="font-black text-slate-900">접수 주의사항 : </span>
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
            개최 지역·대회 구분·접수 상태를 바꾸시거나, 검색어를 지워보세요.
          </p>
          <button
            onClick={() => {
              setSelectedRegion('전체');
              setStatusFilter('전체');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-green-950 font-bold text-xs sm:text-sm shadow transition-colors cursor-pointer"
          >
            모든 필터 초기화
          </button>
        </div>
      ) : (
        /* 게시판 형식 — 대회명을 누르면 상세 정보가 열립니다.
           시니어분들이 목록을 한눈에 훑고 원하는 대회만 골라 보시기 편합니다. */
        <div className="bg-white rounded-3xl border border-amber-200 overflow-hidden shadow-sm">
          {/* 표 머리글 — 넓은 화면에서만 보입니다 */}
          <div className="hidden md:grid grid-cols-[56px_1fr_206px_206px_106px] gap-3 px-5 py-3 bg-green-900 text-white font-black text-[15px] lg:text-base">
            <span className="text-center">번호</span>
            <span>대회명</span>
            <span>일정</span>
            <span>장소</span>
            <span className="text-center">접수</span>
          </div>

          <ul className="divide-y divide-slate-200">
            {filteredTournaments.map((tour, idx) => {
              const dday = getDDayInfo(tour.eventDate, tour.endDate);
              const no = idx + 1;
              const statusColor =
                tour.status === '접수중'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : tour.status === '접수예정'
                  ? 'bg-blue-100 text-blue-900 border-blue-300'
                  : 'bg-slate-100 text-slate-700 border-slate-300';

              return (
                <li key={tour.id} id={`tour-row-${tour.id}`}>
                  <button
                    type="button"
                    onClick={() => openModal('tournamentDetail', tour)}
                    className="w-full text-left px-4 sm:px-5 py-4 hover:bg-amber-50/70 transition-colors cursor-pointer md:grid md:grid-cols-[56px_1fr_206px_206px_106px] md:gap-3 md:items-center"
                  >
                    {/* 번호 */}
                    <span className="hidden md:block text-center text-slate-500 font-bold text-[15px]">{no}</span>

                    {/* 대회명 — 게시판 제목 */}
                    <span className="block min-w-0">
                      <span className="flex items-center gap-2 flex-wrap">
                        {tour.isFeatured && (
                          <span className="shrink-0 px-2 py-0.5 rounded-md bg-amber-400 text-amber-950 text-xs font-black">주요</span>
                        )}
                        <span className="font-black text-green-950 text-lg sm:text-xl leading-snug hover:underline">
                          {tour.title}
                        </span>
                        <span className={`shrink-0 px-2 py-0.5 rounded-md text-xs font-black ${dday.color}`}>
                          {dday.label}
                        </span>
                      </span>

                      {/* 좁은 화면에서는 일정·장소를 제목 아래에 함께 보여줍니다 */}
                      <span className="md:hidden mt-1.5 flex flex-col gap-1 text-[15px] font-bold text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                          <ScheduleText text={tour.dateRange || tour.eventDate} />
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                          {tour.location}
                        </span>
                        <span className={`self-start px-2 py-0.5 rounded-md border text-xs font-black ${statusColor}`}>
                          {tour.status}
                        </span>
                      </span>
                    </span>

                    {/* 일정 (넓은 화면) */}
                    <span className="hidden md:block text-[15px] font-bold text-slate-700 leading-snug">
                      <ScheduleText text={tour.dateRange || tour.eventDate} />
                    </span>

                    {/* 장소 (넓은 화면) */}
                    <span className="hidden md:block text-[15px] font-bold text-slate-700 leading-snug">
                      {tour.location}
                    </span>

                    {/* 접수 상태 (넓은 화면) */}
                    <span className="hidden md:flex justify-center">
                      <span className={`px-2.5 py-1 rounded-lg border text-[13px] font-black whitespace-nowrap ${statusColor}`}>
                        {tour.status}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* 출처 안내 — 대회 정보를 어디서 확인했는지 밝힙니다 */}
          <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 text-[14px] sm:text-[15px] text-slate-600 font-medium leading-relaxed">
            <span className="font-black text-slate-800">정보 출처</span> · 대한파크골프협회, 대한파크골프연맹,
            파크골프투데이 등 공식 발표 자료에서 <b>대회명 · 일정 · 장소 · 접수정보 · 상금</b>만 확인해 정리했습니다.
            각 대회를 누르시면 원문 링크를 보실 수 있습니다. 신청 전 주최측 공식 요강을 반드시 확인해주세요.
          </div>
        </div>
      )}
    </section>
  );
};
