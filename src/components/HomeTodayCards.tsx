import React, { useEffect, useMemo, useState } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { SITE_NOTICES } from '../data/siteNoticesData';
import { Sun, CloudSun, Cloud, CloudRain, Snowflake, Trophy, Navigation, Loader2 } from 'lucide-react';

/**
 * 첫 화면 검색칸 바로 아래 3칸 — "오늘 상태판"입니다.
 *
 *   왼쪽  : 오늘 날씨 (기상청 자료, 지역 선택 가능)
 *   가운데: 가장 가까운 대회와 남은 날짜
 *   오른쪽: 가장 최근에 올라온 소식
 *
 * 셋 다 실제 데이터에서만 나옵니다. 불러오지 못하면 그 칸은 아예 나오지 않고,
 * 지어낸 값으로 자리를 채우지 않습니다.
 */

const CITY_GRID: { name: string; nx: number; ny: number }[] = [
  { name: '서울', nx: 60, ny: 127 },
  { name: '인천', nx: 55, ny: 124 },
  { name: '수원', nx: 60, ny: 121 },
  { name: '춘천', nx: 73, ny: 134 },
  { name: '강릉', nx: 92, ny: 131 },
  { name: '대전', nx: 67, ny: 100 },
  { name: '세종', nx: 66, ny: 103 },
  { name: '청주', nx: 69, ny: 106 },
  { name: '천안', nx: 63, ny: 110 },
  { name: '광주', nx: 58, ny: 74 },
  { name: '전주', nx: 63, ny: 89 },
  { name: '목포', nx: 50, ny: 67 },
  { name: '대구', nx: 89, ny: 90 },
  { name: '부산', nx: 98, ny: 76 },
  { name: '울산', nx: 102, ny: 84 },
  { name: '포항', nx: 102, ny: 94 },
  { name: '창원', nx: 90, ny: 77 },
  { name: '제주', nx: 52, ny: 38 }
];

const SKY_ICON: Record<string, React.ElementType> = {
  sunny: Sun,
  'partly-cloudy': CloudSun,
  cloudy: Cloud,
  rain: CloudRain,
  sleet: CloudRain,
  snow: Snowflake
};

// 헤더에서 쓰던 것과 같은 저장 자리를 씁니다 — 한 번 고르시면 계속 그 지역으로 보입니다.
const CITY_KEY = 'pgm-header-weather-city';

interface Weather {
  temperature: number;
  skyText: string;
  skyIcon: string;
  golfSuitability: string;
}

function readSavedCity(): string {
  try {
    const saved = window.localStorage.getItem(CITY_KEY);
    if (saved && CITY_GRID.some(c => c.name === saved)) return saved;
  } catch {
    /* 저장이 막혀 있어도 기본값으로 보여드립니다 */
  }
  return '서울';
}

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(target.getTime())) return NaN;
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

// 'YYYY-MM-DD' → '9월 12일'
const toKoreanDate = (iso: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${Number(m[2])}월 ${Number(m[3])}일` : iso;
};

const CARD =
  'flex items-center gap-3 sm:gap-4 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3.5 shadow-sm text-left';

export const HomeTodayCards: React.FC = () => {
  const { tournaments, setActiveTab } = useParkGolf();

  const [city, setCity] = useState<string>(readSavedCity);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [weatherFailed, setWeatherFailed] = useState(false);

  useEffect(() => {
    const grid = CITY_GRID.find(c => c.name === city) || CITY_GRID[0];
    let alive = true;
    setWeather(null);
    setWeatherFailed(false);
    fetch(`/api/weather?nx=${grid.nx}&ny=${grid.ny}&location=${encodeURIComponent(grid.name)}`)
      .then(r => r.json())
      .then(res => {
        if (!alive) return;
        if (res?.success && res.data) setWeather(res.data);
        else setWeatherFailed(true);
      })
      .catch(() => alive && setWeatherFailed(true));
    return () => {
      alive = false;
    };
  }, [city]);

  // 아직 열리지 않은 대회 중 가장 가까운 하나
  const nearest = useMemo(() => {
    return tournaments
      .map(t => ({ t, d: daysUntil(String(t.eventDate || '')) }))
      .filter(x => Number.isFinite(x.d) && x.d >= 0)
      .sort((a, b) => a.d - b.d)[0];
  }, [tournaments]);

  const latestNotice = SITE_NOTICES[0];
  const SkyIcon = weather ? SKY_ICON[weather.skyIcon] || CloudSun : CloudSun;

  const pickCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value;
    setCity(next);
    try {
      window.localStorage.setItem(CITY_KEY, next);
    } catch {
      /* 저장이 안 되어도 이번 방문 동안은 고르신 지역으로 보여드립니다 */
    }
  };

  const go = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="bg-stone-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {/* 1. 오늘 날씨 */}
          <div className={CARD}>
            <SkyIcon className="w-9 h-9 sm:w-10 sm:h-10 text-emerald-600 shrink-0" strokeWidth={2} />
            <div className="min-w-0">
              <div className="flex items-center gap-1 text-sm sm:text-base font-bold text-slate-500">
                <span>오늘</span>
                <select
                  value={city}
                  onChange={pickCity}
                  aria-label="날씨를 볼 지역 선택"
                  className="bg-transparent font-bold text-slate-700 underline decoration-slate-300 underline-offset-2 cursor-pointer outline-none focus:ring-2 focus:ring-emerald-500 rounded"
                >
                  {CITY_GRID.map(c => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              {weather ? (
                <p className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mt-0.5">
                  {weather.temperature}° {weather.skyText}
                </p>
              ) : weatherFailed ? (
                <p className="text-lg sm:text-xl font-black text-slate-400 leading-tight mt-0.5">
                  날씨 준비 중
                </p>
              ) : (
                <Loader2 className="w-6 h-6 text-emerald-600 animate-spin mt-1" />
              )}
            </div>
          </div>

          {/* 2. 가장 가까운 대회 — 다가오는 대회가 없으면 이 칸은 나오지 않습니다 */}
          {nearest && (
            <button type="button" onClick={() => go('tournaments')} className={`${CARD} hover:bg-amber-50 transition-colors cursor-pointer`}>
              <span className="shrink-0 inline-flex items-center justify-center min-w-[52px] h-[42px] px-2 rounded-xl bg-red-600 text-white font-black text-lg sm:text-xl">
                {nearest.d === 0 ? '오늘' : `D-${nearest.d}`}
              </span>
              <span className="min-w-0">
                <span className="block text-sm sm:text-base font-bold text-slate-500">가장 가까운 대회</span>
                <span className="block text-lg sm:text-xl font-black text-slate-900 leading-tight mt-0.5 truncate">
                  {nearest.t.title}
                </span>
              </span>
              <Trophy className="w-6 h-6 text-amber-500 shrink-0 ml-auto" />
            </button>
          )}

          {/* 3. 가장 최근 소식 — 공지가 없으면 이 칸은 나오지 않습니다 */}
          {latestNotice && (
            <button type="button" onClick={() => go('notices')} className={`${CARD} hover:bg-emerald-50 transition-colors cursor-pointer`}>
              <Navigation className="w-9 h-9 sm:w-10 sm:h-10 text-emerald-600 shrink-0" strokeWidth={2} />
              <span className="min-w-0">
                <span className="block text-sm sm:text-base font-bold text-slate-500">
                  {toKoreanDate(latestNotice.date)} 새 소식
                </span>
                <span className="block text-lg sm:text-xl font-black text-slate-900 leading-tight mt-0.5 truncate">
                  {latestNotice.title}
                </span>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
