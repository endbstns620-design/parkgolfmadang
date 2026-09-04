// 기상청(KMA) 동네예보 API는 위경도가 아니라 격자좌표(nx, ny)를 사용합니다.
// 구장 데이터 대부분에 정확한 위경도가 없기 때문에, 시/군/구 이름으로 근사 좌표를 찾고,
// 못 찾으면 소속된 6개 권역의 대표 좌표로 대체합니다 (정확한 동 단위는 아니지만
// "오늘 이 근처 날씨가 대략 어떤지" 확인하는 용도로는 충분합니다).

import { RegionCategory } from '../types';

// 주요 시/군/구 대표 격자좌표 (기상청 공개 좌표표 기준)
const DISTRICT_GRID: Record<string, { nx: number; ny: number }> = {
  // 서울/경기/인천
  '서울': { nx: 60, ny: 127 },
  '수원': { nx: 60, ny: 121 },
  '성남': { nx: 63, ny: 124 },
  '고양': { nx: 57, ny: 128 },
  '용인': { nx: 64, ny: 119 },
  '부천': { nx: 56, ny: 125 },
  '안산': { nx: 58, ny: 121 },
  '안양': { nx: 59, ny: 123 },
  '평택': { nx: 62, ny: 114 },
  '인천': { nx: 55, ny: 124 },
  // 강원
  '춘천': { nx: 73, ny: 134 },
  '원주': { nx: 76, ny: 122 },
  '강릉': { nx: 92, ny: 131 },
  '동해': { nx: 97, ny: 127 },
  '속초': { nx: 87, ny: 141 },
  '삼척': { nx: 98, ny: 125 },
  '태백': { nx: 95, ny: 119 },
  '홍천': { nx: 74, ny: 133 },
  '정선': { nx: 89, ny: 123 },
  // 충청/대전/세종
  '대전': { nx: 67, ny: 100 },
  '세종': { nx: 66, ny: 103 },
  '청주': { nx: 69, ny: 106 },
  '천안': { nx: 63, ny: 110 },
  '충주': { nx: 76, ny: 114 },
  '아산': { nx: 60, ny: 110 },
  '서산': { nx: 51, ny: 110 },
  '보령': { nx: 54, ny: 100 },
  // 전라/광주
  '광주': { nx: 58, ny: 74 },
  '전주': { nx: 63, ny: 89 },
  '목포': { nx: 50, ny: 67 },
  '여수': { nx: 73, ny: 66 },
  '순천': { nx: 70, ny: 70 },
  '나주': { nx: 56, ny: 71 },
  '군산': { nx: 56, ny: 92 },
  '익산': { nx: 60, ny: 91 },
  '정읍': { nx: 58, ny: 83 },
  '남원': { nx: 68, ny: 80 },
  '해남': { nx: 51, ny: 60 },
  '담양': { nx: 61, ny: 78 },
  // 경상/대구/부산/울산
  '대구': { nx: 89, ny: 90 },
  '부산': { nx: 98, ny: 76 },
  '울산': { nx: 102, ny: 84 },
  '포항': { nx: 102, ny: 94 },
  '경주': { nx: 100, ny: 91 },
  '구미': { nx: 89, ny: 96 },
  '안동': { nx: 91, ny: 106 },
  '창원': { nx: 90, ny: 77 },
  '진주': { nx: 81, ny: 75 },
  '김해': { nx: 95, ny: 77 },
  '거제': { nx: 90, ny: 69 },
  '통영': { nx: 87, ny: 68 },
  '김천': { nx: 84, ny: 96 },
  '영천': { nx: 95, ny: 93 },
  '의성': { nx: 90, ny: 101 },
  // 제주
  '제주': { nx: 52, ny: 38 },
  '서귀포': { nx: 52, ny: 33 }
};

// 시/군 매칭에 실패했을 때 쓰는 6개 권역 대표 좌표
const REGION_FALLBACK_GRID: Record<RegionCategory, { nx: number; ny: number }> = {
  '전체': { nx: 60, ny: 127 },
  '서울/경기/인천': { nx: 60, ny: 127 },
  '강원': { nx: 73, ny: 134 },
  '충청/대전/세종': { nx: 67, ny: 100 },
  '전라/광주': { nx: 58, ny: 74 },
  '경상/대구/부산/울산': { nx: 89, ny: 90 },
  '제주': { nx: 52, ny: 38 }
};

export function getWeatherGrid(subRegion: string, region: RegionCategory): { nx: number; ny: number; matched: boolean } {
  for (const key of Object.keys(DISTRICT_GRID)) {
    if (subRegion.includes(key)) {
      return { ...DISTRICT_GRID[key], matched: true };
    }
  }
  return { ...REGION_FALLBACK_GRID[region], matched: false };
}
