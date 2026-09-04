import React, { useState, useMemo } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { NewsCategory } from '../types';
import {
  BookOpen,
  Calendar,
  Eye,
  PlusCircle,
  ChevronRight,
  Sparkles,
  Compass,
  Clock,
  Search,
  Filter,
  Volume2,
  FileText,
  User
} from 'lucide-react';

export const NewsSection: React.FC = () => {
  const { news, openModal, speakText, isAdmin } = useParkGolf();
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: NewsCategory[] = [
    '전체',
    '초보 입문가이드',
    '장비·복장 선택',
    '경기 규칙·벌타',
    '스윙·퍼팅 레슨',
    '구장 매너·에티켓'
  ];

  const filteredNews = useMemo(() => {
    return news.filter(n => {
      if (selectedCategory !== '전체' && n.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = n.title.toLowerCase().includes(query);
        const matchesSummary = n.summary.toLowerCase().includes(query);
        const matchesContent = n.content.toLowerCase().includes(query);
        const matchesCategory = n.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSummary && !matchesContent && !matchesCategory) return false;
      }
      return true;
    });
  }, [news, selectedCategory, searchQuery]);

  return (
    <section id="section-news" className="scroll-mt-28 py-10 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-blue-200 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs sm:text-sm font-extrabold mb-2 border border-blue-300 shadow-2xs">
            <Compass className="w-4 h-4 text-blue-700" />
            <span>🔰 초보 파크골퍼 완벽 입문 백과 게시판</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            초보 가이드 게시판
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 mt-1 font-medium leading-relaxed">
            파크골프의 기원과 입문 준비, 공인 용구 선택법, 경기 규칙·벌타 규정, 스윙 및 에티켓 핵심 매뉴얼 목록입니다.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => openModal('admin')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow transition-all shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>가이드 등록 / AI 작성 (관리자)</span>
          </button>
        )}
      </div>

      {/* Quick Visual Roadmap for Beginner Golfers */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50/60 to-emerald-50 rounded-3xl p-5 sm:p-7 border border-blue-200/80 mb-8 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-blue-700" />
          <h3 className="text-base sm:text-lg font-black text-slate-900">
            ⛳ 첫 라운딩 4단계 핵심 체크포인트
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white/95 p-3.5 rounded-2xl border border-blue-100 shadow-2xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">1</span>
              <span className="font-extrabold text-slate-900 text-sm">장비 & 복장 준비</span>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              공인 채(500~550g), 3·4피스 공 2개, 스파이크리스 신발, 모자 착용
            </p>
          </div>

          <div className="bg-white/95 p-3.5 rounded-2xl border border-blue-100 shadow-2xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">2</span>
              <span className="font-extrabold text-slate-900 text-sm">매표 & 4인 조편성</span>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              신분증 지참 관내 할인, 현장 대기실에서 3~4인 1조로 자연스럽게 출발
            </p>
          </div>

          <div className="bg-white/95 p-3.5 rounded-2xl border border-blue-100 shadow-2xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">3</span>
              <span className="font-extrabold text-slate-900 text-sm">티샷 & 안전거리</span>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              앞 팀 홀아웃 후 티샷! 헛스윙은 무벌타, OB는 2벌타 후 2클럽 드롭
            </p>
          </div>

          <div className="bg-white/95 p-3.5 rounded-2xl border border-blue-100 shadow-2xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">4</span>
              <span className="font-extrabold text-slate-900 text-sm">홀아웃 & 에티켓</span>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              벙커 정리, 그린 잔디 보호, 경기 후 동반자 인사 및 에어건 흙먼지 털기
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar w-full sm:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white font-black shadow-xs ring-1 ring-blue-500'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="가이드 주제, 내용 검색..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Bulletin Board Style List */}
      {filteredNews.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-slate-800 mb-1">검색 조건에 맞는 가이드가 없습니다</h3>
          <p className="text-slate-500 font-medium">카테고리 필터를 변경하거나 검색어를 다시 확인해 주세요.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-200">
          {/* Header on Desktop */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-100 text-xs font-black text-slate-700 border-b border-slate-200">
            <div className="col-span-2">분류 / 태그</div>
            <div className="col-span-7">가이드 제목 및 핵심 요약</div>
            <div className="col-span-2 text-center">출처 / 소요시간</div>
            <div className="col-span-1 text-right">조회수</div>
          </div>

          {/* Table Rows */}
          {filteredNews.map((item, index) => (
            <div
              key={item.id}
              id={`guide-row-${item.id}`}
              onClick={() => openModal('newsDetail', item)}
              className="p-4 sm:p-5 hover:bg-blue-50/50 transition-colors cursor-pointer group"
            >
              {/* Desktop Row Layout */}
              <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                {/* Col 1: Category */}
                <div className="col-span-2 space-y-1">
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-xs font-extrabold">
                    {item.category}
                  </span>
                  {item.readTime && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 font-bold">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{item.readTime}</span>
                    </div>
                  )}
                </div>

                {/* Col 2: Title & Summary */}
                <div className="col-span-7 space-y-1 pr-3">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-blue-700 transition-colors flex items-center gap-1.5">
                    <span>{item.title}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-1 font-medium leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                {/* Col 3: Source / Author */}
                <div className="col-span-2 text-center text-xs space-y-0.5">
                  <strong className="text-slate-800 font-bold block">{item.source || item.author}</strong>
                  <span className="text-slate-400 text-[11px]">{item.date}</span>
                </div>

                {/* Col 4: Views & Arrow */}
                <div className="col-span-1 text-right text-xs text-slate-500 space-y-1">
                  <div className="flex items-center justify-end gap-1 font-medium">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.views.toLocaleString()}</span>
                  </div>
                  <div className="text-blue-600 font-bold text-xs flex items-center justify-end group-hover:translate-x-1 transition-transform">
                    <span>열람</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Mobile Row Layout */}
              <div className="md:hidden space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-xs font-black">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                    {item.readTime && <span>⏱️ {item.readTime}</span>}
                    <span>조회 {item.views.toLocaleString()}</span>
                  </div>
                </div>

                <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-700 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 font-medium leading-relaxed">
                  {item.summary}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-700">{item.source || item.author}</span>
                  <div className="flex items-center gap-1 text-blue-600 font-extrabold">
                    <span>자세히 보기</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
