import React from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { Tournament } from '../types';
import {
  X,
  Trophy,
  PhoneCall,
  ExternalLink,
  CheckCircle,
  Share2,
  Calendar,
  Clock,
  MapPin,
  Gift,
  DollarSign,
  Users,
  ShieldCheck,
  Award,
  Sparkles,
  Info
} from 'lucide-react';

export const TournamentDetailModal: React.FC = () => {
  const { activeModal, closeModal } = useParkGolf();

  if (!activeModal || activeModal.type !== 'tournamentDetail' || !activeModal.data) {
    return null;
  }

  const tour: Tournament = activeModal.data;

  // 문의처에 실제 전화번호가 들어있는 대회만 "전화 걸기"를 보여줍니다.
  const phoneMatch = String(tour.contact || '').match(/0\d{1,2}[-\s]?\d{3,4}[-\s]?\d{4}/);
  const phoneNumber = phoneMatch ? phoneMatch[0].replace(/\s/g, '') : '';
  const hasPhone = Boolean(phoneNumber);

  const handleShare = () => {
    const text = `[파크골프마당 대회안내] ${tour.title}\n일시: ${tour.dateRange}\n장소: ${tour.location}\n총상금: ${tour.prizePool}\n문의: ${tour.contact}`;
    if (navigator.share) {
      navigator.share({
        title: tour.title,
        text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text}\n${window.location.href}`);
      alert('대회 상세 정보가 클립보드에 복사되었습니다. 동호회 단톡방이나 문자로 전달해 보세요!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col text-slate-800 border border-amber-200">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-950 text-white p-5 sm:p-6 relative">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black shadow-md ${
                tour.status === '접수중'
                  ? 'bg-emerald-500 text-white'
                  : tour.status === '마감임박'
                  ? 'bg-rose-500 text-white animate-pulse'
                  : tour.status === '접수예정'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-600 text-white'
              }`}
            >
              {tour.status}
            </span>

            {tour.category && (
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-400 text-green-950">
                {tour.category}
              </span>
            )}

            {tour.region && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/20 text-amber-100">
                {tour.region}
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-black leading-snug tracking-tight">
            {tour.title}
          </h3>
          <p className="text-xs sm:text-sm text-amber-200 font-medium mt-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
            <span>{tour.organizer}</span>
          </p>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm text-slate-800">
          
          {/* Key Spec Grid */}
          <div className="bg-amber-50/80 p-4 sm:p-5 rounded-2xl border border-amber-200 space-y-3">
            <h4 className="font-black text-amber-950 text-sm sm:text-base flex items-center gap-1.5 border-b border-amber-200/80 pb-2">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" />
              <span>대회 기본 개요 및 일정</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-800 font-medium">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-600">대회 일시: </span>
                  <strong className="text-slate-900">{tour.dateRange}</strong>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-600">접수 기간: </span>
                  <span className="text-slate-900 font-semibold">{tour.registrationPeriod}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-600">개최 장소: </span>
                  <strong className="text-slate-900">{tour.location}</strong>
                  {tour.courseHoles && (
                    <span className="block text-xs text-amber-800 font-bold">코스: {tour.courseHoles}</span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Gift className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-600">총상금/부상: </span>
                  <strong className="text-rose-700 font-black">{tour.prizePool}</strong>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <DollarSign className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-600">참가비: </span>
                  <strong className="text-slate-900">{tour.participationFee}</strong>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-600">참가 자격/정원: </span>
                  <span className="text-slate-900">{tour.eligibility}</span>
                  {tour.capacity && (
                    <span className="block text-xs text-emerald-800 font-bold">정원: {tour.capacity}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Awards Breakdown */}
          {tour.awardsBreakdown && tour.awardsBreakdown.length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-slate-200 space-y-2.5">
              <h4 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>시상 내역 및 특별 부상</span>
              </h4>
              <div className="grid grid-cols-1 gap-1.5">
                {tour.awardsBreakdown.map((award, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                    <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 font-black flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{award}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedule & Rules */}
          {(tour.scheduleDetail || tour.rulesDetail || tour.suppliesProvided || tour.registrationMethod) && (
            <div className="space-y-3">
              {tour.registrationMethod && (
                <div>
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 mb-1.5 flex items-center gap-1.5">
                    ✍️ 접수 방법
                  </h4>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 font-bold">
                    {tour.registrationMethod}
                  </p>
                </div>
              )}

              {tour.scheduleDetail && (
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1">
                  <strong className="text-emerald-950 block font-bold text-xs sm:text-sm">
                    ⏱️ 대회 진행 타임테이블
                  </strong>
                  <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium">
                    {tour.scheduleDetail}
                  </p>
                </div>
              )}

              {tour.suppliesProvided && (
                <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-1">
                  <strong className="text-purple-950 block font-bold text-xs sm:text-sm">
                    🎁 참가자 지급품 및 혜택
                  </strong>
                  <p className="text-xs sm:text-sm text-purple-900 leading-relaxed font-medium">
                    {tour.suppliesProvided}
                  </p>
                </div>
              )}

              {tour.rulesDetail && (
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1">
                  <strong className="text-amber-950 block font-bold text-xs sm:text-sm">
                    📋 경기 방식 및 세부 규정
                  </strong>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {tour.rulesDetail}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="font-black text-slate-900 text-sm sm:text-base mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>대회 소개 및 개최 취지</span>
            </h4>
            <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {tour.description}
            </p>
          </div>

          {/* Requirements & Notice */}
          <div className="p-4 rounded-2xl bg-stone-100/90 border border-slate-200 space-y-2">
            <div className="font-extrabold text-slate-800 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              <span>참가자 필수 지참물 및 유의사항</span>
            </div>
            <ul className="list-disc list-inside text-slate-600 space-y-1 pl-1">
              <li>대한파크골프협회 공인 클럽 및 공인구 지참 필수 (경기 전 규격 현장 검사 진행)</li>
              <li>신분증(주민등록증/운전면허증) 또는 공인 동호인 회원증 실물 확인</li>
              <li>모자, 장갑 및 스파이크 없는 잔디 보호용 골프화/운동화 착용 필수</li>
            </ul>
            {/* 이 대회 정보를 확인한 공식 출처 — 어르신들이 직접 확인하실 수 있게 링크로 걸어둡니다 */}
            {tour.sourceUrls && tour.sourceUrls.length > 0 && (
              <div className="pt-2 border-t border-slate-200">
                <p className="text-sm font-extrabold text-slate-800 mb-1.5">📎 확인한 공식 출처</p>
                <div className="space-y-1">
                  {tour.sourceUrls.map((u, i) => (
                    <a
                      key={i}
                      href={u}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-xs sm:text-sm text-blue-700 hover:text-blue-900 underline break-all"
                    >
                      {u}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 text-[11px] sm:text-xs text-slate-700 leading-relaxed">
              <strong className="text-red-600 font-extrabold">
                ※ 주최측 사정에 따른 우천 연기, 인원 조기 마감, 일정 변경 등이 발생할 수 있으므로, 반드시 신청 전 주최측 공식 공고 또는 유선 문의로 최종 일정을 확인하시기 바랍니다.
              </strong>
            </div>
          </div>
        </div>

        {/* Bottom CTA Actions */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* 문의 전화가 확인된 대회만 전화 걸기 버튼을 보여줍니다.
              번호가 없는 대회는 헛걸음하지 않도록 공식 요강을 안내합니다. */}
          {hasPhone ? (
            <a
              href={`tel:${phoneNumber}`}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm sm:text-base text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>주최측 문의 ({phoneNumber})</span>
            </a>
          ) : (
            <div className="flex-1 py-3 px-4 rounded-xl bg-slate-200 text-slate-700 font-bold text-sm sm:text-base text-center flex items-center justify-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-slate-500" />
              <span>문의처는 공식 요강에서 확인해주세요</span>
            </div>
          )}

          {tour.linkUrl && (
            <a
              href={tour.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-green-950 font-black text-sm sm:text-base text-center flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>공식 요강 · 참가신청 바로가기</span>
            </a>
          )}

          <button
            onClick={handleShare}
            className="p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 transition-colors cursor-pointer shrink-0"
            title="동호회에 대회 소식 공유"
          >
            <Share2 className="w-5 h-5 text-emerald-700" />
          </button>
        </div>

      </div>
    </div>
  );
};
