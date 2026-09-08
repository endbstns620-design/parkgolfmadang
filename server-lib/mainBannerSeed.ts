// 메인화면 후원사 배너의 처음 자료입니다.
// 관리자 화면에서 수정하면 서버 파일(main-banners.json)에 저장되고, 이 씨앗값은 더 이상 쓰이지 않습니다.
//
// ⚠ 건강기능식품 광고 문구는 식약처가 인정한 표현만 쓸 수 있습니다.
//   아래 문구는 웰리타-Y 공식 광고물(한국건강기능식품협회 광고심의 완료, 심의번호 251210979)의
//   표현을 그대로 옮긴 것입니다.
export const MAIN_BANNER_SEED = [
  {
    id: "banner-welita-y",
    sponsorName: "웰리타-Y · 파크골프마당 공식 후원",
    headlineTop: "간 건강과 스트레스,",
    headlineHighlight: "둘 다 관리해야 합니다",
    points: [
      { name: "밀크씨슬", effect: "간 건강에 도움" },
      { name: "테아닌", effect: "스트레스로 인한 긴장 완화에 도움" }
    ],
    subText: "하루 2정 · 식약처 기능성 인정 원료",
    imageUrl: "/images/welita-y-milkthistle.jpg",
    linkUrl: "https://smartstore.naver.com/welita",
    buttonText: "제품 보러가기",
    disclaimer:
      "한국건강기능식품협회 광고심의필 · 심의번호 251210979 · 본 제품은 질병의 예방 및 치료를 위한 의약품이 아닙니다. 건강기능식품은 개인의 건강 상태에 따라 차이가 있을 수 있습니다.",
    startDate: "",
    endDate: "",
    priority: 1,
    isActive: true,
    views: 0,
    clicks: 0,
    createdAt: "2026-09-08"
  }
];
