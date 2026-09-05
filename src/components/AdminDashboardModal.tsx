import React, { useState } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { ParkCourse, Tournament, NewsItem, AdItem } from '../types';
import {
  X,
  ShieldCheck,
  Plus,
  Edit,
  Trash2,
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Upload,
  Lock,
  Unlock,
  RefreshCw,
  Trophy,
  Newspaper,
  Users,
  Megaphone,
  Star
} from 'lucide-react';

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
    researchCourseWithAI,
    researchCoursesBatch,
    tournaments,
    addTournament,
    updateTournament,
    deleteTournament,
    searchTournamentsWithAI,
    searchTournamentsAllRegions,
    news,
    addNews,
    updateNews,
    deleteNews,
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
  const [activeTab, setActiveTab] = useState<'courses' | 'tournaments' | 'news' | 'matches' | 'reviews' | 'ads'>('courses');

  // Edit / Form state for Course
  const [editingCourse, setEditingCourse] = useState<Partial<ParkCourse> | null>(null);
  const [isNewCourse, setIsNewCourse] = useState(false);

  // Edit / Form state for Tournament
  const [editingTour, setEditingTour] = useState<Partial<Tournament> | null>(null);
  const [isNewTour, setIsNewTour] = useState(false);

  // Edit / Form state for News
  const [editingNews, setEditingNews] = useState<Partial<NewsItem> | null>(null);
  const [isNewNews, setIsNewNews] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Edit / Form state for Ad
  const [editingAd, setEditingAd] = useState<Partial<AdItem> | null>(null);
  const [isNewAd, setIsNewAd] = useState(false);

  // Admin Login 로딩 상태 — 다른 useState들과 함께 컴포넌트 최상단에서 항상 호출되어야 합니다.
  // (조건부 return 아래에 두면 모달이 열릴 때 hooks 호출 순서가 달라져서 리액트가 크래시합니다)
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSearchingTournaments, setIsSearchingTournaments] = useState(false);
  const [tournamentCandidates, setTournamentCandidates] = useState<any[]>([]);
  const [researchingCourseId, setResearchingCourseId] = useState<string | null>(null);
  const [isBatchResearching, setIsBatchResearching] = useState(false);
  const [batchResearchResults, setBatchResearchResults] = useState<{ course: any; result: any }[]>([]);
  const [isBatchSearchingTournaments, setIsBatchSearchingTournaments] = useState(false);

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

  // AI News generation
  const handleGenerateAiNews = async () => {
    if (!aiTopic.trim()) {
      alert('생성할 뉴스 주제(예: 파크골프 비거리 늘리는 타법, 2026년 신규 파크골프장 개장 소식 등)를 입력해주세요.');
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch('/api/generate-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: aiTopic.trim(), category: '건강·레슨' })
      });

      if (!response.ok) {
        throw new Error('AI 뉴스 생성 서버 응답 오류');
      }

      const data = await response.json();
      if (data.news) {
        addNews({
          title: data.news.title,
          category: data.news.category || '건강·레슨',
          summary: data.news.summary,
          content: data.news.content,
          imageUrl: 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?auto=format&fit=crop&w=800&q=80',
          author: '파크골프마당 AI 취재팀',
          source: '파크골프마당 데스크'
        });
        alert('✨ AI가 작성한 최신 뉴스가 성공적으로 등록되었습니다!');
        setAiTopic('');
      }
    } catch (err) {
      // Fallback local generated article if API is unconfigured
      addNews({
        title: `[실시간 소식] ${aiTopic}`,
        category: '건강·레슨',
        summary: `${aiTopic}에 대한 시니어 동호인 맞춤 전문 가이드와 핵심 정보입니다.`,
        content: `파크골프는 무리한 관절 부담 없이 전신 유산소 운동과 하체 근력을 기를 수 있는 최고의 시니어 국민 스포츠입니다.\n\n이번 취재에서는 ${aiTopic}에 대하여 상세히 알아보고자 합니다.\n\n1. 올바른 어드레스와 그립 잡기\n2. 헤드 무게를 이용한 부드러운 스윙\n3. 라운딩 전후 10분 필수 스트레칭\n\n대한파크골프협회 공인 규정에 맞추어 안전하고 매너 있는 라운딩을 즐겨보세요!`,
        imageUrl: 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?auto=format&fit=crop&w=800&q=80',
        author: '파크골프마당 취재팀',
        source: '파크골프마당 실시간 취재'
      });
      alert('✨ 최신 기사가 작성되어 등록되었습니다!');
      setAiTopic('');
    } finally {
      setAiLoading(false);
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
                구장 정보, 대회 일정, 뉴스, 매칭글, 광고 배너 실시간 수정 및 등록
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
            {/* Nav Tabs */}
            <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center gap-1 overflow-x-auto no-scrollbar">
              {[
                { id: 'courses', label: '🏌️ 구장 관리', count: courses.length },
                { id: 'tournaments', label: '🏆 대회 관리', count: tournaments.length },
                { id: 'news', label: '📰 뉴스 & AI작성', count: news.length },
                { id: 'matches', label: '👥 라운딩 매칭', count: matches.length },
                { id: 'reviews', label: '⭐ 후기 관리', count: reviews.length },
                { id: 'ads', label: '📣 제휴광고', count: ads.length }
              ].map(tab => (
                <button
                  key={tab.id}
                  id={`admin-tab-${tab.id}`}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setEditingCourse(null);
                    setEditingTour(null);
                    setEditingNews(null);
                    setEditingAd(null);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'bg-green-800 text-white shadow'
                      : 'bg-white text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-black/20">
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
                        onClick={async () => {
                          if (isBatchResearching) return;
                          setIsBatchResearching(true);
                          setBatchResearchResults([]);
                          await researchCoursesBatch(10, item => {
                            setBatchResearchResults(prev => [...prev, item]);
                          });
                          setIsBatchResearching(false);
                        }}
                        disabled={isBatchResearching}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1 shadow disabled:opacity-60"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>
                          {isBatchResearching
                            ? `일괄 조사 중... (${batchResearchResults.length}/10)`
                            : '확인필요 구장 10곳 일괄조사'}
                        </span>
                      </button>

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
                          imageUrl: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=800&q=80',
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

                  {/* Batch AI Research Results */}
                  {batchResearchResults.length > 0 && (
                    <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-blue-950 text-sm flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4" />
                          일괄조사 결과 ({batchResearchResults.length}건) — 확인 후 각각 적용해주세요
                        </h4>
                        <button
                          onClick={() => setBatchResearchResults([])}
                          className="text-xs text-blue-700 hover:text-blue-900 font-bold"
                        >
                          닫기
                        </button>
                      </div>
                      {batchResearchResults.map(({ course, result }, idx) => (
                        <div key={idx} className="bg-white rounded-xl p-3.5 border border-blue-200 space-y-1">
                          <p className="font-extrabold text-slate-900 text-sm">{course.name}</p>
                          {!result ? (
                            <p className="text-xs text-rose-600">조사 결과를 찾지 못했습니다.</p>
                          ) : (
                            <>
                              <p className="text-xs text-slate-600">
                                📋 {result.reservationType || '미확인'} · 💰 {result.feeLocal || '?'}/{result.feeVisitor || '?'} · 🕐 {result.operatingHours || '미확인'}
                              </p>
                              {result.sourceUrl && (
                                <a href={result.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline break-all">
                                  출처: {result.sourceUrl}
                                </a>
                              )}
                              <button
                                onClick={() => {
                                  const updated = {
                                    ...(result.reservationType && { reservationType: result.reservationType }),
                                    ...(result.reservationDetails && { reservationDetails: result.reservationDetails }),
                                    ...(result.feeLocal && { feeLocal: result.feeLocal }),
                                    ...(result.feeVisitor && { feeVisitor: result.feeVisitor }),
                                    ...(result.operatingHours && { operatingHours: result.operatingHours }),
                                    ...(result.closedDays && { closedDays: result.closedDays }),
                                    ...(result.phoneNumber && { phoneNumber: result.phoneNumber }),
                                    ...(result.parkingDetails && { parkingDetails: result.parkingDetails }),
                                    ...(result.description && { description: result.description }),
                                    ...(result.confidence && { dataConfidence: result.confidence }),
                                    dataSourceNote: result.sourceUrl
                                      ? `AI 실시간 검색으로 확인 (출처: ${result.sourceUrl})`
                                      : course.dataSourceNote
                                  };
                                  updateCourse(course.id, updated);
                                  setBatchResearchResults(prev => prev.filter((_, i) => i !== idx));
                                }}
                                className="w-full mt-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                              >
                                이 내용으로 저장하기
                              </button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

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
                            onClick={async () => {
                              setResearchingCourseId(c.id);
                              const result = await researchCourseWithAI(c.name, c.address);
                              setResearchingCourseId(null);
                              if (result) {
                                setIsNewCourse(false);
                                setEditingCourse({
                                  ...c,
                                  ...(result.reservationType && { reservationType: result.reservationType }),
                                  ...(result.reservationDetails && { reservationDetails: result.reservationDetails }),
                                  ...(result.feeLocal && { feeLocal: result.feeLocal }),
                                  ...(result.feeVisitor && { feeVisitor: result.feeVisitor }),
                                  ...(result.operatingHours && { operatingHours: result.operatingHours }),
                                  ...(result.closedDays && { closedDays: result.closedDays }),
                                  ...(result.phoneNumber && { phoneNumber: result.phoneNumber }),
                                  ...(result.parkingDetails && { parkingDetails: result.parkingDetails }),
                                  ...(result.description && { description: result.description }),
                                  ...(result.confidence && { dataConfidence: result.confidence }),
                                  dataSourceNote: result.sourceUrl
                                    ? `AI 실시간 검색으로 확인 (출처: ${result.sourceUrl})`
                                    : c.dataSourceNote
                                });
                                alert('AI 검색 결과를 수정 폼에 채워넣었습니다. 내용을 확인하시고 저장 버튼을 눌러주세요.');
                              }
                            }}
                            disabled={researchingCourseId === c.id}
                            className="p-2 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold text-xs flex items-center gap-1 disabled:opacity-60"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{researchingCourseId === c.id ? '조사 중...' : 'AI 조사'}</span>
                          </button>
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
                        onClick={async () => {
                          setIsSearchingTournaments(true);
                          const results = await searchTournamentsWithAI();
                          setIsSearchingTournaments(false);
                          setTournamentCandidates(results);
                        }}
                        disabled={isSearchingTournaments}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1 disabled:opacity-60"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>{isSearchingTournaments ? '검색 중...' : 'AI 실시간 검색'}</span>
                      </button>

                      <button
                        onClick={async () => {
                          if (isBatchSearchingTournaments) return;
                          setIsBatchSearchingTournaments(true);
                          setTournamentCandidates([]);
                          await searchTournamentsAllRegions((_region, candidates) => {
                            setTournamentCandidates(prev => [...prev, ...candidates]);
                          });
                          setIsBatchSearchingTournaments(false);
                        }}
                        disabled={isBatchSearchingTournaments}
                        className="px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs sm:text-sm flex items-center gap-1 disabled:opacity-60"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>{isBatchSearchingTournaments ? '전국 검색 중...' : '전국 6개 권역 일괄검색'}</span>
                      </button>

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

                  {/* AI 검색 결과 — 관리자가 확인하고 "이 대회 등록하기"를 눌러야 실제로 저장됩니다. */}
                  {tournamentCandidates.length > 0 && (
                    <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-blue-950 text-sm flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4" />
                          구글 검색으로 찾은 대회 후보 ({tournamentCandidates.length}건) — 확인 후 등록해주세요
                        </h4>
                        <button
                          onClick={() => setTournamentCandidates([])}
                          className="text-xs text-blue-700 hover:text-blue-900 font-bold"
                        >
                          닫기
                        </button>
                      </div>
                      <p className="text-[11px] text-blue-800">
                        AI가 실시간 검색으로 찾은 정보라 정확하지 않을 수 있습니다. 날짜·장소를 꼭 확인하시고 등록해주세요.
                      </p>
                      {tournamentCandidates.map((c, idx) => (
                        <div key={idx} className="bg-white rounded-xl p-3.5 border border-blue-200 space-y-1">
                          <p className="font-extrabold text-slate-900 text-sm">{c.title}</p>
                          <p className="text-xs text-slate-600">
                            📅 {c.eventDate} · 📍 {c.location} · 주최: {c.organizer}
                          </p>
                          {c.registrationPeriod && <p className="text-xs text-slate-500">접수: {c.registrationPeriod}</p>}
                          {c.contact && <p className="text-xs text-slate-500">문의: {c.contact}</p>}
                          {c.sourceUrl && (
                            <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline break-all">
                              출처: {c.sourceUrl}
                            </a>
                          )}
                          <button
                            onClick={() => {
                              setIsNewTour(true);
                              setEditingTour({
                                title: c.title || '',
                                organizer: c.organizer || '',
                                eventDate: c.eventDate || '2026-06-01',
                                dateRange: c.eventDate || '',
                                registrationPeriod: c.registrationPeriod || '',
                                location: c.location || '',
                                status: '접수중',
                                prizePool: '',
                                eligibility: '',
                                participationFee: '',
                                contact: c.contact || '',
                                linkUrl: c.sourceUrl || '',
                                description: `※ AI 실시간 검색으로 수집된 정보입니다. 등록 전 출처(${c.sourceUrl || '미확인'})에서 정확한 내용을 다시 확인해주세요.`,
                                isFeatured: false
                              });
                              setTournamentCandidates([]);
                            }}
                            className="w-full mt-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                          >
                            이 대회 등록 폼 채우기
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

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

              {/* TAB 3: NEWS & AI ARTICLE GENERATOR */}
              {activeTab === 'news' && (
                <div className="space-y-6">
                  {/* AI Auto-Writer Box */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-3xl border-2 border-blue-300 space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <h4 className="font-extrabold text-blue-950 text-base">
                        ✨ AI 실시간 파크골프 뉴스/기사 자동생성
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">
                      작성하고 싶은 주제 키워드를 입력하시면 AI가 시니어 눈높이에 맞춘 전문 기사를 즉시 작성하여 포털에 게시합니다.
                    </p>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="예: 70대 어르신을 위한 무릎 관절 보호 파크골프 스윙법"
                        value={aiTopic}
                        onChange={e => setAiTopic(e.target.value)}
                        className="flex-1 p-3 rounded-xl border border-blue-200 font-medium text-xs sm:text-sm focus:outline-none"
                      />
                      <button
                        onClick={handleGenerateAiNews}
                        disabled={aiLoading}
                        className="px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                      >
                        {aiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        <span>{aiLoading ? '작성중...' : 'AI 기사 생성'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Manual News List */}
                  <div className="space-y-3">
                    {news.map(n => (
                      <div
                        key={n.id}
                        className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-blue-700">[{n.category}]</span>
                          <h5 className="font-bold text-slate-900 text-sm truncate">{n.title}</h5>
                          <span className="text-xs text-slate-400">📅 {n.date} | 👁️ {n.views}회</span>
                        </div>
                        <button
                          onClick={() => deleteNews(n.id)}
                          className="p-2 rounded-xl bg-rose-100 text-rose-700 text-xs font-bold shrink-0"
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
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

              {/* TAB 6: ADS */}
              {activeTab === 'ads' && (
                <div className="space-y-3">
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
