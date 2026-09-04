import React, { useState, useMemo } from 'react';
import { ParkCourse, RegionCategory } from '../types';
import { useParkGolf } from '../context/ParkGolfContext';
import { getCourseCoords, formatDistance } from '../utils/geoCoordinatesHelper';
import {
  MapPin,
  Navigation,
  PhoneCall,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Award,
  Layers,
  Sparkles,
  Info,
  Car,
  Star,
  CheckCircle2,
  X,
  Compass,
  Search,
  Eye
} from 'lucide-react';

interface CourseMapViewProps {
  courses: ParkCourse[];
  userLocation: { lat: number; lng: number } | null;
  onSelectCourse: (course: ParkCourse) => void;
  selectedRegion: RegionCategory;
  selectedSubRegion?: string;
  searchQuery?: string;
  onRegionChange: (region: RegionCategory) => void;
}

// Map bounds for visual coordinate translation on Korea map canvas
// Korea bounding box: lat 33.0 ~ 38.6, lng 125.8 ~ 129.9
const KOREA_BOUNDS = {
  minLat: 33.0,
  maxLat: 38.6,
  minLng: 125.8,
  maxLng: 129.9
};

const REGIONS_LIST: RegionCategory[] = [
  '전체',
  '서울/경기/인천',
  '강원',
  '충청/대전/세종',
  '전라/광주',
  '경상/대구/부산/울산',
  '제주'
];

export const CourseMapView: React.FC<CourseMapViewProps> = ({
  courses,
  userLocation,
  onSelectCourse,
  selectedRegion,
  selectedSubRegion,
  searchQuery,
  onRegionChange
}) => {
  const { openModal } = useParkGolf();
  const [selectedCourse, setSelectedCourse] = useState<ParkCourse | null>(courses[0] || null);
  const [activeFilterHoles, setActiveFilterHoles] = useState<number | 'all'>('all');

  // Convert lat/lng to percentage coordinates on 2D map view
  const getCanvasCoords = (lat: number, lng: number) => {
    // Invert Y axis because SVG/DOM Y is 0 at top
    const yPercent = ((KOREA_BOUNDS.maxLat - lat) / (KOREA_BOUNDS.maxLat - KOREA_BOUNDS.minLat)) * 100;
    const xPercent = ((lng - KOREA_BOUNDS.minLng) / (KOREA_BOUNDS.maxLng - KOREA_BOUNDS.minLng)) * 100;
    return {
      x: Math.max(5, Math.min(95, xPercent)),
      y: Math.max(5, Math.min(95, yPercent))
    };
  };

  const displayedCourses = useMemo(() => {
    if (activeFilterHoles === 'all') return courses;
    if (activeFilterHoles === 54) return courses.filter(c => c.holes >= 54);
    return courses.filter(c => c.holes === activeFilterHoles);
  }, [courses, activeFilterHoles]);

  // Dynamic search query based on current region & filters
  const currentMapSearchQuery = useMemo(() => {
    if (searchQuery && searchQuery.trim()) {
      return searchQuery.trim() + ' 파크골프장';
    }
    let q = '';
    if (selectedRegion && selectedRegion !== '전체') {
      q += selectedRegion + ' ';
    }
    if (selectedSubRegion && selectedSubRegion !== '전체') {
      q += selectedSubRegion + ' ';
    }
    q += '파크골프장';
    return q.trim();
  }, [selectedRegion, selectedSubRegion, searchQuery]);

  // Direct portal launch for current search query
  const handleOpenNaverSearch = () => {
    const encoded = encodeURIComponent(currentMapSearchQuery);
    window.open(`https://map.naver.com/v5/search/${encoded}`, '_blank');
  };

  const handleOpenKakaoSearch = () => {
    const encoded = encodeURIComponent(currentMapSearchQuery);
    window.open(`https://map.kakao.com/link/search/${encoded}`, '_blank');
  };

  // Specific course navigation handlers
  const handleOpenKakaoMap = (course: ParkCourse) => {
    const coords = getCourseCoords(course);
    if (coords.lat && coords.lng) {
      window.open(
        `https://map.kakao.com/link/to/${encodeURIComponent(course.name)},${coords.lat},${coords.lng}`,
        '_blank'
      );
    } else {
      window.open(`https://map.kakao.com/link/search/${encodeURIComponent(course.name)}`, '_blank');
    }
  };

  const handleOpenNaverMap = (course: ParkCourse) => {
    const query = encodeURIComponent(`${course.name} ${course.address}`);
    window.open(`https://map.naver.com/v5/search/${query}`, '_blank');
  };

  const handleOpenKakaoRoadview = (course: ParkCourse) => {
    const coords = getCourseCoords(course);
    window.open(`https://map.kakao.com/link/roadview/${coords.lat},${coords.lng}`, '_blank');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden flex flex-col my-4">
      {/* 1. Top Map Header & Controls */}
      <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-700 text-amber-300 shadow-md shrink-0">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h3 className="font-black text-base sm:text-xl flex items-center gap-2">
              <span>대한민국 전국 파크골프장 지도 뷰</span>
              <span className="text-xs font-bold text-amber-300 bg-amber-950/90 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                현재 {displayedCourses.length}개 구장
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
              지도 핀을 누르시면 네이버 지도 · 카카오맵 길찾기 및 로드뷰를 바로 이용하실 수 있습니다.
            </p>
          </div>
        </div>

        {/* Hole Quick Filter Pills */}
        <div className="flex items-center bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700 shrink-0">
          <span className="text-xs font-bold text-slate-400 px-2 hidden sm:inline">홀수:</span>
          {[
            { label: '전체', value: 'all' },
            { label: '18홀', value: 18 },
            { label: '36홀', value: 36 },
            { label: '54홀+', value: 54 }
          ].map(h => (
            <button
              key={h.label}
              onClick={() => setActiveFilterHoles(h.value as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilterHoles === h.value
                  ? 'bg-emerald-600 text-white font-black shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. 🔥 NAVER MAP & KAKAO MAP DIRECT SEARCH PORTAL BAR 🔥 */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 p-3.5 sm:p-4 border-b border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-slate-900 text-white shrink-0">
            🗺️ 지도 포털 연동
          </span>
          <div className="text-xs sm:text-sm text-slate-800 font-bold truncate">
            <span className="text-slate-500 font-medium">검색어: </span>
            <span className="text-emerald-900 font-extrabold underline decoration-emerald-500 underline-offset-2">
              "{currentMapSearchQuery}"
            </span>
          </div>
        </div>

        {/* Big Action Buttons for Naver Map & Kakao Map Search */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Naver Map Direct Button */}
          <button
            onClick={handleOpenNaverSearch}
            className="flex-1 sm:flex-initial py-2 px-3.5 rounded-xl bg-[#03C75A] hover:bg-[#02b350] active:bg-[#029b45] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
            title="네이버 지도에서 검색 결과 보기"
          >
            <span className="w-4 h-4 rounded bg-white text-[#03C75A] font-black text-[11px] flex items-center justify-center leading-none">
              N
            </span>
            <span>네이버 지도에서 보기</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </button>

          {/* Kakao Map Direct Button */}
          <button
            onClick={handleOpenKakaoSearch}
            className="flex-1 sm:flex-initial py-2 px-3.5 rounded-xl bg-[#FEE500] hover:bg-[#fada0a] active:bg-[#e5c707] text-[#191919] font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
            title="카카오맵에서 검색 결과 보기"
          >
            <span className="w-4 h-4 rounded-full bg-[#191919] text-[#FEE500] font-black text-[10px] flex items-center justify-center leading-none">
              K
            </span>
            <span>카카오맵에서 보기</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>
      </div>

      {/* 3. Main Map Body (Interactive Canvas + Detail Drawer) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px] lg:min-h-[620px]">
        {/* Left/Main Map Canvas Area */}
        <div className="lg:col-span-8 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 relative p-4 flex flex-col justify-between overflow-hidden min-h-[440px] lg:min-h-full">
          
          {/* Subtle Map Grid / Korea Geography Background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
          
          {/* Visual Geography Guides (Water & Land hints) */}
          <div className="absolute top-4 left-4 text-[11px] font-black tracking-wider text-emerald-400/50 pointer-events-none select-none">
            WEST SEA (서해)
          </div>
          <div className="absolute top-4 right-4 text-[11px] font-black tracking-wider text-blue-400/50 pointer-events-none select-none">
            EAST SEA (동해)
          </div>
          <div className="absolute bottom-4 left-4 text-[11px] font-black tracking-wider text-cyan-400/50 pointer-events-none select-none">
            SOUTH SEA (남해) · JEJU
          </div>

          {/* User Current Location Indicator Pin */}
          {userLocation && (
            (() => {
              const uPos = getCanvasCoords(userLocation.lat, userLocation.lng);
              return (
                <div
                  style={{ left: `${uPos.x}%`, top: `${uPos.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center pointer-events-none"
                >
                  <div className="relative">
                    <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-red-400 opacity-75" />
                    <div className="w-5 h-5 rounded-full bg-red-600 border-2 border-white shadow-xl flex items-center justify-center text-white text-[10px] font-black">
                      나
                    </div>
                  </div>
                  <span className="mt-1 px-2 py-0.5 rounded-full bg-red-950/90 text-red-200 text-[10px] font-black border border-red-500 whitespace-nowrap shadow-md">
                    내 현재 위치
                  </span>
                </div>
              );
            })()
          )}

          {/* Interactive Course Pins Canvas */}
          <div className="relative w-full h-full min-h-[380px] lg:min-h-[500px]">
            {displayedCourses.map(course => {
              const coords = getCourseCoords(course);
              const pos = getCanvasCoords(coords.lat, coords.lng);
              const isSelected = selectedCourse?.id === course.id;

              return (
                <button
                  key={course.id}
                  id={`map-pin-${course.id}`}
                  onClick={() => setSelectedCourse(course)}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group transition-all duration-200 cursor-pointer focus:outline-none ${
                    isSelected ? 'scale-125 z-40' : 'hover:scale-115'
                  }`}
                  title={`${course.name} (${course.holes}홀)`}
                >
                  {/* Pin Body */}
                  <div className="relative flex flex-col items-center">
                    <div
                      className={`px-2 py-1 rounded-xl shadow-lg flex items-center gap-1 font-black text-[11px] whitespace-nowrap border transition-all ${
                        isSelected
                          ? 'bg-amber-400 text-green-950 border-white ring-4 ring-amber-400/40 shadow-2xl'
                          : course.holes >= 36
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-300'
                          : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-600'
                      }`}
                    >
                      <MapPin className={`w-3 h-3 ${isSelected ? 'text-green-950' : 'text-amber-400'}`} />
                      <span>{course.holes}홀</span>
                      {course.isAssociationCertified && (
                        <span className="text-[9px] text-amber-300">★</span>
                      )}
                    </div>

                    {/* Small pointer tail */}
                    <div
                      className={`w-2 h-2 rotate-45 -mt-1 ${
                        isSelected ? 'bg-amber-400' : course.holes >= 36 ? 'bg-emerald-600' : 'bg-slate-800'
                      }`}
                    />

                    {/* Course Label on Hover or Active */}
                    <div
                      className={`mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-extrabold max-w-[120px] truncate shadow-md transition-opacity ${
                        isSelected
                          ? 'bg-white text-slate-900 ring-1 ring-amber-400 opacity-100 font-black'
                          : 'bg-black/80 text-slate-200 opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {course.name}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom Map Legend */}
          <div className="relative z-10 flex items-center justify-between gap-2 flex-wrap bg-slate-900/80 backdrop-blur-md p-2.5 rounded-2xl border border-slate-700/80 text-xs text-slate-300">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-emerald-600 border border-emerald-300 inline-block" />
                <span>36홀·54홀 대형</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-slate-800 border border-slate-600 inline-block" />
                <span>9홀·18홀</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-amber-400 border border-white inline-block" />
                <span>선택된 구장</span>
              </span>
            </div>
            <div className="text-[11px] text-emerald-400 font-bold">
              📍 핀 터치 시 네이버·카카오맵 길찾기 즉시 연동
            </div>
          </div>
        </div>

        {/* Right Detail Card Drawer (Selected Course Info & Navigation) */}
        <div className="lg:col-span-4 bg-white p-4 sm:p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200">
          {selectedCourse ? (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div>
                {/* Header Badges */}
                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs border border-emerald-300">
                      {selectedCourse.holes}홀 규모
                    </span>
                    {selectedCourse.isAssociationCertified && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs border border-amber-300 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-700" /> 공인구장
                      </span>
                    )}
                    {selectedCourse.distanceKm !== undefined && (
                      <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-900 font-black text-xs border border-red-300">
                        📍 {formatDistance(selectedCourse.distanceKm)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
                    {selectedCourse.region}
                  </span>
                </div>

                {/* Course Name & Rating */}
                <h4 className="text-lg sm:text-xl font-black text-slate-900 leading-tight mb-1">
                  {selectedCourse.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-600 mb-3">
                  <div className="flex items-center text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                    <span>{selectedCourse.rating.toFixed(1)}</span>
                  </div>
                  <span>•</span>
                  <span>리뷰 {selectedCourse.reviewCount}개</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-bold">{selectedCourse.reservationType}</span>
                </div>

                {/* Course Image */}
                <div className="relative h-36 sm:h-40 rounded-2xl overflow-hidden bg-slate-100 mb-3 border border-slate-200">
                  <img
                    src={selectedCourse.imageUrl}
                    alt={selectedCourse.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 text-white text-xs font-bold truncate max-w-[90%] drop-shadow">
                    {selectedCourse.subRegion}
                  </div>
                </div>

                {/* Spec details */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-700 mb-3">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-green-700 shrink-0 mt-0.5" />
                    <span className="font-semibold text-slate-900">{selectedCourse.address}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-slate-500 shrink-0">이용료:</span>
                    <span className="font-bold text-slate-800">
                      {selectedCourse.feeLocal} / 관외 {selectedCourse.feeVisitor}
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-slate-500 shrink-0">운영/휴장:</span>
                    <span>{selectedCourse.operatingHours} ({selectedCourse.closedDays})</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Car className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                    <span>{selectedCourse.parkingDetails}</span>
                  </div>
                </div>
              </div>

              {/* 4. Action Buttons for Selected Course (Naver Map & Kakao Map) */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                {/* Navigation Links: Naver Map & Kakao Map */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleOpenNaverMap(selectedCourse)}
                    className="py-2.5 px-3 rounded-xl bg-[#03C75A] hover:bg-[#02b350] active:bg-[#029b45] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <span className="w-3.5 h-3.5 rounded bg-white text-[#03C75A] font-black text-[10px] flex items-center justify-center leading-none">
                      N
                    </span>
                    <span>네이버지도 길찾기</span>
                  </button>
                  <button
                    onClick={() => handleOpenKakaoMap(selectedCourse)}
                    className="py-2.5 px-3 rounded-xl bg-[#FEE500] hover:bg-[#fada0a] active:bg-[#e5c707] text-[#191919] font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-[#191919] text-[#FEE500] font-black text-[9px] flex items-center justify-center leading-none">
                      K
                    </span>
                    <span>카카오맵 길찾기</span>
                  </button>
                </div>

                {/* Additional Quick Controls: Roadview & Phone Call & Details */}
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => handleOpenKakaoRoadview(selectedCourse)}
                    className="py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="로드뷰/거리뷰 확인"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span className="truncate">로드뷰</span>
                  </button>
                  <a
                    href={`tel:${selectedCourse.phoneNumber}`}
                    className="py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="전화문의"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-green-700" />
                    <span className="truncate">전화문의</span>
                  </a>
                  <button
                    onClick={() => openModal('courseDetail', selectedCourse)}
                    className="py-2 px-2 rounded-xl bg-slate-900 hover:bg-black text-white font-extrabold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="상세정보"
                  >
                    <span className="truncate">상세정보</span>
                    <ChevronRight className="w-3 h-3 text-amber-400" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500 text-xs">
              지도에서 구장 핀을 터치해 주세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
