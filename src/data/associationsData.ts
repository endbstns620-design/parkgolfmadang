import { AssociationItem } from '../types';

export const ASSOCIATIONS_DATA: AssociationItem[] = [
  // 1. 중앙 본회
  {
    id: 'assoc-kpga-main',
    name: '(사)대한파크골프협회',
    shortName: '대한파크골프협회 (본회)',
    category: '중앙본회',
    region: '전국 (중앙)',
    role: '대한민국 파크골프 총괄 중앙 경기단체 (대한체육회 정회원 종목)',
    websiteUrl: 'https://kpgf.kr',
    phone: '02-2202-8844',
    address: '서울특별시 송파구 올림픽로 424 올림픽공원 벨로드롬 101호',
    description: '대한민국 30만 파크골프 동호인을 대표하는 대한체육회 정가맹 중앙종목단체로, 공식 경기 규칙 제정, 국가대표 선발, 1·2·3급 지도자 및 심판 자격 검정, 파크골프 용구(클럽·공) 공인 인증 심사를 총괄합니다.',
    services: [
      '대한체육회 정가맹 단체',
      '공식 경기규칙 제정',
      '1·2·3급 지도자/심판 자격증',
      '클럽·공 공인용구 인증',
      '전국대회 승인 및 주관'
    ],
    isMainCertified: true
  },
  // 2. 파크골프 주요 연맹 (Federations)
  {
    id: 'fed-kpgf-all',
    name: '(사)한국파크골프연맹',
    shortName: '한국파크골프연맹',
    category: '파크골프연맹',
    region: '전국',
    role: '전국 생활체육 파크골프 동호인 저변 확대 및 클럽 연맹 대회 주관',
    websiteUrl: 'http://www.koreaparkgolf.org',
    phone: '02-452-7330',
    address: '서울특별시 광진구 능동로 209',
    description: '전국 500여 개 파크골프 클럽 연대와 생활체육 파크골프 리그전을 운영하며, 시니어 친선 교류전과 권역별 연맹 챔피언십을 주관합니다.',
    services: [
      '생활체육 연맹 대회 개최',
      '시니어 파크골프 연맹 리그',
      '동호회 클럽 가맹 인증',
      '사회공헌 나눔 라운딩'
    ]
  },
  {
    id: 'fed-ksfpg-life',
    name: '(사)대한생활체육파크골프연맹',
    shortName: '대한생활체육파크골프연맹',
    category: '파크골프연맹',
    region: '전국',
    role: '직장인 및 전 국민 생활체육 파크골프 보급 및 연맹 챔피언십 주관',
    websiteUrl: 'http://www.ksfpg.or.kr',
    phone: '02-780-3377',
    address: '서울특별시 영등포구 국회대로70길 15',
    description: '대한생활체육회 산하 파크골프 전문 연맹으로, 직장인·시니어·주부 등 전 세대가 함께 즐기는 생활체육 파크골프 축제 및 지도자 연수를 총괄합니다.',
    services: [
      '대한생활체육회 산하 연맹',
      '전국 생활체육 챔피언십',
      '신규 지도자 연수·검정',
      '동호인 멘토링 매칭'
    ]
  },
  {
    id: 'fed-workers-pg',
    name: '(사)대한직장인체육회 파크골프연맹',
    shortName: '대한직장인파크골프연맹',
    category: '파크골프연맹',
    region: '전국',
    role: '전국 직장인 및 기업 사내 파크골프 동호회 육성 및 직장인 리그전 운영',
    websiteUrl: 'http://www.kwsc.or.kr',
    phone: '02-2244-1144',
    address: '서울특별시 동대문구 천호대로 319',
    description: '기업체 임직원 및 노동조합 사내 파크골프 동호회를 지원하고, 주말 직장인 파크골프 리그 및 근로자 건강증진 친선 라운드를 주최합니다.',
    services: [
      '전국 직장인 파크골프대회',
      '기업 사내동호회 창립 컨설팅',
      '주말 직장인 야간·주말 리그',
      '워라밸 힐링 라운드'
    ]
  },
  {
    id: 'fed-senior-pg',
    name: '(사)한국시니어파크골프연맹',
    shortName: '한국시니어파크골프연맹',
    category: '파크골프연맹',
    region: '전국',
    role: '60세 이상 실버·시니어 파크골프 건강 증진 및 전국 시니어 페스티벌 주관',
    websiteUrl: 'http://www.seniorparkgolf.or.kr',
    phone: '053-741-5588',
    address: '대구광역시 동구 동대구로 461',
    description: '백세 시대를 선도하는 시니어 맞춤형 파크골프 헬스케어 프로그램과 전국 시니어 마스터스 챔피언십, 부부·혼성 친선 대회를 정기 개최합니다.',
    services: [
      '전국 시니어 마스터스 대회',
      '100세 건강 파크골프 체조',
      '실버 무료 레슨 클리닉',
      '부부·가족 파크골프 축제'
    ]
  },
  {
    id: 'fed-women-pg',
    name: '(사)한국여성파크골프연맹',
    shortName: '한국여성파크골프연맹',
    category: '파크골프연맹',
    region: '전국',
    role: '여성 파크골프 동호인 네트워크 구축 및 전국 여성 파크골프 챔피언십 주관',
    websiteUrl: 'http://www.womenparkgolf.co.kr',
    phone: '02-588-7330',
    address: '서울특별시 서초구 서초대로 397',
    description: '여성 골퍼들의 친목 도모와 매너·에티켓 교육, 전국 여성 파크골프 퀸즈 챔피언십 및 초보 여성 회원을 위한 입문 아카데미를 운영합니다.',
    services: [
      '전국 여성 파크골프 퀸즈대회',
      '초보 여성 입문 클래스',
      '구장 에티켓·매너 캠페인',
      '여성 시니어 클럽 육성'
    ]
  },
  {
    id: 'fed-youth-family',
    name: '(사)대한유소년파크골프연맹',
    shortName: '대한유소년파크골프연맹',
    category: '파크골프연맹',
    region: '전국',
    role: '3대(조부모·부모·손주) 가족 스포츠 및 청소년·유소년 꿈나무 파크골프 육성',
    websiteUrl: 'http://www.youthparkgolf.or.kr',
    phone: '031-719-7330',
    address: '경기도 성남시 분당구 야탑로 205',
    description: '조부모와 손주가 함께 즐기는 세대통합형 3대 가족 파크골프 보급과 초·중·고 방과후 파크골프 프로그램 및 꿈나무 장학 대회를 주관합니다.',
    services: [
      '전국 3대 가족 파크골프대회',
      '방과후 파크골프 학교 프로그램',
      '주니어 전문 지도자 교육',
      '꿈나무 장학 대회 개최'
    ]
  },
  {
    id: 'fed-univ-pg',
    name: '전국대학파크골프연맹',
    shortName: '대학파크골프연맹',
    category: '파크골프연맹',
    region: '전국',
    role: '전국 대학교 파크골프 동아리 연대 및 대학생 선수권대회 주관',
    websiteUrl: 'http://www.univparkgolf.kr',
    phone: '042-821-7330',
    address: '대전광역시 유성구 대학로 99',
    description: '청년 세대의 파크골프 유입을 촉진하고 전국 대학교 스포츠학과 및 동아리 연합 챔피언십, 대학생 서포터즈 활동을 지원합니다.',
    services: [
      '전국 대학생 파크골프 대회',
      '대학 동아리 장비 지원',
      '청년 심판·지도자 연수',
      '산학협력 구장 연구'
    ]
  },
  {
    id: 'fed-wpgf-world',
    name: '세계파크골프연맹 (WPGF - World Park Golf Fed)',
    shortName: '세계파크골프연맹 (WPGF)',
    category: '파크골프연맹',
    region: '국제',
    role: '한국·일본·중국·동남아 등 글로벌 파크골프 종목 보급 및 국제 선수권 총괄',
    websiteUrl: 'http://www.worldparkgolf.org',
    phone: '02-3432-8844',
    address: '서울특별시 송파구 백제고분로 222',
    description: '아시아 및 미주·유럽 등 전 세계 파크골프 종목 보급과 월드 파크골프 챔피언십, 글로벌 규격 표준화 연구를 주도하는 국제 연맹 단체입니다.',
    services: [
      '세계 파크골프 선수권대회',
      '아시아 파크골프 교류전',
      '글로벌 표준 룰 연구',
      '해외 구장 개설 기술 지원'
    ]
  },
  // 3. 프로 & 특수 단체
  {
    id: 'assoc-kppa-pro',
    name: '(사)한국프로파크골프협회',
    shortName: '한국프로파크골프협회',
    category: '프로·특수협회',
    region: '전국',
    role: '프로 파크골프 선수 및 투어 경기 주관, 티칭프로 양성',
    websiteUrl: 'http://parkgolf.or.kr',
    phone: '053-628-9993',
    address: '대구광역시 수성구 달구벌대로 2450',
    description: '파크골프의 전문 프로화와 스포츠 산업화를 선도하는 단체로, 프로 자격 선발전, 티칭프로·투어프로 아카데미 운영, 상금 걸린 마스터스 투어 대회를 주관합니다.',
    services: [
      '투어프로·티칭프로 자격시험',
      '프로 마스터스 대회 개최',
      '전문 강사진 아카데미',
      '기업 스폰서십 투어'
    ]
  },
  {
    id: 'assoc-kdpa-disabled',
    name: '(사)한국장애인파크골프협회',
    shortName: '한국장애인파크골프협회',
    category: '프로·특수협회',
    region: '전국',
    role: '장애인 파크골프 생활체육 보급 및 전국장애인체전 주관',
    websiteUrl: 'http://kdpa.kr',
    phone: '02-786-7330',
    address: '서울특별시 영등포구 의사당대로 22',
    description: '장애인과 비장애인이 함께 어울리는 배리어프리 파크골프 문화를 선도하며, 전국장애인체육대회 파크골프 종목 주관 및 장애인 맞춤형 지도자 교육을 담당합니다.',
    services: [
      '전국장애인체전 종목 주관',
      '어울림 생활체육대회',
      '배리어프리 구장 연구',
      '장애인 전문 지도사 양성'
    ]
  },
  {
    id: 'assoc-leaders-edu',
    name: '(사)한국파크골프지도자협회',
    shortName: '한국파크골프지도자협회',
    category: '프로·특수협회',
    region: '전국',
    role: '전문 시니어 지도자·심판 양성 및 파크골프 표준 교재 연구',
    websiteUrl: 'http://koreaparkgolf.org',
    phone: '02-424-7330',
    address: '서울특별시 송파구 백제고분로 187',
    description: '전국 지자체 문화센터 및 복지관 파크골프 강사 인력풀을 구축하고, 실기·구술 표준 교육과정 및 안전 에티켓 교육 매뉴얼을 보급합니다.',
    services: [
      '시니어 파크골프 강사 파견',
      '실기·이론 지도자 연수',
      '표준 교육교재 발간',
      '구장 안전 관리 컨설팅'
    ]
  },
  {
    id: 'assoc-ipga-japan',
    name: '국제파크골프협회 (IPGA - Japan HQ)',
    shortName: '국제파크골프협회 (IPGA)',
    category: '프로·특수협회',
    region: '국제 (발상지)',
    role: '파크골프 발상지(홋카이도 마쿠베츠) 국제 협력 기구',
    websiteUrl: 'http://www.parkgolf.jp',
    phone: '+81-155-54-2289',
    address: '일본 홋카이도 나카가와군 마쿠베츠초 모토마치 70',
    description: '1983년 파크골프가 최초로 창안된 일본 홋카이도 마쿠베츠초에 본부를 둔 국제 단체로, 글로벌 공인 규칙과 세계선수권대회 및 아시아 교류전을 지원합니다.',
    services: [
      '국제 표준 룰 규정',
      '한·일 친선 교류전',
      '글로벌 발상지 기념사업',
      '국제 공인 용구 승인'
    ]
  },

  // 3. 17개 광역시·도별 파크골프협회
  {
    id: 'assoc-seoul',
    name: '서울특별시 파크골프협회',
    shortName: '서울시협회',
    category: '시·도협회',
    region: '서울',
    role: '서울 25개 자치구 구장 관리 지원 및 서울시장기 대회 주관',
    websiteUrl: 'http://www.seoulparkgolf.or.kr',
    phone: '02-490-2775',
    address: '서울특별시 중랑구 망우로 182 서울특별시체육회관 4층',
    description: '한강 난지, 월드컵공원, 잠실 등 서울 도심 파크골프 활성화와 25개 구 협회 연계 대회 및 시민 파크골프 교실을 운영합니다.',
    services: ['서울시민 생활체육대회', '자치구 연맹 교류전', '서울시장배 대회', '지도자 보수교육']
  },
  {
    id: 'assoc-gyeonggi',
    name: '경기도 파크골프협회',
    shortName: '경기도협회',
    category: '시·도협회',
    region: '경기',
    role: '경기 31개 시·군 100여 개 구장 네트워크 및 도지사기 주관',
    websiteUrl: 'http://www.ggparkgolf.co.kr',
    phone: '031-255-0888',
    address: '경기도 수원시 장안구 장안로 134 경기도체육회관',
    description: '양평 강상, 가평, 파주, 성남 등 전국 최대 규모의 회원을 보유한 도 협회로, 경기 도민체전 파크골프 종목 주관 및 신규 구장 조성을 지원합니다.',
    services: ['경기도지사기 대회', '시군 대항 챔피언십', '도 체육대회 파크골프', '심판 자격 연수']
  },
  {
    id: 'assoc-incheon',
    name: '인천광역시 파크골프협회',
    shortName: '인천시협회',
    category: '시·도협회',
    region: '인천',
    role: '인천 서구 수도권매립지·송도 등 해양도시 파크골프 활성화',
    websiteUrl: 'http://www.incheonparkgolf.or.kr',
    phone: '032-888-7330',
    address: '인천광역시 미추홀구 매소홀로 618 인천문학경기장',
    description: '청라 아시아드, 드림파크 등 친환경 수변 구장 활성화 및 인천시장배 전국동호인대회를 주관합니다.',
    services: ['인천시장기 대회', '군·구 협회 연합 리그', '생활체육대축전 선발', '동호회 등록 관리']
  },
  {
    id: 'assoc-gangwon',
    name: '강원특별자치도 파크골프협회',
    shortName: '강원도협회',
    category: '시·도협회',
    region: '강원',
    role: '화천·춘천·원주·인제 등 파크골프 명품 수도 육성',
    websiteUrl: 'http://www.gwparkgolf.or.kr',
    phone: '033-241-7999',
    address: '강원특별자치도 춘천시 스포츠타운길 124-2',
    description: '화천 산천어 파크골프장 등 전국 최고 명문 54홀 구장들을 기반으로 전국 최대 규모 산천어 왕중왕전 및 도지사기 대회를 지원합니다.',
    services: ['화천 산천어 전국대회 협력', '도지사기 생활체육', '심판·지도자 집중연수', '구장 공인 실사']
  },
  {
    id: 'assoc-daejeon',
    name: '대전광역시 파크골프협회',
    shortName: '대전시협회',
    category: '시·도협회',
    region: '충청/대전/세종',
    role: '갑천·유등천 수변 파크골프장 관리 지원 및 시장기 주관',
    websiteUrl: 'http://www.daejeonparkgolf.or.kr',
    phone: '042-253-7330',
    address: '대전광역시 중구 대종로 373 한밭종합운동장',
    description: '교통의 중심 대전에서 갑천 수변 코스를 중심으로 충청권 교류전과 시민 건강 파크골프 교실을 활발히 운영합니다.',
    services: ['대전시장기 대회', '5개 구 대항 리그전', '주말 시민 무료 레슨', '회원 등급 심사']
  },
  {
    id: 'assoc-sejong',
    name: '세종특별자치시 파크골프협회',
    shortName: '세종시협회',
    category: '시·도협회',
    region: '충청/대전/세종',
    role: '금강변 수변공원 명품 파크골프 코스 육성 및 시장배 주관',
    websiteUrl: 'http://www.sejongparkgolf.or.kr',
    phone: '044-868-7330',
    address: '세종특별자치시 조치원읍 군청로 93',
    description: '행정수도 세종의 금강 수변 금남·부강 파크골프장을 거점으로 젊은 세대와 시니어가 함께하는 스마트 파크골프를 지향합니다.',
    services: ['세종시장배 대회', '금강 수변 리그전', '신규 동호인 입문 교실', '지도자 양성']
  },
  {
    id: 'assoc-chungbuk',
    name: '충청북도 파크골프협회',
    shortName: '충북도협회',
    category: '시·도협회',
    region: '충청/대전/세종',
    role: '청주·충주·제천·영동 등 내륙 호반 파크골프 육성',
    websiteUrl: 'http://www.cbparkgolf.or.kr',
    phone: '043-264-5555',
    address: '충청북도 청주시 서원구 사직대로 229 충북체육회관',
    description: '청주 무심천, 충주 탄금호 등 수려한 자연환경을 갖춘 구장들을 중심으로 충북도지사기 및 전국동호인 초청대회를 개최합니다.',
    services: ['충북도지사기 대회', '시·군 클럽 대항전', '심판 자격 검정', '동호인 친선대회']
  },
  {
    id: 'assoc-chungnam',
    name: '충청남도 파크골프협회',
    shortName: '충남도협회',
    category: '시·도협회',
    region: '충청/대전/세종',
    role: '청양 108홀 국가대표 전용 훈련장 건립 지원 및 도지사기 주관',
    websiteUrl: 'http://www.cnparkgolf.or.kr',
    phone: '041-631-7330',
    address: '충청남도 홍성군 홍북읍 충남대로 21',
    description: '청양군에 조성 중인 국내 최대 108홀 공인 구장과 연계하여 전국 규모 챔피언십 및 도내 15개 시군 파크골프 인프라 확충에 앞장섭니다.',
    services: ['충남도지사배 대회', '청양 108홀 대회 연계', '시군 협회 임원 연수', '클럽 인증제']
  },
  {
    id: 'assoc-daegu',
    name: '대구광역시 파크골프협회',
    shortName: '대구시협회',
    category: '시·도협회',
    region: '경상/대구/부산/울산',
    role: '전국 최대 파크골프 메카 (수성·달성·금호강 30여 개 구장)',
    websiteUrl: 'http://www.daeguparkgolf.or.kr',
    phone: '053-628-9993',
    address: '대구광역시 북구 연암로 40 대구시체육회관',
    description: '낙동강·금호강변을 따라 전국 최다 파크골프 인구를 자랑하는 메카로, 대구시장기 전국대회 및 시니어 챔피언십을 주관합니다.',
    services: ['대구시장기 전국대회', '8개 구·군 리그전', '대구통합예약시스템 협력', '심판 보수교육']
  },
  {
    id: 'assoc-busan',
    name: '부산광역시 파크골프협회',
    shortName: '부산시협회',
    category: '시·도협회',
    region: '경상/대구/부산/울산',
    role: '낙동강 삼락·화명 72홀 등 해양 메트로 파크골프 총괄',
    websiteUrl: 'http://www.busanparkgolf.com',
    phone: '051-505-1994',
    address: '부산광역시 동래구 사직로 45 부산아시아드주경기장 38호',
    description: '삼락생태공원, 대저생태공원 등 낙동강 하구 천혜의 갈대밭 코스를 기반으로 부산시장배 및 영남권 챔피언십을 개최합니다.',
    services: ['부산시장배 전국대회', '구·군 대항 랭킹전', '해양 관광 연계 라운딩', '지도자 자격 연수']
  },
  {
    id: 'assoc-ulsan',
    name: '울산광역시 파크골프협회',
    shortName: '울산시협회',
    category: '시·도협회',
    region: '경상/대구/부산/울산',
    role: '태화강 국가정원 수변 구장 네트워크 및 시장기 주관',
    websiteUrl: 'http://www.ulsanparkgolf.or.kr',
    phone: '052-260-7330',
    address: '울산광역시 남구 문수로 44 문수축구경기장 2층',
    description: '태화강 십리대숲과 어우러진 친환경 구장들과 함께 울산시장기 및 생태공원 파크골프 페스티벌을 운영합니다.',
    services: ['울산시장기 대회', '태화강 국가정원배', '5개 구·군 친선 리그', '회원 안전교육']
  },
  {
    id: 'assoc-gyeongbuk',
    name: '경상북도 파크골프협회',
    shortName: '경북도협회',
    category: '시·도협회',
    region: '경상/대구/부산/울산',
    role: '구미·안동·영천·포항 등 23개 시·군 명품 수변 구장 총괄',
    websiteUrl: 'http://www.gbparkgolf.or.kr',
    phone: '054-855-7330',
    address: '경상북도 안동시 축제환상로 20 경북체육회관',
    description: '구미 동락·선산, 영천 조교, 안동 낙동강변 등 영남의 젖줄을 따라 조성된 대규모 구장들의 도지사기 대회 및 전국대회를 총괄합니다.',
    services: ['경북도지사기 대회', '새마을배 전국대회', '시·군 대항전', '공인 지도자 배출']
  },
  {
    id: 'assoc-gyeongnam',
    name: '경상남도 파크골프협회',
    shortName: '경남도협회',
    category: '시·도협회',
    region: '경상/대구/부산/울산',
    role: '창원·김해·밀양·진주 2000년 파크골프 시원지 역사 계승',
    websiteUrl: 'http://www.gnparkgolf.or.kr',
    phone: '055-282-7330',
    address: '경상남도 창원시 성산구 원이대로 450 창원종합운동장 125호',
    description: '2000년 진주 상락원에서 대한민국 최초 파크골프가 시작된 역사의 고장으로, 밀양 가곡, 창원 대산 72홀 등 전국 최대 규모 인프라를 자랑합니다.',
    services: ['경남도지사기 대회', '영남권 4개 시도 교류전', '18개 시군 챔피언십', '시니어 건강리그']
  },
  {
    id: 'assoc-gwangju',
    name: '광주광역시 파크골프협회',
    shortName: '광주시협회',
    category: '시·도협회',
    region: '전라/광주',
    role: '영산강변 서봉·첨단·동곡 등 빛고을 명품 코스 주관',
    websiteUrl: 'http://www.gwangjuparkgolf.or.kr',
    phone: '062-385-7330',
    address: '광주광역시 서구 화정로 149 광주광역시체육회관 3층',
    description: '영산강과 황룡강 합류 지점의 친환경 수변 구장들을 바탕으로 광주시장기 및 무등산배 전국 파크골프대회를 개최합니다.',
    services: ['광주시장기 전국대회', '5개 구 클럽 챔피언십', '빛고을 시민교실', '심판 자격시험']
  },
  {
    id: 'assoc-jeonbuk',
    name: '전북특별자치도 파크골프협회',
    shortName: '전북도협회',
    category: '시·도협회',
    region: '전라/광주',
    role: '전주·완주·익산·군산 만경강 수변 파크골프 육성',
    websiteUrl: 'http://www.jbparkgolf.or.kr',
    phone: '063-255-7330',
    address: '전북특별자치도 전주시 덕진구 들사평로 62 전북체육회관',
    description: '완주 봉동, 전주 만경강변 코스를 거점으로 전북도지사배 및 전북특별자치도 출범 기념 전국대회를 성공적으로 이끌고 있습니다.',
    services: ['전북도지사배 대회', '14개 시군 리그전', '만경강 페스티벌', '지도자 전문교육']
  },
  {
    id: 'assoc-jeonnam',
    name: '전라남도 파크골프협회',
    shortName: '전남도협회',
    category: '시·도협회',
    region: '전라/광주',
    role: '영암·목포·순천·나주·담양 등 남도 수변 파크골프 총괄',
    websiteUrl: 'http://www.jnparkgolf.co.kr',
    phone: '061-285-0080',
    address: '전라남도 무안군 삼향읍 어진누리길 30 전남체육회관',
    description: '사계절 온화한 기후와 넓은 수변 부지를 활용해 전국 동호인들의 겨울 전지훈련 명소로 각광받으며 도지사기 및 전국동호인대회를 주관합니다.',
    services: ['전남도지사기 대회', '남해안 벨트 친선대회', '시·군 대항 랭킹전', '지도자 자격 검정']
  },
  {
    id: 'assoc-jeju',
    name: '제주특별자치도 파크골프협회',
    shortName: '제주도협회',
    category: '시·도협회',
    region: '제주',
    role: '회천·칠십리 등 유네스코 세계자연유산 청정 힐링 파크골프',
    websiteUrl: 'http://www.jejugolf.co.kr',
    phone: '064-748-0099',
    address: '제주특별자치도 제주시 서광로2길 24 제주도체육회관',
    description: '한라산과 바다가 조망되는 제주시 회천, 서귀포 칠십리 구장에서 사계절 힐링 라운딩 및 도지사배 국제 파크골프 교류전을 개최합니다.',
    services: ['제주도지사배 국제대회', '삼다수배 전국대회', '관광 연계 파크골프 투어', '도민 무료 아카데미']
  }
];
