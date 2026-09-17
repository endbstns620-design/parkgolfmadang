import React from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { FavoriteKind, FAVORITE_LIMIT, FAVORITE_POINT } from '../types';
import { Star } from 'lucide-react';

/**
 * 찜하기 버튼 — 구장·대회 어디서나 같은 모양으로 씁니다.
 *
 * · 구장 3개, 대회 3개까지 찜할 수 있습니다.
 * · 하나 찜할 때마다 200 마당P를 그 자리에서 드립니다.
 * · 찜을 푸시면 그 달에 받았던 200P는 도로 빠집니다.
 * · 로그인하지 않은 분이 누르면 로그인 창이 열립니다.
 *
 * 시니어분들이 누르기 쉽도록 버튼을 크게 잡았고, 글씨로도 상태를 밝힙니다.
 * (별표만 있으면 켜진 건지 꺼진 건지 알아보기 어렵다는 점을 고려했습니다)
 */
interface Props {
  kind: FavoriteKind;
  id: string;
  /** 'full' = 글씨까지 나오는 큰 버튼 · 'icon' = 목록에서 쓰는 작은 별표 */
  size?: 'full' | 'icon';
  className?: string;
}

export const FavoriteButton: React.FC<Props> = ({ kind, id, size = 'full', className = '' }) => {
  const { isFavorite, toggleFavorite, favoriteCourseIds, favoriteTournamentIds } = useParkGolf();

  const on = isFavorite(kind, id);
  const list = kind === 'course' ? favoriteCourseIds : favoriteTournamentIds;
  const isFull = !on && list.length >= FAVORITE_LIMIT;
  const label = kind === 'course' ? '관심구장' : '관심대회';
  // '관심구장은' · '관심대회는' — 받침에 따라 조사가 달라집니다.
  const labelTopic = kind === 'course' ? '관심구장은' : '관심대회는';

  const handle = (e: React.MouseEvent) => {
    // 목록의 카드 안에 들어가는 경우가 많아, 카드 클릭으로 번지지 않게 막습니다.
    e.preventDefault();
    e.stopPropagation();
    if (isFull) {
      alert(`${labelTopic} ${FAVORITE_LIMIT}개까지 찜하실 수 있습니다.\n먼저 찜해 두신 것 중 하나를 풀어주세요.`);
      return;
    }
    void toggleFavorite(kind, id);
  };

  if (size === 'icon') {
    return (
      <button
        type="button"
        onClick={handle}
        aria-label={on ? `${label} 찜 풀기` : `${label}으로 찜하기`}
        title={on ? `${label} 찜 풀기` : `${label}으로 찜하기 (+${FAVORITE_POINT}P)`}
        className={`shrink-0 p-2 rounded-xl border-2 transition-colors cursor-pointer ${
          on
            ? 'bg-amber-400 border-amber-500 text-amber-950'
            : 'bg-white border-slate-300 text-slate-400 hover:border-amber-400 hover:text-amber-600'
        } ${className}`}
      >
        <Star className="w-6 h-6" fill={on ? 'currentColor' : 'none'} strokeWidth={2.5} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handle}
      className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-base sm:text-lg font-black border-2 transition-colors cursor-pointer ${
        on
          ? 'bg-amber-400 border-amber-500 text-amber-950 hover:bg-amber-300'
          : 'bg-white border-slate-300 text-slate-700 hover:border-amber-400 hover:bg-amber-50'
      } ${className}`}
    >
      <Star className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill={on ? 'currentColor' : 'none'} strokeWidth={2.5} />
      <span>
        {on ? `${label} 찜했음` : `${label} 찜하기`}
        {!on && <span className="ml-1 text-green-800">+{FAVORITE_POINT}P</span>}
      </span>
    </button>
  );
};
