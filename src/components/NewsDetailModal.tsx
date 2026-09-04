import React from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { NewsItem } from '../types';
import {
  X,
  Calendar,
  Eye,
  User,
  Share2,
  Volume2,
  VolumeX,
  BookOpen,
  CheckCircle2,
  Clock,
  Tag
} from 'lucide-react';

export const NewsDetailModal: React.FC = () => {
  const { activeModal, closeModal, speakText, isVoiceEnabled } = useParkGolf();

  if (!activeModal || activeModal.type !== 'newsDetail' || !activeModal.data) {
    return null;
  }

  const news: NewsItem = activeModal.data;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: news.title,
        text: `[파크골프마당 가이드] ${news.title}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`[파크골프마당 가이드] ${news.title}\n\n${news.summary}`);
      alert('가이드 제목과 요약 내용이 복사되었습니다.');
    }
  };

  const handleTts = () => {
    const textToRead = `${news.title}. 핵심 요약: ${news.summary}. 내용: ${news.content.replace(/[■•*#]/g, '')}`;
    speakText(textToRead);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col text-slate-800">
        {/* Top bar */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-600 text-white shadow-xs">
              {news.category}
            </span>
            {news.readTime && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-amber-300 border border-slate-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {news.readTime}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTts}
              className="px-3 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-colors cursor-pointer"
              title="음성으로 크게 듣기"
            >
              <Volume2 className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">음성으로 읽어주기</span>
            </button>
            <button
              onClick={closeModal}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 leading-snug mb-3">
              {news.title}
            </h2>

            <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm text-slate-500 pb-4 border-b border-slate-200 gap-2">
              <span className="flex items-center gap-1 font-bold text-slate-700">
                <User className="w-4 h-4 text-blue-700" /> {news.author}
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> {news.date}
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Eye className="w-3.5 h-3.5 text-slate-400" /> {news.views.toLocaleString()}회 조회
                </span>
              </div>
            </div>
          </div>

          {/* Summary Box */}
          <div className="bg-blue-50/90 p-4 sm:p-5 rounded-2xl border border-blue-200 text-blue-950 font-bold text-sm sm:text-base leading-relaxed">
            <span className="inline-block px-2 py-0.5 rounded-md bg-blue-600 text-white text-xs font-black mr-2">
              핵심 요약
            </span>
            {news.summary}
          </div>

          {/* Main Content */}
          <div className="prose prose-slate max-w-none text-sm sm:text-base md:text-lg leading-relaxed space-y-4 text-slate-800 font-medium whitespace-pre-line bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
            {news.content}
          </div>

          {news.tags && news.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <Tag className="w-4 h-4 text-blue-600" />
              {news.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 text-xs font-extrabold border border-blue-200">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {news.source && (
            <div className="text-xs text-slate-400 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span>자료 출처: {news.source}</span>
              <span className="text-slate-400 font-medium">대한파크골프 공식 입문 표준</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs sm:text-sm text-slate-600 font-medium flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-blue-700" />
            초보 파크골퍼 백과사전
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>가이드 공유</span>
            </button>
            <button
              onClick={closeModal}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
