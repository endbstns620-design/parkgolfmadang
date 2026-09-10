import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, Check } from 'lucide-react';
import { useParkGolf } from '../context/ParkGolfContext';
import { MainBanner } from '../types';

/**
 * 후원사(광고) 배너.
 * 내용은 관리자 화면(🖼️ 메인 배너 탭)에서 직접 등록·수정합니다.
 * - 꺼둔 배너, 광고 기간이 지난 배너는 자동으로 빠집니다.
 * - 여러 개면 순서 번호가 작은 것부터 8초마다 돌아가며 보입니다.
 * - 노출 수와 클릭 수를 기록해서 관리자 화면에 보여줍니다.
 *
 * 화면 크기에 따라 두 가지 모양으로 나옵니다.
 *   1) 넓은 PC 화면 — 본문 양옆 빈 공간에 세로 띠로 붙습니다(SponsorRailBanners).
 *   2) 그 밖의 화면 — 본문 안에 얇은 가로 띠로 들어갑니다(SponsorCompactBanner).
 * 본문을 가리지 않으면서 광고는 계속 보이게 하려는 배치입니다.
 *
 * ⚠ 건강기능식품 광고 문구는 식약처가 인정한 표현만 쓸 수 있습니다.
 *   업체가 준 공식 광고물의 표현을 그대로 넣어주세요.
 */

/** 지금 보여줄 배너 하나를 골라주고, 노출 수까지 기록해주는 공용 로직 */
function useActiveBanner() {
  const { mainBanners, trackMainBanner } = useParkGolf();
  const [index, setIndex] = useState(0);
  const countedRef = useRef<Set<string>>(new Set());

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

  const banner: MainBanner | undefined = visible[Math.min(index, Math.max(visible.length - 1, 0))];

  // 노출 수 기록 — 같은 방문에서 같은 배너는 한 번만 셉니다.
  useEffect(() => {
    if (!banner?.id) return;
    if (countedRef.current.has(banner.id)) return;
    countedRef.current.add(banner.id);
    trackMainBanner(banner.id, 'view');
  }, [banner?.id, trackMainBanner]);

  return { banner, visible, index, setIndex, trackMainBanner };
}

const pointsOf = (b?: MainBanner) =>
  Array.isArray(b?.points) ? b!.points.filter(p => p?.name) : [];

/* ────────────────────────────────────────────────────────────
   1) 세로 띠 — 넓은 PC 화면에서 본문 양옆에 붙습니다.
   화면을 내려도 따라 내려오도록 위치를 화면에 고정합니다.
   ──────────────────────────────────────────────────────────── */
const RailBanner: React.FC<{ side: 'left' | 'right' }> = ({ side }) => {
  const { banner, trackMainBanner } = useActiveBanner();
  const { fontSize } = useParkGolf();

  if (!banner) return null;
  // 글씨를 키우시면 본문이 넓어져 띠와 겹칩니다. 그때는 띠를 접고 가로 띠로 보여드립니다.
  if (fontSize !== 'normal') return null;

  const points = pointsOf(banner).slice(0, 2);

  return (
    <aside
      // 본문(최대 1280px)을 가리지 않을 만큼 넓은 화면에서만 보입니다.
      className={`hidden min-[1650px]:block fixed top-1/2 -translate-y-1/2 z-30 w-[172px] ${
        side === 'left' ? 'left-4' : 'right-4'
      }`}
      aria-label="후원사 광고"
    >
      <a
        href={banner.linkUrl || '#'}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={() => trackMainBanner(banner.id, 'click')}
        className="block rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow cursor-pointer bg-gradient-to-b from-green-950 via-green-800 to-green-700"
      >
        <div className="px-3 pt-3 pb-2 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <span className="px-1.5 py-0.5 rounded bg-amber-400 text-amber-950 text-[10px] font-black">광고</span>
            {banner.sponsorName && (
              <span className="text-amber-300 font-extrabold text-[12px] truncate">{banner.sponsorName}</span>
            )}
          </div>

          {banner.imageUrl && (
            <div className="w-[132px] h-[132px] mx-auto mb-2.5 rounded-xl bg-white border-2 border-amber-300 overflow-hidden">
              <img
                src={banner.imageUrl}
                alt={banner.sponsorName || '후원사 제품 사진'}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          )}

          <p className="text-[16px] font-black text-white leading-snug break-keep">
            {banner.headlineTop}
            {banner.headlineHighlight && (
              <>
                <br />
                <span className="text-amber-300">{banner.headlineHighlight}</span>
              </>
            )}
          </p>

          {points.length > 0 && (
            <div className="mt-2.5 flex flex-col gap-1">
              {points.map(p => (
                <span
                  key={p.name}
                  className="flex items-center gap-1 rounded-lg bg-green-950/50 border border-emerald-500/40 px-2 py-1"
                >
                  <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span className="font-black text-white text-[12px] text-left leading-tight break-keep">{p.name}</span>
                </span>
              ))}
            </div>
          )}

          {banner.subText && (
            <p className="mt-2 text-[12px] font-bold text-amber-100 leading-snug break-keep">{banner.subText}</p>
          )}
        </div>

        <div className="px-3 pb-3">
          <span className="w-full inline-flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl bg-amber-400 text-green-950 font-black text-[14px] shadow-[0_3px_0_#d97706]">
            {banner.buttonText || '자세히 보기'}
            <ExternalLink className="w-4 h-4" />
          </span>
        </div>

        {banner.disclaimer && (
          <p className="bg-green-950/60 px-2.5 py-1.5 text-[9px] font-medium text-green-200/90 leading-tight break-keep">
            {banner.disclaimer}
          </p>
        )}
      </a>
    </aside>
  );
};

/** 좌우 두 개를 한 번에 놓습니다. App 화면 전체에서 한 번만 부르면 됩니다. */
export const SponsorRailBanners: React.FC = () => (
  <>
    <RailBanner side="left" />
    <RailBanner side="right" />
  </>
);

/* ────────────────────────────────────────────────────────────
   2) 가로 띠 — 세로 띠가 안 보이는 화면(모바일·노트북)에서
   본문 안에 얇게 들어갑니다. 예전처럼 화면을 크게 차지하지 않습니다.
   ──────────────────────────────────────────────────────────── */
export const SponsorCompactBanner: React.FC = () => {
  const { banner, visible, index, setIndex, trackMainBanner } = useActiveBanner();
  const { fontSize } = useParkGolf();

  if (!banner) return null;

  const points = pointsOf(banner).slice(0, 2);
  // 넓은 화면 + 보통 글씨일 때만 세로 띠가 나오므로, 그때만 이 가로 띠를 숨깁니다.
  const hideOnWide = fontSize === 'normal' ? 'min-[1650px]:hidden' : '';

  return (
    <div className={hideOnWide}>
      <a
        href={banner.linkUrl || '#'}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={() => trackMainBanner(banner.id, 'click')}
        className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-r from-green-950 via-green-800 to-green-700 p-3 sm:p-4"
      >
        <div className="flex items-center gap-3 sm:contents">
        {banner.imageUrl && (
          <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl bg-white border-2 border-amber-300 overflow-hidden">
            <img
              src={banner.imageUrl}
              alt={banner.sponsorName || '후원사 제품 사진'}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="px-1.5 py-0.5 rounded bg-amber-400 text-amber-950 text-[10px] font-black shrink-0">광고</span>
            {banner.sponsorName && (
              <span className="text-amber-300 font-extrabold text-[12px] sm:text-[13px] truncate">
                {banner.sponsorName}
              </span>
            )}
          </div>

          <p className="text-[15px] sm:text-lg font-black text-white leading-snug break-keep">
            {banner.headlineTop}
            {banner.headlineHighlight && <span className="text-amber-300"> {banner.headlineHighlight}</span>}
          </p>

          {points.length > 0 && (
            <p className="mt-1 text-[12px] sm:text-[13px] font-bold text-green-100 leading-snug break-keep">
              {points.map(p => p.name).join(' · ')}
              {banner.subText ? ` · ${banner.subText}` : ''}
            </p>
          )}
        </div>
        </div>

        <span className="shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-1 px-3 sm:px-4 py-2.5 rounded-xl bg-amber-400 text-green-950 font-black text-[14px] sm:text-[15px] shadow-[0_3px_0_#d97706]">
          {banner.buttonText || '보기'}
          <ExternalLink className="w-4 h-4" />
        </span>
      </a>

      {banner.disclaimer && (
        <p className="mt-1.5 px-1 text-[11px] font-medium text-slate-500 leading-snug break-keep">
          {banner.disclaimer}
        </p>
      )}

      {/* 배너가 여러 개일 때 몇 번째인지 알려주는 점 */}
      {visible.length > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          {visible.map((b, i) => (
            <button
              key={b.id}
              onClick={() => setIndex(i)}
              aria-label={`${i + 1}번째 배너 보기`}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                i === index ? 'w-7 bg-green-800' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
