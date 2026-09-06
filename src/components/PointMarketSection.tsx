import React, { useState, useMemo } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { PointShopItem } from '../types';
import { Coins, Gift, Search, X, ExternalLink, Trash2, PackageOpen } from 'lucide-react';
import { openAddressSearch } from '../utils/addressSearch';

/** 상품 사진이 없을 때 보여줄 자리 (사진 대신 선물상자 아이콘) */
const ProductImage: React.FC<{ item: PointShopItem }> = ({ item }) => {
  if (item.coupangEmbedUrl) {
    return (
      <iframe
        src={item.coupangEmbedUrl}
        width="100%"
        height={240}
        frameBorder="0"
        scrolling="no"
        referrerPolicy="unsafe-url"
        title={`coupang-${item.id}`}
        className="w-full rounded-xl bg-white"
      />
    );
  }
  if (item.imageUrl) {
    return (
      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-full h-48 object-contain bg-white rounded-xl border border-slate-100"
      />
    );
  }
  return (
    <div className="w-full h-48 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
      <Gift className="w-14 h-14 text-emerald-300" />
    </div>
  );
};

export const PointMarketSection: React.FC = () => {
  const { pointShopItems, currentUser, isAdmin, redeemPointShopItem, deletePointShopItem, openModal } = useParkGolf();

  // 교환 신청 창 상태
  const [target, setTarget] = useState<PointShopItem | null>(null);
  const [shortfall, setShortfall] = useState<{ required: number; have: number } | null>(null);
  const [done, setDone] = useState<{ itemName: string; pointCost: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manualAddress, setManualAddress] = useState(false);
  const [form, setForm] = useState({
    recipientName: '',
    recipientPhone: '',
    postcode: '',
    roadAddress: '',
    detailAddress: '',
    memo: ''
  });

  const myPoints = currentUser?.points ?? 0;
  const items = useMemo(() => pointShopItems.filter(i => i.isActive !== false), [pointShopItems]);

  const startRedeem = (item: PointShopItem) => {
    if (!currentUser) {
      openModal('auth');
      return;
    }
    // 1차 확인 — 마당P가 모자라면 안내창부터 띄웁니다.
    if (myPoints < item.pointCost) {
      setShortfall({ required: item.pointCost, have: myPoints });
      return;
    }
    setForm({
      recipientName: currentUser.name || '',
      recipientPhone: currentUser.phone || '',
      postcode: '',
      roadAddress: '',
      detailAddress: '',
      memo: ''
    });
    setManualAddress(false);
    setTarget(item);
  };

  const handleFindAddress = async () => {
    const opened = await openAddressSearch(found => {
      setForm(f => ({
        ...f,
        postcode: found.postcode,
        roadAddress: `${found.address} ${found.extraInfo}`.trim()
      }));
    });
    if (!opened) {
      setManualAddress(true);
      alert('주소 검색창을 열지 못했습니다. 아래에 주소를 직접 입력해주세요.');
    }
  };

  const handleSubmit = async () => {
    if (!target) return;
    if (!form.recipientName.trim()) return alert('받으실 분 성함을 입력해주세요.');
    if (form.recipientPhone.replace(/[^0-9]/g, '').length < 9) return alert('연락처를 정확히 입력해주세요.');
    if (!form.roadAddress.trim()) return alert('주소를 입력해주세요.');

    setIsSubmitting(true);
    const result = await redeemPointShopItem(target.id, form);
    setIsSubmitting(false);

    if (result.notEnoughPoints) {
      setTarget(null);
      setShortfall({ required: result.required ?? target.pointCost, have: result.have ?? myPoints });
      return;
    }
    if (result.ok) {
      setDone({ itemName: target.name, pointCost: target.pointCost });
      setTarget(null);
    }
  };

  return (
    <section id="section-point-market" className="scroll-mt-28 py-10 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* 머리말 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-4 border-b border-emerald-200 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-sm sm:text-base font-extrabold mb-2 border border-emerald-300">
            <Coins className="w-4 h-4 text-amber-500" />
            <span>🎁 활동으로 모은 마당P를 상품으로</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            마당P 장터
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 mt-2 font-medium leading-relaxed">
            구장리뷰 · 맛집 · 동반자모집 글을 쓰시면 마당P가 쌓입니다.{' '}
            <br className="hidden sm:block" />
            모은 마당P로 아래 상품을 바꿔 가세요.
          </p>
        </div>

        {/* 내 보유 마당P — 어르신도 한눈에 보이도록 크게 */}
        <div className="shrink-0">
          {currentUser ? (
            <div className="bg-emerald-700 text-white rounded-2xl px-6 py-4 shadow-lg">
              <p className="text-sm sm:text-base font-bold text-emerald-100">{currentUser.nickname}님 보유</p>
              <p className="text-3xl sm:text-4xl font-black text-amber-300 leading-tight">
                {myPoints.toLocaleString()}
                <span className="text-xl sm:text-2xl text-white ml-1">마당P</span>
              </p>
              {(currentUser.pendingPoints ?? 0) > 0 && (
                <p className="text-base sm:text-lg font-bold text-emerald-100 mt-1">
                  지급 대기 +{(currentUser.pendingPoints ?? 0).toLocaleString()}P (운영자 확인 중)
                </p>
              )}
            </div>
          ) : (
            <button
              onClick={() => openModal('auth')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl px-6 py-4 shadow-lg font-black text-lg sm:text-xl cursor-pointer"
            >
              로그인하고 내 마당P 보기 →
            </button>
          )}
        </div>
      </div>

      {isAdmin && (
        <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-center justify-between gap-3 flex-wrap">
          <p className="text-sm sm:text-base font-bold text-amber-900">
            관리자 모드입니다. 상품 등록은 관리자 화면의 <strong>"마당P 장터"</strong> 탭에서 하실 수 있습니다.
          </p>
          <button
            onClick={() => openModal('admin')}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow cursor-pointer shrink-0"
          >
            관리자 화면 열기
          </button>
        </div>
      )}

      {/* 상품 목록 */}
      {items.length === 0 ? (
        <div className="py-20 text-center bg-slate-50 rounded-2xl border border-slate-200">
          <PackageOpen className="w-14 h-14 mx-auto mb-3 text-slate-300" />
          <p className="text-lg sm:text-xl font-bold text-slate-500">아직 등록된 상품이 없습니다.</p>
          <p className="text-base text-slate-400 mt-1">상품이 준비되는 대로 이곳에 올려드리겠습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(item => {
            const enough = myPoints >= item.pointCost;
            return (
              <div
                key={item.id}
                className="relative bg-white border-2 border-slate-200 rounded-2xl p-4 flex flex-col gap-3 hover:border-emerald-400 transition-colors"
              >
                {isAdmin && (
                  <button
                    onClick={() => deletePointShopItem(item.id)}
                    className="absolute -top-2 -right-2 z-10 w-8 h-8 rounded-full bg-white shadow border border-slate-200 hover:bg-rose-600 hover:text-white text-slate-500 flex items-center justify-center cursor-pointer"
                    title="상품 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <ProductImage item={item} />

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white bg-slate-500 px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  {item.sourceType === '쿠팡' && (
                    <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">쿠팡상품</span>
                  )}
                </div>

                <p className="font-extrabold text-lg sm:text-xl text-slate-900 leading-snug">{item.name}</p>

                {item.description && (
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
                    {item.description}
                  </p>
                )}

                {item.referenceUrl && (
                  <a
                    href={item.referenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-500 hover:text-emerald-700 underline flex items-center gap-1 w-fit"
                  >
                    상품 자세히 보기 <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <div className="mt-auto pt-3 border-t border-slate-100">
                  <p className="text-2xl sm:text-3xl font-black text-emerald-700 mb-3">
                    {item.pointCost.toLocaleString()}
                    <span className="text-lg text-slate-500 ml-1">마당P</span>
                  </p>
                  <button
                    onClick={() => startRedeem(item)}
                    className={`w-full py-4 rounded-xl font-black text-lg sm:text-xl shadow transition-all cursor-pointer ${
                      !currentUser || enough
                        ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                        : 'bg-slate-300 text-slate-600 hover:bg-slate-400'
                    }`}
                  >
                    마당P 상품 교환하기
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 마당P 부족 안내창 ── */}
      {shortfall && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShortfall(null)}>
          <div className="bg-white rounded-3xl max-w-md w-full p-7 text-center" onClick={e => e.stopPropagation()}>
            <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
              <Coins className="w-10 h-10 text-rose-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-rose-700 mb-3">마당P가 부족합니다</p>
            <div className="bg-slate-50 rounded-2xl p-4 mb-5 text-lg sm:text-xl font-bold text-slate-700 space-y-1">
              <p>
                필요한 마당P <span className="text-slate-900 font-black">{shortfall.required.toLocaleString()}P</span>
              </p>
              <p>
                내 마당P <span className="text-slate-900 font-black">{shortfall.have.toLocaleString()}P</span>
              </p>
              <p className="text-rose-600">
                {Math.max(0, shortfall.required - shortfall.have).toLocaleString()}P 더 모으시면 교환하실 수 있습니다
              </p>
            </div>
            <p className="text-base sm:text-lg text-slate-600 font-medium mb-5 leading-relaxed">
              구장리뷰 · 맛집 · 동반자모집 글을 쓰시면<br />마당P가 쌓입니다.
            </p>
            <button
              onClick={() => setShortfall(null)}
              className="w-full py-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-black text-lg cursor-pointer"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* ── 배송지 입력창 ── */}
      {target && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full my-6 max-h-[92vh] overflow-y-auto">
            <div className="sticky top-0 bg-emerald-700 text-white px-6 py-5 flex items-center justify-between rounded-t-3xl">
              <div>
                <h3 className="text-xl sm:text-2xl font-black">제품 받으실 곳을 알려주세요</h3>
                <p className="text-sm sm:text-base text-emerald-100 mt-0.5">
                  {target.name} · {target.pointCost.toLocaleString()}마당P
                </p>
              </div>
              <button onClick={() => setTarget(null)} className="text-emerald-100 hover:text-white cursor-pointer shrink-0">
                <X className="w-7 h-7" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-lg font-black text-slate-800 mb-2">받으실 분 성함 *</label>
                <input
                  type="text"
                  value={form.recipientName}
                  onChange={e => setForm({ ...form, recipientName: e.target.value })}
                  placeholder="예: 홍길동"
                  className="w-full px-4 py-4 border-2 border-slate-300 rounded-xl text-lg font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-lg font-black text-slate-800 mb-2">연락처 *</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={form.recipientPhone}
                  onChange={e => setForm({ ...form, recipientPhone: e.target.value })}
                  placeholder="예: 010-1234-5678"
                  className="w-full px-4 py-4 border-2 border-slate-300 rounded-xl text-lg font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-lg font-black text-slate-800 mb-2">주소 *</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={form.postcode}
                    onChange={e => setForm({ ...form, postcode: e.target.value })}
                    placeholder="우편번호"
                    readOnly={!manualAddress}
                    className="w-36 px-4 py-4 border-2 border-slate-300 rounded-xl text-lg font-bold bg-slate-50 focus:outline-none focus:border-emerald-600"
                  />
                  <button
                    type="button"
                    onClick={handleFindAddress}
                    className="flex-1 px-4 py-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-black text-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Search className="w-5 h-5" />
                    주소 찾기
                  </button>
                </div>
                <input
                  type="text"
                  value={form.roadAddress}
                  onChange={e => setForm({ ...form, roadAddress: e.target.value })}
                  placeholder={manualAddress ? '도로명 또는 지번 주소를 입력해주세요' : '주소 찾기를 눌러주세요'}
                  readOnly={!manualAddress}
                  className="w-full px-4 py-4 border-2 border-slate-300 rounded-xl text-lg font-bold bg-slate-50 mb-2 focus:outline-none focus:border-emerald-600"
                />
                <input
                  type="text"
                  value={form.detailAddress}
                  onChange={e => setForm({ ...form, detailAddress: e.target.value })}
                  placeholder="상세주소 (동·호수 등)"
                  className="w-full px-4 py-4 border-2 border-slate-300 rounded-xl text-lg font-bold focus:outline-none focus:border-emerald-600"
                />
                {!manualAddress && (
                  <button
                    type="button"
                    onClick={() => setManualAddress(true)}
                    className="mt-2 text-base text-slate-500 hover:text-slate-800 underline font-bold cursor-pointer"
                  >
                    주소 찾기가 안 되면 여기를 눌러 직접 입력하세요
                  </button>
                )}
              </div>

              <div>
                <label className="block text-lg font-black text-slate-800 mb-2">배송 요청사항 (선택)</label>
                <input
                  type="text"
                  value={form.memo}
                  onChange={e => setForm({ ...form, memo: e.target.value })}
                  placeholder="예: 부재 시 경비실에 맡겨주세요"
                  className="w-full px-4 py-4 border-2 border-slate-300 rounded-xl text-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-base font-bold text-amber-900 leading-relaxed">
                신청하시면 <span className="text-rose-700">{target.pointCost.toLocaleString()}마당P가 차감</span>됩니다.
                자동 발송이 아니라 운영팀이 확인 후 순차적으로 보내드립니다.
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setTarget(null)}
                  className="flex-1 py-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-lg cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-[2] py-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-lg shadow disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? '신청 중...' : '교환 신청하기'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 교환신청 완료 안내창 ── */}
      {done && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setDone(null)}>
          <div className="bg-white rounded-3xl max-w-md w-full p-7 text-center" onClick={e => e.stopPropagation()}>
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <Gift className="w-10 h-10 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-700 mb-3">교환신청이 완료되었습니다</p>
            <div className="bg-slate-50 rounded-2xl p-4 mb-5 text-lg font-bold text-slate-700">
              <p className="text-slate-900">{done.itemName}</p>
              <p className="text-rose-600 mt-1">-{done.pointCost.toLocaleString()}마당P 차감</p>
              <p className="text-emerald-700 mt-1">남은 마당P {myPoints.toLocaleString()}P</p>
            </div>
            <p className="text-base sm:text-lg text-slate-600 font-medium mb-5 leading-relaxed">
              운영팀이 확인 후 순차적으로 보내드립니다.<br />감사합니다!
            </p>
            <button
              onClick={() => setDone(null)}
              className="w-full py-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-lg cursor-pointer"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
