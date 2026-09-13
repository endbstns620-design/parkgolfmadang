import { Youtube, NotebookPen, LucideIcon } from 'lucide-react';

/**
 * 파크골프마당이 함께 운영하는 채널입니다.
 * 주소가 바뀌면 이 파일 한 곳만 고치면 메인화면·푸터가 함께 바뀝니다.
 */
export interface SocialChannel {
  id: string;
  name: string;        // 채널 이름
  headline: string;    // 왜 들어가야 하는지 (어르신들이 누를 이유)
  detail: string;      // 한 줄 설명
  url: string;
  icon: LucideIcon; // 공식 로고 파일이 없을 때 쓰는 기본 아이콘
  // 각 채널이 공식으로 배포하는 로고 파일을 public/images/ 에 넣고 경로를 적어주세요.
  // (예: '/images/logo-youtube.png') 비워두면 위의 기본 아이콘이 표시됩니다.
  logoImage?: string;
  // 로고가 가로로 긴 형태(글자까지 포함된 로고)인지 표시합니다.
  // 공식 로고는 변형하면 안 되므로, 모양에 맞춰 화면 쪽을 맞춥니다.
  logoWide?: boolean;
  // 채널 고유색입니다. Tailwind 클래스로 쓰면 빌드에서 빠질 수 있어 색상값을 직접 넣습니다.
  color: string;
  colorDark: string;
}

export const SOCIAL_CHANNELS: SocialChannel[] = [
  {
    id: 'youtube',
    name: '유튜브',
    headline: '영상으로 보는 파크골프',
    detail: '스윙 자세 · 구장 둘러보기 · 대회 현장을 영상으로 보실 수 있습니다',
    // 한글 채널 주소는 브라우저가 헷갈리지 않도록 변환한 주소를 씁니다.
    url: 'https://www.youtube.com/@%ED%8C%8C%ED%81%AC%EA%B3%A8%ED%94%84%EB%A7%88%EB%8B%B9',
    icon: Youtube,
    logoImage: '/images/logo-youtube.png', // 유튜브 공식 로고 (아이콘 + 글자)
    logoWide: true,
    color: '#FF0000',
    colorDark: '#CC0000'
  },
  {
    id: 'blog',
    name: '네이버 블로그',
    headline: '구장 정보와 파크골프 이야기',
    detail: '지역별 구장 예약방법 · 요금 · 대회소식을 글로 정리해 올립니다',
    url: 'https://blog.naver.com/healthy_5060',
    icon: NotebookPen,
    logoImage: '/images/logo-blog.png', // 네이버 블로그 공식 로고
    logoWide: true,
    color: '#03C75A',
    colorDark: '#02A64B'
  }
];
