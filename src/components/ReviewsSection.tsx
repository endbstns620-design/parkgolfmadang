import React, { useState, useMemo } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { ReviewItem } from '../types';
import {
  Star,
  MessageSquarePlus,
  Trash2,
  Calendar,
  MapPin,
  Search,
  ChevronRight,
  MessageSquare,
  User,
  Clock,
  Filter
} from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { reviews, openModal, deleteReview, isAdmin } = useParkGolf();
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<'all' | '5' | '4' | '3'>('all');
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
    : '5.0';

  const filteredReviews = useMemo(() => {
    return reviews.filter(rev => {
      if (ratingFilter !== 'all' && rev.rating !== Number(ratingFilter)) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesCourse = rev.courseName.toLowerCase().includes(query);
        const matchesTitle = rev.title.toLowerCase().includes(query);
        const matchesContent = rev.content.toLowerCase().includes(query);
        const matchesAuthor = rev.authorName.toLowerCase().includes(query);
        if (!matchesCourse && !matchesTitle && !matchesContent && !matchesAuthor) return false;
      }
      return true;
    });
  }, [reviews, ratingFilter, searchQuery]);

  return (
    <section id="section-reviews" className="scroll-mt-28 py-10 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-amber-200 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs sm:text-sm font-extrabold mb-2 border border-amber-300">
            <Star className="w-4 h-4 text-amber-700 fill-amber-500" />
            <span>⭐ 전국 파크골프장 방문 솔직 후기 게시판</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            구장 리뷰 게시판
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 mt-1 font-medium leading-relaxed">
            전국 파크골프장의 실제 잔디 관리 상태, 디보트, 그늘 쉼터, 화장실 청결도, 주차 난이도 솔직 평가 게시판입니다.
          </p>
        </div>

        {/* Action Button */}
        <button
          id="btn-write-review"
          onClick={() => openModal('newReview')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-green-950 font-extrabold text-base shadow-lg transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          <MessageSquarePlus className="w-5 h-5" />
          <span>+ 구장 방문 솔직 후기 작성</span>
        </button>
      </div>

      {/* Top Rating Summary Bar */}
      <div className="bg-gradient-to-r from-amber-50 via-emerald-50/50 to-amber-50 rounded-2xl p-5 sm:p-6 border border-amber-200/90 mb-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-400 text-green-950 flex flex-col items-center justify-center font-extrabold shadow-sm shrink-0">
            <span className="text-2xl sm:text-3xl font-black">{totalReviews > 0 ? avgRating : '-'}</span>
            <span className="text-[11px] font-bold">5.0 만점</span>
          </div>
          <div>
            <div className="flex items-center gap-1 text-amber-500 text-lg sm:text-xl mb-0.5 justify-center sm:justify-start">
              {'★'.repeat(5)}
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              {totalReviews > 0 ? `전국 ${totalReviews}명의 동호인 솔직 방문 평가` : '동호인 구장 평가 참여 대기'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              직접 라운딩하고 잔디를 밟아본 시니어 동호인들의 100% 솔직한 후기 목록입니다.
            </p>
          </div>
        </div>

        {/* Criteria Evaluation Badges */}
        <div className="grid grid-cols-3 gap-2 w-full sm:w-auto text-center shrink-0">
          <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200/60 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-bold block">잔디 상태</span>
            <strong className="text-sm sm:text-base font-black text-emerald-800">5.0점</strong>
          </div>
          <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200/60 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-bold block">주차 편의</span>
            <strong className="text-sm sm:text-base font-black text-emerald-800">5.0점</strong>
          </div>
          <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200/60 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-bold block">부대 시설</span>
            <strong className="text-sm sm:text-base font-black text-emerald-800">5.0점</strong>
          </div>
        </div>
      </div>

      {/* Board Search and Rating Filter Sub-Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Rating Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> 별점 :
          </span>
          {[
            { label: '전체', value: 'all' },
            { label: '★5점만', value: '5' },
            { label: '★4점이상', value: '4' },
            { label: '★3점이하', value: '3' }
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setRatingFilter(f.value as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                ratingFilter === f.value
                  ? 'bg-amber-500 text-green-950 font-black shadow-2xs ring-1 ring-amber-400'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="구장명, 후기 내용, 작성자 검색..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
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
      {filteredReviews.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-4 shadow-xs">
            <MessageSquare className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
            등록된 구장 방문 후기가 없습니다
          </h3>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mb-6 leading-relaxed">
            다녀오신 파크골프장의 잔디 상태, 주차 편의, 부대시설 등 생생한 라운딩 경험을 첫 번째로 공유해 보세요!
          </p>
          <button
            onClick={() => openModal('newReview')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-green-950 font-black text-base shadow-md transition-all cursor-pointer"
          >
            <MessageSquarePlus className="w-5 h-5" />
            <span>+ 첫 번째 구장 방문 후기 작성하기</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-200">
          {/* Board Header on larger screens */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-100 text-xs font-black text-slate-700 border-b border-slate-200">
            <div className="col-span-3">구장명 / 평점</div>
            <div className="col-span-6">후기 제목 및 내용</div>
            <div className="col-span-2 text-center">작성자 / 연령</div>
            <div className="col-span-1 text-right">방문일</div>
          </div>

          {/* Board Rows */}
          {filteredReviews.map((rev, index) => {
            const isExpanded = selectedReviewId === rev.id;

            return (
              <div
                key={rev.id}
                id={`review-row-${rev.id}`}
                className="p-4 sm:p-5 hover:bg-amber-50/40 transition-colors cursor-pointer"
                onClick={() => setSelectedReviewId(isExpanded ? null : rev.id)}
              >
                {/* Desktop Row Layout */}
                <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                  {/* Col 1: Course Name & Stars */}
                  <div className="col-span-3 space-y-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold">
                      <MapPin className="w-3 h-3 text-emerald-700" />
                      {rev.courseName}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-black">
                      {'★'.repeat(rev.rating)}
                      <span className="text-slate-800 font-bold ml-1">{rev.rating}.0</span>
                    </div>
                  </div>

                  {/* Col 2: Title and preview content */}
                  <div className="col-span-6 space-y-1 pr-2">
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900 hover:text-amber-800 transition-colors">
                      {rev.title}
                    </h4>
                    <p className={`text-xs text-slate-600 leading-relaxed font-medium ${isExpanded ? '' : 'line-clamp-1'}`}>
                      {rev.content}
                    </p>
                  </div>

                  {/* Col 3: Author info */}
                  <div className="col-span-2 text-center text-xs space-y-0.5">
                    <strong className="text-slate-900 font-bold block">{rev.authorName}</strong>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium inline-block">
                      {rev.ageGroup}
                    </span>
                  </div>

                  {/* Col 4: Visit date & Admin delete */}
                  <div className="col-span-1 text-right text-xs text-slate-500 space-y-1">
                    <div className="font-medium">{rev.visitDate}</div>
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteReview(rev.id);
                        }}
                        className="text-rose-600 hover:text-rose-800 text-[11px] font-bold p-1 inline-flex items-center gap-0.5"
                        title="리뷰 삭제 (관리자)"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>삭제</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Mobile Row Layout */}
                <div className="md:hidden space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold">
                      <MapPin className="w-3 h-3 text-emerald-700" />
                      {rev.courseName}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-black">
                      {'★'.repeat(rev.rating)}
                      <span className="text-slate-800 font-bold ml-1">{rev.rating}.0</span>
                    </div>
                  </div>

                  <h4 className="text-sm font-extrabold text-slate-900">
                    {rev.title}
                  </h4>

                  <p className={`text-xs text-slate-600 leading-relaxed font-medium ${isExpanded ? '' : 'line-clamp-2'}`}>
                    {rev.content}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{rev.authorName}</span>
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{rev.ageGroup}</span>
                      <span>{rev.visitDate}</span>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteReview(rev.id);
                        }}
                        className="text-rose-600 hover:text-rose-800 text-xs font-bold"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Detail Box */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-amber-200/80 bg-amber-50/60 p-4 rounded-2xl text-xs sm:text-sm text-slate-800 space-y-2 animate-in fade-in">
                    <div className="flex items-center gap-3 text-xs font-bold text-amber-900 flex-wrap">
                      <span>잔디 상태: ★{rev.grassScore || rev.rating}</span>
                      <span>•</span>
                      <span>부대 시설: ★{rev.facilityScore || rev.rating}</span>
                      <span>•</span>
                      <span>주차 편의: ★{rev.parkingScore || rev.rating}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 font-medium whitespace-pre-line leading-relaxed">
                      {rev.content}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
