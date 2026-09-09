import React, { useEffect, useState } from 'react';
import { ExternalLink, Smartphone } from 'lucide-react';
import { SOCIAL_CHANNELS } from '../data/socialChannels';

/**
 * 파크골프마당이 운영하는 유튜브·네이버 밴드 안내입니다.
 * 후원사 배너 오른쪽에 세로로 쌓아 넣기 때문에, 카드 하나하나를 위아래로 배치합니다.
 * 시니어분들이 누르기 쉽도록 버튼은 카드 폭 전체를 쓰고 글씨를 크게 두었습니다.
 *
 * 맨 아래에는 '모바일로 바로가기' 버튼을 같은 간격으로 하나 더 둡니다.
 * 유튜브·밴드 바로가기와 말투를 맞춘 이름이며, 누르면 바로 설치창이 떠서
 * 휴대폰 홈화면에 아이콘이 만들어집니다.
 */

const AddToHomeButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);
  const [showIosSteps, setShowIosSteps] = useState(false);

  // 아이폰·아이패드 사파리는 설치 신호(beforeinstallprompt)를 주지 않습니다.
  const isIos =
    typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);

  useEffect(() => {
    // 이미 홈화면 앱으로 실행 중이면 버튼이 필요 없습니다.
    const standalone =
      window.matchMedia?.('(display-mode: standalone)')?.matches ||
      (window.navigator as any).standalone === true;
    if (standalone) setInstalled(true);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const handleClick = async () => {
    if (deferredPrompt) {
      // 여기서 휴대폰의 설치창이 바로 뜨고, 확인을 누르면 홈화면에 아이콘이 만들어집니다.
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice.catch(() => null);
      if (result?.outcome === 'accepted') setInstalled(true);
      setDeferredPrompt(null);
      return;
    }
    setShowIosSteps(v => !v);
  };

  // 설치가 끝났거나, 설치도 안 되고 안내할 방법도 없는 브라우저에서는 숨깁니다.
  if (installed) return null;
  if (!deferredPrompt && !isIos) return null;

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        className="w-full py-3.5 rounded-2xl bg-green-800 hover:bg-green-900 text-white font-black text-lg border-b-4 border-green-950 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer"
      >
        <Smartphone className="w-5 h-5" />
        모바일로 바로가기
      </button>

      {/* 아이폰은 사파리가 설치창을 띄워주지 않아, 따라 하실 순서만 짧게 보여드립니다 */}
      {showIosSteps && (
        <p className="mt-2.5 text-[15px] text-slate-600 font-medium leading-relaxed text-center">
          아래쪽 <b className="text-slate-900">공유 버튼</b>(↑) → <b className="text-slate-900">홈 화면에 추가</b> →{' '}
          <b className="text-slate-900">추가</b> 를 누르시면 됩니다.
        </p>
      )}
    </div>
  );
};

export const SocialChannelsSection: React.FC = () => {
  return (
    <div className="h-full flex flex-col gap-4">
      {SOCIAL_CHANNELS.map(ch => {
        const Icon = ch.icon;
        return (
          <a
            key={ch.id}
            href={ch.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex-1 bg-white rounded-3xl border-2 border-slate-200 hover:border-slate-300 p-5 shadow-sm hover:shadow-md transition-all flex flex-col"
          >
            {/* 공식 로고는 모양이 서로 달라서(유튜브는 가로로 긴 로고, 밴드는 정사각형 아이콘)
                변형하지 않고 로고 줄을 따로 두어 높이만 맞춥니다. */}
            <div className="h-10 sm:h-11 flex items-center mb-2.5">
              {ch.logoImage ? (
                <img src={ch.logoImage} alt={`${ch.name} 로고`} className="h-full w-auto object-contain" />
              ) : (
                <span className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <Icon className="w-6 h-6" style={{ color: ch.color }} />
                </span>
              )}
            </div>

            <p className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mb-1.5">{ch.headline}</p>
            <p className="text-base text-slate-600 font-medium leading-relaxed mb-4">{ch.detail}</p>

            <span
              className="mt-auto w-full py-3.5 rounded-2xl text-white font-black text-lg border-b-4 flex items-center justify-center gap-2 transition-transform group-hover:scale-[1.02]"
              style={{ backgroundColor: ch.color, borderBottomColor: ch.colorDark }}
            >
              {ch.name} 바로가기
              <ExternalLink className="w-5 h-5" />
            </span>
          </a>
        );
      })}

      {/* 유튜브·밴드와 같은 간격으로 맨 아래에 놓습니다 */}
      <AddToHomeButton />
    </div>
  );
};
