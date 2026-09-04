import React, { useState } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { CoupangProduct } from '../types';
import { ShoppingBag, PlusCircle, ExternalLink, Trash2, X, ImageOff } from 'lucide-react';

const CATEGORY_OPTIONS: CoupangProduct['category'][] = ['전체', '클럽', '공인구', '가방·파우치', '장갑·잡화', '의류·신발', '기타'];
const DELIVERY_OPTIONS: CoupangProduct['deliveryType'][] = ['로켓배송', '로켓와우', '무료배송', '일반배송'];

export const CoupangShopSection: React.FC = () => {
  const { coupangProducts, isAdmin, addCoupangProduct, deleteCoupangProduct, openModal } = useParkGolf();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: '클럽' as CoupangProduct['category'],
    price: '',
    deliveryType: '로켓배송' as CoupangProduct['deliveryType'],
    imageUrl: '',
    productUrl: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.imageUrl.trim() || !form.productUrl.trim()) {
      alert('상품명, 이미지 URL, 쿠팡파트너스 링크는 필수입니다.');
      return;
    }
    setIsSubmitting(true);
    const success = await addCoupangProduct(form);
    setIsSubmitting(false);
    if (success) {
      setForm({ title: '', category: '클럽', price: '', deliveryType: '로켓배송', imageUrl: '', productUrl: '', description: '' });
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

      {/* Product Grid: 화면에 최소 10개 이상 보이도록 반응형 그리드 구성 */}
      {coupangProducts.length === 0 ? (
        <div className="py-16 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
          <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="font-bold">아직 등록된 상품이 없습니다.</p>
          {isAdmin && <p className="text-sm mt-1">우측 상단 "상품 등록" 버튼으로 쿠팡파트너스 상품을 추가해보세요.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {coupangProducts.map(product => (
            <div
              key={product.id}
              className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg transition-shadow flex flex-col"
            >
              {isAdmin && (
                <button
                  onClick={() => deleteCoupangProduct(product.id)}
                  className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-rose-600 hover:text-white text-slate-500 flex items-center justify-center shadow cursor-pointer transition-colors"
                  title="상품 삭제"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              <a href={product.productUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col h-full">
                <div className="aspect-square bg-slate-100 overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={e => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageOff className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="p-2.5 sm:p-3 flex flex-col flex-1">
                  <span className="inline-block w-fit text-[10px] sm:text-xs font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded mb-1">
                    {product.category}
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2 flex-1">
                    {product.title}
                  </p>
                  {product.price && (
                    <p className="text-sm sm:text-base font-extrabold text-red-700 mt-1.5">{product.price}</p>
                  )}
                  <span className="mt-2 inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-slate-500 group-hover:text-red-700">
                    쿠팡에서 보기 <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Admin Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold text-slate-900">쿠팡파트너스 상품 등록</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">상품명 *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
                  placeholder="예: OO 파크골프 클럽 세트"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">카테고리</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value as CoupangProduct['category'] })}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30"
                  >
                    {CATEGORY_OPTIONS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">배송 유형</label>
                  <select
                    value={form.deliveryType}
                    onChange={e => setForm({ ...form, deliveryType: e.target.value as CoupangProduct['deliveryType'] })}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30"
                  >
                    {DELIVERY_OPTIONS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">가격 (선택)</label>
                <input
                  type="text"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30"
                  placeholder="예: 39,900원"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">상품 이미지 URL *</label>
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30"
                  placeholder="쿠팡 상품 상세페이지에서 이미지 주소 복사"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">쿠팡파트너스 링크 *</label>
                <input
                  type="text"
                  value={form.productUrl}
                  onChange={e => setForm({ ...form, productUrl: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30"
                  placeholder="쿠팡파트너스에서 발급받은 상품 링크(URL)"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">설명 (선택)</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30"
                  rows={2}
                />
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
