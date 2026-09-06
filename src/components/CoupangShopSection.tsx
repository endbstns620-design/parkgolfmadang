import React, { useState, useMemo } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { CoupangProduct } from '../types';
import { ShoppingBag, Trash2 } from 'lucide-react';

const CATEGORY_OPTIONS: CoupangProduct['category'][] = ['전체', '클럽', '공인구', '가방·파우치', '장갑·잡화', '의류·신발', '기타'];

export const CoupangShopSection: React.FC = () => {
  const { coupangProducts, isAdmin, deleteCoupangProduct } = useParkGolf();
  const [selectedCategory, setSelectedCategory] = useState<CoupangProduct['category']>('전체');

  // 실제로 등록된 상품이 있는 카테고리만 골라보기 목록에 보여줍니다.
  const availableCategories = useMemo(() => {
    const used = new Set(coupangProducts.map(p => p.category));
    return CATEGORY_OPTIONS.filter(c => c === '전체' || used.has(c));
  }, [coupangProducts]);

  const visibleProducts = useMemo(
    () => (selectedCategory === '전체' ? coupangProducts : coupangProducts.filter(p => p.category === selectedCategory)),
    [coupangProducts, selectedCategory]
  );

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
            쿠팡추천상품
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 mt-1 font-medium leading-relaxed">
            클럽 · 공인구 · 가방 등 파크골프 용품을 모아뒀습니다. 상품을 누르면 쿠팡으로 이동합니다.
          </p>
        </div>

        {/* 카테고리 골라보기 — 어르신도 쉽게 고르실 수 있게 글씨를 크게 했습니다 */}
        <div className="shrink-0">
          <label htmlFor="coupang-category-select" className="block text-sm font-extrabold text-slate-700 mb-1.5">
            어떤 용품을 찾으세요?
          </label>
          <select
            id="coupang-category-select"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value as CoupangProduct['category'])}
            className="w-full md:w-56 px-4 py-3 rounded-xl border-2 border-red-300 bg-white text-base sm:text-lg font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/30 cursor-pointer"
          >
            {availableCategories.map(c => (
              <option key={c} value={c}>
                {c === '전체' ? '전체 보기' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Coupang Partners 고지 (필수 표시 문구) */}
      <div className="mb-6 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-900 font-medium flex items-start gap-2">
        <span>📢</span>
        <span>이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</span>
      </div>

      {/* Product Grid: 쿠팡이 제공하는 위젯(iframe)을 그대로 심어서, 이미지·이름·가격·구매버튼까지
          전부 쿠팡 서버가 렌더링합니다 — 우리 쪽에서 상품 정보를 따로 저장하지 않습니다.
          상품 등록은 관리자 모드 > "제휴광고" 탭에서 합니다. */}
      {visibleProducts.length === 0 ? (
        <div className="py-16 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
          <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="font-bold">
            {coupangProducts.length === 0
              ? '아직 등록된 상품이 없습니다.'
              : `'${selectedCategory}' 분류에 등록된 상품이 없습니다.`}
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3 sm:gap-4 justify-center sm:justify-start">
          {visibleProducts.map(product => (
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
    </section>
  );
};
