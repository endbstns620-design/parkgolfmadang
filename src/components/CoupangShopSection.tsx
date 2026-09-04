import React, { useState } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { CoupangProduct } from '../types';
import { ShoppingBag, PlusCircle, Trash2, X } from 'lucide-react';

const CATEGORY_OPTIONS: CoupangProduct['category'][] = ['전체', '클럽', '공인구', '가방·파우치', '장갑·잡화', '의류·신발', '기타'];

export const CoupangShopSection: React.FC = () => {
  const { coupangProducts, isAdmin, addCoupangProduct, deleteCoupangProduct, openModal } = useParkGolf();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rawInput, setRawInput] = useState('');
  const [category, setCategory] = useState<CoupangProduct['category']>('클럽');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawInput.trim()) {
      alert('쿠팡파트너스 링크(또는 iframe 코드)를 붙여넣어주세요.');
      return;
    }
    setIsSubmitting(true);
    const success = await addCoupangProduct({ rawInput, category });
    setIsSubmitting(false);
    if (success) {
      setRawInput('');
      setShowForm(false);
    }
  };

  return (
    <section id="section-coupang-shop" className="scroll-mt-28 py-10 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-4 border-b border-red-200 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-900 text-xs sm:text-sm font-extrabold mb-2 border border-red-300 shadow-2xs">
            <ShoppingBag className="w-4 h-4 text-red-700" />
            <span>🛒 파크골프 용품 추천 스토어</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            추천 상품
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 mt-1 font-medium leading-relaxed">
            클럽 · 공인구 · 가방 등 파크골프 용품을 모아뒀습니다. 상품을 누르면 쿠팡으로 이동합니다.
          </p>
        </div>

        {isAdmin ? (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow transition-all shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>상품 등록 (관리자)</span>
          </button>
        ) : (
          <button
            onClick={() => openModal('admin')}
            className="text-xs text-slate-400 hover:text-slate-600 underline shrink-0 cursor-pointer"
          >
            관리자 로그인
          </button>
        )}
      </div>

      {/* Coupang Partners 고지 (필수 표시 문구) */}
      <div className="mb-6 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-900 font-medium flex items-start gap-2">
        <span>📢</span>
        <span>이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</span>
      </div>

      {/* Product Grid: 쿠팡이 제공하는 위젯(iframe)을 그대로 심어서, 이미지·이름·가격·구매버튼까지
          전부 쿠팡 서버가 렌더링합니다 — 우리 쪽에서 상품 정보를 따로 저장하지 않습니다. */}
      {coupangProducts.length === 0 ? (
        <div className="py-16 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
          <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="font-bold">아직 등록된 상품이 없습니다.</p>
          {isAdmin && <p className="text-sm mt-1">우측 상단 "상품 등록" 버튼으로 쿠팡파트너스 링크를 추가해보세요.</p>}
        </div>
      ) : (
        <div className="flex flex-wrap gap-3 sm:gap-4 justify-center sm:justify-start">
          {coupangProducts.map(product => (
            <div key={product.id} className="relative group">
              {isAdmin && (
                <button
                  onClick={() => deleteCoupangProduct(product.id)}
                  className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full bg-white shadow border border-slate-200 hover:bg-rose-600 hover:text-white text-slate-500 flex items-center justify-center cursor-pointer transition-colors opacity-0 group-hover:opacity-100"
                  title="상품 삭제"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <iframe
                src={product.embedUrl}
                width={product.embedWidth}
                height={product.embedHeight}
                frameBorder="0"
                scrolling="no"
                referrerPolicy="unsafe-url"
                title={`coupang-product-${product.id}`}
                className="rounded-lg border border-slate-200 shadow-2xs"
              />
            </div>
          ))}
        </div>
      )}

      {/* Admin: 링크 등록 폼 — 링크(또는 iframe 코드) 하나만 붙여넣으면 끝 */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold text-slate-900">쿠팡파트너스 상품 등록</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">
                  쿠팡파트너스 링크 (또는 iframe 코드) *
                </label>
                <textarea
                  value={rawInput}
                  onChange={e => setRawInput(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 font-mono"
                  rows={4}
                  placeholder={'https://coupa.ng/xxxxxx\n\n또는\n\n<iframe src="https://coupa.ng/xxxxxx" width="120" height="240" ...></iframe>'}
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  쿠팡파트너스 사이트에서 "링크 생성"으로 만드신 단축 URL이나, "이미지+텍스트"에서 복사한 HTML 코드를 그대로 붙여넣으시면 됩니다.
                  상품명·이미지는 따로 입력하지 않으셔도 쿠팡이 자동으로 보여줍니다.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">카테고리 (분류용, 선택)</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as CoupangProduct['category'])}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30"
                >
                  {CATEGORY_OPTIONS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm shadow transition-all disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? '등록 중...' : '상품 등록하기'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
