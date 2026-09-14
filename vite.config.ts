import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg', 'pwa-192x192.png', 'pwa-512x512.png'],
        manifest: {
          id: '/',
          name: '파크골프마당',
          short_name: '파크골프마당',
          description: '전국 파크골프장 552곳 정보와 2026년 전국 대회일정을 한눈에. 구장 리뷰, 동반자 모집, 구장 근처 맛집까지.',
          theme_color: '#166534',
          background_color: '#F8FAF8',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          // 화면 파일(html)은 일부러 저장하지 않습니다.
          //
          // 예전에는 html 까지 저장해두고, 다음에 들어오시면 저장해둔 첫 화면을 먼저 보여줬습니다.
          // 그래서 새로 배포를 해도 "안 바뀌는데?" 하는 일이 계속 생겼습니다 — 서버는 새 화면을
          // 보내고 있는데, 휴대폰이 예전에 저장해둔 화면을 대신 꺼내 보여준 겁니다.
          //
          // 그리고 이 사이트는 구장·대회·맛집 주소마다 서버가 검색용 내용을 채워서 보내는데,
          // 저장해둔 첫 화면이 대신 뜨면 그 내용이 통째로 날아갑니다.
          //
          // 자바스크립트·스타일 파일은 이름에 고유 문자열이 붙어 바뀔 때마다 이름도 바뀌므로
          // 저장해두어도 옛날 것이 나올 일이 없습니다. 그래서 그대로 둡니다.
          globPatterns: ['**/*.{js,css,ico,svg,woff,woff2}'],
          // 배너·카드 사진처럼 용량이 큰 콘텐츠 이미지는 오프라인 캐시 대상에서 제외합니다.
          // (이런 이미지는 앱 실행에 필수가 아니라서, 그냥 그때그때 네트워크로 불러오면 충분합니다.
          //  캐시 대상에 넣으면 하나라도 커지면 빌드 자체가 실패하는 문제가 생깁니다.)
          globIgnores: ['images/**', '**/*.png'],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          // /api/ 로 시작하는 주소는 서비스워커가 가로채지 않도록 합니다.
          // 이걸 빼두면 주소창에 /api/... 를 직접 입력했을 때 서버로 가지 않고
          // 저장해둔 첫 화면(index.html)이 그대로 떠버립니다. (카카오 연결이 막혔던 원인)
          navigateFallbackDenylist: [/^\/api\//],
          // 페이지를 여는 요청은 서비스워커가 대신 답하지 않고 항상 서버로 보냅니다.
          // 그래야 새로 배포한 내용이 바로 보이고, 구장별 검색용 페이지도 제대로 내려옵니다.
          navigateFallback: null,
          // 예전 버전이 저장해둔 찌꺼기는 새 버전이 뜨면 정리합니다.
          cleanupOutdatedCaches: true,
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
