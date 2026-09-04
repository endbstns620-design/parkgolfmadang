import React, { useState } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { 
  Building2, 
  ExternalLink, 
  BookOpen, 
  Award, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  PhoneCall, 
  Globe, 
  MapPin, 
  Sparkles,
  X
} from 'lucide-react';

interface RegionalAssociation {
  name: string;
  category?: '협회' | '연맹';
  region: string;
  url: string;
  phone?: string;
}

const REGIONAL_ASSOCIATIONS: RegionalAssociation[] = [
  { name: '대한파크골프협회 (본회)', category: '협회', region: '전국', url: 'https://koreaparkgolf.org', phone: '02-2202-8844' },
  { name: '(사)한국파크골프연맹', category: '연맹', region: '전국', url: 'http://www.koreaparkgolf.org', phone: '02-452-7330' },
  { name: '(사)대한생활체육파크골프연맹', category: '연맹', region: '전국', url: 'http://www.ksfpg.or.kr', phone: '02-780-3377' },
  { name: '(사)한국시니어파크골프연맹', category: '연맹', region: '전국', url: 'http://www.seniorparkgolf.or.kr', phone: '053-741-5588' },
  { name: '세계파크골프연맹 (WPGF)', category: '연맹', region: '국제', url: 'http://www.worldparkgolf.org', phone: '02-3432-8844' },
  { name: '서울특별시 파크골프협회', category: '협회', region: '서울', url: 'http://www.seoulparkgolf.or.kr', phone: '02-490-2775' },
  { name: '경기도 파크골프협회', category: '협회', region: '경기', url: 'http://www.ggparkgolf.co.kr', phone: '031-255-0888' },
  { name: '대구광역시 파크골프협회', category: '협회', region: '대구', url: 'http://www.daeguparkgolf.or.kr', phone: '053-628-9993' },
  { name: '부산광역시 파크골프협회', category: '협회', region: '부산', url: 'http://www.busanparkgolf.com', phone: '051-505-1994' },
  { name: '경상남도 파크골프협회', category: '협회', region: '경남', url: 'http://www.gnparkgolf.or.kr', phone: '055-282-7330' },
  { name: '강원도 파크골프협회', category: '협회', region: '강원', url: 'http://www.gwparkgolf.or.kr', phone: '033-241-7999' },
  { name: '충청북도 파크골프협회', category: '협회', region: '충북', url: 'http://www.cbparkgolf.or.kr', phone: '043-264-5555' },
  { name: '전라남도 파크골프협회', category: '협회', region: '전남', url: 'http://www.jnparkgolf.co.kr', phone: '061-285-0080' },
  { name: '제주도 파크골프협회', category: '협회', region: '제주', url: 'http://www.jejugolf.co.kr', phone: '064-748-0099' },
];

export const AssociationQuickBar: React.FC = () => {
  const { openModal, setActiveTab } = useParkGolf();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'federation' | 'capital' | 'provincial'>('all');

  const filteredAssociations = REGIONAL_ASSOCIATIONS.filter(item => {
    if (selectedCategory === 'federation') return item.category === '연맹';
    if (selectedCategory === 'capital') return item.region === '서울' || item.region === '경기';
    if (selectedCategory === 'provincial') return item.region !== '서울' && item.region !== '경기' && item.region !== '전국' && item.region !== '국제';
    return true;
  });

  return (
    <>
      {/* 1. Desktop Right Fixed Quick Bar (visible on xl and above) */}
      <aside
        aria-label="파크골프 관련 협회 바로가기 사이드바"
        className={`fixed top-40 right-4 z-40 hidden xl:flex flex-col transition-all duration-300 ${
          isExpanded ? 'w-72' : 'w-12'
        }`}
      >
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-green-700/80 overflow-hidden flex flex-col max-h-[calc(100vh-180px)] backdrop-blur-md">
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-green-900 to-emerald-800 text-white p-3.5 flex items-center justify-between shrink-0">
            <div className={`flex items-center gap-2 overflow-hidden transition-all ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
              <Building2 className="w-5 h-5 text-amber-300 shrink-0" />
              <div className="font-extrabold text-sm whitespace-nowrap">
                파크골프 관련 협회 · 연맹
              </div>
            </div>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors ml-auto focus:outline-hidden"
              title={isExpanded ? '사이드바 접기' : '사이드바 펼치기'}
              aria-label={isExpanded ? '사이드바 접기' : '사이드바 펼치기'}
            >
              {isExpanded ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>

          {/* When Collapsed: Vertical icon strip */}
          {!isExpanded && (
            <div className="py-4 flex flex-col items-center gap-4 bg-slate-50 cursor-pointer" onClick={() => setIsExpanded(true)}>
              <div className="writing-vertical-lr text-xs font-extrabold text-green-900 tracking-wider flex items-center gap-2 select-none py-2">
                <span>🏛️ 협회 · 연맹 바로가기</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center shadow-sm">
                <Globe className="w-4 h-4" />
              </div>
            </div>
          )}

          {/* When Expanded: Full Quick Links */}
          {isExpanded && (
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-slate-800 text-xs">
              {/* Main Official KPGA Button */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-100/90 p-3 rounded-2xl border border-green-300 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-green-700 text-white font-extrabold text-[10px]">
                    중앙 본회
                  </span>
                  <span className="text-[11px] text-green-900 font-bold">대한민국 총괄</span>
                </div>
                <div className="font-black text-slate-900 text-sm">
                  (사)대한파크골프협회
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">
                  전국 공인대회 승인 · 용품 공인인증 · 지도자 자격관리
                </p>
                <div className="pt-1 flex items-center gap-1.5">
                  <a
                    href="https://koreaparkgolf.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-green-800 hover:bg-green-900 text-white font-extrabold text-center flex items-center justify-center gap-1 transition-all shadow-xs"
                  >
                    <span>공식 홈페이지</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Quick Action: Rules & Data Report */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setActiveTab('associations');
                    window.dispatchEvent(new CustomEvent('open-rules-subtab', { detail: 'kpgaRules' }));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-bold text-center flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-amber-700" />
                  <span className="text-[11px]">공식 규정·벌타</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('associations');
                    window.dispatchEvent(new CustomEvent('open-rules-subtab', { detail: 'dataForm' }));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-950 font-bold text-center flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span className="text-[11px]">용품 규격 & 제보</span>
                </button>
              </div>

              {/* Regional Associations & Federations Directory */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-green-700" />
                    <span>협회 및 연맹 바로가기</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{filteredAssociations.length}곳</span>
                </div>

                {/* Filter chips */}
                <div className="flex items-center gap-1 flex-wrap">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors ${
                      selectedCategory === 'all' ? 'bg-green-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    전체
                  </button>
                  <button
                    onClick={() => setSelectedCategory('federation')}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors ${
                      selectedCategory === 'federation' ? 'bg-teal-700 text-white' : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200'
                    }`}
                  >
                    연맹
                  </button>
                  <button
                    onClick={() => setSelectedCategory('capital')}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors ${
                      selectedCategory === 'capital' ? 'bg-green-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    수도권
                  </button>
                  <button
                    onClick={() => setSelectedCategory('provincial')}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors ${
                      selectedCategory === 'provincial' ? 'bg-green-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    지방권
                  </button>
                </div>

                {/* List */}
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {filteredAssociations.map((assoc, idx) => (
                    <a
                      key={idx}
                      href={assoc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-50 hover:bg-green-50 border border-slate-200 hover:border-green-300 flex items-center justify-between group transition-all"
                    >
                      <div className="truncate pr-1">
                        <div className="flex items-center gap-1">
                          {assoc.category === '연맹' && (
                            <span className="px-1 py-0.2 rounded text-[9px] bg-teal-100 text-teal-800 font-bold">
                              연맹
                            </span>
                          )}
                          <span className="font-bold text-slate-800 group-hover:text-green-900 truncate">
                            {assoc.name}
                          </span>
                        </div>
                        {assoc.phone && (
                          <div className="text-[10px] text-slate-400 group-hover:text-green-700 flex items-center gap-1">
                            <PhoneCall className="w-2.5 h-2.5" />
                            <span>{assoc.phone}</span>
                          </div>
                        )}
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-green-700 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Bottom Support Info */}
              <div className="p-2.5 bg-slate-100 rounded-xl text-[10px] text-slate-500 leading-tight">
                * 협회별 대회 접수 및 강습 신청은 해당 협회 사이트에서 진행됩니다.
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* 2. Mobile / Tablet Floating Quick Button (under xl screens) */}
      <div className="xl:hidden fixed bottom-20 right-4 z-40">
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-green-900 text-white font-extrabold text-xs shadow-2xl border-2 border-amber-400 hover:bg-black transition-transform hover:scale-105"
          aria-label="파크골프 관련 협회 및 연맹 바로가기 열기"
        >
          <Building2 className="w-4 h-4 text-amber-300" />
          <span>협회·연맹 바로가기</span>
        </button>
      </div>

      {/* 3. Mobile Drawer Modal */}
      {isMobileDrawerOpen && (
        <div
          className="xl:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
          onClick={() => setIsMobileDrawerOpen(false)}
        >
          <div
            className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-scaleUp"
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="bg-gradient-to-r from-green-900 to-emerald-800 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-300" />
                <h3 className="font-extrabold text-base text-white">
                  파크골프 관련 협회 · 연맹 바로가기
                </h3>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-4 overflow-y-auto space-y-4">
              {/* KPGA Card */}
              <div className="bg-green-50 p-4 rounded-2xl border border-green-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-green-700 text-white font-bold text-xs">
                    중앙 본회
                  </span>
                  <span className="text-xs font-bold text-green-900">02-2202-8844</span>
                </div>
                <div className="font-extrabold text-slate-900 text-base">
                  (사)대한파크골프협회
                </div>
                <p className="text-xs text-slate-600">
                  전국 공인대회 승인, 용품 공인인증 및 지도자 자격 관리
                </p>
                <a
                  href="https://koreaparkgolf.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-green-800 hover:bg-green-900 text-white font-extrabold text-sm text-center flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <span>대한파크골프협회 공식 홈페이지</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Policy Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    setActiveTab('associations');
                    window.dispatchEvent(new CustomEvent('open-rules-subtab', { detail: 'kpgaRules' }));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 font-bold text-xs text-center flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-amber-700" />
                  <span>공식 경기 규칙·벌타</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    setActiveTab('associations');
                    window.dispatchEvent(new CustomEvent('open-rules-subtab', { detail: 'dataForm' }));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold text-xs text-center flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>용품 규격 & 제보</span>
                </button>
              </div>

              {/* Regional List */}
              <div className="space-y-2">
                <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-green-700" />
                  <span>전국 협회 및 연맹 바로가기</span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {REGIONAL_ASSOCIATIONS.map((assoc, idx) => (
                    <a
                      key={idx}
                      href={assoc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-slate-50 hover:bg-green-50 border border-slate-200 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          {assoc.category === '연맹' && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-teal-100 text-teal-800 font-bold">
                              연맹
                            </span>
                          )}
                          <div className="font-bold text-slate-800 text-sm">{assoc.name}</div>
                        </div>
                        {assoc.phone && (
                          <div className="text-xs text-slate-500 mt-0.5">전화: {assoc.phone}</div>
                        )}
                      </div>
                      <ExternalLink className="w-4 h-4 text-green-700 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="p-3 bg-slate-100 border-t border-slate-200">
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-full py-2.5 bg-slate-800 text-white rounded-xl font-bold text-sm"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
