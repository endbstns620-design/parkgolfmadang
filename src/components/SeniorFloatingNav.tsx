import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const SeniorFloatingNav: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!showScrollTop) return null;

  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-40 flex flex-col items-end gap-2.5">
      {/* Scroll to top button */}
      <button
        id="btn-scroll-to-top"
        onClick={scrollToTop}
        className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xl hover:bg-black transition-all hover:scale-105 border-2 border-slate-700"
        title="맨 위로 가기"
        aria-label="맨 위로 이동"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  );
};
