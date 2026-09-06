import React, { useEffect, useState } from 'react';
import { Download, Share, PlusSquare, Smartphone } from 'lucide-react';

// 브라우저마다 설치 유도 방식이 다릅니다:
// - 안드로이드(크롬 등): beforeinstallprompt 이벤트를 잡아서 "설치" 버튼 하나로 바로 설치 가능
// - 아이폰(사파리): 이런 이벤트 자체가 없어서, "공유 → 홈 화면에 추가"를 사람이 직접 해야 합니다.
//   그래서 아이폰은 버튼 대신 그림으로 방법을 안내합니다.
// 하단에 붕 뜨는 방식이 아니라, 메인화면 안에 자연스럽게 들어가는 카드로 만들어서
// 모바일 하단 앱바와 겹치지 않고, 방문자가 스크롤하다 확실히 보게 됩니다.
export const InstallAppBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
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
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') setJustInstalled(true);
    setDeferredPrompt(null);
  };

  // 이미 앱으로 설치되어 실행 중이면 안내 자체가 필요 없으니 아무것도 안 보여줍니다.
  if (isStandalone) return null;

  if (justInstalled) {
    return (
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-4 mb-6 relative z-10">
        <div className="bg-emerald-700 rounded-2xl p-5 text-center text-white shadow-xl">
          <p className="font-black text-base sm:text-lg">🎉 설치 완료! 홈 화면에서 파크골프마당 아이콘을 확인해보세요.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-4 mb-6 relative z-10">
      <div className="bg-white rounded-2xl border-2 border-amber-300 shadow-xl p-4 sm:p-5">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-green-600 to-emerald-400 text-white flex items-center justify-center text-3xl shrink-0 shadow-md">
            ⛳
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-slate-900 text-base sm:text-lg flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
              파크골프마당, 앱처럼 설치해보세요!
            </p>
            {isIOS ? (
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                하단의{' '}
                <span className="inline-flex items-center gap-0.5 font-bold text-blue-600">
                  공유 <Share className="w-3.5 h-3.5" />
                </span>{' '}
                버튼을 누른 뒤,{' '}
                <span className="inline-flex items-center gap-0.5 font-bold text-slate-800">
                  홈 화면에 추가 <PlusSquare className="w-3.5 h-3.5" />
                </span>
                를 눌러주세요.
              </p>
            ) : (
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                홈 화면에 아이콘이 생겨서, 다음부터는 앱처럼 바로 열어보실 수 있어요.
              </p>
            )}
          </div>

          {!isIOS && (
            <button
              onClick={handleInstall}
              disabled={!deferredPrompt}
              className="shrink-0 py-3 px-4 sm:px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black text-sm sm:text-base flex items-center justify-center gap-1.5 shadow cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              설치하기
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
