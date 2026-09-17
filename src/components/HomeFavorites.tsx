import React, { useMemo } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { ParkCourse, Tournament, FAVORITE_LIMIT, FAVORITE_POINT } from '../types';
import { MapPin, ChevronRight, Star, Trophy, Gift, Calendar } from 'lucide-react';
import { buildCourseHrefMap, handleCourseLinkClick } from '../utils/courseUrl';

/**
 * 첫 화면 — "내 관심구장 · 관심대회".
 *
 * 예전에는 이 자리에 "최근에 보신 구장"이 있었습니다. 기기에만 남는 기록이라
 * 다시 오실 이유가 되지 못해서, 회원이 직접 찜해 두신 구장·대회로 바꿨습니다.
 *
 * · 로그인하지 않은 분께는 이 구역을 아예 보여주지 않습니다.
 *   (찜한 것이 없는 분께 빈 칸을 보여드릴 이유가 없습니다)
 * · 회원이신데 아직 찜한 것이 없으면, 무엇을 하면 되는지 한 칸으로 안내합니다.
 * · 달이 바뀌어 이번 달 마당P를 아직 안 받으셨으면 받기 버튼이 나옵니다.
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

export const HomeFavorites: React.FC = () => {
  const {
    courses,
    tournaments,
    currentUser,
    favoriteCourseIds,
    favoriteTournamentIds,
    toggleFavorite,
    unclaimedFavoriteCount,
    claimFavoritePoints,
    openModal,
    setActiveTab
  } = useParkGolf();

  const myCourses = useMemo(() => {
    const byId = new Map<string, ParkCourse>(courses.map(c => [c.id, c]));
    return favoriteCourseIds
      .map(id => byId.get(id))
      .filter((c): c is ParkCourse => Boolean(c));
  }, [courses, favoriteCourseIds]);

  const myTournaments = useMemo(() => {
    const byId = new Map<string, Tournament>(tournaments.map(t => [t.id, t]));
    return favoriteTournamentIds
      .map(id => byId.get(id))
      .filter((t): t is Tournament => Boolean(t));
  }, [tournaments, favoriteTournamentIds]);

  const courseHrefs = useMemo(() => buildCourseHrefMap(courses as any[]), [courses]);

  const goTo = (tab: string) => {
    setActiveTab(tab as any);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 로그인하지 않으셨으면 이 구역은 통째로 내보내지 않습니다.
  if (!currentUser) return null;

  const total = myCourses.length + myTournaments.length;

  return (
    <section className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-2">
            <Star className="w-6 h-6 sm:w-7 sm:h-7 text-amber-500 shrink-0" fill="currentColor" />
            <span>{currentUser.nickname}님의 관심구장 · 관심대회</span>
          </h2>
          <span className="text-base sm:text-lg font-bold text-slate-500">
            구장 {myCourses.length}/{FAVORITE_LIMIT} · 대회 {myTournaments.length}/{FAVORITE_LIMIT}
          </span>
        </div>

        {/* 이번 달 마당P를 아직 안 받으셨을 때만 나옵니다 */}
        {unclaimedFavoriteCount > 0 && (
          <button
            type="button"
            onClick={() => void claimFavoritePoints()}
            className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-green-800 hover:bg-green-900 text-white text-lg sm:text-xl font-black shadow transition-colors cursor-pointer"
          >
            <Gift className="w-6 h-6 shrink-0" />
            <span>
              이번 달 마당P {(unclaimedFavoriteCount * FAVORITE_POINT).toLocaleString()}P 받기
            </span>
          </button>
        )}

        {total === 0 ? (
          /* 회원이신데 아직 찜한 것이 없을 때 — 무엇을 하면 되는지만 짧게 */
          <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/70 p-5 sm:p-6">
            <p className="text-lg sm:text-xl font-black text-slate-900 leading-relaxed break-keep">
              자주 가시는 구장과 나가고 싶은 대회를 찜해 두세요.
            </p>
            <p className="text-base sm:text-lg font-bold text-slate-700 mt-1.5 leading-relaxed break-keep">
              구장 {FAVORITE_LIMIT}개 · 대회 {FAVORITE_LIMIT}개까지 찜하실 수 있고,
              하나 찜할 때마다 <span className="text-green-800">{FAVORITE_POINT}P</span>를 드립니다.
              (다 채우시면 {(FAVORITE_LIMIT * 2 * FAVORITE_POINT).toLocaleString()}P)
              다음에 오시면 찜해 두신 것부터 바로 보여드립니다.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => goTo('courses')}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-green-800 hover:bg-green-900 text-white text-base sm:text-lg font-black cursor-pointer"
              >
                <MapPin className="w-5 h-5" />
                구장 고르러 가기
              </button>
              <button
                onClick={() => goTo('tournaments')}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-green-950 text-base sm:text-lg font-black cursor-pointer"
              >
                <Trophy className="w-5 h-5" />
                대회 고르러 가기
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* 관심구장 */}
            {myCourses.length > 0 && (
              <div>
                <div className="flex items-end justify-between gap-3 mb-2.5">
                  <h3 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
                    관심구장
                  </h3>
                  <button
                    onClick={() => goTo('courses')}
                    className="shrink-0 inline-flex items-center gap-0.5 text-base sm:text-lg font-black text-green-800 hover:text-green-900 cursor-pointer"
                  >
                    전국 {courses.length.toLocaleString()}곳 모두 보기
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                  {myCourses.map(course => (
                    <div
                      key={course.id}
                      className="relative rounded-2xl border-2 border-amber-300 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => void toggleFavorite('course', course.id)}
                        aria-label="관심구장 찜 풀기"
                        title="관심구장 찜 풀기"
                        className="absolute top-3 right-3 p-2 rounded-xl bg-amber-400 border-2 border-amber-500 text-amber-950 hover:bg-amber-300 transition-colors cursor-pointer"
                      >
                        <Star className="w-5 h-5" fill="currentColor" strokeWidth={2.5} />
                      </button>

                      <a
                        href={courseHrefs.get(course.id)}
                        onClick={e => handleCourseLinkClick(e, () => openModal('courseDetail', course))}
                        className="block text-left cursor-pointer pr-12"
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
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 관심대회 */}
            {myTournaments.length > 0 && (
              <div>
                <div className="flex items-end justify-between gap-3 mb-2.5">
                  <h3 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-1.5">
                    <Trophy className="w-5 h-5 text-amber-600 shrink-0" />
                    관심대회
                  </h3>
                  <button
                    onClick={() => goTo('tournaments')}
                    className="shrink-0 inline-flex items-center gap-0.5 text-base sm:text-lg font-black text-green-800 hover:text-green-900 cursor-pointer"
                  >
                    대회 모두 보기
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                  {myTournaments.map(tour => (
                    <div
                      key={tour.id}
                      className="relative rounded-2xl border-2 border-amber-300 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => void toggleFavorite('tournament', tour.id)}
                        aria-label="관심대회 찜 풀기"
                        title="관심대회 찜 풀기"
                        className="absolute top-3 right-3 p-2 rounded-xl bg-amber-400 border-2 border-amber-500 text-amber-950 hover:bg-amber-300 transition-colors cursor-pointer"
                      >
                        <Star className="w-5 h-5" fill="currentColor" strokeWidth={2.5} />
                      </button>

                      <button
                        type="button"
                        onClick={() => openModal('tournamentDetail', tour)}
                        className="block w-full text-left cursor-pointer pr-12"
                      >
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 text-sm sm:text-base font-black mb-2">
                          {tour.status}
                        </span>
                        <p className="text-lg sm:text-xl font-black text-slate-900 leading-tight mb-2 break-keep">
                          {tour.title}
                        </p>
                        <p className="text-base sm:text-lg font-bold text-slate-600 leading-relaxed break-keep flex items-start gap-1.5">
                          <Calendar className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{tour.dateRange || tour.eventDate}</span>
                        </p>
                        <p className="text-base sm:text-lg font-bold text-slate-600 leading-relaxed break-keep flex items-start gap-1.5">
                          <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{tour.location}</span>
                        </p>
                        {tour.regEndDate && (
                          <p className="text-base sm:text-lg font-black text-red-700 mt-1.5 break-keep">
                            접수 마감 {tour.regEndDate}
                          </p>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
