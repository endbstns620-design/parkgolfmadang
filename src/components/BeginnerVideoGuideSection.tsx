import React, { useRef, useState } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { PlayCircle, UploadCloud, Trash2, BookOpen } from 'lucide-react';

// 각 편의 제목은 "무엇을 배우는지"보다 "보시면 뭐가 좋아지는지"가 바로 와닿도록 적었습니다.
const GUIDE_EPISODES = [
  {
    slot: '1',
    title: '파크골프, 오늘 처음이세요?',
    hook: '3분만 보시면 바로 첫 라운딩 나가실 수 있습니다',
    minutes: '약 3분'
  },
  {
    slot: '2',
    title: '채 하나면 충분합니다',
    hook: '뭘 사야 하고 뭘 안 사도 되는지, 돈 아끼는 준비물 이야기',
    minutes: '약 3분'
  },
  {
    slot: '3',
    title: '공이 똑바로 가는 자세',
    hook: '허리에 무리 없이, 이것만 기억하시면 됩니다',
    minutes: '약 3분'
  },
  {
    slot: '4',
    title: '점수 세는 법, 이제 안 헷갈립니다',
    hook: '파·버디·보기 — 어르신 눈높이로 쉽게 풀어드립니다',
    minutes: '약 3분'
  },
  {
    slot: '5',
    title: '어디 가서도 환영받는 매너',
    hook: '이것만 지키시면 처음 만난 분들과도 즐겁게 치실 수 있습니다',
    minutes: '약 3분'
  }
];

const EpisodeCard: React.FC<{
  slot: string;
  title: string;
  hook: string;
  minutes: string;
}> = ({ slot, title, hook, minutes }) => {
  const { guideVideos, isAdmin, uploadGuideVideo, deleteGuideVideo } = useParkGolf();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const videoInfo = guideVideos[slot];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'video/mp4') {
      alert('MP4 형식의 영상 파일만 업로드할 수 있습니다.');
      return;
    }
    setIsUploading(true);
    await uploadGuideVideo(slot, file);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm">
      {/* ── 제목은 영상 위에 ── 몇 편인지, 무슨 내용인지 먼저 보이도록 했습니다 */}
      <div className="px-5 sm:px-7 pt-5 sm:pt-6 pb-4">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* 편 번호 — 순서를 한눈에 */}
          <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-700 text-white flex flex-col items-center justify-center leading-none">
            <span className="text-2xl sm:text-3xl font-black">{slot}</span>
            <span className="text-[11px] sm:text-xs font-bold text-indigo-200 mt-0.5">편</span>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight">
              {title}
            </h3>
            <p className="text-lg sm:text-xl md:text-2xl text-indigo-800 font-bold mt-1.5 leading-snug">
              {hook}
            </p>
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              <span className="text-sm sm:text-base font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                ⏱ {minutes}
              </span>
              {videoInfo ? (
                <span className="text-sm sm:text-base font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  ▶ 지금 보실 수 있습니다
                </span>
              ) : (
                <span className="text-sm sm:text-base font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  준비 중입니다
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 영상 ── */}
      <div className="aspect-video bg-slate-900 flex items-center justify-center relative">
        {videoInfo ? (
          <video
            key={videoInfo.uploadedAt}
            src={`/videos/${videoInfo.fileName}`}
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-contain bg-black"
          />
        ) : (
          <div className="text-center text-slate-400 p-6">
            <PlayCircle className="w-14 h-14 mx-auto mb-3 opacity-60" />
            <p className="text-lg sm:text-xl font-bold">영상을 준비하고 있습니다</p>
            <p className="text-base text-slate-500 mt-1">곧 올려드리겠습니다</p>
          </div>
        )}
      </div>

      {/* ── 관리자 전용 업로드 ── */}
      {isAdmin && (
        <div className="px-5 sm:px-7 py-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4"
            onChange={handleFileSelect}
            className="hidden"
            id={`video-upload-${slot}`}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            <UploadCloud className="w-5 h-5" />
            <span>{isUploading ? '업로드 중...' : videoInfo ? `${slot}편 영상 교체` : `${slot}편 MP4 업로드`}</span>
          </button>
          {videoInfo && (
            <button
              onClick={() => deleteGuideVideo(slot)}
              className="px-4 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-base flex items-center gap-1.5 cursor-pointer"
              title="영상 삭제"
            >
              <Trash2 className="w-5 h-5" />
              <span className="hidden sm:inline">삭제</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export const BeginnerVideoGuideSection: React.FC = () => {
  const { isAdmin, guideVideos } = useParkGolf();
  const uploadedCount = GUIDE_EPISODES.filter(ep => guideVideos[ep.slot]).length;

  return (
    <section className="py-10 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="mb-8 pb-5 border-b-2 border-indigo-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-900 text-sm sm:text-base font-extrabold mb-2.5 border border-indigo-300">
          <BookOpen className="w-4 h-4 text-indigo-700" />
          <span>🔰 영상으로 배우는 파크골프</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          초보 가이드 <span className="text-indigo-700">전 5편</span>
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl text-slate-600 mt-2.5 font-bold leading-relaxed">
          1편부터 차례대로 보시면 됩니다.{' '}
          <br className="sm:hidden" />
          한 편이 3분이면 끝납니다.
        </p>
        {isAdmin && (
          <p className="mt-3 text-base font-bold text-indigo-800 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2.5 inline-block">
            관리자 모드 — 각 편 아래 버튼으로 영상을 올리거나 지우실 수 있습니다 ({uploadedCount}/5편 등록됨)
          </p>
        )}
      </div>

      {/* 1편부터 5편까지 위에서 아래로 한 줄씩 — 순서대로 보기 쉽게 세로로 정렬했습니다 */}
      <div className="flex flex-col gap-7 sm:gap-9">
        {GUIDE_EPISODES.map(ep => (
          <EpisodeCard key={ep.slot} slot={ep.slot} title={ep.title} hook={ep.hook} minutes={ep.minutes} />
        ))}
      </div>

      <p className="mt-8 text-center text-lg sm:text-xl font-bold text-slate-500 leading-relaxed">
        5편까지 다 보셨다면, 이제 <span className="text-emerald-700">가까운 구장</span>으로 나가보세요!
      </p>
    </section>
  );
};
