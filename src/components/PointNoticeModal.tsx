import React from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { Coins, CheckCircle2 } from 'lucide-react';

/**
 * 회원이 구장리뷰 · 맛집 · 동반자모집 글을 올린 직후에 뜨는 안내창입니다.
 * 마당P는 관리자가 글을 확인한 뒤에 실제로 지급되므로, 지금은 "지급 예정"이라는 점과
 * 지급이 다 되면 얼마가 되는지를 어르신들도 한눈에 보이도록 큼직하게 알려드립니다.
 */
export const PointNoticeModal: React.FC = () => {
  const { pointNotice, closePointNotice, currentUser } = useParkGolf();

  if (!pointNotice) return null;

  const now = currentUser?.points ?? 0;

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4" onClick={closePointNotice}>
      <div
        className="bg-white rounded-3xl max-w-md w-full p-7 text-center shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-11 h-11 text-emerald-600" />
        </div>

        <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug mb-2">
          글을 올려주셔서<br />감사합니다!
        </p>

        <p className="text-lg sm:text-xl font-bold text-slate-600 leading-relaxed mb-5">
          운영자 확인 후 <span className="text-emerald-700 font-black">24시간 안에</span><br />
          <span className="text-emerald-700 font-black">{pointNotice.amount.toLocaleString()} 마당P</span>를 넣어드립니다.
        </p>

        <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 mb-5 space-y-2.5">
          <div className="flex items-center justify-between text-lg sm:text-xl font-bold text-slate-700">
            <span>지금 쓸 수 있는 마당P</span>
            <span className="font-black text-slate-900">{now.toLocaleString()}P</span>
          </div>
          <div className="flex items-center justify-between text-lg sm:text-xl font-bold text-slate-700">
            <span>지급 기다리는 마당P</span>
            <span className="font-black text-amber-600">+{pointNotice.pendingPoints.toLocaleString()}P</span>
          </div>
          <div className="pt-2.5 border-t-2 border-slate-200 flex items-center justify-between">
            <span className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-1.5">
              <Coins className="w-5 h-5 text-amber-500" />
              모두 받으시면
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-700">
              {pointNotice.expectedPoints.toLocaleString()}P
            </span>
          </div>
        </div>

        <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed mb-5">
          모으신 마당P는 <strong className="text-slate-700">마당P 장터</strong>에서<br />
          상품으로 바꾸실 수 있습니다.
        </p>

        <button
          onClick={closePointNotice}
          className="w-full py-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xl cursor-pointer"
        >
          확인
        </button>
      </div>
    </div>
  );
};
