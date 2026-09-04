import React, { useState } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { AdItem } from '../types';
import {
  Megaphone,
  PhoneCall,
  ExternalLink,
  Tag,
  ShieldCheck,
  PlusCircle,
  Sparkles,
  ShoppingBag,
  Building2,
  CheckCircle2
} from 'lucide-react';

export const AdsSection: React.FC = () => {
  const { ads, openModal, isAdmin, toggleAdStatus, setActiveTab } = useParkGolf();
  const [adFilterTab, setAdFilterTab] = useState<'all' | 'coupang' | 'sponsor'>('all');

  const activeAds = ads.filter(a => (isAdmin ? true : a.isActive));

  return (
    <section id="section-ads" className="scroll-mt-28 py-10 px-3 sm:px-6 max-w-7xl mx-auto bg-gradient-to-b from-purple-50/50 via-white to-stone-50/80 rounded-3xl my-8 border-2 border-purple-200/80 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-5 border-b border-purple-200 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs sm:text-sm font-extrabold mb-2 border border-purple-300">
            <Megaphone className="w-4 h-4 text-purple-700" />
            <span>📣 파크골프 용품 & 공식 제휴 광고 센터</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            쿠팡 파크골프 용품 및 업체 광고
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 mt-1 font-medium leading-relaxed">
            쿠팡 파트너스 최저가 공인 용품(클럽/볼/파우치) 및 전국 파크골프 전문업체·투어·수리점 안내
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isAdmin && (
            <button
              onClick={() => openModal('admin')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm shadow transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>업체 광고 배너 관리</span>
            </button>
          )}

          <a
            href="tel:1588-7282"
            className="px-4 py-2.5 rounded-xl bg-white border border-purple-300 text-purple-900 font-bold text-xs sm:text-sm shadow-sm hover:bg-purple-50 transition-colors"
          >
            광고 입점 문의 : 1588-7282
          </a>
        </div>
      </div>

      {/* Main Classification Tabs: 1. 전체보기 / 2. 쿠팡 파크골프 용품관 / 3. 제휴 업체 광고 */}
      <div className="flex items-center gap-2 pb-4 mb-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setAdFilterTab('all')}
          className={`px-4 sm:px-5 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs whitespace-nowrap cursor-pointer ${
            adFilterTab === 'all'
              ? 'bg-purple-900 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-purple-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>전체 광고 모아보기</span>
        </button>

        <button
          onClick={() => setAdFilterTab('sponsor')}
          className={`px-4 sm:px-5 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs whitespace-nowrap cursor-pointer ${
            adFilterTab === 'sponsor'
              ? 'bg-purple-800 text-white shadow-md'
              : 'bg-white text-purple-900 border border-purple-200 hover:bg-purple-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>🏢 2. 파크골프 전문 제휴 업체 광고</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">{activeAds.length}개사</span>
        </button>
      </div>

      {/* 쿠팡파트너스 용품관은 별도 "추천 상품" 탭으로 이전되었습니다 (관리자 전용 등록, 서버 공유 저장). */}

      {/* CLASSIFICATION 2: 파크골프 제휴 업체 광고 */}
      {(adFilterTab === 'all' || adFilterTab === 'sponsor') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-t border-purple-100 pt-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 rounded bg-purple-700 inline-block"></span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                [분류 2] 전국 파크골프 전문 업체 제휴 광고
              </h3>
            </div>
            <span className="text-xs text-purple-700 font-bold">
              총 {activeAds.length}개 공인 전문점 제휴중
            </span>
          </div>

          {activeAds.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-purple-200 shadow-sm flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 mb-3 shadow-xs">
                <Megaphone className="w-7 h-7" />
              </div>
              <h4 className="text-lg sm:text-xl font-black text-slate-900 mb-1">
                전국 파크골프 전문 제휴 업체 및 광고 입점 안내
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mb-5 leading-relaxed">
                파크골프 용품 제조사, 맞춤 클럽 피팅점, 시니어 파크골프 전문 여행사 등 전국 동호인 대상 공식 배너 입점 문의를 받고 있습니다.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href="tel:1588-7282"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs sm:text-sm shadow transition-colors cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-amber-300" />
                  <span>광고·제휴 문의: 1588-7282</span>
                </a>
                <button
                  onClick={() => {
                    setActiveTab('associations');
                    window.dispatchEvent(new CustomEvent('open-rules-subtab', { detail: 'dataForm' }));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-extrabold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  <span>온라인 제휴 제보 창구 바로가기</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {activeAds.map(ad => (
                <div
                  key={ad.id}
                  id={`ad-card-${ad.id}`}
                  className={`bg-white rounded-3xl border border-purple-200 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between hover-lift relative ${
                    !ad.isActive ? 'opacity-60 grayscale' : ''
                  }`}
                >
                  <div>
                    {/* Image Banner */}
                    <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={ad.imageUrl}
                        alt={ad.title}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-purple-900/90 text-white shadow">
                          {ad.category}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-green-950 shadow">
                          {ad.badgeText}
                        </span>
                      </div>
                    </div>

                    {/* Text */}
                    <div className="p-4 sm:p-5">
                      <div className="text-xs font-bold text-purple-800 mb-1">
                        {ad.companyName}
                      </div>

                      <h4 className="text-base font-extrabold text-slate-900 leading-snug mb-2 line-clamp-2">
                        {ad.title}
                      </h4>

                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 font-medium mb-3">
                        {ad.description}
                      </p>

                      {ad.specialOffer && (
                        <div className="bg-purple-50 p-2 rounded-xl border border-purple-200 text-xs font-bold text-purple-950 flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                          <span className="truncate">{ad.specialOffer}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="p-4 sm:p-5 pt-0 space-y-2">
                    <a
                      id={`ad-call-btn-${ad.id}`}
                      href={`tel:${ad.phoneNumber}`}
                      className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer"
                    >
                      <PhoneCall className="w-4 h-4 text-amber-300" />
                      <span>주문 · 상담 ({ad.phoneNumber})</span>
                    </a>

                    {isAdmin && (
                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => toggleAdStatus(ad.id)}
                          className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                        >
                          {ad.isActive ? '광고 일시중지' : '광고 재개'}
                        </button>
                        <span className="text-[11px] text-slate-400">
                          {ad.isActive ? '노출중' : '숨김상태'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
