import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// 사이트가 업데이트되면 앱(홈화면에 추가된 상태)도 자동으로 최신 내용으로 바뀌도록 합니다.
// 방문자가 따로 뭘 누르지 않아도, 새 버전이 확인되는 즉시 조용히 적용됩니다.
if ('serviceWorker' in navigator) {
  const updateSW = registerSW({
    immediate: true,
    onRegisteredSW(_url, registration) {
      // 앱을 계속 켜두고 계셔도 놓치지 않도록, 주기적으로 새 버전이 있는지 확인합니다.
      if (registration) {
        setInterval(() => {
          registration.update().catch(() => {});
        }, 60 * 1000); // 1분마다 확인
      }
    },
    onNeedRefresh() {
      // 새 버전이 확인되면 바로 적용합니다 (안내 없이 조용히 최신화 — 시니어 이용자에게
      // 낯선 팝업을 보여주지 않기 위함입니다).
      updateSW(true);
    }
  });
}
