import React from 'react';
import { AdItem } from '../types';
import { PhoneCall, ExternalLink } from 'lucide-react';

// 구장찾기·맛집 게시판 목록 사이, 구장 상세보기 하단 등에 자연스럽게 끼워넣는 광고 배너입니다.
// 시니어 이용자도 헷갈리지 않도록 "광고" 배지를 항상 눈에 띄게 표시합니다.
export const InlineAdBanner: React.FC<{ ad: AdItem }> = ({ ad }) => {
  return (
    <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 sm:gap-4">
      <span className="shrink-0 self-start px-2 py-0.5 rounded-md bg-amber-400 text-amber-950 text-[10px] font-extrabold">
        광고
      </span>

      {ad.imageUrl && (
        <img
          src={ad.imageUrl}
          alt={ad.companyName}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0 border border-amber-200"
          onError={e => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-extrabold text-slate-900 text-sm sm:text-base">{ad.title}</span>
          <span className="text-[10px] sm:text-xs text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded font-bold">
            {ad.companyName}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-1 mt-0.5">{ad.description}</p>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {ad.phoneNumber && (
          <a
            href={`tel:${ad.phoneNumber}`}
            className="p-2 rounded-lg bg-white border border-amber-300 text-amber-700 hover:bg-amber-100"
            title="전화 문의"
          >
            <PhoneCall className="w-4 h-4" />
          </a>
        )}
        {ad.linkUrl && (
          <a
            href={ad.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white border border-amber-300 text-amber-700 hover:bg-amber-100"
            title="자세히 보기"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};
