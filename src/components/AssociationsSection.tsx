import React, { useState, useMemo } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { ASSOCIATIONS_DATA } from '../data/associationsData';
import { AssociationItem } from '../types';
import {
  Building2,
  ExternalLink,
  Phone,
  MapPin,
  Search,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Sparkles,
  Volume2,
  Award,
  BookOpen,
  HelpCircle,
  Copy,
  Check,
  ChevronRight
} from 'lucide-react';

export const AssociationsSection: React.FC = () => {
  const { speakText } = useParkGolf();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('전체');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filterTabs = [
    '전체',
    '파크골프 연맹',
    '중앙본회·특수협회',
    '수도권/강원',
    '충청/대전/세종',
    '경상/대구/부산/울산',
    '전라/광주/제주'
  ];

  const filteredList = useMemo(() => {
    return ASSOCIATIONS_DATA.filter(item => {
      // 1. Category / Region Filter
      let matchesFilter = true;
      if (selectedFilter === '파크골프 연맹') {
        matchesFilter = item.category === '파크골프연맹';
      } else if (selectedFilter === '중앙본회·특수협회') {
        matchesFilter = item.category === '중앙본회' || item.category === '프로·특수협회';
      } else if (selectedFilter === '수도권/강원') {
        matchesFilter = ['서울', '경기', '인천', '강원'].includes(item.region);
      } else if (selectedFilter === '충청/대전/세종') {
        matchesFilter = item.region.includes('충청') || item.region.includes('대전') || item.region.includes('세종');
      } else if (selectedFilter === '경상/대구/부산/울산') {
        matchesFilter = item.region.includes('경상') || item.region.includes('대구') || item.region.includes('부산') || item.region.includes('울산');
      } else if (selectedFilter === '전라/광주/제주') {
        matchesFilter = item.region.includes('전라') || item.region.includes('광주') || item.region === '제주';
      }

      // 2. Search Query
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        matchesSearch = (
          item.name.toLowerCase().includes(query) ||
          (item.shortName && item.shortName.toLowerCase().includes(query)) ||
          item.region.toLowerCase().includes(query) ||
          item.role.toLowerCase().includes(query) ||
          item.address.toLowerCase().includes(query) ||
          item.services.some(s => s.toLowerCase().includes(query))
        );
      }

      return matchesFilter && matchesSearch;
    });
  }, [selectedFilter, searchQuery]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleSpeak = (text: string) => {
    if (speakText) {
      speakText(text);
    }
  };

  return (
    <section id="section-associations" className="py-10 sm:py-14 bg-gradient-to-b from-stone-50 via-emerald-50/30 to-stone-50 border-t border-b border-green-200/80 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-700 text-white font-black text-xs sm:text-sm tracking-wide shadow-xs flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-300" />
                공식 협회 · 연맹 디렉터리
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300">
                총 {ASSOCIATIONS_DATA.length}개 기관
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif flex items-center gap-2">
              파크골프 관련 협회 및 주요 연맹
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm sm:mt-1 font-medium leading-relaxed">
              대한체육회 정회원 중앙본회부터 주요 파크골프연맹(생활체육·직장인·시니어·여성·유소년·국제연맹) 및 17개 광역시·도별 파크골프협회의 공식 사이트, 연락처, 공인 인증 업무를 한눈에 확인하세요.
            </p>
          </div>

          {/* Quick Voice Audio helper */}
          <button
            onClick={() => handleSpeak('파크골프 관련 협회 안내 페이지입니다. 중앙 본회인 대한파크골프협회와 전국 17개 시도별 협회의 공식 사이트 링크 및 전화번호를 제공합니다.')}
            className="self-start md:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 text-xs sm:text-sm font-extrabold transition-all border border-emerald-300 shadow-xs cursor-pointer shrink-0"
            title="소리로 듣기"
          >
            <Volume2 className="w-4 h-4 text-emerald-800" />
            <span>음성 안내 듣기</span>
          </button>
        </div>

        {/* Central Association Featured Hero Card (사)대한파크골프협회 */}
        <div className="mb-8 bg-gradient-to-br from-green-950 via-emerald-900 to-green-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xl border-2 border-emerald-500/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-400 text-green-950 font-black text-xs sm:text-sm shadow-sm flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-green-950" />
                  대한민국 중앙 본회
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-800 text-emerald-200 text-xs font-bold border border-emerald-600">
                  대한체육회 정회원 종목
                </span>
              </div>
              <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-amber-300" />
                공식 승인 기관
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-3">
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-serif flex items-center gap-2">
                  (사)대한파크골프협회 (KPGA)
                </h3>
                <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
                  대한민국 30만 파크골프 동호인을 대표하는 유일한 대한체육회 정가맹 중앙종목단체입니다.
                  전국 공인 경기 규칙 제정, 국가대표 선발전, 1·2·3급 지도자 및 심판 자격 검정, 클럽 및 공 공인용구 심사를 전담 총괄합니다.
                </p>

                {/* Service Tag Badges */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                  {[
                    '대한체육회 정가맹',
                    '공식 경기규칙 제정',
                    '1·2·3급 지도자/심판 자격검정',
                    '공인 용구(클럽·공) 인증',
                    '전국 규모 대회 승인'
                  ].map((service, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-200 text-[11px] sm:text-xs font-semibold border border-emerald-700/60 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                      {service}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-emerald-200 pt-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>서울특별시 송파구 올림픽로 424 올림픽공원 벨로드롬 101호</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-amber-300 shrink-0" />
                    <span className="font-bold text-white">02-2202-8844</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5 justify-center">
                <a
                  href="https://kpgf.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-green-950 font-black text-sm sm:text-base shadow-lg transition-all transform active:scale-95 cursor-pointer text-center"
                >
                  <span>대한파크골프협회 공식 홈 가기</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <a
                  href="tel:02-2202-8844"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-800/90 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm border border-emerald-600 transition-all cursor-pointer text-center"
                >
                  <Phone className="w-4 h-4 text-amber-300" />
                  <span>협회 대표전화 바로연결</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
              {filterTabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setSelectedFilter(tab)}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all shrink-0 cursor-pointer ${
                    selectedFilter === tab
                      ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-500'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="협회명, 지역, 업무 검색..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Association List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-10">
          {filteredList.map(assoc => {
            const isMain = assoc.id === 'assoc-kpga-main';
            return (
              <div
                key={assoc.id}
                id={`assoc-card-${assoc.id}`}
                className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all flex flex-col justify-between hover:shadow-md ${
                  isMain
                    ? 'border-emerald-500 ring-2 ring-emerald-400/30'
                    : 'border-slate-200 hover:border-blue-400'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-black ${
                        assoc.category === '중앙본회'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : assoc.category === '파크골프연맹'
                          ? 'bg-teal-100 text-teal-900 border border-teal-300'
                          : assoc.category === '프로·특수협회'
                          ? 'bg-purple-100 text-purple-900 border border-purple-300'
                          : 'bg-blue-100 text-blue-900 border border-blue-300'
                      }`}>
                        {assoc.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-extrabold border border-slate-200">
                        {assoc.region}
                      </span>
                    </div>

                    {assoc.isMainCertified && (
                      <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 flex items-center gap-0.5">
                        <Award className="w-3 h-3 text-amber-600" />
                        공인
                      </span>
                    )}
                  </div>

                  {/* Association Name */}
                  <h4 className="text-base sm:text-lg font-black text-slate-900 mb-1 leading-snug">
                    {assoc.name}
                  </h4>
                  <p className="text-xs font-semibold text-emerald-800 mb-3 line-clamp-1">
                    {assoc.role}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-600 mb-3.5 leading-relaxed line-clamp-2">
                    {assoc.description}
                  </p>

                  {/* Key Services Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {assoc.services.slice(0, 3).map((srv, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded bg-slate-50 text-slate-700 text-[10px] font-medium border border-slate-200"
                      >
                        • {srv}
                      </span>
                    ))}
                    {assoc.services.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-bold">
                        +{assoc.services.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Contact info */}
                  <div className="space-y-1.5 text-[11px] text-slate-600 border-t border-slate-100 pt-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-600" /> 전화:
                      </span>
                      <a
                        href={`tel:${assoc.phone}`}
                        className="font-extrabold text-slate-900 hover:text-emerald-700 underline underline-offset-2"
                      >
                        {assoc.phone}
                      </a>
                    </div>
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-semibold text-slate-500 flex items-center gap-1 shrink-0">
                        <MapPin className="w-3 h-3 text-emerald-600" /> 주소:
                      </span>
                      <div className="flex items-center gap-1 text-right">
                        <span className="truncate max-w-[160px] text-slate-700" title={assoc.address}>
                          {assoc.address}
                        </span>
                        <button
                          onClick={() => handleCopy(assoc.address, assoc.id)}
                          className="p-0.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
                          title="주소 복사"
                        >
                          {copiedId === assoc.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={assoc.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-colors shadow-xs cursor-pointer text-center"
                  >
                    <span>공식 사이트</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={`tel:${assoc.phone}`}
                    className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 text-slate-800 font-extrabold text-xs border border-slate-300 transition-colors cursor-pointer text-center"
                  >
                    <Phone className="w-3 h-3 text-emerald-700" />
                    <span>전화 연결</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* If no results found */}
        {filteredList.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 mb-10">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-700 font-black text-base mb-1">
              검색 조건에 일치하는 협회 정보가 없습니다.
            </p>
            <p className="text-slate-500 text-xs mb-4">
              검색어를 변경하거나 필터를 '전체'로 재설정해 보세요.
            </p>
            <button
              onClick={() => {
                setSelectedFilter('전체');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              전체 목록 보기
            </button>
          </div>
        )}

        {/* Association Guidance Information Box */}
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-emerald-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-950 font-black text-base sm:text-lg">
            <HelpCircle className="w-5 h-5 text-emerald-700" />
            <span>파크골프 협회 이용 & 자격증·대회 가이드</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="bg-stone-50 p-4 rounded-xl border border-slate-200/80 space-y-1.5">
              <h5 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-black">1</span>
                회원 등록 및 클럽 가입
              </h5>
              <p className="text-slate-600 leading-relaxed text-xs">
                거주지 관할 시·군·구 파크골프협회 또는 소속 클럽을 통해 대한파크골프협회 정회원으로 등록하시면 공식 대회 참가 자격 및 회원증이 발급됩니다.
              </p>
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border border-slate-200/80 space-y-1.5">
              <h5 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-black">2</span>
                지도자 & 심판 자격증 취득
              </h5>
              <p className="text-slate-600 leading-relaxed text-xs">
                대한파크골프협회(KPGA) 주관 1·2·3급 지도자 및 심판 자격시험과 각 시도협회의 연수 교육을 통해 공식 공인 자격증을 취득할 수 있습니다.
              </p>
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border border-slate-200/80 space-y-1.5">
              <h5 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-black">3</span>
                공인 용구(클럽·공) 인증 확인
              </h5>
              <p className="text-slate-600 leading-relaxed text-xs">
                공식 협회 주관 대회에 출전하려면 대한파크골프협회 공인 스티커(KPGA 인증마크)가 부착된 정품 클럽과 공인구를 사용해야 합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
