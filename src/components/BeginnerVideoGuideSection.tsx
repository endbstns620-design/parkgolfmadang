import React, { useRef, useState } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { PlayCircle, UploadCloud, Trash2, BookOpen } from 'lucide-react';

const GUIDE_EPISODES = [
  { slot: '1', title: '파크골프 처음이세요?' },
  { slot: '2', title: '준비물 완전정복' },
  { slot: '3', title: '기본 자세와 스윙' },
  { slot: '4', title: '경기 방법과 점수 계산' },
  { slot: '5', title: '에티켓과 매너' }
];

const EpisodeCard: React.FC<{ slot: string; title: string }> = ({ slot, title }) => {
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
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
      <div className="aspect-video bg-slate-900 flex items-center justify-center relative">
        {videoInfo ? (
          <video
            key={videoInfo.uploadedAt}
            src={`/videos/${videoInfo.fileName}`}
            controls
            className="w-full h-full object-contain bg-black"
          />
        ) : (
          <div className="text-center text-slate-400 p-6">
            <PlayCircle className="w-10 h-10 mx-auto mb-2 opacity-60" />
            <p className="text-sm font-bold">아직 업로드된 영상이 없습니다</p>
          </div>
        )}
      </div>

      <div className="p-4">
        <span className="inline-block text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded mb-1">
          {slot}편
        </span>
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900">{title}</h3>

        {isAdmin && (
          <div className="mt-3 flex items-center gap-2">
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
              className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{isUploading ? '업로드 중...' : videoInfo ? '영상 교체' : 'MP4 업로드'}</span>
            </button>
            {videoInfo && (
              <button
                onClick={() => deleteGuideVideo(slot)}
                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer"
                title="영상 삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const BeginnerVideoGuideSection: React.FC = () => {
  return (
    <section className="py-10 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="mb-8 pb-4 border-b border-indigo-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs sm:text-sm font-extrabold mb-2 border border-indigo-300 shadow-2xs">
          <BookOpen className="w-4 h-4 text-indigo-700" />
          <span>🔰 영상으로 배우는 파크골프 초보 가이드</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          초보 가이드 (전 5편)
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-1 font-medium">
          처음 파크골프를 시작하는 분들을 위한 영상 강의입니다. 순서대로 보시면 도움이 됩니다.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {GUIDE_EPISODES.map(ep => (
          <EpisodeCard key={ep.slot} slot={ep.slot} title={ep.title} />
        ))}
      </div>
    </section>
  );
};
