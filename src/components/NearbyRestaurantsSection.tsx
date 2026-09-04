import React from 'react';
import { MapPin, UtensilsCrossed } from 'lucide-react';

interface RestaurantPost {
  id: string;
  courseName: string;
  region: string;
  restaurantName: string;
  menu: string;
  description: string;
  sourceNote: string;
}

// 실제 사이트에 등록된 구장들을 기준으로, 포털·블로그·맛집정보 사이트에 여러 번 소개된
// 근처 맛집을 조사해서 정리한 추천 게시판입니다 (10건). 향후 이용자 제보로 계속 늘려갈 예정입니다.
const RESTAURANT_POSTS: RestaurantPost[] = [
  {
    id: 'r-01',
    courseName: '여의도한강 파크골프장',
    region: '서울 영등포구',
    restaurantName: '장어나루',
    menu: '장어덮밥',
    description: '여의도한강공원 인근 맛집 순위에서 꾸준히 상위권으로 소개되는 곳입니다. 라운딩 후 든든한 한 끼로 좋습니다.',
    sourceNote: '다이닝코드 등 맛집정보 사이트 종합'
  },
  {
    id: 'r-02',
    courseName: '잠실운동장 파크골프장',
    region: '서울 송파구',
    restaurantName: '나폴레옹베이커리',
    menu: '식빵 · 소세지빵 등',
    description: '잠실종합운동장 사거리 인근에서 오래 자리를 지켜온 베이커리로, 지역 커뮤니티에서 꾸준히 언급되는 곳입니다.',
    sourceNote: '지역 커뮤니티 추천글 종합'
  },
  {
    id: 'r-03',
    courseName: '소양강파크골프장',
    region: '강원 춘천시',
    restaurantName: '통나무집닭갈비',
    menu: '숯불 닭갈비 · 막국수',
    description: '소양강댐 방향으로 가는 길목에 있어 파크골프장에서 오가기 좋고, 춘천 닭갈비 중에서도 가장 많이 언급되는 곳입니다.',
    sourceNote: '식신·다이닝코드 등 복수 소개'
  },
  {
    id: 'r-04',
    courseName: '강릉파크골프장',
    region: '강원 강릉시',
    restaurantName: '정은숙초당순두부',
    menu: '초당두부밥상 · 두부삼합',
    description: 'KBS·SBS 등 방송에 여러 차례 소개된 초당동 순두부마을 대표 맛집입니다. 담백한 순두부 요리로 부담 없이 즐기기 좋습니다.',
    sourceNote: '방송 소개 및 맛집 리뷰 종합'
  },
  {
    id: 'r-05',
    courseName: '강남파크골프장',
    region: '경북 안동시',
    restaurantName: '중앙찜닭',
    menu: '안동찜닭 · 조림닭',
    description: '안동 원조 찜닭거리에서 30년 넘게 이어온 대표 맛집입니다. 안동 여행객이라면 빠지지 않고 찾는 곳으로 알려져 있습니다.',
    sourceNote: '지역 맛집 소개글 다수 확인'
  },
  {
    id: 'r-06',
    courseName: '경주파크골프 1구장',
    region: '경북 경주시',
    restaurantName: '천마맷돌순두부',
    menu: '맷돌순두부 · 순두부찌개',
    description: '황리단길에 위치한 30년 역사의 순두부 전문점으로, 한옥 공간에서 든든한 한 끼를 즐길 수 있습니다.',
    sourceNote: '다이닝코드 등 맛집정보 사이트 종합'
  },
  {
    id: 'r-07',
    courseName: '부주산 국제파크골프장',
    region: '전남·광주 목포시',
    restaurantName: '금메달식당',
    menu: '홍어 코스(회·애·찜·삼합·탕)',
    description: '목포 홍어의 다양한 부위를 코스로 맛볼 수 있는 곳으로, 여러 방송 프로그램에서 소개된 목포 대표 맛집입니다.',
    sourceNote: '방송 소개 및 여행 매체 종합'
  },
  {
    id: 'r-08',
    courseName: '백진공원 파크골프장',
    region: '전남·광주 담양군',
    restaurantName: '신식당',
    menu: '떡갈비 · 대통밥',
    description: '4대째 이어오는 100년 전통의 담양 떡갈비 전문점입니다. 한우 100% 떡갈비와 대통밥 세트가 대표 메뉴입니다.',
    sourceNote: '지역 맛집 소개글 다수 확인'
  },
  {
    id: 'r-09',
    courseName: '온고을 파크골프장',
    region: '전북 전주시',
    restaurantName: '한국집',
    menu: '전주비빔밥 · 육회비빔밥',
    description: '1979년부터 3대째 이어오는 전주비빔밥 전문점으로, 백년가게로 인증받은 곳입니다. 한옥마을에서 차로 10분 거리입니다.',
    sourceNote: '식신 등 맛집매체 종합'
  },
  {
    id: 'r-10',
    courseName: '군산 파크골프장',
    region: '전북 군산시',
    restaurantName: '이성당',
    menu: '단팥빵 · 야채빵',
    description: '1945년부터 이어온 대한민국에서 가장 오래된 빵집입니다. 라운딩 후 들러 여행 기분을 내기 좋은 군산 필수 코스입니다.',
    sourceNote: '다이닝코드 등 맛집정보 사이트 종합'
  }
];

export const NearbyRestaurantsSection: React.FC = () => {
  return (
    <section id="section-restaurants" className="scroll-mt-28 py-10 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-orange-200 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-xs sm:text-sm font-extrabold mb-2 border border-orange-300 shadow-2xs">
            <UtensilsCrossed className="w-4 h-4 text-orange-700" />
            <span>🍚 라운딩 후 든든한 한 끼, 동호인 추천 맛집</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            구장 근처 맛집
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 mt-1 font-medium leading-relaxed">
            전국 구장 근처의 맛집 정보를 조사해서 정리했습니다. 라운딩 다녀오신 곳의 맛집을 알고 계시다면 이용자 제보로 알려주세요.
          </p>
        </div>
      </div>

      {/* Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {RESTAURANT_POSTS.map(post => (
          <div
            key={post.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>{post.courseName} · {post.region}</span>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-1">
              {post.restaurantName}
            </h3>
            <div className="inline-block px-2.5 py-1 rounded-lg bg-orange-50 text-orange-800 text-xs sm:text-sm font-bold mb-3 border border-orange-200">
              {post.menu}
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium mb-3">
              {post.description}
            </p>

            <p className="text-[11px] sm:text-xs text-slate-400 font-medium border-t border-slate-100 pt-2">
              출처: {post.sourceNote} · 영업시간·가격 등은 변동될 수 있으니 방문 전 확인해주세요
            </p>
          </div>
        ))}
      </div>

      {/* Notice */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs sm:text-sm text-amber-900 font-medium">
        <strong>안내</strong> — 이 게시판은 포털·블로그 등에 소개된 정보를 조사해서 정리한 것이며, 실제 방문 후기가 아닙니다.
        영업 여부·가격·메뉴는 바뀔 수 있으니 방문 전 다시 확인해주시고, 직접 다녀오신 근처 맛집이 있다면 리뷰 게시판에 함께 남겨주세요.
      </div>
    </section>
  );
};
