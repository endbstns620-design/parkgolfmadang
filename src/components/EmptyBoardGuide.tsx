import React from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { Coins, PenLine, Lightbulb } from 'lucide-react';

/**
 * 글이 아직 하나도 없는 게시판에서 보여주는 안내입니다.
 *
 * 예전에는 "등록된 글이 없습니다" 한 줄이라, 들어오신 분이 할 일을 못 찾고 그냥 나가셨습니다.
 * 이제 세 가지를 같이 보여드립니다.
 *   1) 글을 쓰면 무엇을 받는지 (마당P 300점)
 *   2) 어떻게 쓰면 되는지 (예시 — 실제 글이 아니라 보기입니다)
 *   3) 바로 쓰러 가는 큰 버튼
 *
 * 예시는 '예시'라고 분명히 표시하고, 점선 테두리에 흐린 색으로 둡니다.
 * 진짜 글처럼 보이면 그 순간 이 사이트를 못 믿게 되기 때문입니다.
 */

interface Props {
  /** 무슨 게시판인지 — 예: '구장 방문 후기' */
  boardName: string;
  /** 큰 제목 아래 한 줄 설명 */
  description: string;
  /** 글쓰기 버튼 문구 */
  ctaLabel: string;
  /** 글쓰기 버튼을 눌렀을 때 */
  onWrite: () => void;
  /** 예시 글 — 줄 단위로 넣습니다 */
  exampleLines: string[];
  /** 색 계열 */
  tone: 'amber' | 'rose';
}

const TONE = {
  amber: {
    ring: 'bg-amber-100 text-amber-600',
    button: 'bg-amber-500 hover:bg-amber-600 text-green-950',
    badge: 'bg-amber-100 text-amber-900 border-amber-300'
  },
  rose: {
    ring: 'bg-rose-100 text-rose-600',
    button: 'bg-rose-600 hover:bg-rose-700 text-white',
    badge: 'bg-rose-100 text-rose-900 border-rose-300'
  }
};

export const EmptyBoardGuide: React.FC<Props> = ({
  boardName,
  description,
  ctaLabel,
  onWrite,
  exampleLines,
  tone
}) => {
  const { currentUser } = useParkGolf();
  const t = TONE[tone];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
      <div className="max-w-xl mx-auto flex flex-col items-center text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${t.ring}`}>
          <PenLine className="w-8 h-8" strokeWidth={2.2} />
        </div>

        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 mb-2 break-keep">
          {boardName}의 첫 글을 기다리고 있습니다
        </h3>
        <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed mb-4 break-keep">
          {description}
        </p>

        <span
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 text-base sm:text-lg font-black mb-6 ${t.badge}`}
        >
          <Coins className="w-5 h-5" />
          글 하나에 300 마당P
        </span>

        {/* 예시 — 실제 글이 아닙니다 */}
        <div className="w-full text-left rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 sm:p-5 mb-6">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-700 text-white text-sm font-black mb-3">
            <Lightbulb className="w-4 h-4" />
            이렇게 쓰시면 됩니다 (예시)
          </span>
          <div className="space-y-1">
            {exampleLines.map((line, i) => (
              <p
                key={i}
                className={`leading-relaxed break-keep ${
                  i === 0
                    ? 'text-lg sm:text-xl font-black text-slate-700'
                    : 'text-base sm:text-lg font-medium text-slate-500'
                }`}
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        <button
          onClick={onWrite}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-black text-lg sm:text-xl shadow-md transition-colors cursor-pointer ${t.button}`}
        >
          <PenLine className="w-5 h-5" />
          {ctaLabel}
        </button>

        <p className="text-sm sm:text-base text-slate-500 font-medium mt-3">
          {currentUser
            ? '마당P는 운영자가 글을 확인한 뒤 지급됩니다'
            : '회원가입은 무료입니다 · 마당P는 운영자가 글을 확인한 뒤 지급됩니다'}
        </p>
      </div>
    </div>
  );
};
