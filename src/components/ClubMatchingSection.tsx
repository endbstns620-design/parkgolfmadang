import React, { useState } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { MatchingPost } from '../types';
import {
  Users,
  MapPin,
  Calendar,
  Clock,
  PhoneCall,
  MessageCircle,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Trash2,
  Timer
} from 'lucide-react';
import { getMeetDateBadgeInfo } from '../utils/matchAutoCleaner';

export const ClubMatchingSection: React.FC = () => {
  const { matches, openModal, updateMatchStatus, deleteMatch, isAdmin, isMyMatch } = useParkGolf();
  const [statusFilter, setStatusFilter] = useState<'전체' | '모집중' | '마감'>('전체');
  const [selectedRegion, setSelectedRegion] = useState<string>('전체');

  const regions = ['전체', '서울/경기/인천', '강원', '충청/대전/세종', '전라/광주', '경상/대구/부산/울산', '제주'];

  const filteredMatches = matches.filter(m => {
    if (statusFilter !== '전체' && m.status !== statusFilter) return false;
    if (selectedRegion !== '전체' && m.region !== selectedRegion) return false;
    return true;
  });

  return (
    <section id="section-matching" className="scroll-mt-28 py-10 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-4 border-b border-rose-200 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs sm:text-sm font-extrabold mb-2 border border-rose-300 shadow-2xs">
            <Users className="w-4 h-4 text-rose-700" />
            <span>👥 동호회 & 라운딩 동반자 매칭 게시판</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            동호회 매칭 · <span className="text-rose-600">라운딩 동반자 모집</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 mt-1 font-medium leading-relaxed">
            혼자 가기 심심할 때, 조 편성 인원이 부족할 때! 지역 기반으로 편안하게 같이 라운딩할 동반자를 찾아보세요.
          </p>
        </div>

        {/* Create Post Button */}
        <button
          id="btn-create-matching-post"
          onClick={() => openModal('newMatch')}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-black text-base shadow-lg hover:shadow-xl transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" />
          <span>+ 라운딩 동반자 모집글 올리기</span>
        </button>
      </div>

      {/* Auto Cleanup Notice Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-rose-50/50 to-orange-50 p-4 sm:p-5 rounded-2xl border border-amber-200/80 mb-6 flex items-start sm:items-center gap-3 shadow-2xs">
        <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5 sm:mt-0 shadow-xs">
          <Timer className="w-5 h-5" />
        </div>
        <div className="flex-1 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          <strong className="text-slate-900 font-extrabold block sm:inline mr-2">
            🛡️ 스마트 자동 삭제 시스템 가동 중 :
          </strong>
          만나는 날짜가 지나거나 마감된 모집글은 <strong>하루(24시간) 뒤 자동으로 삭제</strong>되어 언제나 유효한 최신 모집글만 유지됩니다.
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs sm:text-sm font-bold text-slate-500 mr-1">모집 상태 :</span>
          {(['전체', '모집중', '마감'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                statusFilter === st
                  ? st === '모집중'
                    ? 'bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-500'
                    : st === '마감'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {st === '모집중' ? '🟢 모집 중' : st === '마감' ? '🔴 마감' : '전체'}
            </button>
          ))}
        </div>

        {/* Region Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          <span className="text-xs sm:text-sm font-bold text-slate-500 shrink-0">지역 :</span>
          {regions.map(r => (
            <button
              key={r}
              onClick={() => setSelectedRegion(r)}
              className={`px-2.5 py-1 rounded-lg text-xs font-extrabold shrink-0 transition-all cursor-pointer ${
                selectedRegion === r
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Matching Posts List */}
      {filteredMatches.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-slate-800 mb-1">등록된 동반자 모집글이 없습니다</h3>
          <p className="text-slate-500 mb-4 font-medium">가장 먼저 새로운 라운딩 동반자를 모집해 보세요!</p>
          <button
            onClick={() => openModal('newMatch')}
            className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm shadow cursor-pointer transition-colors"
          >
            + 첫 번째 모집글 쓰기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMatches.map(match => {
            const badgeInfo = getMeetDateBadgeInfo(match);

            return (
              <div
                key={match.id}
                id={`match-card-${match.id}`}
                className={`bg-white rounded-3xl border p-5 sm:p-6 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between hover-lift ${
                  match.status === '모집중' ? 'border-rose-200/90' : 'border-slate-200 opacity-80 bg-slate-50/50'
                }`}
              >
                <div>
                  {/* Top status & Region */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-2xs ${badgeInfo.badgeClass}`}
                      >
                        {badgeInfo.dDayText}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                        {match.region}
                      </span>
                    </div>

                    <span className="text-xs sm:text-sm font-extrabold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                      인원 : <strong>{match.currentCount}명</strong> / 총 {match.maxCount}명
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => openModal('matchDetail', match)}
                    className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug mb-3 cursor-pointer hover:text-rose-600 transition-colors"
                  >
                    {match.title}
                  </h3>

                  {/* Info block */}
                  <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 text-xs sm:text-sm text-slate-700 mb-3 border border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span><strong>구장 :</strong> {match.courseName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span><strong>만나는 날짜 :</strong> <span className="font-extrabold text-slate-900">{match.meetDate}</span> {match.meetTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span><strong>희망 실력 :</strong> {match.handicap}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-700 font-bold">💰</span>
                      <span><strong>비용 정산 :</strong> {match.costShare}</span>
                    </div>
                  </div>

                  {badgeInfo.autoDeleteNotice && (
                    <div className="mb-3 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5">
                      <Timer className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>{badgeInfo.autoDeleteNotice}</span>
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed font-medium">
                    {match.description}
                  </p>
                </div>

                {/* Author & Action buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="font-bold text-slate-800">작성자 : {match.authorName}</span>
                    <span>댓글 {match.comments.length}개</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {/* Phone call */}
                    <a
                      href={`tel:${match.authorPhone}`}
                      className="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>전화 / 문자 하기</span>
                    </a>

                    {/* Detail & Comment */}
                    <button
                      onClick={() => openModal('matchDetail', match)}
                      className="py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-green-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>댓글 / 참여 신청</span>
                    </button>
                  </div>

                  {/* Status toggle & Delete options */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <button
                      onClick={() =>
                        updateMatchStatus(match.id, match.status === '모집중' ? '마감' : '모집중')
                      }
                      className={`font-extrabold cursor-pointer hover:underline ${
                        match.status === '모집중' ? 'text-slate-600 hover:text-rose-600' : 'text-emerald-700 hover:text-emerald-800'
                      }`}
                    >
                      {match.status === '모집중' ? '모집 완료 시 [마감하기]' : '[다시 모집중으로 변경]'}
                    </button>

                    {(isAdmin || isMyMatch(match.id)) && (
                      <button
                        onClick={() => deleteMatch(match.id)}
                        className="text-slate-400 hover:text-rose-600 flex items-center gap-1 font-bold cursor-pointer"
                        title="글 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>삭제</span>
                      </button>
                    )}
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

