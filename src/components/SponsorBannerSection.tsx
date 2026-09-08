import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, Check } from 'lucide-react';
import { useParkGolf } from '../context/ParkGolfContext';

/**
 * 메인화면 후원사 배너.
 * 내용은 관리자 화면(🖼️ 메인 배너 탭)에서 직접 등록·수정합니다.
 * - 꺼둔 배너, 광고 기간이 지난 배너는 자동으로 빠집니다.
 * - 여러 개면 순서 번호가 작은 것부터 8초마다 돌아가며 보입니다.
 * - 노출 수와 클릭 수를 기록해서 관리자 화면에 보여줍니다.
 *
 * ⚠ 건강기능식품 광고 문구는 식약처가 인정한 표현만 쓸 수 있습니다.
 *   업체가 준 공식 광고물의 표현을 그대로 넣어주세요.
 */
export const SponsorBannerSection: React.FC = () => {
  const { mainBanners, trackMainBanner } = useParkGolf();
  const [index, setIndex] = useState(0);
  const countedRef = useRef<Set<string>>(new Set());

  // 오늘 기준으로 실제 보여드릴 배너만 골라냅니다.
  const visible = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return (mainBanners || [])
      .filter(b => b && b.isActive !== false)
      .filter(b => !b.startDate || today >= b.startDate)
      .filter(b => !b.endDate || today <= b.endDate)
      .sort((a, b) => (Number(a.priority) || 99) - (Number(b.priority) || 99));
  }, [mainBanners]);

  // 배너가 여러 개면 8초마다 바꿔줍니다. (시니어분들이 읽으실 시간을 넉넉히 둡니다)
  useEffect(() => {
    if (visible.length < 2) {
      setIndex(0);
      return;
    }
    const timer = window.setInterval(() => setIndex(i => (i + 1) % visible.length), 8000);
    return () => window.clearInterval(timer);
  }, [visible.length]);

  const banner = visible[Math.min(index, Math.max(visible.length - 1, 0))];

  // 노출 수 기록 — 같은 방문에서 같은 배너는 한 번만 셉니다.
  useEffect(() => {
    if (!banner?.id) return;
    if (countedRef.current.has(banner.id)) return;
    countedRef.current.add(banner.id);
    trackMainBanner(banner.id, 'view');
  }, [banner?.id, trackMainBanner]);

  if (!banner) return null;

  const points = Array.isArray(banner.points) ? banner.points.filter(p => p?.name) : [];

  return (
    <div className="h-full flex flex-col">
      <a
        href={banner.linkUrl || '#'}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={() => trackMainBanner(banner.id, 'click')}
        className="flex-1 flex flex-col rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow cursor-pointer bg-gradient-to-br from-green-950 via-green-800 to-green-700"
      >
        <div className="flex-1 flex flex-col items-center sm:flex-row sm:items-center gap-5 p-5 sm:p-6">
          {banner.imageUrl && (
            <div className="w-36 h-36 sm:w-32 sm:h-32 lg:w-36 lg:h-36 shrink-0 self-center rounded-2xl bg-white border-4 border-amber-300 overflow-hidden">
              <img
                src={banner.imageUrl}
                alt={banner.sponsorName || '후원사 제품 사진'}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          )}

          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-md bg-amber-400 text-amber-950 text-xs font-black shrink-0">
                광고
              </span>
              {banner.sponsorName && (
                <span className="text-amber-300 font-extrabold text-sm sm:text-base">{banner.sponsorName}</span>
              )}
            </div>

            <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
              {banner.headlineTop}
              {banner.headlineHighlight && (
                <>
                  <br />
                  <span className="text-amber-300">{banner.headlineHighlight}</span>
                </>
              )}
            </p>

            {points.length > 0 && (
              <div className="mt-3 flex flex-col sm:flex-row sm:flex-wrap items-center sm:items-start gap-2">
                {points.map(p => (
                  <span
                    key={p.name}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-green-950/50 border border-emerald-500/40 px-3 py-1.5"
                  >
                    <Check className="w-4 h-4 text-amber-300 shrink-0" />
                    <span className="font-black text-white text-[15px] sm:text-base">{p.name}</span>
                    {p.effect && (
                      <span className="font-bold text-green-100 text-[14px] sm:text-[15px]">— {p.effect}</span>
                    )}
                  </span>
                ))}
              </div>
            )}

            {banner.subText && (
              <p className="mt-2.5 text-base sm:text-lg font-bold text-amber-100">{banner.subText}</p>
            )}
          </div>

        </div>

        <div className="px-5 sm:px-6 pb-5 sm:pb-6">
          <span className="w-full inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-green-950 font-black text-lg sm:text-xl shadow-[0_4px_0_#d97706] transition-colors">
            {banner.buttonText || '자세히 보기'}
            <ExternalLink className="w-5 h-5" />
          </span>
        </div>

        {banner.disclaimer && (
          <p className="bg-green-950/60 px-5 sm:px-6 py-2 text-center sm:text-left text-[12px] sm:text-[13px] font-medium text-green-200/90 leading-snug">
            {banner.disclaimer}
          </p>
        )}
      </a>

      {/* 배너가 여러 개일 때 몇 번째인지 알려주는 점 */}
      {visible.length > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {visible.map((b, i) => (
            <button
              key={b.id}
              onClick={() => setIndex(i)}
              aria-label={`${i + 1}번째 배너 보기`}
              className={`h-3 rounded-full transition-all cursor-pointer ${
                i === index ? 'w-8 bg-green-800' : 'w-3 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
