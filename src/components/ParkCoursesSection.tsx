import React, { useState, useMemo, useEffect } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { ParkCourse, RegionCategory } from '../types';
import { CourseMapView } from './CourseMapView';
import { InlineAdBanner } from './InlineAdBanner';
import {
  getCourseStructure,
  getCourseSummaryText,
  getDiscountPolicy,
  getRentalFeeInfo,
  checkIsFreeCourse,
  extractDistrictName
} from '../utils/courseDetailsHelper';
import {
  getCourseCoords,
  calculateHaversineDistance,
  formatDistance
} from '../utils/geoCoordinatesHelper';
import {
  MapPin,
  Car,
  CalendarCheck,
  PhoneCall,
  ExternalLink,
  ShieldCheck,
  Star,
  PlusCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Info,
  HelpCircle,
  Search,
  RotateCcw,
  Navigation,
  Sparkles,
  LayoutGrid,
  List,
  Award,
  Layers,
  Flag,
  Share2,
  ChevronDown,
  Loader2,
  SlidersHorizontal,
  Compass
} from 'lucide-react';

type SortOption = 'recommended' | 'distanceAsc' | 'holesDesc' | 'ratingDesc' | 'reviewCount' | 'nameAsc';
type DisplayTab = 'list' | 'map';
type FeeFilter = 'all' | 'free' | 'paid';

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

export const ParkCoursesSection: React.FC = () => {
  const {
    courses,
    selectedRegion,
    setSelectedRegion,
    filterHoles,
    setFilterHoles,
    filterReservation,
    setFilterReservation,
    filterParkingOnly,
    setFilterParkingOnly,
    searchQuery,
    setSearchQuery,
    openModal,
    isAdmin,
    ads
  } = useParkGolf();

  // Local state
  const [selectedSubRegion, setSelectedSubRegion] = useState<string>('전체');
  const [displayTab, setDisplayTab] = useState<DisplayTab>('list');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);

  // Additional detail filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [certifiedOnly, setCertifiedOnly] = useState<boolean>(false);
  const [feeFilter, setFeeFilter] = useState<FeeFilter>('all');
  const [rentalOnly, setRentalOnly] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<SortOption>('recommended');

  // Extract distinct sub-regions (districts) based on current region
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

  // Handle region dropdown change
  const handleRegionDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(e.target.value as RegionCategory);
    setSelectedSubRegion('전체');
  };

  // Handle district dropdown change
  const handleSubRegionDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubRegion(e.target.value);
  };

  // Handle holes dropdown change
  const handleHolesDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'all') {
      setFilterHoles('all');
    } else {
      setFilterHoles(Number(val) as any);
    }
  };

  // Near me geolocation handler
  const handleNearMeClick = () => {
    if (!navigator.geolocation) {
      alert('접속하신 브라우저 환경에서 위치 서비스가 지원되지 않습니다.');
      return;
    }

    setIsLocating(true);
    setLocationNotice('현재 위치를 확인하고 있습니다...');

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setSortOption('distanceAsc');
        setIsLocating(false);
        setLocationNotice('📍 내 현재 위치 기준 거리순으로 정렬되었습니다.');
      },
      error => {
        console.warn('Geolocation error:', error);
        setIsLocating(false);
        // Fallback: Default to central area coordinates
        const fallback = { lat: 37.5665, lng: 126.9780 };
        setUserLocation(fallback);
        setSortOption('distanceAsc');
        setLocationNotice('📍 위치 권한을 확인하지 못해 수도권 중심 기준으로 거리순 정렬되었습니다. 브라우저 위치 권한을 허용하시면 정확한 내 위치가 반영됩니다.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Filter Courses Logic
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      // 1. Region
      if (selectedRegion !== '전체' && course.region !== selectedRegion) {
        return false;
      }

      // 2. Sub-region (District)
      if (selectedSubRegion !== '전체') {
        const d = extractDistrictName(course.subRegion);
        if (d !== selectedSubRegion && !course.subRegion.includes(selectedSubRegion)) {
          return false;
        }
      }

      // 3. Holes
      if (filterHoles !== 'all') {
        if (filterHoles === 54 && course.holes < 54) return false;
        if (filterHoles !== 54 && course.holes !== filterHoles) return false;
      }

      // 4. Reservation type
      if (filterReservation !== 'all') {
        if (filterReservation === '선착순' && !['선착순', '현장접수'].includes(course.reservationType)) return false;
        if (filterReservation !== '선착순' && course.reservationType !== filterReservation) return false;
      }

      // 5. Association Certified
      if (certifiedOnly && !course.isAssociationCertified) {
        return false;
      }

      // 6. Fee Filter (Free vs Paid)
      if (feeFilter === 'free' && !checkIsFreeCourse(course)) {
        return false;
      }
      if (feeFilter === 'paid' && checkIsFreeCourse(course)) {
        return false;
      }

      // 7. Parking
      if (filterParkingOnly && !course.parkingAvailable) {
        return false;
      }

      // 8. Rental equipment
      if (rentalOnly) {
        const hasRental = course.amenities.some(a => a.includes('대여') || a.includes('장비') || a.includes('클럽'));
        if (!hasRental && !course.rentalFee) return false;
      }

      // 9. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = course.name.toLowerCase().includes(q);
        const matchAddress = course.address.toLowerCase().includes(q);
        const matchRegion = course.subRegion.toLowerCase().includes(q);
        const matchDesc = course.description.toLowerCase().includes(q);
        const matchAgency = (course.governmentAgency || course.operatedBy).toLowerCase().includes(q);
        const matchAmenities = course.amenities.some(a => a.toLowerCase().includes(q));

        if (!matchName && !matchAddress && !matchRegion && !matchDesc && !matchAgency && !matchAmenities) {
          return false;
        }
      }

      return true;
    });
  }, [
    courses,
    selectedRegion,
    selectedSubRegion,
    filterHoles,
    filterReservation,
    certifiedOnly,
    feeFilter,
    filterParkingOnly,
    rentalOnly,
    searchQuery
  ]);

  // Attach coordinates & distance to each filtered course
  const coursesWithCoordsAndDistance = useMemo(() => {
    return filteredCourses.map(course => {
      const coords = getCourseCoords(course);
      if (userLocation) {
        const dist = calculateHaversineDistance(
          userLocation.lat,
          userLocation.lng,
          coords.lat,
          coords.lng
        );
        return { ...course, lat: coords.lat, lng: coords.lng, distanceKm: dist };
      }
      return { ...course, lat: coords.lat, lng: coords.lng };
    });
  }, [filteredCourses, userLocation]);

  // Sort Courses Logic
  const sortedCourses = useMemo(() => {
    const list = [...coursesWithCoordsAndDistance];
    switch (sortOption) {
      case 'distanceAsc':
        return list.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
      case 'holesDesc':
        return list.sort((a, b) => b.holes - a.holes);
      case 'ratingDesc':
        return list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      case 'reviewCount':
        return list.sort((a, b) => b.reviewCount - a.reviewCount);
      case 'nameAsc':
        return list.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
      case 'recommended':
      default:
        return list.sort((a, b) => {
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          if (a.isAssociationCertified && !b.isAssociationCertified) return -1;
          if (!a.isAssociationCertified && b.isAssociationCertified) return 1;
          return b.rating - a.rating;
        });
    }
  }, [coursesWithCoordsAndDistance, sortOption]);

  const resetAllFilters = () => {
    setSelectedRegion('전체');
    setSelectedSubRegion('전체');
    setFilterHoles('all');
    setFilterReservation('all');
    setCertifiedOnly(false);
    setFeeFilter('all');
    setFilterParkingOnly(false);
    setRentalOnly(false);
    setSearchQuery('');
    setSortOption('recommended');
    setUserLocation(null);
    setLocationNotice(null);
  };

  const hasActiveFilters =
    selectedRegion !== '전체' ||
    selectedSubRegion !== '전체' ||
    filterHoles !== 'all' ||
    filterReservation !== 'all' ||
    certifiedOnly ||
    feeFilter !== 'all' ||
    filterParkingOnly ||
    rentalOnly ||
    searchQuery.trim().length > 0;

  return (
    <section id="section-courses" className="scroll-mt-28 py-8 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-4 border-b border-green-200 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-900 text-xs sm:text-sm font-extrabold mb-2 border border-green-300">
            <span>⛳ 우리동네 파크골프장 맞춤 찾기 & 전국 구장 정보</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            전국 파크골프장 구장 찾기
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 mt-1 font-medium leading-relaxed">
            시·도 및 시·군·구별 구장, 홀 수(9~72홀), 공인구장 여부까지 전국 642곳 한눈에 검색 — 예약방식·잔디·주차 정보는 확인되는 대로 계속 채워가고 있습니다
          </p>
        </div>

        {/* Action button & Total stats */}
        <div className="flex items-center gap-2 flex-wrap">
          {isAdmin && (
            <button
              id="admin-add-course-btn"
              onClick={() => openModal('admin')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-white font-bold text-sm shadow transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>새 구장 등록</span>
            </button>
          )}
          <div className="flex items-center gap-1.5 text-sm sm:text-base font-extrabold text-green-900 bg-green-50 px-4 py-2 rounded-2xl border border-green-200 shadow-xs">
            <span>검색 결과 :</span>
            <strong className="text-emerald-700 text-lg sm:text-xl">{sortedCourses.length}</strong>
            <span className="text-slate-500 text-xs font-normal">/ 전체 {courses.length}개소</span>
          </div>
        </div>
      </div>

      {/* Public Data & Operation Policy Disclaimer Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-amber-50/90 border border-amber-200 flex items-start gap-3 text-amber-950 shadow-sm">
        <div className="p-1.5 rounded-xl bg-amber-200/80 text-amber-900 shrink-0 mt-0.5">
          <Info className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm leading-relaxed">
          <p className="font-extrabold text-amber-900 text-sm sm:text-base mb-0.5 flex items-center gap-1.5">
            <span>실시간 구장 이용 및 지자체 운영 안내</span>
          </p>
          <p className="text-amber-800">
            본 구장 정보는 공공데이터 및 지자체 공개자료를 기반으로 제공됩니다. 각 지자체의 조례 개정이나 시설 점검으로 인해 운영 방식(예약제, 휴장일, 이용요금 등)이 변경될 수 있으므로, <strong className="text-red-600 font-extrabold">방문 전 해당 지자체 담당 부서나 구장 관리사무소로 문의하시기 바랍니다.</strong>
          </p>
          <p className="text-amber-800 mt-1.5 flex items-center gap-3 flex-wrap">
            <span className="font-bold">정보 신뢰도 표시:</span>
            <span className="inline-flex items-center gap-1"><span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-green-950">공인구장</span> 협회·연맹 복수 출처 일치</span>
            <span className="inline-flex items-center gap-1"><span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800">🔍 확인중</span> 단일 출처, 추가 확인 필요</span>
            <span className="inline-flex items-center gap-1"><span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-600">⚠️ 출처 미확인</span> 세부사항 미확인 참고정보</span>
          </p>
        </div>
      </div>

      {/* =========================================================================
          🔥 [구장검색 3단 UI - 사용자 요청 이미지 100% 동일 구현]
          1행: [ 전체 지역 ▾ ] [ 시·군·구 ▾ ]
          2행: [ 전체 홀수 ▾ ] [ 목록 ] [ 지도 ]
          3행: [ 📍 내 위치에서 가까운 순으로 ]
          ========================================================================= */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-md mb-6 space-y-3">
        
        {/* Row 1: [ 전체 지역 ▾ ] [ 시·군·구 ▾ ] */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Dropdown 1: 전체 지역 */}
          <div className="relative">
            <select
              id="select-course-region"
              value={selectedRegion}
              onChange={handleRegionDropdownChange}
              className="w-full appearance-none bg-white hover:bg-slate-50 border border-slate-300/90 hover:border-slate-400 rounded-xl px-4 py-3.5 pr-10 text-slate-900 font-bold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all cursor-pointer shadow-2xs"
            >
              {REGION_SELECT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* Dropdown 2: 시·군·구 */}
          <div className="relative">
            <select
              id="select-course-district"
              value={selectedSubRegion}
              onChange={handleSubRegionDropdownChange}
              className="w-full appearance-none bg-white hover:bg-slate-50 border border-slate-300/90 hover:border-slate-400 rounded-xl px-4 py-3.5 pr-10 text-slate-900 font-bold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all cursor-pointer shadow-2xs"
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
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Row 2: [ 전체 홀수 ▾ ]  [ 목록 ] [ 지도 ] */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
          {/* Dropdown 3: 전체 홀수 */}
          <div className="relative">
            <select
              id="select-course-holes"
              value={filterHoles}
              onChange={handleHolesDropdownChange}
              className="w-full appearance-none bg-white hover:bg-slate-50 border border-slate-300/90 hover:border-slate-400 rounded-xl px-4 py-3.5 pr-10 text-slate-900 font-bold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all cursor-pointer shadow-2xs"
            >
              {HOLES_SELECT_OPTIONS.map(opt => (
                <option key={String(opt.value)} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* Search Bar & Advanced Filters Toggle (목록/지도 전환 버튼 자리를 대체) */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            {/* Keyword Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="구장명, 주소, 시설명 직접 검색..."
                className="w-full pl-9 pr-8 py-3.5 bg-white hover:bg-slate-50 focus:bg-white rounded-xl border border-slate-300/90 hover:border-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Toggle Advanced Filters Button */}
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`px-3 py-3.5 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer border ${
                  showAdvancedFilters
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>상세 필터 {showAdvancedFilters ? '접기' : '더보기'}</span>
              </button>

              {/* Reset All Filters Button */}
              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="px-3 py-3.5 sm:py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>초기화</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Geolocation Feedback Message */}
        {locationNotice && (
          <div className="p-3 bg-emerald-50 text-emerald-900 text-xs sm:text-sm font-medium rounded-xl border border-emerald-200 flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-1.5">
              <span>{locationNotice}</span>
            </div>
            <button
              onClick={() => setLocationNotice(null)}
              className="text-emerald-700 hover:text-emerald-950 font-bold text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Collapsible Advanced Filters Panel (Fee, Certified, Reservation, Parking, Rental) */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-slate-100 space-y-3 text-xs sm:text-sm animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Fee filter */}
              <div className="space-y-1">
                <span className="font-bold text-slate-700">이용 요금:</span>
                <div className="flex items-center gap-1">
                  {[
                    { label: '전체', value: 'all' },
                    { label: '무료 구장', value: 'free' },
                    { label: '유료 구장', value: 'paid' }
                  ].map(f => (
                    <button
                      key={f.label}
                      onClick={() => setFeeFilter(f.value as FeeFilter)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        feeFilter === f.value
                          ? 'bg-emerald-700 text-white font-black'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reservation type filter */}
              <div className="space-y-1">
                <span className="font-bold text-slate-700">예약 방식:</span>
                <div className="flex items-center gap-1">
                  {[
                    { label: '전체', value: 'all' },
                    { label: '온라인', value: '온라인예약' },
                    { label: '전화', value: '전화예약' },
                    { label: '선착순', value: '선착순' }
                  ].map(res => (
                    <button
                      key={res.label}
                      onClick={() => setFilterReservation(res.value)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        filterReservation === res.value
                          ? 'bg-blue-600 text-white font-black'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {res.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Badges Toggle */}
              <div className="space-y-1">
                <span className="font-bold text-slate-700">특수 조건:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setCertifiedOnly(!certifiedOnly)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all border ${
                      certifiedOnly
                        ? 'bg-amber-400 text-green-950 font-black border-amber-500'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    🏆 공인구장만
                  </button>
                  <button
                    onClick={() => setFilterParkingOnly(!filterParkingOnly)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all border ${
                      filterParkingOnly
                        ? 'bg-emerald-600 text-white font-black border-emerald-700'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    🚗 주차 무료
                  </button>
                  <button
                    onClick={() => setRentalOnly(!rentalOnly)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all border ${
                      rentalOnly
                        ? 'bg-purple-600 text-white font-black border-purple-700'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    🏌️ 대여소 완비
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          🔥 [조건에 따른 뷰 렌더링 : 지도 뷰 (CourseMapView) vs 목록/카드 뷰]
          ========================================================================= */}
      {displayTab === 'map' ? (
        /* MAP VIEW MODE (네이버 지도 & 카카오맵 연동 스마트 지도 뷰) */
        <CourseMapView
          courses={sortedCourses}
          userLocation={userLocation}
          onSelectCourse={course => openModal('courseDetail', course)}
          selectedRegion={selectedRegion}
          selectedSubRegion={selectedSubRegion}
          searchQuery={searchQuery}
          onRegionChange={reg => setSelectedRegion(reg)}
        />
      ) : (
        /* STRICT LIST VIEW ONLY (목록형 전용) */
        <div>
          {/* Sorting Sub-bar */}
          <div className="flex items-center justify-between mb-4 px-1 gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700">
              <span>정렬 :</span>
              <div className="flex items-center gap-1 flex-wrap">
                {[
                  { label: '추천순', value: 'recommended' },
                  { label: '홀수 많은순', value: 'holesDesc' },
                  { label: '평점순', value: 'ratingDesc' },
                  { label: '후기순', value: 'reviewCount' },
                  { label: '가나다순', value: 'nameAsc' }
                ].map(s => (
                  <button
                    key={s.label}
                    onClick={() => setSortOption(s.value as SortOption)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      sortOption === s.value
                        ? 'bg-slate-800 text-white shadow-xs font-black'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-xs font-bold text-slate-500">
              전체 <strong className="text-emerald-700">{sortedCourses.length}</strong>개 구장 목록
            </span>
          </div>

          {/* Courses Results List Display */}
          {!hasActiveFilters ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <MapPin className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-800 mb-1">지역을 선택하거나 구장명을 검색해주세요</h3>
                <p className="text-slate-500 text-sm">
                  위에서 지역·시군구를 선택하시거나, 구장명·주소를 직접 검색하시면<br className="hidden sm:block" />
                  해당하는 구장 목록이 여기에 표시됩니다.
                </p>
              </div>
            </div>
          ) : sortedCourses.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-800 mb-1">선택하신 조건에 맞는 구장이 없습니다</h3>
                <p className="text-slate-500 text-sm">
                  지역, 시·군·구 또는 홀 수 선택 조건을 변경해 보세요.
                </p>
              </div>
              <button
                onClick={resetAllFilters}
                className="px-6 py-3 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-extrabold text-sm shadow transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>모든 필터 초기화하고 전체 구장 보기</span>
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/90 divide-y divide-slate-100 overflow-hidden shadow-sm">
              {sortedCourses.map((course, courseIdx) => {
                const isFree = checkIsFreeCourse(course);
                const structures = getCourseStructure(course);

                return (
                  <React.Fragment key={course.id}>
                  <div
                    id={`course-list-item-${course.id}`}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* 📱 MOBILE VIEW: 간단명료하고 직관적인 모바일 전용 카드 (sm:hidden) */}
                    <div className="sm:hidden p-3.5 space-y-2.5">
                      {/* Header: Badges & Name */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                            <span className="px-2 py-0.5 rounded text-[11px] font-black bg-emerald-700 text-white shadow-2xs">
                              🚩 {course.holes}홀
                            </span>
                            {course.isAssociationCertified && (
                              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-400 text-green-950 shadow-2xs flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3 text-green-950" /> 공인
                              </span>
                            )}
                            {course.dataConfidence === 'unverified' && (
                              <span
                                className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-200 text-slate-600"
                                title={course.dataSourceNote}
                              >
                                ⚠️ 출처 미확인
                              </span>
                            )}
                            {(course.dataConfidence === 'C' || course.dataConfidence === 'C+') && (
                              <span
                                className="px-2 py-0.5 rounded text-[11px] font-bold bg-orange-100 text-orange-800"
                                title={course.dataSourceNote}
                              >
                                🔍 확인중
                              </span>
                            )}
                            {course.distanceKm !== undefined && (
                              <span className="px-2 py-0.5 rounded text-[11px] font-black bg-rose-100 text-rose-900">
                                📍 {formatDistance(course.distanceKm)}
                              </span>
                            )}
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${isFree ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`}>
                              {isFree ? '무료' : '유료'}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-800">
                              {course.reservationType}
                            </span>
                          </div>
                          <h4
                            onClick={() => openModal('courseDetail', course)}
                            className="text-base font-black text-slate-900 active:text-emerald-800 transition-colors cursor-pointer truncate"
                          >
                            {course.name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-0.5 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{course.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      {/* Concise Info Box */}
                      <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1 text-slate-700 border border-slate-100">
                        <div className="flex items-center gap-1 text-slate-600 truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{course.address}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                          <span className="truncate">요금: <strong className="text-slate-800">{course.feeLocal}</strong></span>
                          <span className="shrink-0 ml-2">주차: <strong className="text-emerald-700">{course.parkingAvailable ? '가능' : '문의'}</strong></span>
                        </div>
                      </div>

                      {/* Map Links & Touch Action Buttons */}
                      <div className="space-y-1.5 pt-0.5">
                        {/* Call & Detail Buttons */}
                        <div className="grid grid-cols-2 gap-1.5">
                          <a
                            href={`tel:${course.phoneNumber}`}
                            className="py-2.5 px-3 rounded-xl bg-slate-100 active:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center justify-center gap-1 border border-slate-200 cursor-pointer"
                          >
                            <PhoneCall className="w-3.5 h-3.5 text-green-700" />
                            <span>전화문의</span>
                          </a>
                          <button
                            onClick={() => openModal('courseDetail', course)}
                            className="py-2.5 px-3 rounded-xl bg-slate-900 active:bg-black text-white font-extrabold text-xs flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                          >
                            <span>상세정보</span>
                            <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 💻 DESKTOP & TABLET VIEW: 상세 제원 그리드가 포함된 확장 목록 뷰 (hidden sm:flex) */}
                    <div className="hidden sm:flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 sm:p-5">
                      {/* Course Information Block */}
                      <div className="space-y-2.5 flex-1">
                        {/* Badges Row */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-700 text-white shadow-2xs">
                            🚩 {course.holes}홀
                          </span>
                          {course.isAssociationCertified && (
                            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-400 text-green-950 shadow-2xs flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-950" /> 공인구장
                            </span>
                          )}
                          {course.dataConfidence === 'unverified' && (
                            <span
                              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-200 text-slate-600"
                              title={course.dataSourceNote}
                            >
                              ⚠️ 출처 미확인 정보
                            </span>
                          )}
                          {(course.dataConfidence === 'C' || course.dataConfidence === 'C+') && (
                            <span
                              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-100 text-orange-800"
                              title={course.dataSourceNote}
                            >
                              🔍 확인중인 정보
                            </span>
                          )}
                          {course.distanceKm !== undefined && (
                            <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-red-100 text-red-900 shadow-2xs">
                              📍 {formatDistance(course.distanceKm)}
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700">
                            {course.region} · {course.subRegion}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                              isFree ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {isFree ? '무료 이용' : '유료/관외'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-800">
                            {course.reservationType}
                          </span>
                        </div>

                        {/* Course Title & Address */}
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4
                              className="text-lg sm:text-xl font-black text-slate-900 hover:text-emerald-800 transition-colors cursor-pointer"
                              onClick={() => openModal('courseDetail', course)}
                            >
                              {course.name}
                            </h4>
                            <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{course.rating.toFixed(1)}</span>
                              <span className="text-slate-400 font-normal">({course.reviewCount}개 후기)</span>
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-600 font-medium flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{course.address}</span>
                          </p>
                        </div>

                        {/* Detailed Specifications Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 bg-slate-50/90 p-3 rounded-xl text-xs border border-slate-100">
                          <div className="flex items-center gap-1 text-slate-700">
                            <span className="font-bold text-slate-500 shrink-0">코스:</span>
                            <span className="font-extrabold text-slate-800 truncate">
                              {structures.map(s => s.name.split(' ')[0]).join('·')} ({course.holes}홀)
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-700">
                            <span className="font-bold text-slate-500 shrink-0">요금:</span>
                            <span className="font-bold text-slate-900 truncate">
                              {course.feeLocal} / 관외 {course.feeVisitor}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-700">
                            <span className="font-bold text-slate-500 shrink-0">주차:</span>
                            <span className="text-slate-800 truncate">{course.parkingDetails}</span>
                          </div>
                          <div className="flex items-center gap-1 text-amber-900 sm:col-span-2">
                            <span className="font-bold text-amber-800 shrink-0">할인:</span>
                            <span className="font-medium truncate">{getDiscountPolicy(course)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-purple-950">
                            <span className="font-bold text-purple-800 shrink-0">대여:</span>
                            <span className="font-medium truncate">{getRentalFeeInfo(course)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons Column */}
                      <div className="flex sm:flex-row lg:flex-col items-center gap-2 shrink-0 self-stretch sm:self-auto justify-end">
                        <div className="flex items-center gap-1.5 w-full">
                          <a
                            href={`tel:${course.phoneNumber}`}
                            className="flex-1 py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer border border-slate-200"
                            title="전화문의"
                          >
                            <PhoneCall className="w-3.5 h-3.5 text-green-700" />
                            <span>전화문의</span>
                          </a>

                          {course.reservationUrl && (
                            <a
                              href={course.reservationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>예약</span>
                            </a>
                          )}
                        </div>

                        <button
                          onClick={() => openModal('courseDetail', course)}
                          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer"
                        >
                          <span>상세정보 & 길찾기</span>
                          <ChevronRight className="w-4 h-4 text-amber-400" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 10개 구장마다 업체 광고 배너 1개 (활성 광고가 있을 때만) */}
                  {(courseIdx + 1) % 10 === 0 && ads.filter(a => a.isActive).length > 0 && (
                    <div className="p-3 bg-slate-50/50">
                      <InlineAdBanner
                        ad={ads.filter(a => a.isActive)[(Math.floor(courseIdx / 10)) % ads.filter(a => a.isActive).length]}
                      />
                    </div>
                  )}
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
