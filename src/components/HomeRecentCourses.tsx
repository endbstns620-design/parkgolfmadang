import React, { useMemo } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { ParkCourse } from '../types';
import { MapPin, ChevronRight, Clock } from 'lucide-react';
import { buildCourseHrefMap, handleCourseLinkClick } from '../utils/courseUrl';

/**
 * 첫 화면 — "최근에 보신 구장".
 *
 * 이 기기에서 실제로 열어보신 구장만 최신 순으로 보여줍니다.
 * 조회수 순위나 인기 순위처럼 지어낸 숫자는 쓰지 않습니다. 요금·주차·예약방법도
 * 구장 자료에 들어 있는 값을 그대로 옮길 뿐, 확인되지 않은 것은 '문의 필요'로 둡니다.
 *
 * 처음 오신 분은 기록이 없으니, 그때는 한 줄 안내만 보여드립니다.
 */

// '충청남도 천안시' → '충남 천안'
const SIDO_SHORT: [RegExp, string][] = [
  [/^서울특별시/, '서울'],
  [/^부산광역시/, '부산'],
  [/^대구광역시/, '대구'],
  [/^인천광역시/, '인천'],
  [/^광주광역시/, '광주'],
  [/^대전광역시/, '대전'],
  [/^울산광역시/, '울산'],
  [/^세종특별자치시/, '세종'],
  [/^경기도/, '경기'],
  [/^강원특별자치도|^강원도/, '강원'],
  [/^충청북도/, '충북'],
  [/^충청남도/, '충남'],
  [/^전북특별자치도|^전라북도/, '전북'],
  [/^전라남도/, '전남'],
  [/^경상북도/, '경북'],
  [/^경상남도/, '경남'],
  [/^제주특별자치도/, '제주']
];

function shortenRegion(subRegion: string): string {
  const text = (subRegion || '').trim();
  if (!text) return '';
  for (const [pattern, short] of SIDO_SHORT) {
    if (pattern.test(text)) {
      const rest = text.replace(pattern, '').trim();
      return rest ? `${short} ${rest}` : short;
    }
  }
  return text;
}

export const HomeRecentCourses: React.FC = () => {
  const { courses, recentCourseIds, openModal, setActiveTab } = useParkGolf();

  // 기록에 남은 번호로 실제 구장을 찾습니다. 지워진 구장은 조용히 건너뜁니다.
  const recent = useMemo(() => {
    const byId = new Map<string, ParkCourse>(courses.map(c => [c.id, c]));
    return recentCourseIds
      .map(id => byId.get(id))
      .filter((c): c is ParkCourse => Boolean(c))
      .slice(0, 3);
  }, [courses, recentCourseIds]);

  // 구장별 주소표 (서버와 같은 규칙). 전체 목록으로 만들어야 이름 중복이 구분됩니다.
  const courseHrefs = useMemo(() => buildCourseHrefMap(courses as any[]), [courses]);

  const goToAllCourses = () => {
    setActiveTab('courses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 처음 오신 분 — 한 줄 안내만 두고 자리를 차지하지 않습니다.
  if (recent.length === 0) {
    return (
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          {/* 카드가 없을 때도 이 구역의 제목은 남겨둡니다 (화면에는 안 보입니다) */}
          <h2 className="sr-only">최근에 보신 구장</h2>
          <p className="flex items-center gap-2 text-base sm:text-lg font-bold text-slate-600">
            <Clock className="w-5 h-5 text-slate-400 shrink-0" />
            구장을 한 번 열어보시면, 다음에 오셨을 때 이 자리에 바로 나옵니다
          </p>
          <button
            onClick={goToAllCourses}
            className="shrink-0 inline-flex items-center gap-1 text-base sm:text-lg font-black text-green-800 hover:text-green-900 cursor-pointer"
          >
            전국 {courses.length.toLocaleString()}곳 모두 보기
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-end justify-between gap-3 mb-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900">최근에 보신 구장</h2>
          <button
            onClick={goToAllCourses}
            className="shrink-0 inline-flex items-center gap-0.5 text-base sm:text-lg font-black text-green-800 hover:text-green-900 cursor-pointer"
          >
            전국 {courses.length.toLocaleString()}곳 모두 보기
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {recent.map(course => (
            <a
              key={course.id}
              href={courseHrefs.get(course.id)}
              onClick={e => handleCourseLinkClick(e, () => openModal('courseDetail', course))}
              className="block text-left rounded-2xl border-2 border-slate-200 hover:border-green-600 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-sm sm:text-base font-black">
                  <MapPin className="w-4 h-4" />
                  {shortenRegion(course.subRegion)}
                </span>
                {course.holes > 0 && (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-sm sm:text-base font-black">
                    {course.holes}홀
                  </span>
                )}
              </div>

              <p className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 leading-tight mb-2 break-keep">
                {course.name}
              </p>

              <p className="text-base sm:text-lg font-bold text-slate-600 leading-relaxed break-keep">
                이용료 {course.feeLocal || '문의 필요'}
              </p>
              <p className="text-base sm:text-lg font-bold text-slate-600 leading-relaxed break-keep">
                주차 {course.parkingAvailable ? course.parkingDetails || '가능' : '확인 필요'} · {course.reservationType}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
