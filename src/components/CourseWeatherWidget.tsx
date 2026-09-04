import React, { useState, useEffect } from 'react';
import { ParkCourse } from '../types';
import { getWeatherGrid } from '../utils/weatherGrid';
import { CloudSun, CloudRain, Cloud, Sun, Snowflake, Wind, Droplets, Loader2 } from 'lucide-react';

interface WeatherData {
  temperature: number;
  skyText: string;
  skyIcon: string;
  humidity: number;
  windSpeed: number;
  golfSuitability: string;
  suitColor: string;
  updatedAt: string;
}

const SKY_ICON_MAP: Record<string, React.ElementType> = {
  sunny: Sun,
  'partly-cloudy': CloudSun,
  cloudy: Cloud,
  rain: CloudRain,
  sleet: CloudRain,
  snow: Snowflake
};

const SUIT_COLOR_CLASSES: Record<string, string> = {
  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  blue: 'bg-blue-50 border-blue-200 text-blue-900',
  amber: 'bg-amber-50 border-amber-200 text-amber-900',
  slate: 'bg-slate-50 border-slate-200 text-slate-700'
};

export const CourseWeatherWidget: React.FC<{ course: ParkCourse }> = ({ course }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [gridMatched, setGridMatched] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const { nx, ny, matched } = getWeatherGrid(course.subRegion || '', course.region);
    setGridMatched(matched);

    (async () => {
      try {
        const res = await fetch(`/api/weather?nx=${nx}&ny=${ny}&location=${encodeURIComponent(course.subRegion || course.region)}`);
        if (!res.ok) throw new Error('weather fetch failed');
        const data = await res.json();
        if (isMounted && data.success) {
          setWeather(data.data);
        } else if (isMounted) {
          setHasError(true);
        }
      } catch {
        if (isMounted) setHasError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [course.id]);

  if (isLoading) {
    return (
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-2 text-slate-500 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>오늘 날씨를 불러오는 중...</span>
      </div>
    );
  }

  if (hasError || !weather) {
    return null; // 날씨 조회 실패 시 조용히 숨김 (다른 정보에는 영향 없음)
  }

  const Icon = SKY_ICON_MAP[weather.skyIcon] || Cloud;
  const colorClass = SUIT_COLOR_CLASSES[weather.suitColor] || SUIT_COLOR_CLASSES.slate;

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border ${colorClass}`}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Icon className="w-9 h-9 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black">{weather.temperature}°C</span>
              <span className="text-sm font-bold opacity-80">{weather.skyText}</span>
            </div>
            <p className="text-xs sm:text-sm font-bold mt-0.5">⛳ {weather.golfSuitability}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs opacity-80">
          <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5" /> 습도 {weather.humidity}%</span>
          <span className="flex items-center gap-1"><Wind className="w-3.5 h-3.5" /> 풍속 {weather.windSpeed}m/s</span>
        </div>
      </div>
      <p className="text-[11px] opacity-70 mt-2">
        {weather.updatedAt} 기준 · 기상청 동네예보
        {!gridMatched && ' · 정확한 관측지점이 없어 인근 권역 날씨로 표시됩니다'}
        {' · 실제 현지 날씨와 다를 수 있으니 출발 전 다시 확인해주세요'}
      </p>
    </div>
  );
};
