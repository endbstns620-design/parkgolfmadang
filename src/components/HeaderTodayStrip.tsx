import React, { useEffect, useMemo, useState } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { Sun, CloudSun, Cloud, CloudRain, Snowflake, Trophy, ChevronRight, Loader2 } from 'lucide-react';

/**
 * 상단 로고와 로그인 버튼 사이의 빈 공간을 채우는 "오늘의 파크골프" 띠입니다.
 * 왼쪽 = 오늘 날씨(지역 선택 가능, 기상청 자료), 오른쪽 = 다가오는 대회 D-day(5초마다 순환).
 * 시니어분들이 보시기 편하도록 글씨를 크게 두었고, 화면이 좁아지면 단계적으로 감춥니다.
 */

// 지역을 고르면 기상청 격자좌표로 날씨를 불러옵니다.
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

const STORAGE_KEY = 'pgm-header-weather-city';

interface Weather {
  temperature: number;
  skyText: string;
  skyIcon: string;
  golfSuitability: string;
  suitColor: string;
}

function readSavedCity(): string {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && CITY_GRID.some(c => c.name === saved)) return saved;
  } catch {
    /* 브라우저 설정에 따라 저장이 막혀 있어도 그냥 기본값을 씁니다 */
  }
  return '서울';
}

// 오늘 0시 기준으로 남은 날짜를 셉니다.
function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(target.getTime())) return NaN;
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

export const HeaderTodayStrip: React.FC = () => {
  const { tournaments, setActiveTab } = useParkGolf();

  const [city, setCity] = useState<string>(readSavedCity);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [weatherFailed, setWeatherFailed] = useState(false);
  const [slide, setSlide] = useState(0);

  // 선택한 지역의 오늘 날씨를 불러옵니다.
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

  // 아직 열리지 않은 대회를 가까운 순서로 최대 5개까지 준비합니다.
  const upcoming = useMemo(() => {
    return tournaments
      .map(t => ({ t, d: daysUntil(String(t.eventDate || '')) }))
      .filter(x => Number.isFinite(x.d) && x.d >= 0)
      .sort((a, b) => a.d - b.d)
      .slice(0, 5);
  }, [tournaments]);

  // 대회가 여러 개면 5초마다 번갈아 보여줍니다.
  useEffect(() => {
    if (upcoming.length < 2) {
      setSlide(0);
      return;
    }
    const timer = window.setInterval(() => setSlide(s => (s + 1) % upcoming.length), 5000);
    return () => window.clearInterval(timer);
  }, [upcoming.length]);

  const current = upcoming[Math.min(slide, Math.max(upcoming.length - 1, 0))];
  const SkyIcon = weather ? SKY_ICON[weather.skyIcon] || CloudSun : CloudSun;

  const handleCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value;
    setCity(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* 저장이 안 되어도 이번 방문 동안은 선택한 지역으로 보여드립니다 */
    }
  };

  return (
    <div className="flex items-center gap-2 flex-1 min-w-0 justify-end lg:justify-start pl-2 lg:pl-4 xl:pl-6">
      {/* 오늘 날씨 */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 min-w-0 rounded-2xl border-2 border-emerald-200 bg-emerald-50/70 px-2 sm:px-3 py-1 sm:py-1.5">
        <SkyIcon className="w-5 h-5 xl:w-6 xl:h-6 text-emerald-700 shrink-0" />
        <select
          value={city}
          onChange={handleCity}
          aria-label="날씨를 볼 지역 선택"
          className="bg-transparent font-black text-green-950 text-[14px] sm:text-[15px] xl:text-[17px] cursor-pointer outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg py-0.5"
        >
          {CITY_GRID.map(c => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        {weather ? (
          <span className="font-black text-green-950 text-[14px] sm:text-[15px] xl:text-[17px] whitespace-nowrap">
            {weather.temperature}°<span className="hidden min-[400px]:inline"> {weather.skyText}</span>
            <span className="hidden xl:inline font-bold text-emerald-800">
              {' '}
              · {weather.golfSuitability}
            </span>
          </span>
        ) : weatherFailed ? (
          <span className="font-bold text-slate-500 text-[14px] sm:text-[15px] whitespace-nowrap">날씨 준비 중</span>
        ) : (
          <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
        )}
      </div>

      {/* 다가오는 대회 D-day */}
      {current && (
        <button
          type="button"
          onClick={() => {
            setActiveTab('tournaments');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          title="대회 소식 보러 가기"
          className="group hidden lg:flex items-center gap-2 min-w-0 flex-1 rounded-2xl border-2 border-amber-300 bg-amber-50/80 hover:bg-amber-100 px-3 py-1.5 transition-colors cursor-pointer text-left"
        >
          <Trophy className="w-5 h-5 xl:w-6 xl:h-6 text-amber-600 shrink-0" />
          <span key={current.t.id} className="animate-[fadeIn_.5s_ease] min-w-0 truncate">
            <span className="font-black text-green-950 text-[15px] xl:text-[17px]">
              {current.t.title}
            </span>
            {current.t.location && (
              <span className="hidden xl:inline font-bold text-amber-900/80 text-[15px] xl:text-[16px]">
                {' '}
                · {current.t.location}
              </span>
            )}
          </span>
          <span className="ml-auto shrink-0 rounded-lg bg-red-600 text-white font-black text-[14px] xl:text-[16px] px-2 py-0.5">
            {current.d === 0 ? '오늘' : `D-${current.d}`}
          </span>
          <ChevronRight className="w-5 h-5 text-amber-700 shrink-0 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
};
