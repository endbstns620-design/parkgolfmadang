import React, { useEffect, useState } from 'react';
import { Smartphone, Download, Share, PlusSquare } from 'lucide-react';

// 브라우저마다 설치 유도 방식이 다릅니다:
// - 안드로이드(크롬 등): beforeinstallprompt 이벤트를 잡아서 버튼 하나로 바로 설치 가능
// - 아이폰(사파리): 이런 이벤트 자체가 없어서, "공유 → 홈 화면에 추가"를 직접 안내합니다.
// 화면 한 자리를 차지하는 배너 대신, 오른쪽 아래 작은 아이콘 버튼 + 말풍선(툴팁) 형태로
// 최소한의 공간만 쓰도록 만들었습니다.
export const InstallAppBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);
    if (standalone) return;

    const ua = window.navigator.userAgent;
    const iosDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(iosDevice);

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      setShowTooltip(true);
      return;
    }
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') setJustInstalled(true);
    setDeferredPrompt(null);
    setShowTooltip(false);
  };

  if (isStandalone) return null;

  return (
    <div
      className="fixed z-40 bottom-24 right-4 sm:bottom-8 sm:right-8"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* 말풍선 툴팁 */}
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-2 w-60 sm:w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 animate-in fade-in duration-150">
          {justInstalled ? (
            <p className="text-sm font-black text-emerald-700 text-center">
              🎉 설치 완료! 홈 화면에서 확인해보세요.
            </p>
          ) : isIOS ? (
            <>
              <p className="text-xs font-black text-slate-900 mb-1.5">휴대폰 모드로 바로가기</p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                하단의{' '}
                <span className="inline-flex items-center gap-0.5 font-bold text-blue-600">
                  공유 <Share className="w-3 h-3" />
                </span>{' '}
                버튼 →{' '}
                <span className="inline-flex items-center gap-0.5 font-bold text-slate-800">
                  홈 화면에 추가 <PlusSquare className="w-3 h-3" />
                </span>
              </p>
            </>
          ) : (
            <>
              <p className="text-xs font-black text-slate-900 mb-2">휴대폰 모드로 바로가기</p>
              <button
                onClick={handleInstall}
                disabled={!deferredPrompt}
                className="w-full py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
              >
                <Download className="w-3.5 h-3.5" />
                앱처럼 설치하기
              </button>
            </>
          )}
          {/* 말풍선 꼬리 */}
          <div className="absolute top-full right-5 w-3 h-3 bg-white border-r border-b border-slate-200 rotate-45 -mt-1.5" />
        </div>
      )}

      {/* 아이콘 버튼 */}
      <button
        onClick={() => {
          if (isIOS) {
            setShowTooltip(prev => !prev);
          } else {
            handleInstall();
          }
        }}
        className="w-14 h-14 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white shadow-xl flex items-center justify-center cursor-pointer transition-transform active:scale-90"
        title="휴대폰 모드로 바로가기"
      >
        <Smartphone className="w-6 h-6" />
      </button>
    </div>
  );
};
