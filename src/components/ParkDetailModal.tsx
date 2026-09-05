import React, { useState } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { ParkCourse } from '../types';
import { CourseWeatherWidget } from './CourseWeatherWidget';
import { InlineAdBanner } from './InlineAdBanner';
import {
  getCourseStructure,
  getCourseSummaryText,
  getDiscountPolicy,
  getRentalFeeInfo,
  checkIsFreeCourse
} from '../utils/courseDetailsHelper';
import {
  X,
  MapPin,
  Car,
  Calendar,
  Clock,
  PhoneCall,
  ExternalLink,
  ShieldCheck,
  Star,
  CheckCircle,
  Copy,
  Check,
  Navigation,
  MessageSquarePlus,
  Share2,
  Building2,
  Landmark,
  Globe,
  HelpCircle,
  Info,
  Layers,
  Award,
  Users,
  Flag,
  Sparkles,
  AlertCircle,
  FileText
} from 'lucide-react';

type DetailTab = 'overview' | 'courseHoles' | 'fees' | 'reservation' | 'facilities' | 'reviews';

export const ParkDetailModal: React.FC = () => {
  const { activeModal, closeModal, reviews, openModal, ads } = useParkGolf();
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [copied, setCopied] = useState(false);

  if (!activeModal || activeModal.type !== 'courseDetail' || !activeModal.data) {
    return null;
  }

  const course: ParkCourse = activeModal.data;
  const courseReviews = reviews.filter(r => r.courseId === course.id);
  const realAverageRating =
    courseReviews.length > 0
      ? courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length
      : null;
  const isFree = checkIsFreeCourse(course);
  const structures = getCourseStructure(course);
  const totalPar = structures.reduce((sum, s) => sum + s.par, 0);
  const totalDistance = structures.reduce((sum, s) => sum + (s.distanceMeters || 580), 0);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(course.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${course.name} - 파크골프마당`,
        text: `[파크골프마당] ${course.name} (${course.holes}홀) - ${course.address}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      handleCopyAddress();
      alert('구장 주소가 복사되었습니다. 카카오톡이나 문자로 공유해 보세요.');
    }
  };

  // Switch to match post modal for this course
  const handleCreateMatchForThisCourse = () => {
    closeModal();
    openModal('newMatch', {
      courseName: course.name,
      region: course.region
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col border border-slate-200">
        
        {/* ==================== 1. Modal Top Hero Image Banner ==================== */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-900 shrink-0 overflow-hidden">
          <img
            src={course.imageUrl}
            alt={course.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Close button */}
          <button
            id="course-modal-close-btn"
            onClick={closeModal}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors cursor-pointer z-10"
            title="닫기"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Badges & Course Name Overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow">
                  🚩 {course.holes}홀 ({structures.length}개 코스)
                </span>
                {course.isAssociationCertified && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-green-950 shadow flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> 대한파크골프협회 공인구장
                  </span>
                )}
                {isFree ? (
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-green-500 text-white shadow">
                    무료 이용
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-amber-300 shadow">
                    유료 구장
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow">
                  {course.reservationType}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight drop-shadow-md">
                {course.name}
              </h2>
              <p className="text-xs sm:text-sm text-green-200 mt-0.5 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>{course.subRegion}</span>
                <span className="text-white/60">·</span>
                <span>{course.governmentAgency || course.operatedBy}</span>
              </p>
            </div>
            <span className="shrink-0 text-[10px] text-white/80 bg-black/60 backdrop-blur-xs px-2 py-1 rounded-md font-medium select-none pointer-events-none mb-0.5 hidden sm:block">
              ※ 사진은 참고용입니다
            </span>
          </div>
        </div>

        {/* ==================== 2. Fast-Action Command Strip ==================== */}
        <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <a
              href={`tel:${course.phoneNumber}`}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              title="관리사무소 통화"
            >
              <PhoneCall className="w-4 h-4" />
              <span>관리사무소 ({course.phoneNumber})</span>
            </a>

            {course.reservationType === '온라인예약' && course.reservationUrl && (
              <a
                href={course.reservationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Globe className="w-4 h-4" />
                <span>온라인 예약 포털</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            )}

            <a
              href={`https://map.kakao.com/link/search/${encodeURIComponent(course.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-green-950 font-bold text-xs sm:text-sm flex items-center gap-1 transition-colors cursor-pointer shrink-0"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>카카오맵 길찾기</span>
            </a>

            <a
              href={`https://map.naver.com/v5/search/${encodeURIComponent(course.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-green-700 hover:bg-green-800 text-white font-bold text-xs sm:text-sm flex items-center gap-1 transition-colors cursor-pointer shrink-0"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>네이버 지도</span>
            </a>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleCopyAddress}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              title="주소 복사"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '복사완료' : '주소복사'}</span>
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition-colors"
              title="공유하기"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ==================== 3. Tab Navigation (Dongnepg Style) ==================== */}
        <div className="bg-slate-100 px-4 pt-2 border-b border-slate-200 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'overview', label: '📌 구장 기본정보', count: null },
            { id: 'courseHoles', label: '⛳ 코스 및 홀 제원', count: `${structures.length}개 코스` },
            { id: 'fees', label: '💰 이용요금 & 감면', count: isFree ? '무료' : '유료' },
            { id: 'reservation', label: '📋 예약 및 이용방법', count: course.reservationType },
            { id: 'facilities', label: '🚗 주차 & 편의시설', count: `${course.amenities.length}종` },
            { id: 'reviews', label: '⭐ 어르신 후기', count: courseReviews.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as DetailTab)}
              className={`px-3.5 py-2.5 text-xs sm:text-sm font-extrabold rounded-t-2xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-white text-green-900 shadow-sm border-t-2 border-green-700 font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === tab.id ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ==================== 4. Modal Scrollable Content Body ==================== */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-in fade-in">
              {/* Today's Weather */}
              <CourseWeatherWidget course={course} />

              {/* Data Confidence Notice */}
              {course.dataConfidence && course.dataConfidence !== 'A' && (
                <div
                  className={`p-3.5 rounded-2xl border flex items-start gap-2.5 text-sm ${
                    course.dataConfidence === 'unverified'
                      ? 'bg-slate-100 border-slate-300 text-slate-700'
                      : course.dataConfidence === 'C' || course.dataConfidence === 'C+'
                      ? 'bg-orange-50 border-orange-200 text-orange-900'
                      : 'bg-blue-50 border-blue-200 text-blue-900'
                  }`}
                >
                  <span className="shrink-0 mt-0.5">
                    {course.dataConfidence === 'unverified' ? '⚠️' : '🔍'}
                  </span>
                  <div>
                    <p className="font-bold mb-0.5">
                      {course.dataConfidence === 'unverified'
                        ? '출처가 명확하지 않은 참고정보입니다'
                        : '아직 확인 중인 정보입니다'}
                    </p>
                    <p className="text-xs sm:text-sm opacity-90">{course.dataSourceNote}</p>
                  </div>
                </div>
              )}

              {/* Description Box */}
              <div className="bg-green-50/70 p-4 sm:p-5 rounded-2xl border border-green-200/80">
                <h4 className="text-xs font-bold text-green-800 mb-1 flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-green-700" /> 구장 특징 및 소개
                </h4>
                <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                  {course.description}
                </p>
              </div>

              {/* Address & Navigation Card */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-500">구장 소재지 / 도로명 주소</div>
                      <div className="text-base sm:text-lg font-extrabold text-slate-900">{course.address}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{course.subRegion}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyAddress}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs sm:text-sm font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? '복사완료' : '주소 복사'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <a
                    href={`https://map.kakao.com/link/search/${encodeURIComponent(course.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-green-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>카카오맵 길찾기</span>
                  </a>
                  <a
                    href={`https://map.naver.com/v5/search/${encodeURIComponent(course.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-green-700 hover:bg-green-800 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>네이버 지도 길찾기</span>
                  </a>
                </div>
              </div>

              {/* Key Specs 4-Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Operating Agency */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="text-xs font-bold text-green-800 flex items-center gap-1">
                    <Landmark className="w-4 h-4" /> 관할 지자체 및 운영 주체
                  </div>
                  <div className="text-base font-extrabold text-slate-900">
                    {course.governmentAgency || course.operatedBy}
                  </div>
                  <div className="text-xs text-slate-600 space-y-0.5">
                    <div>관리부서: {course.operatedBy}</div>
                    {course.governmentPhone && <div>지자체 대표: {course.governmentPhone}</div>}
                    <div>현장 관리실: {course.phoneNumber}</div>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="text-xs font-bold text-green-800 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> 운영 시간 및 휴장일
                  </div>
                  <div className="text-base font-extrabold text-slate-900">
                    {course.operatingHours}
                  </div>
                  <div className="text-xs font-bold text-rose-600">
                    정기 휴장: {course.closedDays}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    * 폭우, 폭설, 잔디 양생 등 기상 악화 시 임시 휴장될 수 있습니다.
                  </div>
                </div>
              </div>

              {/* Match Posting Link Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-extrabold text-emerald-950 text-sm sm:text-base flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-700" />
                    <span>{course.name} 함께 갈 동반자를 찾으시나요?</span>
                  </div>
                  <p className="text-xs text-emerald-800">
                    파크골프마당 조편성 게시판에 동반자 모집글을 등록하고 즐겁게 라운딩해 보세요!
                  </p>
                </div>
                <button
                  onClick={handleCreateMatchForThisCourse}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm shadow-xs transition-colors shrink-0 cursor-pointer"
                >
                  동반자 모집하기
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: COURSE & HOLES */}
          {activeTab === 'courseHoles' && (
            <div className="space-y-5 animate-in fade-in">
              {/* Summary Header */}
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-extrabold text-emerald-950 flex items-center gap-1.5">
                    <Flag className="w-4 h-4 text-emerald-700" />
                    <span>구장 코스 제원 총괄</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-800 font-medium mt-0.5">
                    {getCourseSummaryText(course)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1 bg-white rounded-xl text-xs font-black text-emerald-900 border border-emerald-300">
                    잔디: {course.grassType}
                  </span>
                </div>
              </div>

              {/* Course by Course Cards */}
              <div className="space-y-3">
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-green-700" />
                  <span>세부 코스별 구성 ({structures.length}개 코스)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {structures.map((s, idx) => (
                    <div
                      key={s.name}
                      className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5 hover:border-emerald-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-slate-900 text-base flex items-center gap-1.5">
                          <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-extrabold inline-flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span>{s.name}</span>
                        </span>
                        <span className="text-xs font-extrabold bg-green-100 text-green-900 px-2.5 py-0.5 rounded-full">
                          {s.holes}홀 / Par {s.par}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl text-slate-700">
                        <div>전장 거리: <strong className="text-slate-900">{s.distanceMeters || 580}m</strong></div>
                        <div>평균 Par: <strong className="text-slate-900">Par {s.par}</strong></div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        💡 <strong>코스 특징:</strong> {s.feature}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Quality & Grass Information */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <span>🌿 잔디 관리 및 필드 컨디션</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {course.grassType}. 주기적인 배토 및 잔디 깎기 관리로 볼 구름(스피드)과 타구감이 뛰어납니다.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: FEES & DISCOUNTS */}
          {activeTab === 'fees' && (
            <div className="space-y-5 animate-in fade-in">
              {/* Fee Comparison Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Local Citizen Fee */}
                <div className="bg-green-50/80 p-5 rounded-3xl border border-green-200 space-y-2">
                  <div className="text-xs font-extrabold text-green-800 flex items-center gap-1">
                    🏛️ 관내 거주 주민 요금
                  </div>
                  <div className="text-2xl font-black text-green-900">
                    {course.feeLocal}
                  </div>
                  <p className="text-xs text-green-700">
                    * 관내 주민 혜택 적용을 위해 반드시 실물 주민등록증/운전면허증 지참 필수
                  </p>
                </div>

                {/* Visitor / Non-local Fee */}
                <div className="bg-amber-50/80 p-5 rounded-3xl border border-amber-200 space-y-2">
                  <div className="text-xs font-extrabold text-amber-900 flex items-center gap-1">
                    🌐 관외(타 지역) 방문객 요금
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {course.feeVisitor}
                  </div>
                  <p className="text-xs text-amber-800">
                    * 타 지역 방문객 일반 요금 (일부 지자체는 지역사랑상품권 환급 혜택 제공)
                  </p>
                </div>
              </div>

              {/* Senior & Special Discounts */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-2.5 shadow-xs">
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>만 65세 이상 시니어 및 감면 대상자 안내</span>
                </h4>
                <div className="p-3 bg-slate-50 rounded-xl text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {getDiscountPolicy(course)}
                </div>
                <ul className="text-xs text-slate-500 list-disc list-inside space-y-1 pl-1">
                  <li>감면 대상: 만 65세 이상, 국가유공자, 장애인 복지카드 소지자, 다자녀 가정 등</li>
                  <li>모든 할인은 현장 발권 시 본인 신분증 및 증빙 서류를 제시하셔야 적용됩니다.</li>
                </ul>
              </div>

              {/* Equipment Rental Fee */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-2 shadow-xs">
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span>🏌️ 장비(클럽·공) 대여료 안내</span>
                </h4>
                <div className="p-3 bg-slate-50 rounded-xl text-xs sm:text-sm text-slate-800 font-bold">
                  {getRentalFeeInfo(course)}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RESERVATION */}
          {activeTab === 'reservation' && (
            <div className="space-y-5 animate-in fade-in">
              {/* Reservation Main Box */}
              <div className="bg-blue-50/80 p-5 rounded-3xl border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-blue-900 flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> 공식 예약 방식
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-600 text-white">
                    {course.reservationType}
                  </span>
                </div>
                <div className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                  {course.reservationDetails}
                </div>
              </div>

              {/* Direct Booking Actions */}
              <div className="space-y-2.5">
                <h4 className="text-sm font-extrabold text-slate-900">
                  ⚡ 예약 바로가기 및 연락처
                </h4>

                {course.reservationType === '온라인예약' && course.reservationUrl ? (
                  <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="font-extrabold text-slate-900 text-sm sm:text-base">
                        지자체 공식 온라인 통합예약 포털
                      </div>
                      <p className="text-xs text-slate-500">
                        {course.reservationUrl}
                      </p>
                    </div>
                    <a
                      href={course.reservationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer shrink-0"
                    >
                      <Globe className="w-4 h-4" />
                      <span>온라인 예약창 바로가기</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  </div>
                ) : course.reservationType === '전화예약' ? (
                  <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="font-extrabold text-slate-900 text-sm sm:text-base">
                        전화 사전 예약 접수처
                      </div>
                      <p className="text-xs text-slate-500">
                        운영시간 내 전화로 원하시는 시간대 및 인원을 접수하세요.
                      </p>
                    </div>
                    <a
                      href={`tel:${course.phoneNumber}`}
                      className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-green-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer shrink-0"
                    >
                      <PhoneCall className="w-4 h-4 text-green-950" />
                      <span>전화 예약하기 ({course.phoneNumber})</span>
                    </a>
                  </div>
                ) : (
                  <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="font-extrabold text-slate-900 text-sm sm:text-base">
                        당일 현장 매표소 선착순 접수
                      </div>
                      <p className="text-xs text-slate-500">
                        별도 사전 예약 없이 구장 현장 무인 발권기 또는 매표소에서 선착순으로 발권 후 입장합니다.
                      </p>
                    </div>
                    <a
                      href={`tel:${course.phoneNumber}`}
                      className="px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer shrink-0"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>현장 대기상황 문의</span>
                    </a>
                  </div>
                )}
              </div>

              {/* General Rules & Etiquette */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>파크골프장 입장 및 이용 수칙</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1 text-xs">
                  <li>원활한 경기 진행을 위해 3~4인 1조 편성을 원칙으로 합니다. (혼자 오신 분은 현장 조편성 조인)</li>
                  <li>규격에 맞는 공인 파크골프채 및 파크골프 공(무게 80~95g)을 사용하셔야 합니다.</li>
                  <li>잔디 보호를 위해 쇠 징이 박힌 일반 골프화는 착용이 금지되며, 운동화 또는 스파이크리스 골프화를 착용해 주세요.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 5: FACILITIES & PARKING */}
          {activeTab === 'facilities' && (
            <div className="space-y-5 animate-in fade-in">
              {/* Parking Detailed Card */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                <div className="text-xs font-extrabold text-green-800 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-green-700" />
                  <span>주차장 및 주차 요금 안내</span>
                </div>
                <div className="text-lg font-extrabold text-slate-900">
                  {course.parkingAvailable ? '무료 주차장 완비' : '별도 전용 주차장 없음 (인근 공영주차장 이용)'}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  {course.parkingDetails}
                </p>
              </div>

              {/* Amenities Checklist Badges */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span>🌿 구장 부대시설 & 편의시설 ({course.amenities.length}종)</span>
                </h4>
                <div className="flex items-center gap-2 flex-wrap">
                  {course.amenities.map(amenity => (
                    <span
                      key={amenity}
                      className="px-3.5 py-2 rounded-xl bg-green-100/90 text-green-950 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 border border-green-200 shadow-2xs"
                    >
                      <CheckCircle className="w-4 h-4 text-green-700" />
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-5 animate-in fade-in">
              {/* Review Header Stats */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-xs font-extrabold text-slate-500">종합 만족도 평점</div>
                  <div className="flex items-center gap-2 mt-1">
                    {realAverageRating !== null ? (
                      <>
                        <span className="text-3xl font-black text-slate-900">★ {realAverageRating.toFixed(1)}</span>
                        <span className="text-xs text-slate-500">({courseReviews.length}개의 생생 방문 후기)</span>
                      </>
                    ) : (
                      <span className="text-sm text-slate-400 font-bold">아직 등록된 후기가 없습니다</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => openModal('newReview', { courseId: course.id, courseName: course.name })}
                  className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-green-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow transition-colors cursor-pointer"
                >
                  <MessageSquarePlus className="w-4 h-4" />
                  <span>방문 후기 작성하기</span>
                </button>
              </div>

              {/* Review List */}
              {courseReviews.length === 0 ? (
                <div className="bg-slate-50 p-8 rounded-2xl text-center border border-slate-200 space-y-2">
                  <p className="text-sm text-slate-600 font-bold">
                    아직 등록된 후기가 없습니다.
                  </p>
                  <p className="text-xs text-slate-400">
                    첫 번째 방문 후기를 남겨서 전국의 파크골프 동호인들에게 유용한 정보를 나눠주세요!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {courseReviews.map(rev => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm">{rev.authorName}</span>
                          <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                            {rev.ageGroup}
                          </span>
                        </div>
                        <span className="text-amber-500 font-black text-sm">
                          {'★'.repeat(rev.rating)}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-sm">{rev.title}</div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{rev.content}</p>
                      <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-100 flex items-center justify-between">
                        <span>방문일자: {rev.visitDate}</span>
                        <span>잔디 ★{rev.grassScore || rev.rating} · 시설 ★{rev.facilityScore || rev.rating} · 주차 ★{rev.parkingScore || rev.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 업체 광고 배너 (구장 상세 하단, 활성 광고 중 구장ID 기준으로 하나 선택) */}
          {ads.filter(a => a.isActive).length > 0 && (
            <div className="pt-2">
              <InlineAdBanner
                ad={ads.filter(a => a.isActive)[course.id.length % ads.filter(a => a.isActive).length]}
              />
            </div>
          )}

        </div>

        {/* ==================== 5. Modal Bottom Fixed CTA ==================== */}
        <div className="p-4 sm:p-5 bg-slate-100 border-t border-slate-200 flex items-center gap-2.5 sm:gap-3 shrink-0">
          {course.reservationType === '온라인예약' && course.reservationUrl ? (
            <a
              id="modal-direct-online-res"
              href={course.reservationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 sm:py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow transition-colors cursor-pointer"
            >
              <Globe className="w-5 h-5" />
              <span>온라인 예약 사이트 바로가기</span>
            </a>
          ) : course.reservationType === '전화예약' ? (
            <a
              id="modal-direct-res-phone-call"
              href={`tel:${course.phoneNumber}`}
              className="flex-1 py-3 sm:py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-green-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow transition-colors cursor-pointer"
            >
              <PhoneCall className="w-5 h-5 text-green-950" />
              <span>전화 예약 문의 ({course.phoneNumber})</span>
            </a>
          ) : (
            <a
              id="modal-direct-phone-call"
              href={`tel:${course.phoneNumber}`}
              className="flex-1 py-3 sm:py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow transition-colors cursor-pointer"
            >
              <PhoneCall className="w-5 h-5 text-amber-300" />
              <span>구장 현장문의 ({course.phoneNumber})</span>
            </a>
          )}

          {/* Match Companion Recruitment Quick Button */}
          <button
            onClick={handleCreateMatchForThisCourse}
            className="py-3 sm:py-3.5 px-3 sm:px-4 rounded-2xl bg-white hover:bg-slate-200 text-emerald-900 border border-emerald-300 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs shrink-0 cursor-pointer"
            title="이 구장 동반자 모집하기"
          >
            <Users className="w-4 h-4 text-emerald-700" />
            <span className="hidden sm:inline">동반자 모집</span>
          </button>

          <button
            onClick={handleShare}
            className="p-3.5 rounded-2xl bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold shrink-0 cursor-pointer"
            title="구장 정보 공유하기"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
