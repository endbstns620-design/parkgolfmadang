import React, { useEffect, useRef } from 'react';
import { useParkGolf } from '../context/ParkGolfContext';
import { buildSlugMaps, parseDetailPath } from '../utils/pageUrls';

/**
 * 검색으로 /구장/서재파크골프장 같은 주소로 들어온 분을
 * 곧바로 그 구장(또는 대회·맛집) 화면으로 데려다 줍니다.
 *
 * 화면에는 아무것도 그리지 않고, 주소를 읽어 알맞은 창을 열어주는 역할만 합니다.
 */
export const DeepLinkOpener: React.FC = () => {
  const { courses, tournaments, restaurants, setActiveTab, openModal } = useParkGolf();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;

    const target = parseDetailPath(window.location.pathname);
    if (!target) {
      done.current = true;
      return;
    }

    if (target.kind === 'course') {
      if (!courses.length) return; // 자료가 아직 준비되기 전이면 다음 기회에
      const found = buildSlugMaps(courses as any[]).bySlug.get(target.slug);
      done.current = true;
      if (found) {
        setActiveTab('courses');
        openModal('courseDetail', found);
      }
      return;
    }

    if (target.kind === 'tournament') {
      if (!tournaments.length) return;
      const found = buildSlugMaps(
        tournaments.map(t => ({ ...t, name: t.title })) as any[]
      ).bySlug.get(target.slug);
      done.current = true;
      if (found) {
        setActiveTab('tournaments');
        openModal('tournamentDetail', found);
      }
      return;
    }

    if (target.kind === 'restaurant') {
      if (!restaurants.length) return;
      done.current = true;
      setActiveTab('restaurants');
    }
  }, [courses, tournaments, restaurants, setActiveTab, openModal]);

  return null;
};
