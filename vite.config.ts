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
          globPatterns: ['**/*.{js,css,html,ico,svg,woff,woff2}'],
          // 배너·카드 사진처럼 용량이 큰 콘텐츠 이미지는 오프라인 캐시 대상에서 제외합니다.
          // (이런 이미지는 앱 실행에 필수가 아니라서, 그냥 그때그때 네트워크로 불러오면 충분합니다.
          //  캐시 대상에 넣으면 하나라도 커지면 빌드 자체가 실패하는 문제가 생깁니다.)
          globIgnores: ['images/**', '**/*.png'],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          // /api/ 로 시작하는 주소는 서비스워커가 가로채지 않도록 합니다.
          // 이걸 빼두면 주소창에 /api/... 를 직접 입력했을 때 서버로 가지 않고
          // 저장해둔 첫 화면(index.html)이 그대로 떠버립니다. (카카오 연결이 막혔던 원인)
          navigateFallbackDenylist: [/^\/api\//],
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
