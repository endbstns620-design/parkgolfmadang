import React, { useState } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { MatchingPost } from '../types';
import {
  X,
  Users,
  MapPin,
  Calendar,
  Clock,
  PhoneCall,
  MessageCircle,
  Send,
  CheckCircle2,
  ShieldCheck,
  Share2,
  Timer,
  Trash2,
  ShieldAlert,
  AlertTriangle,
  AlertOctagon,
  Sparkles
} from 'lucide-react';
import { getMeetDateBadgeInfo } from '../utils/matchAutoCleaner';
import { validatePostContent, ModerationResult } from '../utils/contentModeration';

export const MatchingPostModal: React.FC = () => {
  const { activeModal, closeModal, addMatch, addMatchComment, matches, updateMatchStatus, deleteMatch, isAdmin, isMyMatch, currentUser, openModal } = useParkGolf();

  // State for writing a new post
  const [newTitle, setNewTitle] = useState('');
  const [newRegion, setNewRegion] = useState('서울/경기/인천');
  const [newCourseName, setNewCourseName] = useState('');
  const [newMeetDate, setNewMeetDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
  });
  const [newMeetTime, setNewMeetTime] = useState('오전 09:00');
  const [newMaxCount, setNewMaxCount] = useState(4);
  const [newCurrentCount, setNewCurrentCount] = useState(1);
  const [newAuthorName, setNewAuthorName] = useState('');
  const [newAuthorPhone, setNewAuthorPhone] = useState('');
  const [newHandicap, setNewHandicap] = useState('타수 상관없음 / 초보 환영');
  const [newCostShare, setNewCostShare] = useState('구장 입장료 각자 정산');
  const [newDescription, setNewDescription] = useState('');

  // Moderation Blocked Modal State
  const [blockedModal, setBlockedModal] = useState<ModerationResult | null>(null);

  // State for adding a comment to existing post
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentPhone, setCommentPhone] = useState('');
  const [commentContent, setCommentContent] = useState('');

  if (!activeModal || (activeModal.type !== 'matchDetail' && activeModal.type !== 'newMatch')) {
    return null;
  }

  const isNewPost = activeModal.type === 'newMatch';

  // 새 글쓰기는 회원만 가능합니다 — 비회원이면 로그인 안내로 대체합니다.
  if (isNewPost && !currentUser) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={closeModal}>
        <div className="bg-white rounded-3xl max-w-sm w-full p-7 text-center" onClick={e => e.stopPropagation()}>
          <p className="text-lg font-extrabold text-slate-900 mb-2">로그인이 필요합니다</p>
          <p className="text-sm text-slate-500 mb-5">동반자 모집글은 회원만 작성할 수 있습니다.</p>
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

  const post: MatchingPost | undefined = isNewPost
    ? undefined
    : matches.find(m => m.id === activeModal.data?.id) || activeModal.data;

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!newTitle.trim() || !newCourseName.trim() || !newAuthorPhone.trim()) {
      alert('제목, 구장명, 연락처를 모두 입력해주세요.');
      return;
    }

    // 1. Automated Content & Spam Moderation Check
    const moderationResult = validatePostContent({
      title: newTitle.trim(),
      courseName: newCourseName.trim(),
      authorName: currentUser.nickname,
      authorPhone: newAuthorPhone.trim(),
      description: newDescription.trim()
    });

    if (!moderationResult.isValid) {
      // Show blocking popup and abort submission immediately
      setBlockedModal(moderationResult);
      return;
    }

    addMatch({
      title: newTitle.trim(),
      region: newRegion,
      courseName: newCourseName.trim(),
      meetDate: newMeetDate.trim() || new Date().toISOString().slice(0, 10),
      meetTime: newMeetTime.trim(),
      currentCount: Number(newCurrentCount),
      maxCount: Number(newMaxCount),
      status: '모집중',
      authorName: currentUser.nickname,
      authorPhone: newAuthorPhone.trim(),
      handicap: newHandicap.trim(),
      costShare: newCostShare.trim(),
      description: newDescription.trim() || '즐겁게 매너 지키며 함께 라운딩하실 분 환영합니다!'
    });

    alert('라운딩 동반자 모집글이 성공적으로 등록되었습니다!');
    closeModal();
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;
    if (!currentUser) {
      openModal('auth');
      return;
    }
    if (!commentContent.trim()) {
      alert('신청 내용을 입력해주세요.');
      return;
    }

    // Moderate comments as well
    const moderationResult = validatePostContent({
      authorName: currentUser.nickname,
      authorPhone: commentPhone.trim(),
      content: commentContent.trim()
    });

    if (!moderationResult.isValid) {
      setBlockedModal(moderationResult);
      return;
    }

    addMatchComment(post.id, {
      authorName: currentUser.nickname,
      authorPhone: commentPhone.trim(),
      content: commentContent.trim()
    });

    setCommentContent('');
    alert('참여 신청 댓글이 등록되었습니다.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col text-slate-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div>
            <div className="text-xs sm:text-sm font-bold text-rose-100 flex items-center gap-1 mb-1">
              <Users className="w-4 h-4" />
              <span>{isNewPost ? '동호회 라운딩 매칭' : post?.region}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold">
              {isNewPost ? '라운딩 동반자 모집글 올리기' : post?.title}
            </h2>
          </div>

          <button
            onClick={closeModal}
            className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 text-sm sm:text-base">
          {isNewPost ? (
            /* Writing Form */
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                  모집글 제목 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 이번 주 목요일 양평 36홀 2분 모십니다 (초보 환영)"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                    지역 선택 *
                  </label>
                  <select
                    value={newRegion}
                    onChange={e => setNewRegion(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white"
                  >
                    {['서울/경기/인천', '강원', '충청/대전/세종', '전라/광주', '경상/대구/부산/울산', '제주'].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                    방문할 구장명 *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="예: 화천 산천어 파크골프장"
                    value={newCourseName}
                    onChange={e => setNewCourseName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                    만나는 날짜 (일시) *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().slice(0, 10)}
                    value={newMeetDate}
                    onChange={e => setNewMeetDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                    만나는 시간 *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="예: 오전 09:30"
                    value={newMeetTime}
                    onChange={e => setNewMeetTime(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Auto cleanup info */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
                <Timer className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>스마트 자동 정리:</strong> 만나는 날짜가 지나거나 마감 처리된 글은 <strong>1일(24시간) 후 자동으로 삭제</strong>됩니다.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                    현재 확정 인원
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={newCurrentCount}
                    onChange={e => setNewCurrentCount(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-300 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                    총 모집 정원
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="8"
                    value={newMaxCount}
                    onChange={e => setNewMaxCount(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                    작성자
                  </label>
                  <div className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-600">
                    {currentUser?.nickname}
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                    안심 연락처 (전화/문자) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="예: 010-1234-5678"
                    value={newAuthorPhone}
                    onChange={e => setNewAuthorPhone(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                  희망 핸디 / 타수 조건
                </label>
                <input
                  type="text"
                  placeholder="예: 초보 환영, 평균 60~70타, 매너 좋은 분"
                  value={newHandicap}
                  onChange={e => setNewHandicap(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                  상세 설명 및 안내사항
                </label>
                <textarea
                  rows={3}
                  placeholder="카풀 가능 여부, 라운딩 후 식사 계획 등 자유롭게 남겨주세요."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              {/* Safety & Real-time Auto-Moderation Notice */}
              <div className="p-3.5 bg-rose-50/90 rounded-2xl border border-rose-200/80 text-rose-950 text-xs font-semibold flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-extrabold text-rose-900 flex items-center gap-1">
                    <span>🛡️ 클린 파크골프 안전 시스템 가동 중</span>
                  </div>
                  <p className="text-rose-800 text-[11px] leading-relaxed">
                    스팸, 음란물, 불법 도박 및 파크골프와 무관한 상업적 광고글은 실시간 자동 필터링에 의해 <strong>등록이 즉시 차단</strong>됩니다.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base shadow-lg transition-all cursor-pointer"
              >
                모집글 등록 완료하기
              </button>
            </form>
          ) : post ? (
            /* Post View & Comment Thread */
            <div className="space-y-6">
              {/* Top status */}
              {(() => {
                const badgeInfo = getMeetDateBadgeInfo(post);
                return (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black shadow-2xs ${badgeInfo.badgeClass}`}
                        >
                          {badgeInfo.dDayText}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">{post.createdAt} 등록</span>
                      </div>

                      <span className="text-sm font-extrabold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                        모집 인원: {post.currentCount}명 / {post.maxCount}명
                      </span>
                    </div>

                    {badgeInfo.autoDeleteNotice && (
                      <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-2">
                        <Timer className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>{badgeInfo.autoDeleteNotice}</span>
                      </div>
                    )}
                  </>
                );
              })()}

              {/* Specs Box */}
              <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200 space-y-2 text-xs sm:text-sm">
                <div><strong>📍 구장:</strong> {post.courseName} ({post.region})</div>
                <div><strong>📅 만나는 날짜:</strong> <span className="font-extrabold text-slate-900">{post.meetDate}</span> {post.meetTime}</div>
                <div><strong>👤 작성자:</strong> {post.authorName}</div>
                <div><strong>📞 연락처:</strong> <a href={`tel:${post.authorPhone}`} className="text-blue-700 font-bold underline">{post.authorPhone}</a></div>
                <div><strong>⛳ 희망 핸디:</strong> {post.handicap}</div>
                <div><strong>💰 비용 정산:</strong> {post.costShare}</div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-extrabold text-slate-900 mb-1 text-sm sm:text-base">모집 상세 안내</h4>
                <p className="text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {post.description}
                </p>
              </div>

              {/* Status and Post Management Bar (본인 글이거나 관리자일 때만 노출) */}
              {(isAdmin || isMyMatch(post.id)) && (
              <div className="p-3.5 bg-slate-100 rounded-2xl flex items-center justify-between text-xs sm:text-sm">
                <span className="font-extrabold text-slate-700">모집글 상태:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      updateMatchStatus(post.id, post.status === '모집중' ? '마감' : '모집중');
                    }}
                    className={`px-3 py-1.5 rounded-xl font-black transition-colors cursor-pointer ${
                      post.status === '모집중'
                        ? 'bg-slate-700 text-white hover:bg-slate-800'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {post.status === '모집중' ? '🔴 마감으로 변경' : '🟢 다시 모집중으로 변경'}
                  </button>
                  <button
                    onClick={() => {
                      deleteMatch(post.id);
                      closeModal();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-100 text-rose-800 hover:bg-rose-200 font-bold cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>삭제</span>
                  </button>
                </div>
              </div>
              )}

              {/* Quick Call Action */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${post.authorPhone}`}
                  className="py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-center flex items-center justify-center gap-2 shadow cursor-pointer transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>작성자에게 전화하기</span>
                </a>
                <a
                  href={`sms:${post.authorPhone}?body=${encodeURIComponent(`[파크골프마당] ${post.title} 글 보고 동반자 신청 문의드립니다.`)}`}
                  className="py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-green-950 font-extrabold text-center flex items-center justify-center gap-2 shadow cursor-pointer transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>문자로 신청하기</span>
                </a>
              </div>

              {/* Comments / Join requests */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="font-extrabold text-slate-900 mb-3 text-sm sm:text-base flex items-center gap-1.5">
                  <MessageCircle className="w-5 h-5 text-rose-600" />
                  <span>참여 신청 댓글 ({post.comments.length}개)</span>
                </h4>

                {post.comments.length === 0 ? (
                  <p className="text-xs sm:text-sm text-slate-500 italic mb-4">
                    아직 달린 신청 댓글이 없습니다. 아래 양식을 작성해 첫 번째로 신청해 보세요!
                  </p>
                ) : (
                  <div className="space-y-2 mb-4">
                    {post.comments.map(c => (
                      <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm">
                        <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                          <span>{c.authorName}</span>
                          <span className="text-slate-400 text-xs font-normal">{c.createdAt}</span>
                        </div>
                        <p className="text-slate-700">{c.content}</p>
                        {c.authorPhone && (
                          <div className="text-[11px] text-slate-500 pt-1">
                            연락처: {c.authorPhone}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment Form */}
                <form onSubmit={handleAddComment} className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="성함 / 닉네임"
                      value={commentAuthor}
                      onChange={e => setCommentAuthor(e.target.value)}
                      className="p-2.5 rounded-xl border border-slate-300 font-medium text-xs sm:text-sm"
                    />
                    <input
                      type="text"
                      placeholder="연락처 (선택)"
                      value={commentPhone}
                      onChange={e => setCommentPhone(e.target.value)}
                      className="p-2.5 rounded-xl border border-slate-300 font-medium text-xs sm:text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="참여 신청 한마디 (예: 저도 참가 희망합니다!)"
                      value={commentContent}
                      onChange={e => setCommentContent(e.target.value)}
                      className="flex-1 p-2.5 rounded-xl border border-slate-300 font-medium text-xs sm:text-sm"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-rose-600 text-white rounded-xl font-bold text-xs sm:text-sm hover:bg-rose-700 shrink-0"
                    >
                      신청 등록
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
        </div>

        {/* Real-time Blocked Content Warning Popup Modal */}
        {blockedModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-rose-500 overflow-hidden text-slate-800">
              {/* Header */}
              <div className="bg-gradient-to-r from-rose-600 to-red-600 text-white p-5 sm:p-6 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 mb-3 text-white shadow-inner">
                  <AlertOctagon className="w-8 h-8 text-white animate-pulse" />
                </div>
                <div className="inline-block px-3 py-1 rounded-full text-xs font-black bg-white/25 text-rose-100 mb-2">
                  🚨 부적절 / 스팸 게시물 자동 차단
                </div>
                <h3 className="text-xl sm:text-2xl font-black leading-snug">
                  해당 글은 파크골프와 무관하거나<br />부적절한 내용이므로 등록이 불가합니다.
                </h3>
              </div>

              {/* Details */}
              <div className="p-5 sm:p-6 space-y-4 text-sm">
                <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 space-y-2">
                  <div className="font-extrabold text-rose-950 flex items-center gap-1.5 text-sm sm:text-base">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>차단 사유 : {blockedModal.reason}</span>
                  </div>
                  {blockedModal.detail && (
                    <p className="text-rose-800 font-medium text-xs sm:text-sm pl-6.5 leading-relaxed">
                      {blockedModal.detail}
                    </p>
                  )}
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-green-700" />
                    <span>파크골프마당 게시판 운영 원칙</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1 text-xs leading-relaxed">
                    <li>순수 파크골프 라운딩 동반자(조편성) 모집글만 등록 가능합니다.</li>
                    <li>성인/음란물, 불법 도박, 무단 상업 광고, 사기/스팸은 엄격히 차단됩니다.</li>
                    <li>비방, 욕설, 타인 명의 도용 시 이용이 영구 제한될 수 있습니다.</li>
                  </ul>
                </div>

                <button
                  onClick={() => setBlockedModal(null)}
                  className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-base shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>확인 (내용 수정하러 가기)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
