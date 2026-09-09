import React, { useEffect, useState } from 'react';
import { ExternalLink, Smartphone } from 'lucide-react';
import { SOCIAL_CHANNELS } from '../data/socialChannels';

/**
 * 파크골프마당이 운영하는 유튜브·네이버 밴드 안내입니다.
 * 후원사 배너 오른쪽에 세로로 쌓아 넣기 때문에, 카드 하나하나를 위아래로 배치합니다.
 * 시니어분들이 누르기 쉽도록 버튼은 카드 폭 전체를 쓰고 글씨를 크게 두었습니다.
 *
 * 맨 아래에는 '모바일로 바로가기' 버튼을 같은 간격으로 하나 더 둡니다.
 * 누르면 휴대폰 홈화면에 아이콘이 만들어져, 다음부터는 주소를 치지 않고
 * 아이콘만 눌러 들어오실 수 있습니다.
 *
 * 자동 설치창이 뜨지 않는 환경(아이폰 사파리, 카카오톡 안의 브라우저 등)에서도
 * 버튼을 숨기지 않고, 그 환경에 맞는 방법을 대신 알려드립니다.
 */

type Env = 'ios' | 'inapp' | 'android' | 'desktop';

/** 어떤 환경에서 열었는지 판단합니다 (안내 문구가 달라집니다) */
function detectEnv(): Env {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios';
  // 카카오톡·네이버·인스타 등 '앱 안의 브라우저'에서는 홈화면 추가가 아예 불가능합니다.
  if (/KAKAOTALK|NAVER\(inapp|Instagram|FBAN|FBAV|Line\//i.test(ua)) return 'inapp';
  if (/android/i.test(ua)) return 'android';
  return 'desktop';
}

const AddToHomeButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [env, setEnv] = useState<Env>('desktop');

  useEffect(() => {
    setEnv(detectEnv());

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
      // 휴대폰 설치창이 바로 떠서, 확인을 누르면 홈화면에 아이콘이 만들어집니다.
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice.catch(() => null);
      if (result?.outcome === 'accepted') setInstalled(true);
      setDeferredPrompt(null);
      return;
    }
    // 자동 설치가 안 되는 환경에서는 따라 하실 순서를 보여드립니다.
    setShowSteps(v => !v);
  };

  if (installed) return null;

  // 자동 설치가 안 되는 환경에서도 버튼은 항상 보여드리고, 대신 방법을 알려드립니다.
  const steps: Record<Env, React.ReactNode> = {
    ios: (
      <>
        화면 <b className="text-slate-900">맨 아래 가운데 공유 버튼(↑)</b>을 누르시고,
        목록을 내려서 <b className="text-slate-900">'홈 화면에 추가'</b> → <b className="text-slate-900">'추가'</b>를 누르세요.
      </>
    ),
    inapp: (
      <>
        지금은 <b className="text-slate-900">카카오톡·네이버 앱 안</b>에서 보고 계셔서 추가가 안 됩니다.
        오른쪽 위 <b className="text-slate-900">점 세 개(⋮)</b> → <b className="text-slate-900">'다른 브라우저로 열기'</b>로
        크롬을 여신 뒤 이 버튼을 다시 눌러주세요.
      </>
    ),
    android: (
      <>
        브라우저 오른쪽 위 <b className="text-slate-900">점 세 개(⋮)</b>를 누르시고,
        <b className="text-slate-900">'홈 화면에 추가'</b> 또는 <b className="text-slate-900">'앱 설치'</b> → <b className="text-slate-900">'추가'</b>를 누르세요.
      </>
    ),
    desktop: (
      <>
        휴대폰에서 이 사이트를 여신 뒤 이 버튼을 누르시면, 홈화면에 아이콘이 만들어집니다.
      </>
    )
  };

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

      {showSteps && (
        <p className="mt-2.5 text-[15px] text-slate-600 font-medium leading-relaxed text-center">
          {steps[env]}
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
