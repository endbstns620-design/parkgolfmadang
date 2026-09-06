import React, { useState, useEffect } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { ParkCourse, Tournament, AdItem, CoupangProduct } from '../types';
import {
  X,
  ShieldCheck,
  Plus,
  Edit,
  Trash2,
  Save,
  RotateCcw,
  AlertTriangle,
  Lock,
  RefreshCw,
  Users,
  Megaphone,
  Coins
} from 'lucide-react';

// 휴대폰번호를 010-1234-5678 형태로 보기 좋게 표시합니다.
const formatPhone = (raw?: string) => {
  const d = String(raw || '').replace(/[^0-9]/g, '');
  if (d.length === 11) return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  return raw || '-';
};

export const AdminDashboardModal: React.FC = () => {
  const {
    activeModal,
    closeModal,
    isAdmin,
    loginAdmin,
    logoutAdmin,
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    tournaments,
    addTournament,
    updateTournament,
    deleteTournament,
    fetchRedemptions,
    fetchPointRequests,
    decidePointRequest,
    updateRedemptionStatus,
    pointShopItems,
    addPointShopItem,
    deletePointShopItem,
    coupangProducts,
    addCoupangProduct,
    deleteCoupangProduct,
    fetchMembers,
    matches,
    updateMatchStatus,
    deleteMatch,
    reviews,
    deleteReview,
    ads,
    addAd,
    updateAd,
    deleteAd,
    resetToDefaultData
  } = useParkGolf();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState<'courses' | 'tournaments' | 'members' | 'matches' | 'reviews' | 'pointapproval' | 'ads' | 'pointshop' | 'redemptions'>('courses');

  // Edit / Form state for Course
  const [editingCourse, setEditingCourse] = useState<Partial<ParkCourse> | null>(null);
  const [isNewCourse, setIsNewCourse] = useState(false);

  // Edit / Form state for Tournament
  const [editingTour, setEditingTour] = useState<Partial<Tournament> | null>(null);
  const [isNewTour, setIsNewTour] = useState(false);


  // Edit / Form state for Ad
  const [editingAd, setEditingAd] = useState<Partial<AdItem> | null>(null);
  const [isNewAd, setIsNewAd] = useState(false);

  // Admin Login 로딩 상태 — 다른 useState들과 함께 컴포넌트 최상단에서 항상 호출되어야 합니다.
  // (조건부 return 아래에 두면 모달이 열릴 때 hooks 호출 순서가 달라져서 리액트가 크래시합니다)
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [isLoadingRedemptions, setIsLoadingRedemptions] = useState(false);
  const [newPointShopItem, setNewPointShopItem] = useState<{
    name: string;
    category: string;
    pointCost: string;
    referenceUrl: string;
    imageUrl: string;
    description: string;
    sourceType: '쿠팡' | '일반';
    selectedCoupangId: string;
    coupangEmbedUrl: string;
  }>({
    name: '',
    category: '',
    pointCost: '',
    referenceUrl: '',
    imageUrl: '',
    description: '',
    sourceType: '일반',
    selectedCoupangId: '',
    coupangEmbedUrl: ''
  });
  const [isAddingPointShopItem, setIsAddingPointShopItem] = useState(false);
  // 마당P 승인 탭
  const [pointRequests, setPointRequests] = useState<any[]>([]);
  const [isLoadingPointReqs, setIsLoadingPointReqs] = useState(false);
  const [pointReqFilter, setPointReqFilter] = useState<'대기' | '지급완료' | '거부'>('대기');

  // 회원관리 탭
  const [members, setMembers] = useState<any[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');

  // 제휴광고 탭 안의 쿠팡추천상품 등록
  const [coupangRawInput, setCoupangRawInput] = useState('');
  const [coupangCategory, setCoupangCategory] = useState<CoupangProduct['category']>('클럽');
  const [isAddingCoupang, setIsAddingCoupang] = useState(false);


  // 관리자 모달이 열려있을 때 교환 신청 배지 숫자(및 목록)를 미리 불러옵니다.
  useEffect(() => {
    if (activeModal && activeModal.type === 'admin') {
      fetchRedemptions().then(setRedemptions);
      if (isAdmin) {
        setIsLoadingMembers(true);
        fetchMembers()
          .then(setMembers)
          .finally(() => setIsLoadingMembers(false));
        fetchPointRequests().then(setPointRequests);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModal, isAdmin]);

  if (!activeModal || activeModal.type !== 'admin') {
    return null;
  }

  // Handle Admin Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    const success = await loginAdmin(pinInput);
    setIsLoggingIn(false);
    if (success) {
      setPinError('');
      setPinInput('');
    } else {
      setPinError('관리자 비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col text-slate-800">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold">
                파크골프마당 관리자 모드
              </h2>
              <p className="text-xs text-slate-400">
                구장 정보 · 대회 일정 · 회원 · 마당P · 광고 관리 (초보가이드 영상은 가이드 페이지에서)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={logoutAdmin}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300"
              >
                로그아웃
              </button>
            )}
            <button
              onClick={closeModal}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!isAdmin ? (
          /* Login Screen */
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                관리자 인증이 필요합니다
              </h3>
              <p className="text-sm text-slate-600">
                게시물 수정, 삭제 및 새 구장 등록 권한을 위해 4자리 관리자 비밀번호를 입력해주세요.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                id="admin-pin-input"
                type="password"
                placeholder="비밀번호 입력"
                value={pinInput}
                onChange={e => setPinInput(e.target.value)}
                className="w-full text-center text-2xl tracking-widest font-extrabold p-3.5 rounded-2xl border-2 border-slate-300 focus:border-green-600 focus:outline-none"
              />

              {pinError && (
                <div className="text-xs font-bold text-rose-600 flex items-center justify-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  {pinError}
                </div>
              )}

              <button
                id="admin-login-submit-btn"
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-4 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-extrabold text-base shadow-lg transition-all disabled:opacity-60"
              >
                {isLoggingIn ? '확인 중...' : '관리자 로그인하기'}
              </button>
            </form>
          </div>
        ) : (
          /* Logged In Dashboard */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Nav Tabs — 탭이 9개로 늘어나 한 줄에 다 넣으면 글씨가 잘리므로, 화면이 좁으면
                두 줄로 자연스럽게 넘어가도록 flex-wrap을 씁니다 (탭 이름이 항상 다 보입니다) */}
            <div className="bg-slate-100 p-2 border-b border-slate-200 flex flex-wrap items-center gap-1">
              {[
                { id: 'courses', label: '🏌️ 구장 관리', count: courses.length },
                { id: 'tournaments', label: '🏆 대회 관리', count: tournaments.length },
                { id: 'members', label: '🧑‍🤝‍🧑 회원관리', count: members.length },
                { id: 'matches', label: '👥 라운딩 매칭', count: matches.length },
                { id: 'reviews', label: '⭐ 후기 관리', count: reviews.length },
                {
                  id: 'pointapproval',
                  label: '🪙 마당P 승인',
                  count: pointRequests.filter((r: any) => r.status === '대기').length
                },
                { id: 'ads', label: '📣 제휴광고', count: ads.length },
                { id: 'pointshop', label: '🛍️ 마당P 장터', count: pointShopItems.length },
                { id: 'redemptions', label: '🎁 교환신청', count: redemptions.filter((r: any) => r.status === '접수됨').length }
              ].map(tab => (
                <button
                  key={tab.id}
                  id={`admin-tab-${tab.id}`}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setEditingCourse(null);
                    setEditingTour(null);
                    setEditingAd(null);
                  }}
                  className={`grow shrink-0 basis-[30%] sm:basis-[22%] md:basis-0 px-2 sm:px-2.5 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs md:text-sm font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-0 sm:gap-1.5 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-green-800 text-white shadow'
                      : 'bg-white text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="text-[9px] sm:text-[11px] px-1.5 py-0.2 rounded-full bg-black/20 shrink-0">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Main Panel Content */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
              {/* TAB 1: COURSES */}
              {activeTab === 'courses' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">
                        전국 파크골프장 목록 ({courses.length}개 등록됨)
                      </h3>
                      <p className="text-xs text-slate-500">
                        사진 URL 변경, 홀 수, 요금, 주차정보 및 예약 링크를 직접 수정할 수 있습니다.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                      onClick={() => {
                        setIsNewCourse(true);
                        setEditingCourse({
                          name: '',
                          region: '서울/경기/인천',
                          subRegion: '',
                          address: '',
                          holes: 18,
                          courseScale: '18홀',
                          operatedBy: '지자체 시설관리공단 직영',
                          reservationType: '선착순',
                          reservationDetails: '',
                          parkingAvailable: true,
                          parkingDetails: '무료 주차장 완비',
                          feeLocal: '무료',
                          feeVisitor: '5,000원',
                          phoneNumber: '031-000-0000',
                          operatingHours: '09:00 ~ 18:00',
                          closedDays: '매주 월요일 정기휴장',
                          imageUrl: '/images/card-courses-v4.png',
                          grassType: '한국형 천연잔디 (버뮤다)',
                          amenities: ['화장실', '무료주차', '클럽하우스', '휴게쉼터'],
                          isAssociationCertified: true,
                          rating: 5.0,
                          reviewCount: 0,
                          description: ''
                        });
                      }}
                      className="px-4 py-2 rounded-xl bg-green-700 hover:bg-green-800 text-white font-bold text-xs sm:text-sm flex items-center gap-1 shadow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>새 구장 추가</span>
                    </button>
                    </div>
                  </div>

                  {/* Course Form Editor (if editing) */}
                  {editingCourse && (
                    <div className="bg-green-50/80 p-5 rounded-3xl border-2 border-green-400 space-y-4">
                      <div className="flex items-center justify-between border-b border-green-200 pb-2">
                        <h4 className="font-extrabold text-green-950 text-base">
                          {isNewCourse ? '새 파크골프구장 등록' : `[${editingCourse.name}] 정보 수정`}
                        </h4>
                        <button
                          onClick={() => setEditingCourse(null)}
                          className="text-xs font-bold text-slate-500 hover:text-slate-800"
                        >
                          취소
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                        <div>
                          <label className="font-bold text-slate-700">구장명 *</label>
                          <input
                            type="text"
                            value={editingCourse.name || ''}
                            onChange={e => setEditingCourse({ ...editingCourse, name: e.target.value })}
                            className="w-full p-2 rounded-xl border border-slate-300 font-bold"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700">지역 *</label>
                          <select
                            value={editingCourse.region || '강원'}
                            onChange={e => setEditingCourse({ ...editingCourse, region: e.target.value as any })}
                            className="w-full p-2 rounded-xl border border-slate-300 font-bold bg-white"
                          >
                            {['서울/경기/인천', '강원', '충청/대전/세종', '전라/광주', '경상/대구/부산/울산', '제주'].map(r => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="font-bold text-slate-700">시/군/구 (예: 강원 화천군)</label>
                          <input
                            type="text"
                            value={editingCourse.subRegion || ''}
                            onChange={e => setEditingCourse({ ...editingCourse, subRegion: e.target.value })}
                            className="w-full p-2 rounded-xl border border-slate-300"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700">홀 수 (숫자)</label>
                          <input
                            type="number"
                            value={editingCourse.holes || 18}
                            onChange={e =>
                              setEditingCourse({
                                ...editingCourse,
                                holes: Number(e.target.value),
                                courseScale: `${e.target.value}홀`
                              })
                            }
                            className="w-full p-2 rounded-xl border border-slate-300 font-bold"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="font-bold text-slate-700">도로명 주소 *</label>
                          <input
                            type="text"
                            value={editingCourse.address || ''}
                            onChange={e => setEditingCourse({ ...editingCourse, address: e.target.value })}
                            className="w-full p-2 rounded-xl border border-slate-300"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700">예약 방식</label>
                          <select
                            value={editingCourse.reservationType || '선착순'}
                            onChange={e => setEditingCourse({ ...editingCourse, reservationType: e.target.value as any })}
                            className="w-full p-2 rounded-xl border border-slate-300 font-bold bg-white"
                          >
                            <option value="선착순">선착순</option>
                            <option value="온라인예약">온라인예약</option>
                            <option value="현장접수">현장접수</option>
                            <option value="전화예약">전화예약</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-bold text-slate-700">지자체 직통 전화번호 *</label>
                          <input
                            type="text"
                            value={editingCourse.phoneNumber || ''}
                            onChange={e => setEditingCourse({ ...editingCourse, phoneNumber: e.target.value })}
                            className="w-full p-2 rounded-xl border border-slate-300 font-bold"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700">관내 주민 요금</label>
                          <input
                            type="text"
                            value={editingCourse.feeLocal || ''}
                            onChange={e => setEditingCourse({ ...editingCourse, feeLocal: e.target.value })}
                            className="w-full p-2 rounded-xl border border-slate-300"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700">관외(타 지역) 요금</label>
                          <input
                            type="text"
                            value={editingCourse.feeVisitor || ''}
                            onChange={e => setEditingCourse({ ...editingCourse, feeVisitor: e.target.value })}
                            className="w-full p-2 rounded-xl border border-slate-300"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="font-bold text-slate-700">대표 사진 이미지 URL</label>
                          <input
                            type="text"
                            value={editingCourse.imageUrl || ''}
                            onChange={e => setEditingCourse({ ...editingCourse, imageUrl: e.target.value })}
                            className="w-full p-2 rounded-xl border border-slate-300 text-xs"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="font-bold text-slate-700">온라인 예약 사이트 주소 (링크)</label>
                          <input
                            type="text"
                            value={editingCourse.reservationUrl || ''}
                            onChange={e => setEditingCourse({ ...editingCourse, reservationUrl: e.target.value })}
                            className="w-full p-2 rounded-xl border border-slate-300 text-xs"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="font-bold text-slate-700">구장 상세 특장점 설명</label>
                          <textarea
                            rows={3}
                            value={editingCourse.description || ''}
                            onChange={e => setEditingCourse({ ...editingCourse, description: e.target.value })}
                            className="w-full p-2 rounded-xl border border-slate-300"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (!editingCourse.name || !editingCourse.address) {
                            alert('구장명과 주소를 입력해주세요.');
                            return;
                          }
                          if (isNewCourse) {
                            addCourse(editingCourse as any);
                            alert('새 구장이 등록되었습니다!');
                          } else {
                            updateCourse(editingCourse.id!, editingCourse);
                            alert('구장 정보가 수정되었습니다!');
                          }
                          setEditingCourse(null);
                        }}
                        className="w-full py-3 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-extrabold flex items-center justify-center gap-2 shadow"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isNewCourse ? '새 구장 등록 완료' : '수정 사항 저장하기'}</span>
                      </button>
                    </div>
                  )}

                  {/* Course Cards List */}
                  <div className="space-y-3">
                    {courses.map(c => (
                      <div
                        key={c.id}
                        className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={c.imageUrl}
                            alt={c.name}
                            className="w-14 h-14 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900 text-sm sm:text-base truncate">
                                {c.name}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-900 font-bold">
                                {c.holes}홀
                              </span>
                              <span className="text-xs text-slate-500 font-semibold">
                                {c.region}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 truncate">{c.address}</p>
                            <span className="text-xs text-slate-500">📞 {c.phoneNumber} | {c.reservationType}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setIsNewCourse(false);
                              setEditingCourse(c);
                            }}
                            className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs flex items-center gap-1"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>수정</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`'${c.name}' 구장을 정말 삭제하시겠습니까?`)) {
                                deleteCourse(c.id);
                              }
                            }}
                            className="p-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>삭제</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: TOURNAMENTS */}
              {activeTab === 'tournaments' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">
                        전국 대회 일정 관리 ({tournaments.length}건)
                      </h3>
                      <p className="text-xs text-slate-500">
                        대회 접수 상태(접수중/마감/접수예정), 상금, 신청 링크 수정
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsNewTour(true);
                          setEditingTour({
                            title: '',
                            organizer: '대한파크골프협회 / 지자체 체육회',
                            eventDate: '2026-06-01',
                            dateRange: '2026.06.01 ~ 06.02 (2일간)',
                            registrationPeriod: '2026.05.01 ~ 05.20',
                            location: '전국 공인 파크골프장',
                            status: '접수중',
                            prizePool: '총상금 1,000만원 상당',
                            eligibility: '전국 파크골프 동호인 (협회 등록 회원)',
                            participationFee: '30,000원',
                            contact: '02-000-0000',
                            linkUrl: '',
                            description: '',
                            isFeatured: true
                          });
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        <span>새 대회 등록</span>
                      </button>
                    </div>
                  </div>

                  {editingTour && (
                    <div className="bg-amber-50 p-5 rounded-3xl border-2 border-amber-400 space-y-4">
                      <h4 className="font-extrabold text-amber-950">
                        {isNewTour ? '새 대회 등록' : `[${editingTour.title}] 대회 수정`}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                        <div className="sm:col-span-2">
                          <label className="font-bold">대회명 *</label>
                          <input
                            type="text"
                            value={editingTour.title || ''}
                            onChange={e => setEditingTour({ ...editingTour, title: e.target.value })}
                            className="w-full p-2 rounded-xl border border-slate-300 font-bold"
                          />
                        </div>
                        <div>
                          <label className="font-bold">주최/주관</label>
                          <input
                            type="text"
                            value={editingTour.organizer || ''}
                            onChange={e => setEditingTour({ ...editingTour, organizer: e.target.value })}
                            className="w-full p-2 rounded-xl border border-slate-300"
                          />
                        </div>
                        <div>
                          <label className="font-bold">진행 상태</label>
                          <select
                            value={editingTour.status || '접수중'}
                            onChange={e => setEditingTour({ ...editingTour, status: e.target.value as any })}
                            className="w-full p-2 rounded-xl border border-slate-300 font-bold bg-white"
                          >
                            <option value="접수중">접수중</option>
                            <option value="접수예정">접수예정</option>
                            <option value="마감임박">마감임박</option>
                            <option value="접수마감">접수마감</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-bold">대회 일시</label>
                          <input
                            type="text"
                            value={editingTour.dateRange || ''}
                            onChange={e => setEditingTour({ ...editingTour, dateRange: e.target.value })}
                            className="w-full p-2 rounded-xl border border-slate-300"
                          />
                        </div>
                        <div>
                          <label className="font-bold">개최 장소</label>
                          <input
                            type="text"
                            value={editingTour.location || ''}
                            onChange={e => setEditingTour({ ...editingTour, location: e.target.value })}
                            className="w-full p-2 rounded-xl border border-slate-300"
                          />
                        </div>
                        <div>
                          <label className="font-bold">총상금/부상</label>
                          <input
                            type="text"
                            value={editingTour.prizePool || ''}
                            onChange={e => setEditingTour({ ...editingTour, prizePool: e.target.value })}
                            className="w-full p-2 rounded-xl border border-slate-300"
                          />
                        </div>
                        <div>
                          <label className="font-bold">문의 연락처</label>
                          <input
                            type="text"
                            value={editingTour.contact || ''}
                            onChange={e => setEditingTour({ ...editingTour, contact: e.target.value })}
                            className="w-full p-2 rounded-xl border border-slate-300"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (!editingTour.title) return alert('대회명을 입력하세요.');
                          if (isNewTour) {
                            addTournament(editingTour as any);
                          } else {
                            updateTournament(editingTour.id!, editingTour);
                          }
                          setEditingTour(null);
                        }}
                        className="w-full py-3 rounded-2xl bg-amber-600 text-white font-bold"
                      >
                        대회 저장
                      </button>
                    </div>
                  )}

                  <div className="space-y-3">
                    {tournaments.map(t => (
                      <div
                        key={t.id}
                        className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{t.title}</span>
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                              {t.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            📅 {t.dateRange} | 📍 {t.location} | 🎁 {t.prizePool}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setIsNewTour(false);
                              setEditingTour(t);
                            }}
                            className="p-2 rounded-xl bg-slate-200 text-xs font-bold"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => deleteTournament(t.id)}
                            className="p-2 rounded-xl bg-rose-100 text-rose-700 text-xs font-bold"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: 회원관리 */}
              {activeTab === 'members' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">
                        가입회원 관리 (총 {members.length}명)
                      </h3>
                      <p className="text-xs text-slate-500">
                        실명·휴대폰번호는 개인정보입니다. 본인 확인·경품 발송 등 꼭 필요한 용도로만 사용해주세요.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsLoadingMembers(true);
                        fetchMembers()
                          .then(setMembers)
                          .finally(() => setIsLoadingMembers(false));
                      }}
                      disabled={isLoadingMembers}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoadingMembers ? 'animate-spin' : ''}`} />
                      <span>{isLoadingMembers ? '불러오는 중...' : '새로고침'}</span>
                    </button>
                  </div>

                  <input
                    type="text"
                    value={memberSearch}
                    onChange={e => setMemberSearch(e.target.value)}
                    placeholder="닉네임 · 이름 · 휴대폰번호 · 지역으로 검색"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm"
                  />

                  {members.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                      <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p className="font-bold">{isLoadingMembers ? '회원 목록을 불러오는 중입니다...' : '아직 가입한 회원이 없습니다.'}</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                      <table className="w-full text-xs sm:text-sm whitespace-nowrap">
                        <thead className="bg-slate-100 text-slate-700">
                          <tr>
                            <th className="px-3 py-2.5 text-left font-extrabold">번호</th>
                            <th className="px-3 py-2.5 text-left font-extrabold">닉네임</th>
                            <th className="px-3 py-2.5 text-left font-extrabold">이름</th>
                            <th className="px-3 py-2.5 text-left font-extrabold">휴대폰</th>
                            <th className="px-3 py-2.5 text-left font-extrabold">지역</th>
                            <th className="px-3 py-2.5 text-left font-extrabold">평균타수</th>
                            <th className="px-3 py-2.5 text-right font-extrabold">마당P</th>
                            <th className="px-3 py-2.5 text-left font-extrabold">배지</th>
                            <th className="px-3 py-2.5 text-left font-extrabold">가입일</th>
                          </tr>
                        </thead>
                        <tbody>
                          {members
                            .filter(m => {
                              const q = memberSearch.trim().toLowerCase();
                              if (!q) return true;
                              return [m.nickname, m.name, m.phone, m.preferredRegion]
                                .filter(Boolean)
                                .some((v: string) => String(v).toLowerCase().includes(q));
                            })
                            .map(m => (
                              <tr key={m.id} className="border-t border-slate-200 hover:bg-slate-50">
                                <td className="px-3 py-2.5 font-bold text-slate-500">{m.founderNumber}</td>
                                <td className="px-3 py-2.5 font-extrabold text-slate-900">{m.nickname}</td>
                                <td className="px-3 py-2.5 text-slate-700">{m.name}</td>
                                <td className="px-3 py-2.5 text-slate-700">{formatPhone(m.phone)}</td>
                                <td className="px-3 py-2.5 text-slate-600">{m.preferredRegion || '-'}</td>
                                <td className="px-3 py-2.5 text-slate-600">{m.averageScore || '-'}</td>
                                <td className="px-3 py-2.5 text-right font-extrabold text-emerald-700">
                                  {Number(m.points || 0).toLocaleString()}P
                                </td>
                                <td className="px-3 py-2.5">
                                  <div className="flex flex-wrap gap-1">
                                    {(m.badges || []).length === 0 ? (
                                      <span className="text-slate-400">-</span>
                                    ) : (
                                      (m.badges || []).map((b: string, i: number) => (
                                        <span key={i} className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                                          {b}
                                        </span>
                                      ))
                                    )}
                                  </div>
                                </td>
                                <td className="px-3 py-2.5 text-slate-500">{m.createdAt}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: MATCHES */}
              {activeTab === 'matches' && (
                <div className="space-y-3">
                  <h3 className="font-extrabold text-slate-900">
                    동호회 라운딩 동반자 모집글 관리 ({matches.length}건)
                  </h3>
                  {matches.map(m => (
                    <div
                      key={m.id}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{m.title}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200">
                            {m.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {m.courseName} | {m.meetDate} | 작성자: {m.authorName} ({m.authorPhone})
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateMatchStatus(m.id, m.status === '모집중' ? '마감' : '모집중')
                          }
                          className="px-3 py-1.5 rounded-xl bg-slate-200 text-xs font-bold"
                        >
                          {m.status === '모집중' ? '마감처리' : '모집중전환'}
                        </button>
                        <button
                          onClick={() => deleteMatch(m.id)}
                          className="p-2 rounded-xl bg-rose-100 text-rose-700 text-xs font-bold"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 5: REVIEWS */}
              {activeTab === 'reviews' && (
                <div className="space-y-3">
                  <h3 className="font-extrabold text-slate-900">
                    구장 방문 후기 관리 ({reviews.length}건)
                  </h3>
                  {reviews.map(r => (
                    <div
                      key={r.id}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          [{r.courseName}] {r.title}
                        </div>
                        <p className="text-xs text-slate-600">{r.content}</p>
                        <span className="text-xs text-slate-400">
                          작성자: {r.authorName} ({r.ageGroup}) | ★ {r.rating}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteReview(r.id)}
                        className="p-2 rounded-xl bg-rose-100 text-rose-700 text-xs font-bold shrink-0"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB: 마당P 승인 — 회원이 쓴 글을 직접 보고 지급 여부를 정합니다 */}
              {activeTab === 'pointapproval' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">
                        마당P 지급 승인 (대기 {pointRequests.filter((r: any) => r.status === '대기').length}건)
                      </h3>
                      <p className="text-xs text-slate-500">
                        회원이 글을 올리면 마당P가 바로 지급되지 않고 여기 쌓입니다. 글 내용을 확인하시고
                        지급 또는 거부를 눌러주세요. <strong>지급</strong>을 누르는 순간 회원 마당P가 올라갑니다.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsLoadingPointReqs(true);
                        fetchPointRequests()
                          .then(setPointRequests)
                          .finally(() => setIsLoadingPointReqs(false));
                      }}
                      disabled={isLoadingPointReqs}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoadingPointReqs ? 'animate-spin' : ''}`} />
                      <span>{isLoadingPointReqs ? '불러오는 중...' : '새로고침'}</span>
                    </button>
                  </div>

                  {/* 상태별 보기 */}
                  <div className="flex items-center gap-2">
                    {(['대기', '지급완료', '거부'] as const).map(st => (
                      <button
                        key={st}
                        onClick={() => setPointReqFilter(st)}
                        className={`px-4 py-2 rounded-xl font-bold text-sm border-2 cursor-pointer ${
                          pointReqFilter === st
                            ? 'bg-green-800 text-white border-green-900'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {st} ({pointRequests.filter((r: any) => r.status === st).length})
                      </button>
                    ))}
                  </div>

                  {pointRequests.filter((r: any) => r.status === pointReqFilter).length === 0 ? (
                    <div className="py-16 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                      <Coins className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p className="font-bold">{pointReqFilter} 상태인 신청이 없습니다.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pointRequests
                        .filter((r: any) => r.status === pointReqFilter)
                        .map((r: any) => (
                          <div key={r.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-extrabold text-white bg-slate-600 px-2 py-0.5 rounded-full">
                                {r.type}
                              </span>
                              <span
                                className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                                  r.status === '대기'
                                    ? 'bg-amber-100 text-amber-800'
                                    : r.status === '지급완료'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-rose-100 text-rose-700'
                                }`}
                              >
                                {r.status}
                              </span>
                              <span className="text-sm font-extrabold text-emerald-700">
                                {Number(r.amount).toLocaleString()}마당P
                              </span>
                              <span className="text-xs text-slate-500">
                                {r.userNickname}님 · {new Date(r.createdAt).toLocaleString('ko-KR')}
                              </span>
                            </div>

                            <h5 className="font-extrabold text-slate-900 text-sm sm:text-base">{r.title}</h5>

                            {/* 글 내용 — 주제에 맞는 글인지, 허위 글은 아닌지 여기서 확인하시면 됩니다 */}
                            <div className="bg-white border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-700 whitespace-pre-line max-h-40 overflow-y-auto leading-relaxed">
                              {r.preview?.trim() ? r.preview : <span className="text-slate-400">(본문 없음)</span>}
                            </div>

                            {r.status === '거부' && r.rejectReason && (
                              <p className="text-xs text-rose-700 font-bold">거부 사유: {r.rejectReason}</p>
                            )}

                            {r.status === '대기' && (
                              <div className="flex items-center gap-2 pt-1">
                                <button
                                  onClick={async () => {
                                    if (!window.confirm(`${r.userNickname}님께 ${Number(r.amount).toLocaleString()}마당P를 지급하시겠습니까?`)) return;
                                    const ok = await decidePointRequest(r.id, 'approve');
                                    if (ok) {
                                      setPointRequests(prev =>
                                        prev.map(x => (x.id === r.id ? { ...x, status: '지급완료' } : x))
                                      );
                                      fetchMembers().then(setMembers);
                                    }
                                  }}
                                  className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm cursor-pointer"
                                >
                                  마당P 지급하기
                                </button>
                                <button
                                  onClick={async () => {
                                    const reason = window.prompt(
                                      '거부 사유를 적어주세요. (예: 주제와 관계없는 글 / 내용이 사실과 다름)',
                                      ''
                                    );
                                    if (reason === null) return;
                                    const ok = await decidePointRequest(r.id, 'reject', reason);
                                    if (ok) {
                                      setPointRequests(prev =>
                                        prev.map(x =>
                                          x.id === r.id ? { ...x, status: '거부', rejectReason: reason } : x
                                        )
                                      );
                                    }
                                  }}
                                  className="flex-1 py-2.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-extrabold text-sm cursor-pointer"
                                >
                                  지급 거부
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: ADS (제휴광고 + 쿠팡추천상품 등록) */}
              {activeTab === 'ads' && (
                <div className="space-y-6">
                  {/* 쿠팡추천상품 등록 — 방문자 화면에서 옮겨온 관리자 전용 등록 기능입니다 */}
                  <div className="bg-red-50/70 p-5 rounded-3xl border-2 border-red-300 space-y-3">
                    <div className="flex items-center gap-2">
                      <Megaphone className="w-5 h-5 text-red-700" />
                      <h4 className="font-extrabold text-red-950 text-base">
                        쿠팡추천상품 등록 (현재 {coupangProducts.length}개)
                      </h4>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-1 block">
                        쿠팡파트너스 링크 (또는 iframe 코드) *
                      </label>
                      <textarea
                        value={coupangRawInput}
                        onChange={e => setCoupangRawInput(e.target.value)}
                        rows={4}
                        placeholder={'https://coupa.ng/xxxxxx\n\n또는\n\n<iframe src="https://coupa.ng/xxxxxx" width="120" height="240" ...></iframe>'}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm font-mono"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        쿠팡파트너스에서 만드신 단축 URL이나 "이미지+텍스트" HTML 코드를 그대로 붙여넣으시면 됩니다.
                        상품명·이미지·가격은 쿠팡이 자동으로 보여줍니다.
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-1 block">카테고리 *</label>
                      <select
                        value={coupangCategory}
                        onChange={e => setCoupangCategory(e.target.value as CoupangProduct['category'])}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm bg-white font-bold"
                      >
                        {(['클럽', '공인구', '가방·파우치', '장갑·잡화', '의류·신발', '기타'] as CoupangProduct['category'][]).map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <p className="text-[11px] text-slate-500 mt-1">
                        방문자 화면의 "쿠팡추천상품" 탭에서 이 카테고리로 골라볼 수 있습니다.
                      </p>
                    </div>

                    <button
                      onClick={async () => {
                        if (!coupangRawInput.trim()) {
                          alert('쿠팡파트너스 링크(또는 iframe 코드)를 붙여넣어주세요.');
                          return;
                        }
                        setIsAddingCoupang(true);
                        const ok = await addCoupangProduct({ rawInput: coupangRawInput, category: coupangCategory });
                        setIsAddingCoupang(false);
                        if (ok) {
                          setCoupangRawInput('');
                          alert('쿠팡추천상품이 등록되었습니다.');
                        }
                      }}
                      disabled={isAddingCoupang}
                      className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm shadow disabled:opacity-60 cursor-pointer"
                    >
                      {isAddingCoupang ? '등록 중...' : '쿠팡추천상품 등록하기'}
                    </button>

                    {coupangProducts.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-red-200">
                        {coupangProducts.map((cp: any) => (
                          <div key={cp.id} className="flex items-center justify-between gap-3 bg-white rounded-xl px-3 py-2 border border-red-200">
                            <div className="min-w-0">
                              <span className="text-xs font-extrabold text-red-800">[{cp.category}]</span>
                              <p className="text-[11px] text-slate-500 truncate">{cp.embedUrl}</p>
                            </div>
                            <button
                              onClick={() => deleteCoupangProduct(cp.id)}
                              className="p-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold shrink-0 cursor-pointer"
                            >
                              삭제
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-900">
                      추천 용품 & 제휴 업체 광고 관리 ({ads.length}개)
                    </h3>
                  </div>

                  {ads.map(a => (
                    <div
                      key={a.id}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <div>
                        <span className="text-xs font-bold text-purple-700">[{a.companyName}]</span>
                        <h5 className="font-bold text-slate-900 text-sm">{a.title}</h5>
                        <span className="text-xs text-slate-400">📞 {a.phoneNumber}</span>
                      </div>
                      <button
                        onClick={() => deleteAd(a.id)}
                        className="p-2 rounded-xl bg-rose-100 text-rose-700 text-xs font-bold"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'pointshop' && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">마당P 장터 상품 관리 ({pointShopItems.length}개)</h3>
                    <p className="text-xs text-slate-500">
                      여기에 올린 상품이 방문자 화면의 "마당P 장터" 탭에 그대로 보입니다.
                    </p>
                  </div>

                  {/* 새 상품 등록 폼 */}
                  <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 space-y-4">
                    <h4 className="font-extrabold text-emerald-950 text-base">새 상품 등록</h4>

                    {/* ① 상품 종류 고르기 */}
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-1.5 block">① 어떤 상품인가요?</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['쿠팡', '일반'] as const).map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() =>
                              setNewPointShopItem({
                                ...newPointShopItem,
                                sourceType: t,
                                selectedCoupangId: '',
                                coupangEmbedUrl: ''
                              })
                            }
                            className={`py-3 rounded-xl font-extrabold text-sm border-2 cursor-pointer transition-colors ${
                              newPointShopItem.sourceType === t
                                ? 'bg-emerald-700 text-white border-emerald-800'
                                : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-400'
                            }`}
                          >
                            {t === '쿠팡' ? '쿠팡추천상품에서 고르기' : '일반상품 직접 등록'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ② 쿠팡상품이면 목록에서 선택 */}
                    {newPointShopItem.sourceType === '쿠팡' && (
                      <div>
                        <label className="text-sm font-bold text-slate-700 mb-1.5 block">
                          ② 등록해 둔 쿠팡추천상품 중에서 고르기
                        </label>
                        {coupangProducts.length === 0 ? (
                          <p className="text-sm text-rose-700 font-bold bg-rose-50 border border-rose-200 rounded-xl p-3">
                            등록된 쿠팡추천상품이 없습니다. "제휴광고" 탭에서 먼저 쿠팡상품을 등록해주세요.
                          </p>
                        ) : (
                          <select
                            value={newPointShopItem.selectedCoupangId}
                            onChange={e => {
                              const sel = coupangProducts.find((p: any) => p.id === e.target.value);
                              setNewPointShopItem({
                                ...newPointShopItem,
                                selectedCoupangId: e.target.value,
                                coupangEmbedUrl: sel ? sel.embedUrl : '',
                                referenceUrl: sel ? sel.embedUrl : newPointShopItem.referenceUrl,
                                category: sel ? sel.category : newPointShopItem.category
                              });
                            }}
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm"
                          >
                            <option value="">쿠팡상품을 골라주세요</option>
                            {coupangProducts.map((p: any) => (
                              <option key={p.id} value={p.id}>
                                [{p.category}] {p.embedUrl}
                              </option>
                            ))}
                          </select>
                        )}
                        <p className="text-[11px] text-slate-500 mt-1">
                          고르시면 장터에 쿠팡 위젯(사진·가격)이 그대로 보입니다. 상품명과 교환 마당P는 아래에 입력해주세요.
                        </p>
                      </div>
                    )}

                    {/* ③ 공통 입력 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-bold text-slate-700 mb-1.5 block">상품명 *</label>
                        <input
                          type="text"
                          value={newPointShopItem.name}
                          onChange={e => setNewPointShopItem({ ...newPointShopItem, name: e.target.value })}
                          placeholder="예: 지맥스 파크골프 장갑 (양손 세트)"
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-slate-700 mb-1.5 block">분류</label>
                        <input
                          type="text"
                          value={newPointShopItem.category}
                          onChange={e => setNewPointShopItem({ ...newPointShopItem, category: e.target.value })}
                          placeholder="예: 장갑, 공, 가방, 상품권"
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-1.5 block">
                        교환에 필요한 마당P * <span className="text-slate-400 font-medium">— 직접 정하시면 됩니다</span>
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={newPointShopItem.pointCost}
                        onChange={e => setNewPointShopItem({ ...newPointShopItem, pointCost: e.target.value })}
                        placeholder="예: 15000"
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-base font-extrabold"
                      />
                    </div>

                    {newPointShopItem.sourceType === '일반' && (
                      <div>
                        <label className="text-sm font-bold text-slate-700 mb-1.5 block">상품 사진 주소 (선택)</label>
                        <input
                          type="text"
                          value={newPointShopItem.imageUrl}
                          onChange={e => setNewPointShopItem({ ...newPointShopItem, imageUrl: e.target.value })}
                          placeholder="https://... (비워두시면 선물상자 아이콘이 표시됩니다)"
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm font-mono"
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-1.5 block">상품 설명 (선택)</label>
                      <textarea
                        value={newPointShopItem.description}
                        onChange={e => setNewPointShopItem({ ...newPointShopItem, description: e.target.value })}
                        rows={3}
                        placeholder="색상·용량·구성 등 회원분들이 알아야 할 내용을 적어주세요."
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-1.5 block">
                        상품 확인 링크 (선택) — 장터에서 "상품 자세히 보기"로 이동합니다
                      </label>
                      <input
                        type="text"
                        value={newPointShopItem.referenceUrl}
                        onChange={e => setNewPointShopItem({ ...newPointShopItem, referenceUrl: e.target.value })}
                        placeholder="https://www.coupang.com/vp/products/..."
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm font-mono"
                      />
                    </div>

                    <button
                      onClick={async () => {
                        if (!newPointShopItem.name.trim()) {
                          alert('상품명을 입력해주세요.');
                          return;
                        }
                        if (!newPointShopItem.pointCost || Number(newPointShopItem.pointCost) <= 0) {
                          alert('교환에 필요한 마당P를 1 이상으로 입력해주세요.');
                          return;
                        }
                        if (newPointShopItem.sourceType === '쿠팡' && !newPointShopItem.coupangEmbedUrl) {
                          alert('쿠팡추천상품을 목록에서 골라주세요. (또는 "일반상품 직접 등록"을 선택해주세요)');
                          return;
                        }
                        setIsAddingPointShopItem(true);
                        const success = await addPointShopItem({
                          name: newPointShopItem.name.trim(),
                          category: newPointShopItem.category.trim() || '기타',
                          pointCost: Number(newPointShopItem.pointCost),
                          referenceUrl: newPointShopItem.referenceUrl.trim() || undefined,
                          imageUrl: newPointShopItem.imageUrl.trim() || undefined,
                          description: newPointShopItem.description.trim() || undefined,
                          sourceType: newPointShopItem.sourceType,
                          coupangEmbedUrl: newPointShopItem.coupangEmbedUrl || undefined
                        });
                        setIsAddingPointShopItem(false);
                        if (success) {
                          setNewPointShopItem({
                            name: '', category: '', pointCost: '', referenceUrl: '',
                            imageUrl: '', description: '', sourceType: '일반',
                            selectedCoupangId: '', coupangEmbedUrl: ''
                          });
                          alert('마당P 장터에 상품이 등록되었습니다.');
                        }
                      }}
                      disabled={isAddingPointShopItem}
                      className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow disabled:opacity-60 cursor-pointer"
                    >
                      {isAddingPointShopItem ? '등록 중...' : '마당P 장터에 등록하기'}
                    </button>
                  </div>

                  {/* 등록된 상품 목록 */}
                  <div className="space-y-2">
                    {pointShopItems.length === 0 ? (
                      <p className="py-10 text-center text-slate-400 font-bold bg-slate-50 rounded-2xl border border-slate-200">
                        아직 등록된 상품이 없습니다.
                      </p>
                    ) : (
                      pointShopItems.map((item: any) => (
                        <div
                          key={item.id}
                          className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-purple-700">[{item.category}]</span>
                            {item.sourceType === '쿠팡' && (
                              <span className="ml-1.5 text-xs font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">쿠팡</span>
                            )}
                            <h5 className="font-bold text-slate-900 text-sm truncate">{item.name}</h5>
                            <span className="text-sm text-emerald-700 font-extrabold">
                              {Number(item.pointCost).toLocaleString()}마당P
                            </span>
                          </div>
                          <button
                            onClick={() => deletePointShopItem(item.id)}
                            className="p-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold shrink-0 cursor-pointer"
                          >
                            삭제
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'redemptions' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-900">
                      마당P 장터 교환신청 관리 ({redemptions.length}건)
                    </h3>
                    <button
                      onClick={async () => {
                        setIsLoadingRedemptions(true);
                        const data = await fetchRedemptions();
                        setRedemptions(data);
                        setIsLoadingRedemptions(false);
                      }}
                      disabled={isLoadingRedemptions}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-xs font-bold"
                    >
                      {isLoadingRedemptions ? '새로고침 중...' : '새로고침'}
                    </button>
                  </div>

                  {redemptions.length === 0 ? (
                    <p className="text-sm text-slate-400 py-8 text-center">아직 교환 신청이 없습니다.</p>
                  ) : (
                    redemptions.map((r: any) => (
                      <div
                        key={r.id}
                        className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start justify-between gap-3 flex-wrap"
                      >
                        <div className="min-w-0 flex-1">
                          <span
                            className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full mb-1 ${
                              r.status === '접수됨'
                                ? 'bg-amber-100 text-amber-800'
                                : r.status === '발송완료'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {r.status}
                          </span>
                          <h5 className="font-bold text-slate-900 text-sm">{r.itemName}</h5>
                          <p className="text-xs text-slate-500">
                            신청자: {r.userNickname} · 가입 연락처: {formatPhone(r.userPhone)} ·{' '}
                            {Number(r.pointCost).toLocaleString()}마당P 차감
                          </p>

                          {/* 배송지 — 실물을 보내려면 이 정보가 필요합니다 */}
                          <div className="mt-2 bg-white rounded-xl border border-slate-200 p-3 text-xs sm:text-sm space-y-0.5">
                            <p className="font-extrabold text-slate-800">📦 받으실 곳</p>
                            <p className="text-slate-700">
                              <strong>{r.recipientName || '-'}</strong> · {formatPhone(r.recipientPhone)}
                            </p>
                            <p className="text-slate-700">
                              {r.postcode ? `(${r.postcode}) ` : ''}
                              {r.roadAddress || '-'} {r.detailAddress || ''}
                            </p>
                            {r.memo && <p className="text-slate-500">요청사항: {r.memo}</p>}
                            <button
                              type="button"
                              onClick={() => {
                                const text = `${r.recipientName} / ${formatPhone(r.recipientPhone)} / ${
                                  r.postcode ? `(${r.postcode}) ` : ''
                                }${r.roadAddress || ''} ${r.detailAddress || ''}`.trim();
                                navigator.clipboard
                                  ?.writeText(text)
                                  .then(() => alert('배송지를 복사했습니다.'))
                                  .catch(() => alert(text));
                              }}
                              className="mt-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
                            >
                              배송지 복사하기
                            </button>
                          </div>

                          <p className="text-[11px] text-slate-400 mt-1">
                            신청일시: {new Date(r.createdAt).toLocaleString('ko-KR')}
                          </p>
                        </div>
                        {r.status === '접수됨' && (
                          <button
                            onClick={async () => {
                              const ok = await updateRedemptionStatus(r.id, '발송완료');
                              if (ok) {
                                setRedemptions(prev =>
                                  prev.map(x => (x.id === r.id ? { ...x, status: '발송완료' } : x))
                                );
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                          >
                            발송완료 처리
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Danger Zone: Reset to Factory Initial Data */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>데이터가 꼬였거나 초기 샘플 데이터로 복구하고 싶을 때:</span>
                <button
                  onClick={() => {
                    if (confirm('모든 데이터를 초기 기본값으로 리셋하시겠습니까?')) {
                      resetToDefaultData();
                      alert('기본 데이터로 복원되었습니다.');
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>초기 샘플데이터로 전체 복구</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
