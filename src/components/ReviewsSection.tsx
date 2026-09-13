import React, { useState, useMemo } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { EmptyBoardGuide } from './EmptyBoardGuide';
import { ReviewItem } from '../types';
import {
  Star,
  MessageSquarePlus,
  Trash2,
  Calendar,
  MapPin,
  Search,
  ChevronRight,
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
    : null;

  // 잔디·주차·시설 점수는 실제 후기에서 평균을 냅니다.
  // 예전에는 화면에 '5.0점'이라고 글자로 박혀 있어서, 후기가 0건인데도 만점이 떠 있었습니다.
  const avgOf = (pick: (r: typeof reviews[number]) => number | undefined) => {
    const nums = reviews.map(pick).filter((n): n is number => typeof n === 'number' && n > 0);
    return nums.length > 0 ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1) : null;
  };
  const avgGrass = avgOf(r => r.grassScore ?? r.rating);
  const avgParking = avgOf(r => r.parkingScore ?? r.rating);
  const avgFacility = avgOf(r => r.facilityScore ?? r.rating);

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

      {/* 후기 요약 띠 — 후기가 한 건이라도 있을 때만 나옵니다.
          후기 0건인데 별 다섯 개와 '5.0점'이 떠 있으면, 그 숫자 하나 때문에
          이 게시판의 다른 후기까지 지어낸 것처럼 보입니다. */}
      {totalReviews > 0 && (
        <div className="bg-gradient-to-r from-amber-50 via-emerald-50/50 to-amber-50 rounded-2xl p-5 sm:p-6 border border-amber-200/90 mb-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-400 text-green-950 flex flex-col items-center justify-center font-extrabold shadow-sm shrink-0">
              <span className="text-2xl sm:text-3xl font-black">{avgRating}</span>
              <span className="text-[11px] font-bold">5.0 만점</span>
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-500 text-lg sm:text-xl mb-0.5 justify-center sm:justify-start">
                {'★'.repeat(Math.round(Number(avgRating)))}
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                전국 {totalReviews}명의 동호인 솔직 방문 평가
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                직접 라운딩하고 잔디를 밟아본 시니어 동호인들의 100% 솔직한 후기 목록입니다.
              </p>
            </div>
          </div>

          {/* 항목별 평균 — 실제 후기에서 계산한 값입니다 */}
          <div className="grid grid-cols-3 gap-2 w-full sm:w-auto text-center shrink-0">
            {[
              { label: '잔디 상태', value: avgGrass },
              { label: '주차 편의', value: avgParking },
              { label: '부대 시설', value: avgFacility }
            ].map(item => (
              <div key={item.label} className="bg-white/90 p-2.5 rounded-xl border border-amber-200/60 shadow-2xs">
                <span className="text-[11px] text-slate-500 font-bold block">{item.label}</span>
                <strong className="text-sm sm:text-base font-black text-emerald-800">
                  {item.value ? `${item.value}점` : '–'}
                </strong>
              </div>
            ))}
          </div>
        </div>
      )}

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
        <EmptyBoardGuide
          tone="amber"
          boardName="구장 방문 후기"
          description="다녀오신 구장의 잔디 상태, 주차, 화장실 같은 건 가본 사람만 압니다. 짧게 두세 줄이면 충분합니다."
          ctaLabel="구장 후기 쓰기"
          onWrite={() => openModal('newReview')}
          exampleLines={[
            '천안 성성호수파크골프장 · 지난주 토요일 오전',
            '잔디는 짧게 깎여 있어 굴러가는 게 좋았습니다.',
            '주차장은 넉넉했고 9시쯤 가니 대기 없이 바로 쳤습니다.',
            '화장실이 입구 쪽 한 곳뿐이라 조금 멀었습니다.'
          ]}
        />
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
