import React, { useState, useEffect } from 'react';
import { Users, Eye, TrendingUp, ShieldCheck, Activity } from 'lucide-react';

interface VisitorStats {
  today: number;
  total: number;
  activeNow: number;
}

export const VisitorCounterBadge: React.FC = () => {
  const [stats, setStats] = useState<VisitorStats>(() => {
    // Initial fallback from localStorage
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const savedDate = localStorage.getItem('pgm_visit_date_v1');
      const savedTotal = localStorage.getItem('pgm_visit_total_v1');
      const savedToday = localStorage.getItem('pgm_visit_today_v1');

      let currentTotal = savedTotal ? parseInt(savedTotal, 10) : 1;
      let currentToday = savedToday ? parseInt(savedToday, 10) : 1;

      if (savedDate !== todayStr) {
        localStorage.setItem('pgm_visit_date_v1', todayStr);
        currentToday = 1;
        localStorage.setItem('pgm_visit_today_v1', '1');
      }

      return {
        today: currentToday,
        total: currentTotal,
        activeNow: 1
      };
    } catch {
      return {
        today: 1,
        total: 1,
        activeNow: 1
      };
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasNewVisitPing, setHasNewVisitPing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Fetch from backend server API
    const fetchVisitorCounts = async () => {
      try {
        const res = await fetch('/api/stats/visitors');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success) {
            setStats({
              today: data.today,
              total: data.total,
              activeNow: data.activeNow || 1
            });
            // Update local backup
            try {
              localStorage.setItem('pgm_visit_today_v1', data.today.toString());
              localStorage.setItem('pgm_visit_total_v1', data.total.toString());
              localStorage.setItem('pgm_visit_date_v1', data.todayDate);
            } catch {}
          }
        }
      } catch (err) {
        // Increment client-side simulated visitor counter
        if (isMounted) {
          setStats(prev => {
            const nextToday = prev.today + 1;
            const nextTotal = prev.total + 1;
            try {
              localStorage.setItem('pgm_visit_today_v1', nextToday.toString());
              localStorage.setItem('pgm_visit_total_v1', nextTotal.toString());
            } catch {}
            return {
              ...prev,
              today: nextToday,
              total: nextTotal
            };
          });
        }
      }
    };

    fetchVisitorCounts();

    // Subtle real-time periodic visitor pulse update (every 45 seconds)
    const interval = setInterval(() => {
      fetchVisitorCounts();
      setHasNewVisitPing(true);
      setTimeout(() => setHasNewVisitPing(false), 2000);
    }, 45000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      id="visitor-counter-bar"
      className="inline-flex items-center justify-center gap-1.5 sm:gap-2.5 py-1 px-2 sm:py-1.5 sm:px-3 rounded-full bg-gradient-to-r from-green-900 via-emerald-900 to-green-950 text-white text-xs border border-emerald-700/60 shadow-xs select-none max-w-full"
    >
      {/* Live pulse & title */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
        </span>
        <span className="font-extrabold text-green-100 hidden md:inline-flex items-center gap-1 text-[11px] lg:text-xs">
          <Activity className="w-3 h-3 text-amber-400" />
          <span>실시간 방문</span>
        </span>
      </div>

      {/* Stats items */}
      <div className="flex items-center gap-1.5 sm:gap-2 font-sans shrink-0">
        {/* Today Visitors */}
        <div className="flex items-center gap-1 bg-green-950/80 px-2 py-0.5 rounded-full border border-emerald-700/40">
          <span className="text-emerald-300 text-[10px] sm:text-[11px] font-medium flex items-center gap-0.5">
            <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">오늘:</span>
          </span>
          <span className={`font-black text-[11px] sm:text-xs text-amber-300 transition-transform ${hasNewVisitPing ? 'scale-110 text-white' : ''}`}>
            {stats.today.toLocaleString()}명
          </span>
        </div>

        {/* Total Visitors */}
        <div className="flex items-center gap-1 bg-green-950/80 px-2 py-0.5 rounded-full border border-emerald-700/40">
          <span className="text-emerald-300 text-[10px] sm:text-[11px] font-medium flex items-center gap-0.5">
            <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">총 누적:</span>
          </span>
          <span className="font-black text-[11px] sm:text-xs text-white">
            {stats.total.toLocaleString()}명
          </span>
        </div>

        {/* Real-time active concurrent users */}
        <div className="hidden lg:flex items-center gap-1 text-[10px] text-emerald-200 bg-emerald-950/40 px-1.5 py-0.5 rounded-full">
          <Users className="w-2.5 h-2.5 text-emerald-400" />
          <span>접속: <strong className="text-emerald-300">{stats.activeNow}명</strong></span>
        </div>

        {/* Security badge (Extra large screens only) */}
        <div className="hidden 2xl:flex items-center gap-1 text-[9px] text-emerald-300/80 pl-1 border-l border-emerald-700/60">
          <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
          <span>보안 적용</span>
        </div>
      </div>
    </div>
  );
};
