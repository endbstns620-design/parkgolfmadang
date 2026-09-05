import React from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { X, Award, Coins, ExternalLink } from 'lucide-react';

export const MyPageModal: React.FC = () => {
  const { activeModal, closeModal, currentUser, pointShopItems, redeemPointShopItem, logoutUser } = useParkGolf();

  if (!activeModal || activeModal.type !== 'myPage' || !currentUser) {
    return null;
  }

  const handleRedeem = (itemId: string, itemName: string, pointCost: number) => {
    if (currentUser.points < pointCost) {
      alert('포인트가 부족합니다.');
      return;
    }
    if (window.confirm(`"${itemName}"을(를) ${pointCost.toLocaleString()}P로 교환 신청하시겠습니까?`)) {
      redeemPointShopItem(itemId);
    }
  };

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
              <p className="text-xs text-slate-500 mt-0.5">창립회원 #{String(currentUser.founderNumber).padStart(4, '0')}</p>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-4 py-2 rounded-xl border border-emerald-300 shadow-2xs">
              <Coins className="w-5 h-5 text-amber-500" />
              <span className="text-lg font-extrabold text-emerald-700">{currentUser.points.toLocaleString()}</span>
              <span className="text-sm font-bold text-slate-500">마당P</span>
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

        {/* Point Earning Guide */}
        <div className="mb-6 text-xs sm:text-sm text-slate-500 bg-slate-50 rounded-xl p-3">
          💬 구장 리뷰 작성 +200P · 👥 동반자 모집글 작성 +300P · 🍚 맛집 등록 +150P — 활동할수록 포인트가 쌓입니다.
        </div>

        {/* Point Shop */}
        <h4 className="text-base font-extrabold text-slate-900 mb-3">마당P 교환소</h4>
        <p className="text-xs text-slate-500 mb-4">
          자동 발송이 아니라, 신청하시면 운영팀이 확인 후 순차적으로 보내드립니다.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pointShopItems.filter(i => i.isActive).map(item => (
            <div key={item.id} className="border border-slate-200 rounded-xl p-4 flex flex-col gap-2">
              <span className="text-[11px] font-bold text-slate-400">{item.category}</span>
              <p className="font-bold text-sm text-slate-900 leading-snug">{item.name}</p>
              <div className="flex items-center justify-between mt-auto pt-2">
                <span className="text-emerald-700 font-extrabold text-sm">{item.pointCost.toLocaleString()}P</span>
                {item.referenceUrl && (
                  <a
                    href={item.referenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-0.5"
                  >
                    상품보기 <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <button
                onClick={() => handleRedeem(item.id, item.name, item.pointCost)}
                disabled={currentUser.points < item.pointCost}
                className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs cursor-pointer disabled:cursor-not-allowed"
              >
                {currentUser.points < item.pointCost ? '포인트 부족' : '교환 신청하기'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
