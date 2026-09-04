import { ParkCourse } from '../types';

// Approximate accurate coordinates (lat, lng) for Korean Park Golf Courses
export const COURSE_COORDINATES_MAP: Record<string, { lat: number; lng: number }> = {
  // 강원
  'course-gw-1': { lat: 38.0772, lng: 127.7082 }, // 화천 산천어 (북한강 수변)
  'course-gw-2': { lat: 38.0754, lng: 128.6201 }, // 양양 남대천
  'course-gw-3': { lat: 37.8998, lng: 127.7289 }, // 춘천 소양강
  'course-gw-4': { lat: 37.4721, lng: 129.0234 }, // 동해 무릉
  'course-gw-5': { lat: 37.3892, lng: 129.1302 }, // 삼척 미로
  'course-gw-6': { lat: 38.1091, lng: 127.9942 }, // 양구 한반도섬
  'course-gw-7': { lat: 37.5501, lng: 127.9892 }, // 횡성 섬강
  'course-gw-8': { lat: 37.3242, lng: 127.9482 }, // 원주 문막·원주천

  // 서울 / 경기 / 인천
  'course-ic-1': { lat: 37.3912, lng: 126.6341 }, // 인천 송도
  'course-ic-2': { lat: 37.5458, lng: 126.6698 }, // 인천아시아드주경기장
  'course-ic-3': { lat: 37.5381, lng: 126.6521 }, // 인천 청라
  'course-seoul-1': { lat: 37.5148, lng: 127.0736 }, // 서울 잠실 파크골프장
  'course-seoul-2': { lat: 37.5284, lng: 126.9341 }, // 서울 여의도 한강 파크골프장
  'course-seoul-3': { lat: 37.5682, lng: 126.8856 }, // 서울 마포 월드컵 노을
  'course-seoul-4': { lat: 37.5921, lng: 127.0812 }, // 서울 중랑천 파크골프장
  'course-seoul-5': { lat: 37.5021, lng: 126.8721 }, // 서울 구로 안양천
  'course-gg-1': { lat: 37.4912, lng: 127.4891 }, // 양평 강상 파크골프장
  'course-gg-2': { lat: 37.3021, lng: 127.5612 }, // 여주 남한강 파크골프장
  'course-gg-3': { lat: 37.7412, lng: 127.0421 }, // 의정부 중랑천
  'course-gg-4': { lat: 37.1241, lng: 127.0812 }, // 평택 진위천
  'course-gg-5': { lat: 37.3821, lng: 126.8012 }, // 시흥 갯골 파크골프장
  'course-gg-6': { lat: 37.6212, lng: 126.7112 }, // 김포 한강중앙

  // 충청 / 대전 / 세종
  'course-cc-1': { lat: 36.3712, lng: 127.3891 }, // 대전 유등천 파크골프장
  'course-cc-2': { lat: 36.3541, lng: 127.3412 }, // 대전 갑천 파크골프장
  'course-cc-3': { lat: 36.4821, lng: 127.2612 }, // 세종 금강 파크골프장
  'course-cc-4': { lat: 36.6341, lng: 127.4891 }, // 청주 무심천 파크골프장
  'course-cc-5': { lat: 36.9712, lng: 127.9281 }, // 충주 호암 파크골프장
  'course-cc-6': { lat: 36.7841, lng: 127.1512 }, // 천안 풍서천 파크골프장
  'course-cc-7': { lat: 36.7812, lng: 127.0012 }, // 아산 곡교천 파크골프장
  'course-cc-8': { lat: 36.2812, lng: 126.9112 }, // 부여 백마강 파크골프장

  // 전라 / 광주
  'course-jl-1': { lat: 35.1541, lng: 126.8512 }, // 광주 서구 영산강
  'course-jl-2': { lat: 35.2141, lng: 126.8412 }, // 광주 첨단 영산강
  'course-jl-3': { lat: 35.8241, lng: 127.1481 }, // 전주 만경강
  'course-jl-4': { lat: 35.9612, lng: 126.9512 }, // 익산 목천 파크골프장
  'course-jl-5': { lat: 35.3212, lng: 126.9812 }, // 담양 백진 파크골프장
  'course-jl-6': { lat: 34.8112, lng: 126.3912 }, // 목포 영산강 하구
  'course-jl-7': { lat: 34.9512, lng: 127.4891 }, // 순천만 생태 파크골프장
  'course-jl-8': { lat: 34.6812, lng: 127.3512 }, // 고흥 만남의광장

  // 경상 / 대구 / 부산 / 울산
  'course-gs-1': { lat: 35.8581, lng: 128.6212 }, // 대구 수성 파크골프장
  'course-gs-2': { lat: 35.8891, lng: 128.5912 }, // 대구 북구 강변 파크골프장
  'course-gs-3': { lat: 35.8641, lng: 128.4512 }, // 대구 달성 다사 파크골프장
  'course-gs-4': { lat: 35.1712, lng: 128.9812 }, // 부산 삼락생태공원 파크골프장
  'course-gs-5': { lat: 35.1112, lng: 128.9412 }, // 부산 을숙도 파크골프장
  'course-gs-6': { lat: 35.5412, lng: 129.3112 }, // 울산 태화강 파크골프장
  'course-gs-7': { lat: 35.2212, lng: 128.6812 }, // 창원 대산 파크골프장
  'course-gs-8': { lat: 35.1912, lng: 128.1012 }, // 진주 남강 파크골프장
  'course-gs-9': { lat: 35.8412, lng: 129.2112 }, // 경주 형산강 파크골프장
  'course-gs-10': { lat: 36.0141, lng: 129.3612 }, // 포항 형산강 파크골프장
  'course-gs-11': { lat: 36.1212, lng: 128.3412 }, // 구미 동락 파크골프장

  // 제주
  'course-jj-1': { lat: 33.4996, lng: 126.5312 }, // 제주 사라봉/제주시
  'course-jj-2': { lat: 33.2541, lng: 126.5612 }, // 서귀포 칠십리/강창학
  'course-jj-3': { lat: 33.2841, lng: 126.2612 }, // 제주 서부 한경
};

/**
 * Approximate default regional fallback coordinates
 */
export const REGION_DEFAULT_COORDS: Record<string, { lat: number; lng: number }> = {
  '전체': { lat: 36.5, lng: 127.8 }, // South Korea center
  '서울/경기/인천': { lat: 37.5665, lng: 126.9780 },
  '강원': { lat: 37.8854, lng: 127.7298 },
  '충청/대전/세종': { lat: 36.3504, lng: 127.3845 },
  '전라/광주': { lat: 35.1595, lng: 126.8526 },
  '경상/대구/부산/울산': { lat: 35.8714, lng: 128.6014 },
  '제주': { lat: 33.4996, lng: 126.5312 }
};

/**
 * Calculates haversine distance in kilometers between two coordinates
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Formats distance display string (e.g., "1.4 km", "850 m")
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }
  return `${distanceKm.toFixed(1)}km`;
}

/**
 * Resolves coordinate for a given course
 */
export function getCourseCoords(course: ParkCourse): { lat: number; lng: number } {
  if (course.lat && course.lng) {
    return { lat: course.lat, lng: course.lng };
  }
  if (COURSE_COORDINATES_MAP[course.id]) {
    return COURSE_COORDINATES_MAP[course.id];
  }
  // Region-based fallback
  return REGION_DEFAULT_COORDS[course.region] || { lat: 36.5, lng: 127.8 };
}
