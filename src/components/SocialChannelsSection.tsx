import React from 'react';
import { ExternalLink } from 'lucide-react';
import { SOCIAL_CHANNELS } from '../data/socialChannels';

/**
 * 메인화면 아래쪽에 들어가는 채널 안내입니다.
 * 시니어분들은 떠다니는 작은 버튼보다, 화면을 내려보다 만나는 큼직한 안내를 훨씬 잘 누르십니다.
 * 그래서 로고만 두지 않고 "무엇을 볼 수 있는지"를 함께 적었습니다.
 */
export const SocialChannelsSection: React.FC = () => {
  return (
    <section className="bg-slate-50 border-y border-slate-200 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-7">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            유튜브와 밴드에서도 <span className="text-emerald-700">만나요</span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 font-bold mt-2.5 leading-relaxed">
            파크골프마당이 직접 운영하는 채널입니다.{' '}
            <br className="sm:hidden" />
            눌러서 바로 들어가실 수 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {SOCIAL_CHANNELS.map(ch => {
            const Icon = ch.icon;
            return (
              <a
                key={ch.id}
                href={ch.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-3xl border-2 border-slate-200 hover:border-slate-300 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                {/* 공식 로고는 모양이 서로 달라서(유튜브는 가로로 긴 로고, 밴드는 정사각형 아이콘)
                    변형하지 않고 로고 줄을 따로 두어 높이만 맞춥니다. */}
                <div className="h-12 sm:h-14 flex items-center mb-3">
                  {ch.logoImage ? (
                    <img
                      src={ch.logoImage}
                      alt={`${ch.name} 로고`}
                      className="h-full w-auto object-contain"
                    />
                  ) : (
                    <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                      <Icon className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: ch.color }} />
                    </span>
                  )}
                </div>

                <p className="text-base sm:text-lg font-bold text-slate-500">{ch.name}</p>
                <p className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mb-2.5">
                  {ch.headline}
                </p>

                <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed mb-5">
                  {ch.detail}
                </p>

                <span
                  className="mt-auto w-full py-4 rounded-2xl text-white font-black text-lg sm:text-xl border-b-4 flex items-center justify-center gap-2 transition-transform group-hover:scale-[1.02]"
                  style={{ backgroundColor: ch.color, borderBottomColor: ch.colorDark }}
                >
                  {ch.name} 바로가기
                  <ExternalLink className="w-5 h-5" />
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
