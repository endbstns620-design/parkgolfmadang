export interface AppUser {
  id: string;
  name: string; // 실명 (본인만 확인 가능, 다른 이용자에게는 비공개)
  phone: string; // 휴대폰 (본인만 확인 가능, 다른 이용자에게는 비공개)
  nickname: string; // 사이트에서 공개적으로 쓰이는 이름
  preferredRegion?: string;
  averageScore?: string;
  createdAt: string;
}

export type RegionCategory =
  | '전체'
  | '서울/경기/인천'
  | '강원'
  | '충청/대전/세종'
  | '전라/광주'
  | '경상/대구/부산/울산'
  | '제주';

export type ReservationType =
  | '선착순'
  | '온라인예약'
  | '현장접수'
  | '전화예약'
  | '추첨제'
  | '예약방법 확인중';

export interface CourseStructureItem {
  name: string; // e.g., 'A 코스 (산천어)', 'B 코스 (수달)'
  holes: number; // e.g., 9
  par: number; // e.g., 33
  distanceMeters?: number; // e.g., 620
  feature?: string; // e.g., '완만한 평지형 강변 페어웨이, 초보자 추천'
}

export interface ParkCourse {
  id: string;
  name: string;
  region: RegionCategory;
  subRegion: string;
  address: string;
  holes: number;
  courseScale: string;
  operatedBy: string;
  governmentAgency?: string; // 관할 지자체 / 주관 행정청 (예: 화천군청 체육진흥과)
  governmentPhone?: string; // 관할 지자체 공식 대표/부서 전화번호
  parkingAvailable: boolean;
  parkingDetails: string;
  reservationType: ReservationType;
  reservationDetails: string;
  reservationUrl?: string;
  reservationPeriodInfo?: string; // 예약 오픈 일시 (예: 매월 1일 09시)
  feeLocal: string;
  feeVisitor: string;
  rentalFee?: string; // 클럽/볼 장비 대여료
  discountInfo?: string; // 65세 이상, 장애인, 국가유공자 감면 혜택
  amenities: string[];
  closedDays: string;
  operatingHours: string;
  phoneNumber: string; // 구장 관리사무소 / 현장 매표소 번호
  grassType: string;
  surfaceFeature?: string; // 코스 지형 특성 (예: 수변 평지형, 둔치 완경사, 언덕형)
  rating: number;
  reviewCount: number;
  imageUrl: string;
  description: string;
  courseStructure?: CourseStructureItem[];
  isPopular?: boolean;
  isAssociationCertified?: boolean;
  // 이 구장 정보의 신뢰도 등급입니다. 전 구장에 일관되게 표시해서, 어떤 정보가
  // 실제로 확인된 것이고 어떤 정보가 아직 확인되지 않았는지 이용자가 알 수 있게 합니다.
  //   'A'/'B+'/'B'  : 대한파크골프협회·연맹 등 복수 공식 출처가 일치하는 정보
  //   'C+'/'C'      : 단일 출처이거나 출처 간 정보가 엇갈려 추가 확인이 필요한 정보
  //   'unverified'  : 출처가 명확하지 않은 초기 참고정보 (주차·편의시설·잔디 등 세부사항 미확인)
  dataConfidence?: 'A' | 'B+' | 'B' | 'C+' | 'C' | 'unverified';
  dataSourceNote?: string;
  isFree?: boolean; // 무료 구장 여부
  lat?: number; // 위도
  lng?: number; // 경도
  distanceKm?: number; // 사용자 현재 위치와의 거리 (km)
}

export type TournamentStatus =
  | '접수중'
  | '접수예정'
  | '마감임박'
  | '접수마감'
  | '대회종료';

export type TournamentCategory =
  | '전체'
  | '전국 메이저'
  | '지자체장기·시장기'
  | '시·도협회장기'
  | '시니어·실버'
  | '부부·혼성 페스티벌';

export interface Tournament {
  id: string;
  title: string;
  organizer: string;
  region?: RegionCategory;
  category?: '전국 메이저' | '지자체장기·시장기' | '시·도협회장기' | '시니어·실버' | '부부·혼성 페스티벌';
  dateRange: string;
  eventDate: string; // YYYY-MM-DD
  registrationPeriod: string;
  location: string;
  courseHoles?: string;
  capacity?: string;
  eligibility: string;
  gameFormat?: string;
  prizePool: string;
  participationFee: string;
  suppliesProvided?: string;
  awardsBreakdown?: string[];
  scheduleDetail?: string;
  rulesDetail?: string;
  contact: string;
  inquiryTime?: string;
  status: TournamentStatus;
  linkUrl?: string;
  description: string;
  posterUrl?: string;
  isFeatured?: boolean;
  isCertifiedHost?: boolean;
  views?: number;
}

export type NewsCategory =
  | '전체'
  | '초보 입문가이드'
  | '장비·복장 선택'
  | '경기 규칙·벌타'
  | '스윙·퍼팅 레슨'
  | '구장 매너·에티켓';

export interface NewsItem {
  id: string;
  title: string;
  category: '초보 입문가이드' | '장비·복장 선택' | '경기 규칙·벌타' | '스윙·퍼팅 레슨' | '구장 매너·에티켓' | '협회소식' | '신규구장' | '장비·룰' | '건강·레슨' | '대회결과';
  summary: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
  views: number;
  source?: string;
  tags?: string[];
  readTime?: string;
}

export interface ReviewItem {
  id: string;
  authorUserId?: string;
  courseId: string;
  courseName: string;
  authorName: string;
  ageGroup: string;
  rating: number;
  visitDate: string;
  title: string;
  content: string;
  grassScore: number;
  facilityScore: number;
  parkingScore: number;
  imageUrl?: string;
  createdAt: string;
}

export interface MatchingComment {
  id: string;
  postId: string;
  authorName: string;
  authorPhone?: string;
  content: string;
  createdAt: string;
}

export interface MatchingPost {
  id: string;
  authorUserId?: string;
  title: string;
  region: string;
  courseName: string;
  meetDate: string;
  meetTime: string;
  currentCount: number;
  maxCount: number;
  status: '모집중' | '마감';
  closedAt?: string;
  authorName: string;
  authorPhone: string;
  handicap: string;
  description: string;
  costShare: string;
  createdAt: string;
  comments: MatchingComment[];
}

export interface CoupangProduct {
  id: string;
  category: '전체' | '클럽' | '공인구' | '가방·파우치' | '장갑·잡화' | '의류·신발' | '기타';
  // 쿠팡파트너스가 발급한 위젯(iframe) 주소입니다. 쿠팡 서버가 상품 이미지·이름·가격·
  // "쇼핑하기" 버튼까지 전부 렌더링해서 보내주기 때문에, 우리 쪽에서 별도로 상품 정보를
  // 입력하거나 가져올 필요가 없습니다.
  embedUrl: string;
  embedWidth: number;
  embedHeight: number;
  createdAt: string;
}

export interface AdItem {
  id: string;
  title: string;
  companyName: string;
  category: '용품·클럽' | '볼·가방' | '맞춤투어' | '구장인근맛집' | '전문수리';
  description: string;
  imageUrl: string;
  linkUrl?: string;
  phoneNumber: string;
  badgeText: string;
  specialOffer?: string;
  isActive: boolean;
}

export interface RestaurantPost {
  id: string;
  authorUserId?: string;
  courseName: string;
  region: string;
  restaurantName: string;
  menu: string;
  address: string;
  phoneNumber: string;
  businessHours: string;
  description: string;
  authorName: string;
  createdAt: string;
}

export type FontSizeOption = 'normal' | 'large' | 'xlarge';

export interface AssociationItem {
  id: string;
  name: string;
  shortName?: string;
  category: '중앙본회' | '파크골프연맹' | '프로·특수협회' | '시·도협회';
  region: string;
  role: string;
  websiteUrl: string;
  phone: string;
  address: string;
  description: string;
  services: string[];
  isMainCertified?: boolean;
}
