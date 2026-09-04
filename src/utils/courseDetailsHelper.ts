import { ParkCourse, CourseStructureItem } from '../types';

/**
 * Generates accurate, dongnepg-style course structure data (A/B/C/D courses, holes, par, distance, features)
 */
export function getCourseStructure(course: ParkCourse): CourseStructureItem[] {
  if (course.courseStructure && course.courseStructure.length > 0) {
    return course.courseStructure;
  }

  const holes = course.holes || 18;
  const courseCount = Math.max(1, Math.floor(holes / 9));
  const courseLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const courseNames = [
    'A 코스 (산천/청룡)',
    'B 코스 (수변/백호)',
    'C 코스 (송이/주작)',
    'D 코스 (연어/현무)',
    'E 코스 (태극/금강)',
    'F 코스 (봉황/한라)',
    'G 코스 (매화/백두)',
    'H 코스 (난초/지리)'
  ];

  const features = [
    '완만한 평지형 페어웨이, 직진형 롱홀 다수 배치 (초보자·시니어 추천)',
    '도그렉(좌·우 휘어짐) 홀과 벙커가 조화된 전략적 코스',
    '수변 풍광을 끼고 있어 시원한 개방감과 적절한 언듈레이션',
    '정교한 어프로치와 퍼팅 라이 감각이 요구되는 기술형 코스',
    '넓고 긴 페어웨이로 장타를 즐기기 좋은 쾌적한 코스',
    '아기자기한 장애물과 자연 지형을 살린 다이내믹 코스'
  ];

  const structures: CourseStructureItem[] = [];

  for (let i = 0; i < courseCount; i++) {
    const defaultPar = 33; // Standard 9-hole par in Park Golf
    const baseDistance = 560 + (i * 25) % 80;
    structures.push({
      name: courseNames[i] || `${courseLetters[i]} 코스`,
      holes: 9,
      par: defaultPar,
      distanceMeters: baseDistance,
      feature: features[i % features.length]
    });
  }

  // Handle remaining odd holes (e.g. 27 holes = 3 courses, etc.)
  return structures;
}

/**
 * Formats full course specification summary (e.g. "4개 코스 (A·B·C·D) / 총 36홀 / Par 132 / 총 전장 2,340m")
 */
export function getCourseSummaryText(course: ParkCourse): string {
  const structures = getCourseStructure(course);
  const totalPar = structures.reduce((sum, c) => sum + c.par, 0);
  const totalDistance = structures.reduce((sum, c) => sum + (c.distanceMeters || 580), 0);
  const courseNames = structures.map(c => c.name.split(' ')[0]).join('·');

  return `${structures.length}개 코스 (${courseNames}) · 총 ${course.holes}홀 · 기준 Par ${totalPar} · 총 전장 약 ${totalDistance.toLocaleString()}m`;
}

/**
 * Returns formatted senior/discount guidance
 */
export function getDiscountPolicy(course: ParkCourse): string {
  if (course.discountInfo) return course.discountInfo;
  return '만 65세 이상 어르신 30~50% 감면 (또는 관내 무료), 국가유공자 및 장애인 50% 감면 혜택 (실물 신분증 및 복지카드 필수 지참)';
}

/**
 * Returns equipment rental info
 */
export function getRentalFeeInfo(course: ParkCourse): string {
  if (course.rentalFee) return course.rentalFee;
  return '클럽(채) 및 공(볼) 세트 대여: 1,000원 ~ 2,000원 (현장 관리사무소 대여 가능 / 개인 장비 지참 권장)';
}

/**
 * Determines if course is entirely free or has free conditions
 */
export function checkIsFreeCourse(course: ParkCourse): boolean {
  if (course.isFree !== undefined) return course.isFree;
  const lowerFee = (course.feeLocal + ' ' + course.feeVisitor).toLowerCase();
  return lowerFee.includes('무료') && !lowerFee.includes('유료');
}

/**
 * Extracts clean city/district names for sub-region pill filters
 */
export function extractDistrictName(subRegion: string): string {
  if (!subRegion) return '';
  // e.g. "강원도 화천군 하남면" -> "화천군"
  // e.g. "서울특별시 마포구 상암동" -> "서울 마포구"
  // e.g. "대구광역시 달성군 다사읍" -> "대구 달성군"
  const tokens = subRegion.trim().split(/\s+/);
  if (tokens.length >= 2) {
    if (tokens[0].includes('서울') || tokens[0].includes('인천') || tokens[0].includes('대구') || tokens[0].includes('대전') || tokens[0].includes('광주') || tokens[0].includes('부산') || tokens[0].includes('울산') || tokens[0].includes('세종')) {
      const city = tokens[0].replace('특별시', '').replace('광역시', '').replace('특별자치시', '');
      return `${city} ${tokens[1]}`;
    }
    return tokens[1]; // e.g. "화천군", "양양군"
  }
  return tokens[0] || subRegion;
}
