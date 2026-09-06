import React from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { X, Award, Coins, Gift } from 'lucide-react';

export const MyPageModal: React.FC = () => {
  const { activeModal, closeModal, currentUser, pointShopItems, setActiveTab, logoutUser } = useParkGolf();

  if (!activeModal || activeModal.type !== 'myPage' || !currentUser) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={closeModal}>
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-extrabold text-slate-900">마이페이지</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.confirm('로그아웃하시겠습니까?')) {
                  logoutUser();
                  closeModal();
                }
              }}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
            >
              로그아웃
            </button>
            <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-lg font-extrabold text-slate-900">{currentUser.nickname}님</p>
              <p className="text-xs text-slate-500 mt-0.5">창립회원 #{String(currentUser.founderNumber).padStart(3, '0')}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 bg-white px-4 py-2 rounded-xl border border-emerald-300 shadow-2xs">
                <Coins className="w-6 h-6 text-amber-500" />
                <span className="text-2xl font-black text-emerald-700">{currentUser.points.toLocaleString()}</span>
                <span className="text-base font-bold text-slate-500">마당P</span>
              </div>
              {(currentUser.pendingPoints ?? 0) > 0 && (
                <p className="text-base font-bold text-amber-700 mt-1.5">
                  지급 대기 +{(currentUser.pendingPoints ?? 0).toLocaleString()}P
                </p>
              )}
            </div>
          </div>
          {currentUser.badges.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mt-3">
              {currentUser.badges.map(b => (
                <span key={b} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200">
                  <Award className="w-3 h-3" />
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 마당P 적립 안내 */}
        <div className="mb-5 text-base sm:text-lg text-slate-700 bg-slate-50 rounded-2xl p-4 font-bold leading-relaxed">
          💬 구장리뷰 · 🍚 맛집 · 👥 동반자모집 — 글 하나에 <strong className="text-emerald-700">+300 마당P</strong><br />
          운영자 확인 후 24시간 안에 넣어드립니다.
        </div>

        {/* 마당P 장터로 보내기 — 교환은 장터 페이지 한 곳에서만 합니다 */}
        <button
          onClick={() => {
            closeModal();
            setActiveTab('pointmarket');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="w-full py-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-lg sm:text-xl shadow flex items-center justify-center gap-2 cursor-pointer"
        >
          <Gift className="w-6 h-6" />
          마당P 장터에서 상품 교환하기 →
        </button>
        <p className="text-center text-base text-slate-500 mt-2.5 font-medium">
          현재 {pointShopItems.filter(i => i.isActive !== false).length}개의 상품이 준비되어 있습니다
          {(currentUser.pendingPoints ?? 0) > 0 && (
            <>
              <br />
              지급 대기 중인 마당P는 운영자 확인 후 24시간 안에 들어옵니다.
            </>
          )}
        </p>
      </div>
    </div>
  );
};
