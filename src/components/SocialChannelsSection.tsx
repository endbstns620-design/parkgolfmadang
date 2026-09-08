import React from 'react';
import { ExternalLink } from 'lucide-react';
import { SOCIAL_CHANNELS } from '../data/socialChannels';

/**
 * 파크골프마당이 운영하는 유튜브·네이버 밴드 안내입니다.
 * 후원사 배너 오른쪽에 세로로 쌓아 넣기 때문에, 카드 하나하나를 위아래로 배치합니다.
 * 시니어분들이 누르기 쉽도록 버튼은 카드 폭 전체를 쓰고 글씨를 크게 두었습니다.
 */
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
    </div>
  );
};
