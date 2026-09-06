import React, { useState, useMemo, useEffect } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { RegionCategory, ParkCourse } from '../types';
import { extractDistrictName } from '../utils/courseDetailsHelper';
import {
  X,
  Star,
  MessageSquarePlus,
  Search,
  MapPin,
  ChevronDown,
  CalendarCheck,
  PhoneCall,
  CheckCircle2,
  Car,
  RotateCcw,
  Sparkles
} from 'lucide-react';

const REGION_SELECT_OPTIONS: { label: string; value: RegionCategory }[] = [
  { label: '전체 지역', value: '전체' },
  { label: '서울/경기/인천', value: '서울/경기/인천' },
  { label: '강원', value: '강원' },
  { label: '충청/대전/세종', value: '충청/대전/세종' },
  { label: '전라/광주', value: '전라/광주' },
  { label: '경상/대구/부산/울산', value: '경상/대구/부산/울산' },
  { label: '제주', value: '제주' }
];

const HOLES_SELECT_OPTIONS: { label: string; value: number | 'all' }[] = [
  { label: '전체 홀수', value: 'all' },
  { label: '9홀', value: 9 },
  { label: '18홀', value: 18 },
  { label: '27홀', value: 27 },
  { label: '36홀', value: 36 },
  { label: '54홀 이상', value: 54 }
];

export const ReviewWriteModal: React.FC = () => {
  const { activeModal, closeModal, addReview, courses, currentUser, openModal } = useParkGolf();

  // Course selector state (same mechanism as Course Search)
  const [selectedRegion, setSelectedRegion] = useState<RegionCategory>('전체');
  const [selectedSubRegion, setSelectedSubRegion] = useState<string>('전체');
  const [selectedHoles, setSelectedHoles] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  // Review form fields
  const [authorName, setAuthorName] = useState('');
  const [ageGroup, setAgeGroup] = useState('60대');
  const [rating, setRating] = useState(5);
  const [grassScore, setGrassScore] = useState(5);
  const [facilityScore, setFacilityScore] = useState(5);
  const [parkingScore, setParkingScore] = useState(5);
  const [visitDate, setVisitDate] = useState(new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Synchronize initial course if modal was opened with target course data
  useEffect(() => {
    if (activeModal?.type === 'newReview') {
      const initialCourseId = activeModal?.data?.courseId || activeModal?.data?.id;
      if (initialCourseId) {
        setSelectedCourseId(initialCourseId);
        const targetCourse = courses.find(c => c.id === initialCourseId);
        if (targetCourse) {
          setSelectedRegion(targetCourse.region);
        }
      } else if (courses.length > 0 && !selectedCourseId) {
        setSelectedCourseId(courses[0].id);
      }
    }
  }, [activeModal, courses]);

  // Extract distinct sub-regions (districts) for selected region
  const availableSubRegions = useMemo(() => {
    const regionCourses = selectedRegion === '전체' 
      ? courses 
      : courses.filter(c => c.region === selectedRegion);

    const set = new Set<string>();
    regionCourses.forEach(c => {
      const d = extractDistrictName(c.subRegion);
      if (d) set.add(d);
    });

    return ['전체', ...Array.from(set).sort((a, b) => a.localeCompare(b, 'ko'))];
  }, [courses, selectedRegion]);

  // Filtered courses based on region, district, holes, and keyword
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      if (selectedRegion !== '전체' && course.region !== selectedRegion) return false;
      if (selectedSubRegion !== '전체' && !course.subRegion.includes(selectedSubRegion)) return false;
      if (selectedHoles !== 'all' && course.holes !== selectedHoles) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = course.name.toLowerCase().includes(query);
        const matchesAddress = course.address.toLowerCase().includes(query);
        const matchesSubRegion = course.subRegion.toLowerCase().includes(query);
        if (!matchesName && !matchesAddress && !matchesSubRegion) return false;
      }
      return true;
    });
  }, [courses, selectedRegion, selectedSubRegion, selectedHoles, searchQuery]);

  // Currently selected course object
  const selectedCourse = useMemo(() => {
    return courses.find(c => c.id === selectedCourseId) || filteredCourses[0] || courses[0];
  }, [courses, selectedCourseId, filteredCourses]);

  if (!activeModal || activeModal.type !== 'newReview') {
    return null;
  }

  // 비회원은 리뷰를 쓸 수 없습니다 — 로그인 안내로 대체합니다.
  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={closeModal}>
        <div className="bg-white rounded-3xl max-w-sm w-full p-7 text-center" onClick={e => e.stopPropagation()}>
          <p className="text-lg font-extrabold text-slate-900 mb-2">로그인이 필요합니다</p>
          <p className="text-sm text-slate-500 mb-5">구장 리뷰는 회원만 작성할 수 있습니다.</p>
          <button
            onClick={() => {
              closeModal();
              openModal('auth');
            }}
            className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm cursor-pointer"
          >
            로그인 / 회원가입
          </button>
        </div>
      </div>
    );
  }

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const region = e.target.value as RegionCategory;
    setSelectedRegion(region);
    setSelectedSubRegion('전체');
  };

  const handleSubRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubRegion(e.target.value);
  };

  const handleHolesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedHoles(val === 'all' ? 'all' : Number(val));
  };

  const handleSelectCourse = (course: ParkCourse) => {
    setSelectedCourseId(course.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) {
      alert('방문하신 파크골프장을 선택해주세요.');
      return;
    }
    if (!title.trim() || !content.trim()) {
      alert('후기 제목과 본문 내용을 모두 입력해주세요.');
      return;
    }

    addReview({
      courseId: selectedCourse.id,
      courseName: selectedCourse.name,
      authorName: currentUser.nickname,
      ageGroup,
      rating: Number(rating),
      grassScore: Number(grassScore),
      facilityScore: Number(facilityScore),
      parkingScore: Number(parkingScore),
      visitDate,
      title: title.trim(),
      content: content.trim()
    });

    // 등록 안내는 마당P 지급예정 안내창(PointNoticeModal)이 대신 보여줍니다.
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col text-slate-800 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-amber-500 text-green-950 px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <MessageSquarePlus className="w-6 h-6 text-green-950" />
            <div>
              <h3 className="text-xl font-extrabold text-green-950">구장 솔직 방문 후기 작성</h3>
              <p className="text-xs text-green-950/80 font-bold">동호인 어르신들과 생생한 구장 정보를 나누세요</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-2 rounded-full hover:bg-amber-600 transition-colors cursor-pointer text-green-950"
            title="닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* =========================================================================
              🔥 [구장찾기와 100% 동일한 구장 선택 UI 섹션]
              ========================================================================= */}
          <div className="bg-amber-50/60 p-4 sm:p-5 rounded-2xl border border-amber-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>방문하신 파크골프장 선택 (구장찾기와 동일) *</span>
              </label>
              {(selectedRegion !== '전체' || selectedSubRegion !== '전체' || selectedHoles !== 'all' || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRegion('전체');
                    setSelectedSubRegion('전체');
                    setSelectedHoles('all');
                    setSearchQuery('');
                  }}
                  className="text-xs text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>조건 초기화</span>
                </button>
              )}
            </div>

            {/* Row 1: [ 전체 지역 ▾ ] [ 시·군·구 ▾ ] */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="relative">
                <select
                  value={selectedRegion}
                  onChange={handleRegionChange}
                  className="w-full appearance-none bg-white hover:bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 pr-9 text-slate-900 font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-2xs"
                >
                  {REGION_SELECT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              <div className="relative">
                <select
                  value={selectedSubRegion}
                  onChange={handleSubRegionChange}
                  className="w-full appearance-none bg-white hover:bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 pr-9 text-slate-900 font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-2xs"
                >
                  <option value="전체">시·군·구 (전체)</option>
                  {availableSubRegions
                    .filter(sub => sub !== '전체')
                    .map(sub => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Row 2: [ 전체 홀수 ▾ ] [ 구장 직접 검색 ] */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="relative sm:col-span-1">
                <select
                  value={selectedHoles}
                  onChange={handleHolesChange}
                  className="w-full appearance-none bg-white hover:bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 pr-9 text-slate-900 font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-2xs"
                >
                  {HOLES_SELECT_OPTIONS.map(opt => (
                    <option key={String(opt.value)} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              <div className="relative sm:col-span-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="구장명, 읍·면·동 직접 검색..."
                  className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Row 3: Filtered Course Dropdown Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                검색된 구장 목록 ({filteredCourses.length}개소 중 선택) :
              </label>
              {filteredCourses.length === 0 ? (
                <div className="p-3 bg-white rounded-xl border border-rose-200 text-rose-700 text-xs font-bold text-center">
                  검색 조건에 맞는 구장이 없습니다. 지역이나 검색어를 다시 확인해주세요.
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={selectedCourse?.id || ''}
                    onChange={e => setSelectedCourseId(e.target.value)}
                    className="w-full appearance-none bg-white hover:bg-slate-50 border-2 border-amber-400 rounded-xl px-4 py-3 pr-10 text-slate-900 font-extrabold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-xs"
                  >
                    {filteredCourses.map(c => (
                      <option key={c.id} value={c.id}>
                        [{c.region} · {c.subRegion}] {c.name} ({c.holes}홀 {c.isAssociationCertified ? '· 공인' : ''})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-amber-700">
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </div>
              )}
            </div>

            {/* Selected Course Confirmation Summary Box */}
            {selectedCourse && (
              <div className="bg-white p-3.5 rounded-xl border border-amber-300 text-xs space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-700 text-white font-black text-xs">
                      {selectedCourse.holes}홀
                    </span>
                    {selectedCourse.isAssociationCertified && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-400 text-green-950 font-black text-xs flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3 text-green-950" /> 공인
                      </span>
                    )}
                    <strong className="text-sm font-black text-slate-900">{selectedCourse.name}</strong>
                  </div>
                  <span className="text-blue-800 font-extrabold bg-blue-50 px-2 py-0.5 rounded">
                    {selectedCourse.reservationType}
                  </span>
                </div>
                <p className="text-slate-600 font-medium line-clamp-1">
                  📍 {selectedCourse.address}
                </p>
                <div className="flex items-center gap-3 text-slate-500 font-semibold pt-1 border-t border-slate-100 flex-wrap">
                  <span>💰 요금: {selectedCourse.feeLocal} (관외 {selectedCourse.feeVisitor})</span>
                  <span>•</span>
                  <span>📞 {selectedCourse.phoneNumber}</span>
                </div>
              </div>
            )}
          </div>

          {/* =========================================================================
              🔥 [작성자 정보 & 별점 평가 섹션]
              ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                작성자
              </label>
              <div className="w-full p-2.5 sm:p-3 rounded-xl border border-slate-200 bg-slate-50 font-bold text-sm text-slate-600">
                {currentUser.nickname}
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                연령대
              </label>
              <select
                value={ageGroup}
                onChange={e => setAgeGroup(e.target.value)}
                className="w-full p-2.5 sm:p-3 rounded-xl border border-slate-300 font-bold text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {['50대', '60대', '70대', '80대 이상'].map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                방문 일자 *
              </label>
              <input
                type="date"
                required
                value={visitDate}
                onChange={e => setVisitDate(e.target.value)}
                className="w-full p-2.5 sm:p-3 rounded-xl border border-slate-300 font-bold text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Rating Evaluation Breakdown */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <label className="text-xs sm:text-sm font-black text-slate-900">
                전체 종합 만족도 평점 : <strong className="text-amber-600 text-base">{rating}점</strong> / 5.0
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-0.5 text-2xl text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                  >
                    {star <= rating ? '★' : '☆'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-700">🌱 잔디 관리</span>
                <select
                  value={grassScore}
                  onChange={e => setGrassScore(Number(e.target.value))}
                  className="font-bold text-amber-600 bg-transparent border-0 focus:ring-0 cursor-pointer"
                >
                  <option value={5}>★ 5점 (최상)</option>
                  <option value={4}>★ 4점 (우수)</option>
                  <option value={3}>★ 3점 (보통)</option>
                  <option value={2}>★ 2점 (미흡)</option>
                  <option value={1}>★ 1점 (불량)</option>
                </select>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-700">🚻 부대·편의시설</span>
                <select
                  value={facilityScore}
                  onChange={e => setFacilityScore(Number(e.target.value))}
                  className="font-bold text-amber-600 bg-transparent border-0 focus:ring-0 cursor-pointer"
                >
                  <option value={5}>★ 5점 (최상)</option>
                  <option value={4}>★ 4점 (우수)</option>
                  <option value={3}>★ 3점 (보통)</option>
                  <option value={2}>★ 2점 (미흡)</option>
                  <option value={1}>★ 1점 (불량)</option>
                </select>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-700">🚗 주차 편의</span>
                <select
                  value={parkingScore}
                  onChange={e => setParkingScore(Number(e.target.value))}
                  className="font-bold text-amber-600 bg-transparent border-0 focus:ring-0 cursor-pointer"
                >
                  <option value={5}>★ 5점 (최상)</option>
                  <option value={4}>★ 4점 (우수)</option>
                  <option value={3}>★ 3점 (보통)</option>
                  <option value={2}>★ 2점 (미흡)</option>
                  <option value={1}>★ 1점 (불량)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
              후기 한 줄 제목 *
            </label>
            <input
              type="text"
              required
              placeholder="예: 잔디 관리가 매우 잘 되어 있고 주차가 편리해서 추천합니다!"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 font-bold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Content Input */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
              상세 방문 후기 소감 *
            </label>
            <textarea
              rows={4}
              required
              placeholder="잔디 상태, 디보트, 그늘 쉼터, 화장실 청결도, 주차 난이도, 조편성 대기 등 다른 동호인 어르신들에게 유익한 솔직한 라운딩 경험을 적어주세요."
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 font-medium text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-green-950 font-black text-base sm:text-lg shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <MessageSquarePlus className="w-5 h-5" />
            <span>방문 솔직 후기 등록 완료</span>
          </button>
        </form>
      </div>
    </div>
  );
};
