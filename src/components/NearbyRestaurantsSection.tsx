import React, { useState, useMemo } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { RestaurantPost } from '../types';
import { UtensilsCrossed, PlusCircle, X, MapPin, Clock, PhoneCall, Trash2, Search, ChevronRight } from 'lucide-react';
import { InlineAdBanner } from './InlineAdBanner';

export const NearbyRestaurantsSection: React.FC = () => {
  const { restaurants, addRestaurant, deleteRestaurant, isMyRestaurant, isAdmin, ads } = useParkGolf();
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<RestaurantPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    courseName: '',
    region: '',
    restaurantName: '',
    menu: '',
    address: '',
    phoneNumber: '',
    businessHours: '',
    description: '',
    authorName: ''
  });

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return restaurants;
    const q = searchQuery.trim().toLowerCase();
    return restaurants.filter(
      r =>
        r.restaurantName.toLowerCase().includes(q) ||
        r.courseName.toLowerCase().includes(q) ||
        r.region.toLowerCase().includes(q) ||
        r.menu.toLowerCase().includes(q)
    );
  }, [restaurants, searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.courseName.trim() || !form.restaurantName.trim() || !form.authorName.trim()) {
      alert('구장명, 맛집명, 작성자 닉네임은 필수입니다.');
      return;
    }
    setIsSubmitting(true);
    const success = await addRestaurant({
      ...form,
      region: form.region.trim() || form.courseName,
      address: form.address.trim() || '확인 필요',
      phoneNumber: form.phoneNumber.trim() || '확인 필요',
      businessHours: form.businessHours.trim() || '확인 필요',
      menu: form.menu.trim() || '정보 없음',
      description: form.description.trim() || ''
    });
    setIsSubmitting(false);
    if (success) {
      setForm({
        courseName: '', region: '', restaurantName: '', menu: '',
        address: '', phoneNumber: '', businessHours: '', description: '', authorName: ''
      });
      setShowForm(false);
    }
  };

  return (
    <section id="section-restaurants" className="scroll-mt-28 py-10 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-4 border-b border-orange-200 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-xs sm:text-sm font-extrabold mb-2 border border-orange-300 shadow-2xs">
            <UtensilsCrossed className="w-4 h-4 text-orange-700" />
            <span>🍚 라운딩 후 든든한 한 끼, 동호인 추천 맛집</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            구장 근처 맛집 <span className="text-orange-600">({restaurants.length}곳)</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 mt-1 font-medium leading-relaxed">
            사전 조사한 정보로 시작했고, 이제는 누구나 직접 다녀온 맛집을 자유롭게 남길 수 있는 게시판입니다.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow transition-all shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>맛집 글쓰기</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="구장명, 맛집명, 지역, 메뉴로 검색..."
          className="w-full pl-9 pr-4 py-3 bg-white border border-slate-300/90 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 shadow-2xs"
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
          <UtensilsCrossed className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="font-bold">검색 결과가 없습니다.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-2xs">
          {filtered.map((r, idx) => (
            <React.Fragment key={r.id}>
            <button
              onClick={() => setSelected(r)}
              className="w-full text-left px-4 sm:px-5 py-4 flex items-center justify-between gap-3 hover:bg-orange-50/60 transition-colors cursor-pointer"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-emerald-700 mb-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{r.courseName} · {r.region}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base sm:text-lg font-extrabold text-slate-900">{r.restaurantName}</span>
                  <span className="text-xs sm:text-sm text-orange-700 font-bold bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-200">
                    {r.menu}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-1">{r.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 shrink-0" />
            </button>

            {/* 10곳마다 업체 광고 배너 1개 (활성 광고가 있을 때만) */}
            {(idx + 1) % 10 === 0 && ads.filter(a => a.isActive).length > 0 && (
              <div className="p-3 bg-slate-50/50">
                <InlineAdBanner
                  ad={ads.filter(a => a.isActive)[Math.floor(idx / 10) % ads.filter(a => a.isActive).length]}
                />
              </div>
            )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <MapPin className="w-3.5 h-3.5" />
                <span>{selected.courseName} · {selected.region}</span>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">{selected.restaurantName}</h3>
            <span className="inline-block text-sm font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200 mb-4">
              {selected.menu}
            </span>

            <div className="space-y-2.5 bg-slate-50 rounded-xl p-4 border border-slate-200 mb-4">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-slate-800 font-medium">{selected.address}</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-slate-800 font-medium">{selected.businessHours}</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <PhoneCall className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                {selected.phoneNumber && selected.phoneNumber !== '확인 필요' ? (
                  <a href={`tel:${selected.phoneNumber}`} className="text-blue-700 font-bold underline">
                    {selected.phoneNumber}
                  </a>
                ) : (
                  <span className="text-slate-500 font-medium">확인 필요</span>
                )}
              </div>
            </div>

            {selected.description && (
              <p className="text-sm text-slate-700 leading-relaxed mb-4">{selected.description}</p>
            )}

            <p className="text-xs text-slate-400 mb-4">작성자: {selected.authorName} · {selected.createdAt}</p>

            {(isAdmin || isMyRestaurant(selected.id)) && (
              <button
                onClick={() => {
                  deleteRestaurant(selected.id);
                  setSelected(null);
                }}
                className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-sm border border-rose-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>이 글 삭제하기</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Write Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold text-slate-900">맛집 글쓰기</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">구장명 *</label>
                <input
                  type="text"
                  value={form.courseName}
                  onChange={e => setForm({ ...form, courseName: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  placeholder="예: 여의도한강 파크골프장"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">지역 (선택)</label>
                <input
                  type="text"
                  value={form.region}
                  onChange={e => setForm({ ...form, region: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  placeholder="예: 서울 영등포구"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">맛집명 *</label>
                <input
                  type="text"
                  value={form.restaurantName}
                  onChange={e => setForm({ ...form, restaurantName: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">대표 메뉴 (선택)</label>
                <input
                  type="text"
                  value={form.menu}
                  onChange={e => setForm({ ...form, menu: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">가게 주소 (선택)</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">영업시간 (선택)</label>
                  <input
                    type="text"
                    value={form.businessHours}
                    onChange={e => setForm({ ...form, businessHours: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                    placeholder="예: 매일 10:00~21:00"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">전화번호 (선택)</label>
                  <input
                    type="text"
                    value={form.phoneNumber}
                    onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">한 줄 후기 (선택)</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">작성자 닉네임 *</label>
                <input
                  type="text"
                  value={form.authorName}
                  onChange={e => setForm({ ...form, authorName: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm shadow transition-all disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? '등록 중...' : '등록하기'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
