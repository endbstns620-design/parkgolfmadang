import { useState } from 'react';
import JSZip from 'jszip';

/**
 * Hook to download deployable files / packaged zip folder
 */
export function useDownloadDeployPackage() {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadDeployZip = async () => {
    setIsDownloading(true);
    try {
      // 1. Try fetching the pre-built dist zip
      const res = await fetch('/kwang-real-estate-dist.zip');
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `kwang-real-estate-dist-${new Date().toISOString().slice(0, 10)}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return;
      }
    } catch (e) {
      console.warn('Prebuilt zip fetch error, generating dynamic deploy zip:', e);
    }

    try {
      // 2. Dynamic generation fallback: Bundle current document and essential assets into a zip
      const zip = new JSZip();
      
      // Add current rendered HTML
      const fullHtml = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
      zip.file('index.html', fullHtml);

      // Add a README.md explaining deployment instructions
      const readmeText = `# 천안아산 부동산세탁소 배포 패키지

본 폴더는 Netlify, Vercel, GitHub Pages, 카페24, AWS S3 등에 바로 배포할 수 있는 빌드 파일 모음입니다.

## 배포 안내
1. **Netlify**: https://app.netlify.com/drop 에 이 압축 파일을 드래그 앤 드롭하시면 30초 내에 무료 웹사이트가 생성됩니다.
2. **Vercel / 호스팅 서버**: 정적 웹 호스팅 루트 경로에 본 파일들을 업로드하세요.
3. **Formspree 연동**: 고객 상담 및 매물의뢰 데이터는 \`https://formspree.io/f/mqpkbzqj\` 로 실시간 전송됩니다.
`;
      zip.file('README.md', readmeText);

      // Add _redirects for Netlify SPA routing
      zip.file('_redirects', '/*    /index.html   200\n');

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kwang-real-estate-dist-${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Dynamic deploy zip error:', err);
      // Last fallback: download standalone HTML
      const fullHtml = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
      const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kwang-real-estate-site-${new Date().toISOString().slice(0, 10)}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadDeployZip, isDownloading };
}
